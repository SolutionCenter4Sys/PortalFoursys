/**
 * Catálogo das "caixas internas" das sessões — usado pelo classificador
 * para resolver comandos como "abrir caixa de KPIs", "focar nas alianças".
 *
 * As caixas mais relevantes da Home estão pré-cadastradas. Outras
 * sessões podem usar o mesmo padrão `data-voz-caixa` para se tornarem
 * descobertas automaticamente — ver `descobrirCaixasNoDom`.
 */
import type { CaixaSecao, IdiomaVoz } from './types'

const CAIXAS_PT: ReadonlyArray<CaixaSecao> = [
  // ── Home ────────────────────────────────────────────────────────────────
  {
    id: 'home-kpis',
    secao: 'home',
    rotulo: 'KPIs',
    rotulos: ['kpis', 'kpi', 'indicadores', 'numeros', 'dados', 'estatisticas', 'fundada em 2000'],
  },
  {
    id: 'home-ofertas',
    secao: 'home',
    rotulo: 'Principais Ofertas',
    rotulos: [
      'principais ofertas',
      'ofertas',
      'ofertas principais',
      'ofertas flagship',
      'ai squad',
      'modernizacao',
      'ciberseguranca',
      'fourblox',
      'qualidade',
    ],
  },
  {
    id: 'home-modelos-entrega',
    secao: 'home',
    rotulo: 'Modelos de Entrega',
    rotulos: ['modelos de entrega', 'modelos', 'entrega', 'delivery', 'modelos de delivery'],
  },
  {
    id: 'home-certificacoes',
    secao: 'home',
    rotulo: 'Certificações',
    rotulos: ['certificacoes', 'iso', 'certificados', 'iso 9001', 'iso 27001'],
  },
  {
    id: 'home-aliancas',
    secao: 'home',
    rotulo: 'Alianças Estratégicas',
    rotulos: [
      'aliancas',
      'aliancas estrategicas',
      'parceiros',
      'parcerias',
      'parceiros estrategicos',
      'aws',
      'microsoft',
      'google cloud',
    ],
  },

  // ── Identity (Quem somos) ───────────────────────────────────────────────
  { id: 'identity-kpis', secao: 'identity', rotulo: 'KPIs',
    rotulos: ['kpis', 'numeros', 'indicadores', 'dados', 'metricas', 'foursys em numeros'] },
  { id: 'identity-missao', secao: 'identity', rotulo: 'Missão',
    rotulos: ['missao'] },
  { id: 'identity-visao', secao: 'identity', rotulo: 'Visão',
    rotulos: ['visao'] },
  { id: 'identity-proposito', secao: 'identity', rotulo: 'Propósito',
    rotulos: ['proposito'] },

  // ── AI Foursys ──────────────────────────────────────────────────────────
  { id: 'ai-resultados', secao: 'ai-foursys', rotulo: 'Resultados Comprovados',
    rotulos: ['resultados', 'resultados comprovados', 'kpis', 'metricas de ia'] },
  { id: 'ai-servicos', secao: 'ai-foursys', rotulo: 'Nossos Serviços',
    rotulos: ['servicos', 'nossos servicos', 'ofertas de ia', 'frentes de ia'] },
  { id: 'ai-como', secao: 'ai-foursys', rotulo: 'Como Fazemos',
    rotulos: ['como fazemos', 'como entregamos', 'metodologia', 'how we deliver'] },

  // ── Innovation ──────────────────────────────────────────────────────────
  { id: 'innovation-trends', secao: 'innovation', rotulo: 'Tendências de Inovação',
    rotulos: ['tendencias', 'tendencias de inovacao', 'trends', 'inovacao'] },

  // ── Offers Flagship ─────────────────────────────────────────────────────
  { id: 'offers-grid', secao: 'offers-flagship', rotulo: 'Principais Ofertas',
    rotulos: ['ofertas', 'ofertas flagship', 'ofertas principais', 'flagships'] },

  // ── Services ────────────────────────────────────────────────────────────
  { id: 'services-orbita', secao: 'services', rotulo: 'Linhas de Serviço',
    rotulos: ['linhas de servico', 'orbita', 'servicos', 'roda de servicos'] },

  // ── Alliances ───────────────────────────────────────────────────────────
  { id: 'alliances-parceiros-grid', secao: 'alliances', rotulo: 'Parceiros',
    rotulos: ['parceiros', 'parcerias', 'aliancas', 'cards de parceiros', 'logos'] },
  { id: 'alliances-lista-detalhada', secao: 'alliances', rotulo: 'Detalhe das Alianças',
    rotulos: ['detalhe das aliancas', 'lista de aliancas', 'aliancas detalhadas'] },

  // ── Awards ──────────────────────────────────────────────────────────────
  { id: 'awards-grid', secao: 'awards', rotulo: 'Premiações',
    rotulos: ['premios', 'premiacoes', 'reconhecimentos', 'certificacoes'] },

  // ── Capabilities ────────────────────────────────────────────────────────
  // Cards individuais ficam descobertos via DOM (data-voz-caixa). Aqui só
  // damos um sinônimo para o conjunto.

  // ── ESG ─────────────────────────────────────────────────────────────────
  { id: 'esg-frentes', secao: 'esg', rotulo: 'Frentes de Impacto',
    rotulos: ['frentes', 'frentes de impacto', 'capacitacao', 'inclusao', 'sustentabilidade', 'fourlives'] },
  { id: 'esg-videos', secao: 'esg', rotulo: 'FourCamp na Mídia',
    rotulos: ['videos', 'fourcamp', 'fourcamp na midia', 'midia'] },

  // ── WhyFoursys ──────────────────────────────────────────────────────────
  { id: 'why-kpis', secao: 'why-foursys', rotulo: 'Diferenciais',
    rotulos: ['diferenciais', 'kpis', 'metricas', 'numeros'] },
  { id: 'why-vantagens', secao: 'why-foursys', rotulo: 'Vantagens',
    rotulos: ['vantagens', 'cards de vantagem', 'destaques'] },
]

