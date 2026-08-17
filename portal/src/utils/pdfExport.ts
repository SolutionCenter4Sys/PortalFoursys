import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import type { AppSection } from '../types'

export interface PdfExportProgress {
  current: number
  total: number
  currentSection: string
  status: 'preparing' | 'capturing' | 'building' | 'done' | 'error'
}

interface CapturedPage {
  imgData: string
  width: number
  height: number
  label: string
}

// ─── Shared capture pipeline ─────────────────────────────────────────────────

async function captureSections(
  sectionIds: AppSection[],
  getSectionLabel: (section: AppSection) => string,
  navigateToSection: (section: AppSection) => void,
  onProgress: (progress: PdfExportProgress) => void
): Promise<CapturedPage[]> {
  const total = sectionIds.length
  const mainContent = document.getElementById('main-content')
  if (!mainContent) {
    onProgress({ current: 0, total, currentSection: '', status: 'error' })
    return []
  }

  const freezeStyle = document.createElement('style')
  freezeStyle.id = 'pdf-freeze-anims'
  freezeStyle.textContent = `
    #main-content, #main-content *,
    #main-content *::before, #main-content *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `

  const captures: CapturedPage[] = []

  for (let i = 0; i < sectionIds.length; i++) {
    const sectionId = sectionIds[i]
    const label = getSectionLabel(sectionId)

    onProgress({ current: i + 1, total, currentSection: label, status: 'preparing' })

    navigateToSection(sectionId)
    await sleep(3000)

    document.head.appendChild(freezeStyle)
    neutralizeAnimations(mainContent)
    await sleep(300)

    mainContent.scrollTop = 0
    const wrapper = mainContent.querySelector('[data-section-capture]') as HTMLElement | null
    if (wrapper) wrapper.scrollTop = 0
    await sleep(200)

    onProgress({ current: i + 1, total, currentSection: label, status: 'capturing' })

    const overflowState = unlockOverflow(mainContent)
    await sleep(100)

    const targetEl = wrapper ?? mainContent
    const w = targetEl.scrollWidth || targetEl.offsetWidth
    const h = targetEl.scrollHeight || targetEl.offsetHeight

    let canvas: HTMLCanvasElement
    try {
      canvas = await html2canvas(targetEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#0d1117',
        width: w,
        height: h,
        windowWidth: Math.max(w, 1200),
        windowHeight: h,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
      })
    } catch (canvasErr) {
      console.error(`html2canvas failed for "${label}":`, canvasErr)
      restoreOverflow(overflowState)
      restoreAnimations(mainContent)
      freezeStyle.remove()
      continue
    }

    restoreOverflow(overflowState)
    restoreAnimations(mainContent)
    freezeStyle.remove()

    if (canvas.width === 0 || canvas.height === 0) {
      console.warn(`Blank canvas for "${label}" (${canvas.width}x${canvas.height}), skipping`)
      continue
    }

    captures.push({
      imgData: canvas.toDataURL('image/jpeg', 0.85),
      width: canvas.width,
      height: canvas.height,
      label,
    })
  }

  return captures
}

// ─── PDF export ──────────────────────────────────────────────────────────────

export async function exportSectionsToPdf(
  sectionIds: AppSection[],
  getSectionLabel: (section: AppSection) => string,
  navigateToSection: (section: AppSection) => void,
  onProgress: (progress: PdfExportProgress) => void
): Promise<void> {
  const total = sectionIds.length
  if (total === 0) return

  const returnSection = sectionIds[0]

  try {
    const captures = await captureSections(sectionIds, getSectionLabel, navigateToSection, onProgress)

    if (captures.length === 0) {
      onProgress({ current: 0, total, currentSection: '', status: 'error' })
      return
    }

    onProgress({ current: total, total, currentSection: '', status: 'building' })
    buildAndSavePdf(captures)
    onProgress({ current: total, total, currentSection: '', status: 'done' })
  } catch (err) {
    console.error('PDF export error:', err)
    onProgress({ current: 0, total, currentSection: '', status: 'error' })
  } finally {
    cleanup()
    navigateToSection(returnSection)
  }
}

