import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import type { AppSection } from '../types'

export interface PdfExportProgress {
  current: number
  total: number
  currentSection: string
  status: 'preparing' | 'capturing' | 'building' | 'done' | 'error'
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

  const currentSectionBackup = sectionIds[0]

  try {
    const captures: { imgData: string; width: number; height: number; label: string }[] = []

    for (let i = 0; i < sectionIds.length; i++) {
      const sectionId = sectionIds[i]
      const label = getSectionLabel(sectionId)

      onProgress({ current: i + 1, total, currentSection: label, status: 'preparing' })
      navigateToSection(sectionId)
      await waitForRender(1500)

      forceVisibility(mainContent)
      await waitForRender(400)

      onProgress({ current: i + 1, total, currentSection: label, status: 'capturing' })

      const canvas = await html2canvas(mainContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0d1117',
        windowWidth: 1100,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
      })

      captures.push({
        imgData: canvas.toDataURL('image/jpeg', 0.92),
        width: canvas.width,
        height: canvas.height,
        label,
      })

      restoreVisibility(mainContent)
    }

    onProgress({ current: total, total, currentSection: '', status: 'building' })

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const margin = 10
    const headerH = 6

    for (let i = 0; i < captures.length; i++) {
      if (i > 0) pdf.addPage()

      const { imgData, width, height, label } = captures[i]

      pdf.setFontSize(8)
      pdf.setTextColor(255, 102, 0)
      pdf.text(label, margin, margin + 3)
      pdf.setDrawColor(255, 102, 0)
      pdf.setLineWidth(0.3)
      pdf.line(margin, margin + headerH, pageW - margin, margin + headerH)

      const contentW = pageW - margin * 2
      const contentH = pageH - margin * 2 - headerH
      const imgAspect = width / height
      const slotAspect = contentW / contentH

      let drawW: number, drawH: number
      if (imgAspect > slotAspect) {
        drawW = contentW
        drawH = contentW / imgAspect
      } else {
        drawH = contentH
        drawW = contentH * imgAspect
      }

      const x = margin + (contentW - drawW) / 2
      const y = margin + headerH + 2

      pdf.addImage(imgData, 'JPEG', x, y, drawW, Math.min(drawH, contentH))
    }

    const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')
    pdf.save(`Foursys_Portal_${date}.pdf`)

    onProgress({ current: total, total, currentSection: '', status: 'done' })
  } catch (err) {
    console.error('PDF export error:', err)
    onProgress({ current: 0, total, currentSection: '', status: 'error' })
  } finally {
    navigateToSection(currentSectionBackup)
  }
}

function forceVisibility(root: HTMLElement) {
  root.querySelectorAll('[style]').forEach(el => {
    const h = el as HTMLElement
    const op = h.style.opacity
    if (op !== '' && parseFloat(op) < 1) {
      h.dataset.pdfOp = op
      h.style.opacity = '1'
    }
    const tr = h.style.transform
    if (tr && tr !== 'none') {
      h.dataset.pdfTr = tr
      h.style.transform = 'none'
    }
  })
}

function restoreVisibility(root: HTMLElement) {
  root.querySelectorAll('[data-pdf-op]').forEach(el => {
    const h = el as HTMLElement
    h.style.opacity = h.dataset.pdfOp ?? ''
    delete h.dataset.pdfOp
  })
  root.querySelectorAll('[data-pdf-tr]').forEach(el => {
    const h = el as HTMLElement
    h.style.transform = h.dataset.pdfTr ?? ''
    delete h.dataset.pdfTr
  })
}

function waitForRender(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