const CAIXAS_EN: ReadonlyArray<CaixaSecao> = [
  // ── Home ────────────────────────────────────────────────────────────────
  { id: 'home-kpis', secao: 'home', rotulo: 'KPIs',
    rotulos: ['kpis', 'kpi', 'indicators', 'numbers', 'stats', 'statistics', 'founded in 2000'] },
  { id: 'home-ofertas', secao: 'home', rotulo: 'Main Offers',
    rotulos: ['main offers', 'key solutions', 'flagship offers', 'offers', 'ai squad', 'modernization', 'cybersecurity', 'fourblox', 'quality'] },
  { id: 'home-modelos-entrega', secao: 'home', rotulo: 'Delivery Models',
    rotulos: ['delivery models', 'delivery', 'models'] },
  { id: 'home-certificacoes', secao: 'home', rotulo: 'Certifications',
    rotulos: ['certifications', 'iso', 'iso 9001', 'iso 27001'] },
  { id: 'home-aliancas', secao: 'home', rotulo: 'Strategic Alliances',
    rotulos: ['alliances', 'strategic alliances', 'partners', 'partnerships', 'aws', 'microsoft', 'google cloud'] },

  // ── Identity ────────────────────────────────────────────────────────────
  { id: 'identity-kpis', secao: 'identity', rotulo: 'KPIs',
    rotulos: ['kpis', 'numbers', 'indicators', 'metrics', 'foursys in numbers'] },
  { id: 'identity-missao', secao: 'identity', rotulo: 'Mission', rotulos: ['mission'] },
  { id: 'identity-visao', secao: 'identity', rotulo: 'Vision', rotulos: ['vision'] },
  { id: 'identity-proposito', secao: 'identity', rotulo: 'Purpose', rotulos: ['purpose'] },

  // ── AI Foursys ──────────────────────────────────────────────────────────
  { id: 'ai-resultados', secao: 'ai-foursys', rotulo: 'Proven Results',
    rotulos: ['results', 'proven results', 'kpis', 'ai metrics'] },
  { id: 'ai-servicos', secao: 'ai-foursys', rotulo: 'Our Services',
    rotulos: ['services', 'our services', 'ai offers', 'ai fronts'] },
  { id: 'ai-como', secao: 'ai-foursys', rotulo: 'How We Deliver',
    rotulos: ['how we deliver', 'methodology', 'how we do it'] },

  // ── Innovation ──────────────────────────────────────────────────────────
  { id: 'innovation-trends', secao: 'innovation', rotulo: 'Innovation Trends',
    rotulos: ['trends', 'innovation trends', 'innovation'] },

  // ── Offers Flagship ─────────────────────────────────────────────────────
  { id: 'offers-grid', secao: 'offers-flagship', rotulo: 'Main Offers',
    rotulos: ['offers', 'flagship offers', 'main offers', 'flagships'] },

  // ── Services ────────────────────────────────────────────────────────────
  { id: 'services-orbita', secao: 'services', rotulo: 'Service Lines',
    rotulos: ['service lines', 'orbit', 'services', 'service wheel'] },

  // ── Alliances ───────────────────────────────────────────────────────────
  { id: 'alliances-parceiros-grid', secao: 'alliances', rotulo: 'Partners',
    rotulos: ['partners', 'partnerships', 'alliances', 'partner cards', 'logos'] },
  { id: 'alliances-lista-detalhada', secao: 'alliances', rotulo: 'Alliance Details',
    rotulos: ['alliance details', 'partner list', 'detailed alliances'] },

  // ── Awards ──────────────────────────────────────────────────────────────
  { id: 'awards-grid', secao: 'awards', rotulo: 'Awards',
    rotulos: ['awards', 'recognitions', 'certifications'] },

  // ── ESG ─────────────────────────────────────────────────────────────────
  { id: 'esg-frentes', secao: 'esg', rotulo: 'Impact Fronts',
    rotulos: ['fronts', 'impact fronts', 'training', 'inclusion', 'sustainability', 'fourlives'] },
  { id: 'esg-videos', secao: 'esg', rotulo: 'FourCamp on Media',
    rotulos: ['videos', 'fourcamp', 'fourcamp on media', 'media'] },

  // ── WhyFoursys ──────────────────────────────────────────────────────────
  { id: 'why-kpis', secao: 'why-foursys', rotulo: 'Differentials',
    rotulos: ['differentials', 'kpis', 'metrics', 'numbers'] },
  { id: 'why-vantagens', secao: 'why-foursys', rotulo: 'Advantages',
    rotulos: ['advantages', 'advantage cards', 'highlights'] },
]

