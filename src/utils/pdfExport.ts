import html2pdf from 'html2pdf.js'
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
    const containers: HTMLElement[] = []

    for (let i = 0; i < sectionIds.length; i++) {
      const sectionId = sectionIds[i]
      const label = getSectionLabel(sectionId)

      onProgress({ current: i + 1, total, currentSection: label, status: 'preparing' })
      navigateToSection(sectionId)
      await waitForRender(1200)

      neutralizeAnimations(mainContent)
      await waitForRender(300)

      onProgress({ current: i + 1, total, currentSection: label, status: 'capturing' })
      const container = buildCaptureContainer(mainContent, label)
      containers.push(container)

      restoreAnimations(mainContent)
    }

    onProgress({ current: total, total, currentSection: '', status: 'building' })

    const wrapper = document.createElement('div')
    wrapper.style.cssText = 'position: fixed; left: 0; top: 0; width: 1100px; z-index: -1; opacity: 0; pointer-events: none;'
    containers.forEach((c, idx) => {
      c.style.position = 'relative'
      c.style.left = '0'
      if (idx > 0) {
        c.style.pageBreakBefore = 'always'
        c.classList.add('html2pdf__page-break')
      }
      wrapper.appendChild(c)
    })
    document.body.appendChild(wrapper)

    await waitForRender(200)

    const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')

    await html2pdf()
      .set({
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `Foursys_Portal_${date}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#0d1117',
          width: 1100,
          windowWidth: 1100,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'landscape' as const,
        },
      })
      .from(wrapper)
      .save()

    document.body.removeChild(wrapper)

    onProgress({ current: total, total, currentSection: '', status: 'done' })
  } catch (err) {
    console.error('PDF export error:', err)
    onProgress({ current: 0, total, currentSection: '', status: 'error' })
  } finally {
    navigateToSection(currentSectionBackup)
  }
}

function neutralizeAnimations(root: HTMLElement) {
  root.querySelectorAll('[style]').forEach(el => {
    const htmlEl = el as HTMLElement
    if (htmlEl.style.opacity !== '' && parseFloat(htmlEl.style.opacity) < 1) {
      htmlEl.dataset.pdfOrigOpacity = htmlEl.style.opacity
      htmlEl.style.opacity = '1'
    }
    if (htmlEl.style.transform && htmlEl.style.transform !== 'none') {
      htmlEl.dataset.pdfOrigTransform = htmlEl.style.transform
      htmlEl.style.transform = 'none'
    }
  })
}

function restoreAnimations(root: HTMLElement) {
  root.querySelectorAll('[data-pdf-orig-opacity]').forEach(el => {
    const htmlEl = el as HTMLElement
    htmlEl.style.opacity = htmlEl.dataset.pdfOrigOpacity ?? ''
    delete htmlEl.dataset.pdfOrigOpacity
  })
  root.querySelectorAll('[data-pdf-orig-transform]').forEach(el => {
    const htmlEl = el as HTMLElement
    htmlEl.style.transform = htmlEl.dataset.pdfOrigTransform ?? ''
    delete htmlEl.dataset.pdfOrigTransform
  })
}

function buildCaptureContainer(mainContent: HTMLElement, label: string): HTMLElement {
  const container = document.createElement('div')
  container.style.cssText = `
    width: 1100px;
    padding: 40px;
    background: #0d1117;
    color: #e6edf3;
    font-family: 'Inter', sans-serif;
  `

  const header = document.createElement('div')
  header.style.cssText = `
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #FF6600;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `
  header.innerHTML = `
    <div style="font-size: 22px; font-weight: 700; color: #FF6600;">${label}</div>
    <div style="font-size: 12px; color: #8b949e;">Foursys Portal Institucional</div>
  `
  container.appendChild(header)

  const contentClone = mainContent.cloneNode(true) as HTMLElement
  contentClone.style.cssText = `
    overflow: visible;
    height: auto;
    max-height: none;
  `
  contentClone.removeAttribute('id')

  contentClone.querySelectorAll('[style]').forEach(el => {
    const htmlEl = el as HTMLElement
    if (htmlEl.style.opacity !== '' && parseFloat(htmlEl.style.opacity) < 1) {
      htmlEl.style.opacity = '1'
    }
    if (htmlEl.style.transform && htmlEl.style.transform !== 'none') {
      htmlEl.style.transform = 'none'
    }
    if (htmlEl.style.animation) {
      htmlEl.style.animation = 'none'
    }
  })

  contentClone.querySelectorAll('.animate-spin, .animate-pulse, .animate-bounce').forEach(el => {
    el.classList.remove('animate-spin', 'animate-pulse', 'animate-bounce')
  })

  container.appendChild(contentClone)
  return container
}

function waitForRender(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