function buildAndSavePdf(captures: CapturedPage[]) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const margin = 10
  const headerH = 8

  for (let i = 0; i < captures.length; i++) {
    if (i > 0) pdf.addPage()

    const { imgData, width, height, label } = captures[i]

    pdf.setFontSize(8)
    pdf.setTextColor(255, 102, 0)
    pdf.text(label, margin, margin + 3)
    pdf.setDrawColor(255, 102, 0)
    pdf.setLineWidth(0.3)
    pdf.line(margin, margin + headerH - 2, pageW - margin, margin + headerH - 2)

    const slotW = pageW - margin * 2
    const slotH = pageH - margin * 2 - headerH
    const imgRatio = width / height
    const slotRatio = slotW / slotH

    let drawW: number
    let drawH: number
    if (imgRatio > slotRatio) {
      drawW = slotW
      drawH = slotW / imgRatio
    } else {
      drawH = slotH
      drawW = slotH * imgRatio
    }

    const x = margin + (slotW - drawW) / 2
    const y = margin + headerH

    pdf.addImage(imgData, 'JPEG', x, y, drawW, Math.min(drawH, slotH))
  }

  const ts = new Date().toISOString().slice(0, 10)
  pdf.save(`Foursys_Portal_${ts}.pdf`)
}

// ─── HTML export ─────────────────────────────────────────────────────────────

export async function exportSectionsToHtml(
  sectionIds: AppSection[],
  getSectionLabel: (section: AppSection) => string,
  navigateToSection: (section: AppSection) => void,
  onProgress: (progress: PdfExportProgress) => void,
  lang: 'pt' | 'en' = 'pt'
): Promise<void> {
  const total = sectionIds.length
  if (total === 0) return

  const returnSection = sectionIds[0]

  try {
    const captures = await captureSections(sectionIds, getSectionLabel, navigateToSection, onProgress)

    if (captures.length === 0) {
      onProgress({ current: 0, total, currentSection: '', status: 'error' })
      return
    }

    onProgress({ current: total, total, currentSection: '', status: 'building' })
    openHtmlPreview(captures, lang)
    onProgress({ current: total, total, currentSection: '', status: 'done' })
  } catch (err) {
    console.error('HTML export error:', err)
    onProgress({ current: 0, total, currentSection: '', status: 'error' })
  } finally {
    cleanup()
    navigateToSection(returnSection)
  }
}

