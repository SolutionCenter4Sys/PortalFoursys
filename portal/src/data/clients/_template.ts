/**
 * Template para adicionar novos clientes ao FoursysPortal.
 *
 * Para criar um novo cliente:
 * 1. Copie este arquivo e renomeie para o nome do cliente (ex: acme.ts)
 * 2. Preencha todos os campos obrigatórios
 * 3. Importe e adicione ao array `clients` em ./index.ts
 * 4. As seções client-opening, client-insights, client-cases e client-extra-1
 *    são renderizadas automaticamente pelos componentes em components/sections/client/
 */

import type { ClientConfig } from '../../types'

export const templateClient: ClientConfig = {
  id: 'template',
  name: 'Nome do Cliente',
  colors: {
    primary: '#FF6600',
    accent: '#FFB800',
  },
  tagline: 'Tagline da parceria com o cliente',
  relationship: 'Descrição do relacionamento',
  yearsPartnership: 0,
  sections: [
    {
      id: 'client-opening',
      label: 'Visão Geral',
      description: 'Abertura da apresentação personalizada',
      icon: 'building-2',
      component: 'client-opening',
    },
    {
      id: 'client-insights',
      label: 'Insights',
      description: 'Percepções e oportunidades identificadas',
      icon: 'scan-eye',
      component: 'client-insights',
    },
    {
      id: 'client-cases',
      label: 'Cases',
      description: 'Projetos entregues para o cliente',
      icon: 'trophy',
      component: 'client-cases',
    },
  ],
  insights: [
    {
      id: 'insight-1',
      title: 'Título do Insight',
      description: 'Descrição do problema ou oportunidade identificada',
      solution: 'Como a Foursys pode ajudar',
      icon: 'lightbulb',
    },
  ],
  cases: [
    {
      id: 'case-1',
      title: 'Título do Case',
      sector: 'Setor',
      type: 'Tipo do Projeto',
      challenge: 'Desafio enfrentado',
      solution: 'Solução implementada',
      results: ['Resultado 1', 'Resultado 2'],
      metric: { value: '0%', label: 'Métrica principal' },
      stack: ['Tech 1', 'Tech 2'],
    },
  ],
}
