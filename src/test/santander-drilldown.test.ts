import { describe, it, expect } from 'vitest'
import {
  santanderStrategicContext,
  santanderDrillDowns,
  santanderClient,
} from '../data/clients/santander'

describe('Santander strategic context (4T25)', () => {
  it('has report metadata', () => {
    expect(santanderStrategicContext.reportTitle).toContain('4T25')
    expect(santanderStrategicContext.period).toContain('2025')
  })

  it('has at least 6 KPIs', () => {
    expect(santanderStrategicContext.kpis.length).toBeGreaterThanOrEqual(6)
  })

  it('contains key financial KPIs', () => {
    const labels = santanderStrategicContext.kpis.map(k => k.label)
    expect(labels).toContain('Total de Ativos')
    expect(labels).toContain('ROAE')
    expect(labels).toContain('Clientes Totais')
  })

  it('has 3 strategy pillars', () => {
    expect(santanderStrategicContext.strategyPillars).toHaveLength(3)
    const pillarIds = santanderStrategicContext.strategyPillars.map(p => p.id)
    expect(pillarIds).toContain('think-value')
    expect(pillarIds).toContain('think-customer')
    expect(pillarIds).toContain('think-global')
  })

  it('each pillar has at least 2 strategic points', () => {
    for (const pillar of santanderStrategicContext.strategyPillars) {
      expect(pillar.points.length).toBeGreaterThanOrEqual(2)
      expect(pillar.title).toBeTruthy()
      expect(pillar.subtitle).toBeTruthy()
      expect(pillar.color).toMatch(/^#/)
    }
  })

  it('has client segmentation data', () => {
    expect(santanderStrategicContext.segmentation.length).toBeGreaterThanOrEqual(5)
  })

  it('has credit mix data', () => {
    expect(santanderStrategicContext.creditMix.length).toBeGreaterThanOrEqual(3)
  })

  it('has result highlights', () => {
    expect(santanderStrategicContext.highlights.length).toBeGreaterThanOrEqual(5)
  })
})

describe('Santander drill-downs', () => {
  it('has a drill-down for each insight', () => {
    const insightIds = santanderClient.insights?.map(i => i.id) ?? []
    for (const id of insightIds) {
      const drillDown = santanderDrillDowns.find(d => d.insightId === id)
      expect(drillDown).toBeTruthy()
    }
  })

  it('each drill-down has complete structure', () => {
    for (const dd of santanderDrillDowns) {
      expect(dd.insightId).toBeTruthy()
      expect(dd.heroStat.value).toBeTruthy()
      expect(dd.heroStat.label).toBeTruthy()
      expect(dd.context.length).toBeGreaterThan(50)
      expect(dd.challenge.length).toBeGreaterThan(30)
      expect(dd.foursysApproach.length).toBeGreaterThanOrEqual(3)
      expect(dd.expectedImpact.length).toBeGreaterThanOrEqual(2)
      expect(dd.relevantKpis.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('drill-down content references real financial data', () => {
    const thinkValue = santanderDrillDowns.find(d => d.insightId === 'think-value')
    expect(thinkValue?.context).toContain('49.661')
    expect(thinkValue?.heroStat.value).toContain('1,256')
  })
})

describe('Santander client config', () => {
  it('has correct brand colors', () => {
    expect(santanderClient.colors.primary).toBe('#CC0000')
    expect(santanderClient.colors.accent).toBe('#FF3333')
  })

  it('has 4 sections', () => {
    expect(santanderClient.sections).toHaveLength(4)
  })

  it('has 2 cases', () => {
    expect(santanderClient.cases).toHaveLength(2)
  })

  it('has extra1 (Quality IA framework)', () => {
    expect(santanderClient.extra1).toBeTruthy()
    expect(santanderClient.extra1?.title).toContain('Quality IA')
  })
})
