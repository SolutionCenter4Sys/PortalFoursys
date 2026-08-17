/**
 * pg-shim — cliente PostgreSQL local com interface compatível com @supabase/supabase-js.
 *
 * Cobre exatamente os padrões usados nos arquivos RAG (retriever/query/ingest):
 *   db.from(table).select(cols).eq(col,val)...maybeSingle()
 *   db.from(table).upsert(row, { onConflict }).select('id').single()
 *   db.from(table).insert(rows)
 *   db.from(table).update(data).eq(col,val)
 *   db.from(table).delete().eq(col,val) / .in(col,vals)
 *   db.from(table).select('id', { count:'exact', head:true }).eq(col,val)
 *   db.rpc('match_document_chunks', args)
 *
 * Ativado quando DATABASE_URL está configurada (postgres local / Docker).
 * Sem DATABASE_URL → o chamador cai no cliente Supabase original.
 */

import { Pool } from 'pg';

let _pool: Pool | null = null;

function pool(): Pool {
  if (!_pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não configurada — defina no .env.local ou .env.docker');
    _pool = new Pool({ connectionString: url, max: 10 });
  }
  return _pool;
}

// ── Tipos compatíveis com Supabase ────────────────────────────────────────────
export type DbResult<T> = { data: T | null; error: { message: string } | null; count?: number };

type WhereClause =
  | { type: 'eq';    col: string; val: unknown }
  | { type: 'ilike'; col: string; val: string }
  | { type: 'in';    col: string; vals: unknown[] };

// ── Helpers SQL ───────────────────────────────────────────────────────────────
function qi(name: string): string {
  // Identifiers que já têm aspas ou são * ficam como estão
  if (name === '*' || name.startsWith('"')) return name;
  return `"${name.replace(/"/g, '""')}"`;
}

function parseCols(cols: string): string {
  if (cols.trim() === '*') return '*';
  return cols.split(',').map((c) => qi(c.trim())).join(', ');
}

function serializeParam(col: string, val: unknown): unknown {
  if (val === null || val === undefined) return null;
  // number[] → pgvector text format '[1.0,2.0,...]'
  if (col === 'embedding' && Array.isArray(val)) return `[${(val as number[]).join(',')}]`;
  // objects/arrays → JSON string (cast to ::jsonb in SQL)
  if (col === 'metadata' || col === 'config') return typeof val === 'string' ? val : JSON.stringify(val);
  return val;
}

function colCast(col: string, placeholder: string): string {
  if (col === 'embedding') return `${placeholder}::vector`;
  if (col === 'metadata' || col === 'config') return `${placeholder}::jsonb`;
  return placeholder;
}

// ── Builder ───────────────────────────────────────────────────────────────────
class Builder {
  private _table: string;
  private _op: 'select' | 'insert' | 'upsert' | 'update' | 'delete' = 'select';
  private _cols = '*';
  private _wheres: WhereClause[] = [];
  private _limitN: number | null = null;
  private _countMode = false;
  private _insertRows: Record<string, unknown>[] = [];
  private _upsertConflict = '';
  private _updateData: Record<string, unknown> = {};

  constructor(table: string) { this._table = table; }

  select(cols: string, opts?: { count?: 'exact'; head?: boolean }): this {
    this._cols = cols;
    this._countMode = opts?.count === 'exact';
    return this;
  }

  eq(col: string, val: unknown): this {
    this._wheres.push({ type: 'eq', col, val });
    return this;
  }

  ilike(col: string, val: string): this {
    this._wheres.push({ type: 'ilike', col, val });
    return this;
  }

  in(col: string, vals: unknown[]): this {
    this._wheres.push({ type: 'in', col, vals });
    return this;
  }

  limit(n: number): this { this._limitN = n; return this; }

