import type { ChartDatum, ChartWidget, TimelineStep } from "@/lib/widgets/types";

/**
 * Renderizadores visuais PUROS (sem Shell/card) reutilizados em dois lugares:
 *  - WidgetPanel (Contexto), envoltos num Shell
 *  - MarkdownLite (inline, dentro da bolha da resposta — como o mermaid)
 * Manter uma única implementação evita divergência entre painel e inline.
 */

/** paleta Foursys para séries de gráficos */
export const CHART_COLORS = [
  "var(--jarvis-accent)",
  "var(--jarvis-accent-mint)",
  "var(--jarvis-accent-vanilla)",
  "var(--jarvis-accent-hover)",
  "var(--jarvis-fg-muted)",
];

function BarChart({ data, unit }: { data: ChartDatum[]; unit?: string }) {
  const W = 300;
  const H = 150;
  const labelH = 16;
  const valueH = 14;
  const max = Math.max(...data.map((d) => d.value)) || 1;
  const bw = W / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gráfico de barras" className="w-full">
      {data.map((d, i) => {
        const h = ((H - labelH - valueH) * d.value) / max;
        const x = i * bw;
        const y = H - labelH - h;
        return (
          <g key={i}>
            <rect
              x={x + bw * 0.18}
              y={y}
              width={bw * 0.64}
              height={h}
              rx="3"
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              opacity="0.85"
            />
            <text x={x + bw / 2} y={y - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--jarvis-fg)">
              {d.value}
              {unit ?? ""}
            </text>
            <text x={x + bw / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--jarvis-fg-subtle)">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ data, unit }: { data: ChartDatum[]; unit?: string }) {
  const W = 300;
  const H = 140;
  const pad = 14;
  const labelH = 14;
  const max = Math.max(...data.map((d) => d.value)) || 1;
  const step = (W - pad * 2) / Math.max(1, data.length - 1);
  const pts = data.map((d, i) => ({
    x: pad + i * step,
    y: H - labelH - ((H - labelH - 22) * d.value) / max,
  }));
  const poly = pts.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gráfico de linha" className="w-full">
      <polygon
        points={`${poly} ${pts[pts.length - 1].x},${H - labelH} ${pts[0].x},${H - labelH}`}
        fill="var(--jarvis-accent)"
        opacity="0.12"
      />
      <polyline
        points={poly}
        fill="none"
        stroke="var(--jarvis-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="var(--jarvis-accent)" />
          <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--jarvis-fg)">
            {data[i].value}
            {unit ?? ""}
          </text>
          <text x={p.x} y={H - 3} textAnchor="middle" fontSize="9" fill="var(--jarvis-fg-subtle)">
            {data[i].label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function DonutChart({ data, unit }: { data: ChartDatum[]; unit?: string }) {
  const R = 42;
  const C = 2 * Math.PI * R;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const fractions = data.map((d) => d.value / total);
  const offsets = fractions.map(
    (_, i) => -fractions.slice(0, i).reduce((s, f) => s + f, 0) * C,
  );
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 120 120" role="img" aria-label="Gráfico donut" className="w-24 shrink-0">
        {data.map((d, i) => (
          <circle
            key={i}
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth="15"
            strokeDasharray={`${fractions[i] * C} ${C}`}
            strokeDashoffset={offsets[i]}
            transform="rotate(-90 60 60)"
            opacity="0.9"
          />
        ))}
        <text x="60" y="64" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--jarvis-fg)">
          {total}
          {unit ?? ""}
        </text>
      </svg>
      <ul className="min-w-0 flex-1 space-y-1">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-1.5 text-[11px] text-[var(--jarvis-fg-muted)]">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className="min-w-0 flex-1 truncate">{d.label}</span>
            <span className="font-bold text-[var(--jarvis-fg)]">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** gráfico SVG puro — bar, line ou donut na paleta Foursys */
export function ChartBody({
  chartType,
  data,
  unit,
}: {
  chartType: ChartWidget["chartType"];
  data: ChartDatum[];
  unit?: string;
}) {
  if (data.length === 0) {
    return <p className="text-xs text-[var(--jarvis-fg-subtle)]">Sem dados para exibir.</p>;
  }
  if (chartType === "bar") return <BarChart data={data} unit={unit} />;
  if (chartType === "line") return <LineChart data={data} unit={unit} />;
  return <DonutChart data={data} unit={unit} />;
}

/** tabela semântica — header com acento laranja, zebra sutil */
export function TableBody({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  if (rows.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--jarvis-border)]">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b-2 border-[var(--jarvis-accent)]/40 bg-[var(--jarvis-bg-surface)]">
            {columns.map((c, i) => (
              <th
                key={i}
                scope="col"
                className="px-2.5 py-2 font-bold whitespace-nowrap text-[var(--jarvis-fg)]"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 ? "bg-[var(--jarvis-hover)]" : ""}>
              {row.map((cell, j) => (
                <td key={j} className="px-2.5 py-1.5 text-[var(--jarvis-fg-muted)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** linha do tempo vertical com marcadores laranja */
export function TimelineBody({ steps }: { steps: TimelineStep[] }) {
  if (steps.length === 0) return null;
  return (
    <ol className="relative ml-1.5 space-y-4 border-l border-[var(--jarvis-border)] pl-4">
      {steps.map((s, i) => (
        <li key={i} className="relative">
          <span
            aria-hidden="true"
            className={`absolute top-0.5 -left-[21.5px] h-3 w-3 rounded-full border-2 ${
              s.done
                ? "border-[var(--jarvis-accent)] bg-[var(--jarvis-accent)]"
                : "border-[var(--jarvis-accent)]/60 bg-[var(--jarvis-bg-elevated)]"
            }`}
          />
          <div className="flex flex-wrap items-baseline gap-x-2">
            <p className="text-sm font-semibold text-[var(--jarvis-fg)]">{s.title}</p>
            {s.period && (
              <span className="text-[10px] font-semibold tracking-wide text-[var(--jarvis-accent-hover)] uppercase">
                {s.period}
              </span>
            )}
          </div>
          {s.description && (
            <p className="mt-0.5 text-xs text-[var(--jarvis-fg-muted)]">{s.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
