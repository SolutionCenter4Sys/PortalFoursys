import { NextResponse } from "next/server";

import { buildIndex, clearMemoryIndex, getIndexMeta, loadIndex } from "@/lib/rag/index-store";

export const maxDuration = 300;
export const runtime = "nodejs";

export async function GET() {
  const meta = await getIndexMeta();
  const chunks = await loadIndex();
  return NextResponse.json({
    indexed: chunks.length > 0,
    chunkCount: chunks.length,
    meta,
  });
}

export async function POST() {
  if (process.env.RAG_REINDEX_KEY) {
    /* optional auth in future */
  }

  try {
    clearMemoryIndex();
    const { chunks, meta } = await buildIndex();
    return NextResponse.json({
      ok: true,
      chunkCount: chunks.length,
      meta,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Reindex failed" },
      { status: 502 },
    );
  }
}