  insert(rows: Record<string, unknown> | Record<string, unknown>[]): this {
    this._op = 'insert';
    this._insertRows = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  upsert(row: Record<string, unknown>, opts: { onConflict: string }): this {
    this._op = 'upsert';
    this._insertRows = [row];
    this._upsertConflict = opts.onConflict;
    return this;
  }

  update(data: Record<string, unknown>): this {
    this._op = 'update';
    this._updateData = data;
    return this;
  }

  delete(): this { this._op = 'delete'; return this; }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async single(): Promise<DbResult<any>> {
    return this._exec(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async maybeSingle(): Promise<DbResult<any>> {
    return this._exec(true);
  }

  // Thenable: permite `await builder` sem terminal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  then<R>(resolve: (v: DbResult<any>) => R, reject: (e: unknown) => R): Promise<R> {
    return this._exec(false).then(resolve, reject);
  }

  // ── Execução ────────────────────────────────────────────────────────────────
  private _buildWhere(params: unknown[]): string {
    if (this._wheres.length === 0) return '';
    const parts: string[] = [];
    for (const w of this._wheres) {
      if (w.type === 'eq') {
        params.push(w.val);
        parts.push(`${qi(w.col)} = $${params.length}`);
      } else if (w.type === 'ilike') {
        params.push(w.val);
        parts.push(`${qi(w.col)} ILIKE $${params.length}`);
      } else if (w.type === 'in') {
        if (!w.vals.length) { parts.push('FALSE'); continue; }
        const placeholders = w.vals.map((v) => { params.push(v); return `$${params.length}`; }).join(', ');
        parts.push(`${qi(w.col)} IN (${placeholders})`);
      }
    }
    return parts.length ? ` WHERE ${parts.join(' AND ')}` : '';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async _exec(singleRow: boolean): Promise<DbResult<any>> {
    const params: unknown[] = [];
    try {
      const p = pool();
      const t = qi(this._table);

      // ── COUNT ────────────────────────────────────────────────────────────
      if (this._countMode) {
        const where = this._buildWhere(params);
        const { rows } = await p.query(`SELECT COUNT(*) FROM ${t}${where}`, params);
        return { data: null, error: null, count: Number(rows[0].count) };
      }

      // ── SELECT ───────────────────────────────────────────────────────────
      if (this._op === 'select') {
        const cols = parseCols(this._cols);
        const where = this._buildWhere(params);
        const limitN = singleRow ? 1 : this._limitN;
        const limit = limitN !== null ? ` LIMIT ${limitN}` : '';
        const { rows } = await p.query(`SELECT ${cols} FROM ${t}${where}${limit}`, params);
        return singleRow
          ? { data: (rows[0] ?? null) as Record<string, unknown>, error: null }
          : { data: rows as Record<string, unknown>[], error: null };
      }

      // ── DELETE ───────────────────────────────────────────────────────────
      if (this._op === 'delete') {
        const where = this._buildWhere(params);
        if (!where) throw new Error('DELETE sem WHERE recusado pelo shim');
        await p.query(`DELETE FROM ${t}${where}`, params);
        return { data: null, error: null };
      }

      // ── UPDATE ───────────────────────────────────────────────────────────
      if (this._op === 'update') {
        const keys = Object.keys(this._updateData);
        const setClause = keys.map((k) => {
          params.push(serializeParam(k, this._updateData[k]));
          return `${qi(k)} = ${colCast(k, `$${params.length}`)}`;
        }).join(', ');
        const where = this._buildWhere(params);
        await p.query(`UPDATE ${t} SET ${setClause}${where}`, params);
        return { data: null, error: null };
      }

      // ── INSERT ───────────────────────────────────────────────────────────
      if (this._op === 'insert') {
        if (!this._insertRows.length) return { data: null, error: null };
        const keys = Object.keys(this._insertRows[0]);
        const colList = keys.map(qi).join(', ');
        const valueSets = this._insertRows.map((row) => {
          const ph = keys.map((k) => {
            params.push(serializeParam(k, row[k]));
            return colCast(k, `$${params.length}`);
          });
          return `(${ph.join(', ')})`;
        });
        await p.query(`INSERT INTO ${t} (${colList}) VALUES ${valueSets.join(', ')}`, params);
        return { data: null, error: null };
      }

      // ── UPSERT ───────────────────────────────────────────────────────────
      if (this._op === 'upsert') {
        const row = this._insertRows[0];
        const keys = Object.keys(row);
        const colList = keys.map(qi).join(', ');
        const ph = keys.map((k) => {
          params.push(serializeParam(k, row[k]));
          return colCast(k, `$${params.length}`);
        });
        const conflictCols = this._upsertConflict.split(',').map((c) => qi(c.trim())).join(', ');
        const conflictSet = this._upsertConflict.split(',').map((c) => c.trim());
        const updateSet = keys
          .filter((k) => !conflictSet.includes(k))
          .map((k) => `${qi(k)} = EXCLUDED.${qi(k)}`)
          .join(', ');
        const returning = this._cols !== '*' ? ` RETURNING ${parseCols(this._cols)}` : '';
        const sql = `INSERT INTO ${t} (${colList}) VALUES (${ph.join(', ')}) ON CONFLICT (${conflictCols}) DO UPDATE SET ${updateSet}${returning}`;
        const { rows } = await p.query(sql, params);
        return { data: rows[0] ?? null, error: null };
      }

      return { data: null, error: { message: 'Operação desconhecida no shim' } };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return { data: null, error: { message } };
    }
  }
}

// ── Cliente público ───────────────────────────────────────────────────────────
export function createPgClient() {
  return {
    from: (table: string) => new Builder(table),

    rpc: async (fn: string, args: Record<string, unknown>): Promise<DbResult<unknown[]>> => {
      if (fn !== 'match_document_chunks') {
        return { data: null, error: { message: `rpc '${fn}' não implementado no pg-shim` } };
      }
      try {
        const { query_embedding, match_count, match_threshold, filter_source_id } = args as {
          query_embedding: number[];
          match_count: number;
          match_threshold: number;
          filter_source_id: string | null;
        };
        const embStr = `[${query_embedding.join(',')}]`;
        const { rows } = await pool().query(
          `SELECT * FROM match_document_chunks($1::vector, $2, $3, $4)`,
          [embStr, match_count, match_threshold, filter_source_id],
        );
        return { data: rows, error: null };
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return { data: null, error: { message } };
      }
    },
  };
}

export function isPgAvailable(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