export function catalogoCaixas(idioma: IdiomaVoz): ReadonlyArray<CaixaSecao> {
  return idioma === 'en-US' ? CAIXAS_EN : CAIXAS_PT
}

export function caixasParaSecao(
  secao: string,
  idioma: IdiomaVoz,
): ReadonlyArray<CaixaSecao> {
  return catalogoCaixas(idioma).filter((c) => c.secao === secao)
}

/**
 * Descobre caixas adicionais marcadas no DOM com `data-voz-caixa`.
 * Estende o catálogo estático com componentes que se "auto-cadastram".
 */
export function descobrirCaixasNoDom(): ReadonlyArray<CaixaSecao> {
  if (typeof document === 'undefined') return []
  const els = Array.from(
    document.querySelectorAll<HTMLElement>('[data-voz-caixa][data-voz-caixa-secao]'),
  )
  const seen = new Set<string>()
  const out: CaixaSecao[] = []
  for (const el of els) {
    const id = el.dataset.vozCaixa ?? ''
    const secao = (el.dataset.vozCaixaSecao ?? '') as CaixaSecao['secao']
    if (!id || !secao) continue
    if (seen.has(id)) continue
    seen.add(id)
    const rotulo =
      el.getAttribute('aria-label') ??
      el.dataset.vozCaixaRotulo ??
      el.textContent?.trim() ??
      id
    const sinRaw = el.dataset.vozCaixaSinonimos ?? ''
    const rotulos = sinRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    out.push({ id, secao, rotulo, rotulos })
  }
  return out
}