function openHtmlPreview(captures: CapturedPage[], lang: 'pt' | 'en') {
  const ts = new Date().toISOString().slice(0, 10)
  const title = `Foursys Portal — ${ts}`

  const isPt = lang === 'pt'
  const btnPrintLabel = isPt ? 'Gerar PDF (Imprimir)' : 'Generate PDF (Print)'
  const btnDownloadLabel = isPt ? 'Baixar HTML' : 'Download HTML'
  const footerText = isPt
    ? `Documento gerado em ${new Date().toLocaleString('pt-BR')} — Foursys`
    : `Document generated on ${new Date().toLocaleString('en-US')} — Foursys`

  const sectionsHtml = captures.map(({ imgData, label }) => `
    <section class="page-section">
      <div class="section-header">
        <span class="section-label">${escapeHtml(label)}</span>
      </div>
      <img src="${imgData}" alt="${escapeHtml(label)}" />
    </section>
  `).join('\n')

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --bg: #0d1117;
      --surface: #161b22;
      --border: rgba(255,255,255,0.08);
      --orange: #FF6600;
      --text: #e6edf3;
      --dim: #8b949e;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 32px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(12px);
    }

    .toolbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toolbar-brand .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--orange);
      box-shadow: 0 0 8px rgba(255,102,0,0.5);
    }

    .toolbar-brand h1 {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    .toolbar-brand h1 span { color: var(--orange); }

    .toolbar-actions { display: flex; gap: 10px; }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 20px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid var(--border);
      transition: all 0.15s;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--orange), #ff8833);
      color: #fff;
      border-color: var(--orange);
      box-shadow: 0 2px 16px rgba(255,102,0,0.25);
    }
    .btn-primary:hover {
      box-shadow: 0 4px 24px rgba(255,102,0,0.4);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: var(--surface);
      color: var(--text);
      border-color: rgba(255,255,255,0.12);
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.06); }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 80px;
    }

    .page-section {
      margin-bottom: 40px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--surface);
    }

    .section-header {
      padding: 14px 24px;
      border-bottom: 2px solid var(--orange);
      background: rgba(255,102,0,0.06);
    }

    .section-label {
      font-size: 13px;
      font-weight: 800;
      color: var(--orange);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .page-section img {
      display: block;
      width: 100%;
      height: auto;
    }

    .footer {
      text-align: center;
      padding: 24px;
      font-size: 11px;
      color: var(--dim);
      border-top: 1px solid var(--border);
    }

    @media print {
      .toolbar { display: none !important; }
      body { background: #fff; color: #000; }

      .content { max-width: none; padding: 0; }

      .page-section {
        break-inside: avoid;
        page-break-inside: avoid;
        margin-bottom: 0;
        border: none;
        border-radius: 0;
        background: #fff;
      }

      .section-header {
        padding: 8px 16px;
        background: none;
        border-bottom: 2px solid var(--orange);
      }

      .section-label { color: var(--orange); }

      .footer { display: none; }

      @page {
        size: A4 landscape;
        margin: 8mm;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="toolbar-brand">
      <div class="dot"></div>
      <h1>Foursys <span>Portal</span></h1>
    </div>
    <div class="toolbar-actions">
      <button class="btn btn-secondary" onclick="downloadSelf()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ${escapeHtml(btnDownloadLabel)}
      </button>
      <button class="btn btn-primary" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        ${escapeHtml(btnPrintLabel)}
      </button>
    </div>
  </div>

  <div class="content">
    ${sectionsHtml}
  </div>

  <div class="footer">${escapeHtml(footerText)}</div>

  <script>
    function downloadSelf() {
      var html = document.documentElement.outerHTML;
      var blob = new Blob(['<!DOCTYPE html>' + html], { type: 'text/html;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Foursys_Portal_${ts}.html';
      a.click();
      URL.revokeObjectURL(a.href);
    }
  </script>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
  setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function cleanup() {
  const leftover = document.getElementById('pdf-freeze-anims')
  if (leftover) leftover.remove()
}

function neutralizeAnimations(root: HTMLElement) {
  const all = root.querySelectorAll('*')
  all.forEach(node => {
    const el = node as HTMLElement
    if (!el.style) return

    const op = el.style.opacity
    if (op !== '' && op !== '1' && parseFloat(op) < 1) {
      el.dataset.pdfOp = op
      el.style.opacity = '1'
    }

    const tr = el.style.transform
    if (tr && tr !== 'none' && tr !== '') {
      el.dataset.pdfTr = tr
      el.style.transform = 'none'
    }

    const cs = getComputedStyle(el)
    if (cs.opacity !== '1' && !el.dataset.pdfOp) {
      el.dataset.pdfOp = el.style.opacity
      el.style.opacity = '1'
    }
    if (cs.transform && cs.transform !== 'none' && !el.dataset.pdfTr) {
      el.dataset.pdfTr = el.style.transform
      el.style.transform = 'none'
    }
  })
}

function restoreAnimations(root: HTMLElement) {
  root.querySelectorAll('[data-pdf-op]').forEach(node => {
    const el = node as HTMLElement
    el.style.opacity = el.dataset.pdfOp ?? ''
    delete el.dataset.pdfOp
  })
  root.querySelectorAll('[data-pdf-tr]').forEach(node => {
    const el = node as HTMLElement
    el.style.transform = el.dataset.pdfTr ?? ''
    delete el.dataset.pdfTr
  })
}

interface OverflowEntry { el: HTMLElement; overflow: string; overflowY: string; height: string; maxHeight: string }

function unlockOverflow(root: HTMLElement): OverflowEntry[] {
  const saved: OverflowEntry[] = []
  const targets = [root, ...root.querySelectorAll('[data-section-capture]')] as HTMLElement[]

  targets.forEach(el => {
    const cs = getComputedStyle(el)
    if (cs.overflowY === 'auto' || cs.overflowY === 'scroll' || cs.overflowY === 'hidden') {
      saved.push({
        el,
        overflow: el.style.overflow,
        overflowY: el.style.overflowY,
        height: el.style.height,
        maxHeight: el.style.maxHeight,
      })
      el.style.overflow = 'visible'
      el.style.overflowY = 'visible'
      el.style.height = 'auto'
      el.style.maxHeight = 'none'
    }
  })

  return saved
}

function restoreOverflow(entries: OverflowEntry[]) {
  entries.forEach(({ el, overflow, overflowY, height, maxHeight }) => {
    el.style.overflow = overflow
    el.style.overflowY = overflowY
    el.style.height = height
    el.style.maxHeight = maxHeight
  })
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}
