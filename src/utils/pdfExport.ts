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

export async function exportSectionsToPdf(
  sectionIds: AppSection[],
  getSectionLabel: (section: AppSection) => string,
  navigateToSection: (section: AppSection) => void,
  onProgress: (progress: PdfExportProgress) => void
): Promise<void> {
  const total = sectionIds.length
  if (total === 0) return

  const mainContent = document.getElementById('main-content')
  if (!mainContent) {
    onProgress({ current: 0, total, currentSection: '', status: 'error' })
    return
  }

  const returnSection = sectionIds[0]

  const freezeStyle = document.createElement('style')
  freezeStyle.id = 'pdf-freeze-anims'
  freezeStyle.textContent = `
    #main-content, #main-content * ,
    #main-content *::before, #main-content *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `

  try {
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
    const leftover = document.getElementById('pdf-freeze-anims')
    if (leftover) leftover.remove()
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
