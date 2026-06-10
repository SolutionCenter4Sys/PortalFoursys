import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Maximize2, ArrowRight } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { useLanguage } from '../../i18n'
import { DynIcon } from '../../utils/iconMap'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PillarStat {
  value: string
  label: string
}

interface PillarGroup {
  title: string
  items: string[]
}

interface Pillar {
  id: string
  icon: string
  color: string
  title: string
  scope: string
  summary: string
  stats: PillarStat[]
  groups: PillarGroup[]
}

interface PlatformBlock {
  intro: string
  title: string
  description: string
  pillars: { title: string; icon: string; items: string[] }[]
}

interface IntegratedStrategy {
  title: string
  description: string
  steps: { stage: string; action: string }[]
  stats: { value: string; label: string }[]
  note: string
}

interface RHContent {
  badge: string
  title: string
  subtitle: string
  detailLabel: string
  pillars: Pillar[]
  platform: PlatformBlock
  integrated: IntegratedStrategy
  valueTitle: string
  values: { icon: string; title: string; description: string }[]
  closing: string
}

// ─── Drill-down "Atração" (conteúdo completo das páginas 5 a 7 do PDF) ──────────

interface DrillItem {
  name?: string
  desc: string
}

interface DrillBlock {
  heading: string
  subtitle?: string
  items: DrillItem[]
}

interface DrillPage {
  page: string
  title: string
  intro?: string
  stats?: { value: string; label: string }[]
  blocks?: DrillBlock[]
  table?: { headers: string[]; rows: string[][] }
  note?: string
}

interface AtracaoDrill {
  badge: string
  title: string
  subtitle: string
  closeLabel: string
  pages: DrillPage[]
}

// ─── i18n Data (conteúdo extraído da Apresentação Comercial de RH) ──────────────

const rhContentI18n: Record<'pt' | 'en', RHContent> = {
  pt: {
    badge: 'RH · Estratégia de Talentos',
    title: 'Como conectamos talentos, liderança e operações para garantir excelência nas entregas.',
    subtitle:
      'Fundada no ano 2000, a Foursys consolida 26 anos de história em 2026, atuando globalmente no desenvolvimento de soluções de tecnologia e agilizando processos com inteligência de ponta para impulsionar negócios.',
    detailLabel: 'Detalhamento do pilar',
    pillars: [
      {
        id: 'atracao',
        icon: 'users',
        color: '#FF6600',
        title: 'Atração',
        scope: 'Escala e Especialização',
        summary:
          'Estrutura dedicada ao fechamento de centenas de vagas anuais de tecnologia, otimizada com plataformas e metodologias de recrutamento assistidas por IA.',
        stats: [
          { value: '80', label: 'Contratações médias por mês' },
          { value: '17 dias', label: 'Tempo médio de fechamento' },
          { value: '22', label: 'Recrutadores especializados' },
        ],
        groups: [
          {
            title: 'Velocidade',
            items: ['Kickoff da vaga em 24h', 'Primeiros perfis em 48–72h', 'Shortlist qualificada em até 5 dias'],
          },
          {
            title: 'Canais de atração estratégica',
            items: [
              'Programas de Formação (FourCamp e FourCamp Inclusion)',
              'Grupos e comunidades de tecnologia',
              'Programa de indicação interna',
              'Talent Mapping & Hubs de Talentos',
            ],
          },
          {
            title: 'Diferenciais',
            items: ['Hunting especializado', 'Talent Pools ativos', 'IA aplicada ao recrutamento', 'Avaliação técnica e fit cultural'],
          },
        ],
      },
      {
        id: 'desenvolvimento',
        icon: 'graduation-cap',
        color: '#8B5CF6',
        title: 'Desenvolvimento',
        scope: 'Técnico e Humano',
        summary:
          'Programas de capacitação intensiva, como o FourLeaders para formação de lideranças de alta performance e o renomado FourCamp para aceleração de carreiras.',
        stats: [
          { value: '+45.000h', label: 'Desenvolvimento em 2026' },
          { value: '2.760', label: 'Participações em 2026' },
          { value: 'NPS 90', label: 'Programa de liderança' },
        ],
        groups: [
          {
            title: 'Ecossistema de desenvolvimento',
            items: [
              'Integração e Jornada 180 dias',
              'Competências técnicas (Java, Cobol, React, .Net, AWS, Azure, IA)',
              'Competências comportamentais',
              'Compliance e governança',
            ],
          },
          {
            title: 'FourCamp — aceleração de talentos',
            items: [
              '+700 horas de desenvolvimento',
              '+120 dias de aceleração contínua',
              'Talentos prontos para codificar desde o dia zero',
              'Validação em laboratório com projetos simulados',
            ],
          },
          {
            title: 'FourLeaders — lideranças',
            items: [
              '800 participações (jan–mai/26)',
              '1.200 horas de formação',
              'Comunicação assertiva e inteligência emocional',
              'Rituais de gestão e gestão de conflitos',
            ],
          },
        ],
      },
      {
        id: 'retencao',
        icon: 'heart',
        color: '#4ADE80',
        title: 'Retenção',
        scope: 'Cultura e Clima',
        summary:
          'Ambiente de trabalho de excelência certificado consecutivamente pelo Great Place to Work (GPTW), focado em bem-estar e desenvolvimento mútuo.',
        stats: [
          { value: '85%', label: 'Favorabilidade GPTW' },
          { value: '91%', label: 'Orgulho do trabalho realizado' },
          { value: '90%', label: 'Colaboração entre equipes' },
        ],
        groups: [
          {
            title: 'Escutamos',
            items: ['Pesquisa de clima e pulses', 'Feedbacks contínuos', '1:1 recorrente', 'Escuta ativa dos HRBPs'],
          },
          {
            title: 'Desenvolvemos',
            items: ['Academy', 'FourLeaders', 'Jornada de crescimento', 'FourCamp'],
          },
          {
            title: 'Cuidamos (bem-estar)',
            items: [
              'Wellz — apoio psicológico (até 53 sessões/ano)',
              'Wellhub — academias e bem-estar',
              'Campanhas internas de saúde mental',
              'SulAmérica Saúde + Rede D’Or',
            ],
          },
        ],
      },
      {
        id: 'governanca',
        icon: 'shield-check',
        color: '#3B82F6',
        title: 'Governança',
        scope: 'Conformidade e Segurança',
        summary:
          'Mitigação de riscos suportada pelas normas internacionais ISO 9001, ISO 27001, ISO 27701 e práticas do framework SAFe para escala ágil.',
        stats: [
          { value: 'ISO 9001', label: 'Qualidade' },
          { value: 'ISO 27001/27701', label: 'Segurança e privacidade' },
          { value: 'SAFe', label: 'Escala ágil' },
        ],
        groups: [
          {
            title: 'Compliance',
            items: ['Obrigações legais e encargos', 'Processos padronizados', 'Mitigação de riscos'],
          },
          {
            title: 'Segurança e privacidade',
            items: ['LGPD', 'ISO 27001 e ISO 27701', 'Treinamentos obrigatórios'],
          },
          {
            title: 'Governança corporativa & ESG',
            items: [
              'Código de ética e auditorias',
              'Controles internos e processos rastreáveis',
              'Comitê ESG, Pacto Global e FourLives',
            ],
          },
        ],
      },
    ],
    platform: {
      intro:
        'A Foursys utiliza a Fourmakers, sua plataforma proprietária de inteligência organizacional, como principal ambiente de gestão integrada de pessoas, processos, dados e agentes de Inteligência Artificial.',
      title: 'Plataforma Fourmakers',
      description:
        'Estruturada sobre 4 pilares de transformação organizacional, promove atendimento inteligente, integração com IA, automação e desenvolvimento humano, garantindo escalabilidade, rastreabilidade e alinhamento estratégico.',
      pillars: [
        {
          title: 'RH Digital',
          icon: 'clipboard-list',
          items: [
            'Gestão de ponto e jornada',
            'Férias e afastamentos',
            'Timesheet e alocação de equipes',
            'Gestão de terceiros',
            'Contratos e parcerias',
          ],
        },
        {
          title: 'Desenvolvimento Humano',
          icon: 'graduation-cap',
          items: [
            'Avaliação de desempenho',
            'Plano de Desenvolvimento Individual (PDI)',
            'Trilhas de aprendizagem',
            'Treinamentos corporativos',
            'Reconhecimento 360°',
          ],
        },
        {
          title: 'Comunicação',
          icon: 'network',
          items: [
            'Feed corporativo',
            'Comunicados e campanhas',
            'Pesquisas organizacionais',
            'Gamificação',
            'Central de atendimento assistida por IA',
          ],
        },
        {
          title: 'Gestão Estratégica',
          icon: 'target',
          items: [
            'Recrutamento e seleção',
            'Recrutamento assistido por IA',
            'Simulação salarial',
            'Conferência de folha',
            'Gestão de reembolsos',
          ],
        },
      ],
    },
    integrated: {
      title: 'Estratégia Integrada de Talentos',
      description:
        'Conectamos talentos, liderança e operações para garantir continuidade operacional, escalabilidade e excelência nas entregas.',
      steps: [
        { stage: 'Atrair', action: 'Encontrar os talentos certos' },
        { stage: 'Integrar', action: 'Acelerar produtividade' },
        { stage: 'Desenvolver', action: 'Expandir competências' },
        { stage: 'Orquestrar', action: 'Alocar com inteligência' },
        { stage: 'Engajar', action: 'Fortalecer pertencimento' },
        { stage: 'Sustentar', action: 'Garantir continuidade operacional' },
      ],
      stats: [
        { value: '44.370h', label: 'De capacitação e desenvolvimento (2025)' },
        { value: '85%', label: 'Favorabilidade GPTW (2025)' },
      ],
      note: 'Nossa estratégia de talentos foi desenhada para garantir que os profissionais certos estejam nos projetos certos, permaneçam engajados e sustentem resultados para nossos clientes.',
    },
    valueTitle: 'O que isso gera para nossos clientes',
    values: [
      { icon: 'zap', title: 'Velocidade', description: 'Mobilização ágil de profissionais qualificados para demandas críticas.' },
      { icon: 'shield-check', title: 'Continuidade', description: 'Menor risco de ruptura nas equipes e preservação do conhecimento.' },
      { icon: 'target', title: 'Aderência', description: 'Profissionais alinhados técnica, comportamental e culturalmente.' },
      { icon: 'lock', title: 'Segurança', description: 'Governança, compliance e proteção da informação em operações confiáveis.' },
      { icon: 'trending-up', title: 'Performance', description: 'Equipes preparadas para gerar resultados consistentes e de alta qualidade.' },
      { icon: 'rocket', title: 'Escalabilidade', description: 'Crescimento com qualidade, previsibilidade e sustentabilidade.' },
    ],
    closing:
      'Na Foursys, a excelência das entregas começa na estratégia de pessoas. Pessoas certas. Lideranças preparadas. Governança sólida.',
  },
  en: {
    badge: 'HR · Talent Strategy',
    title: 'How we connect talent, leadership and operations to ensure delivery excellence.',
    subtitle:
      'Founded in 2000, Foursys consolidates 26 years of history in 2026, operating globally in the development of technology solutions and streamlining processes with cutting-edge intelligence to drive business.',
    detailLabel: 'Pillar details',
    pillars: [
      {
        id: 'atracao',
        icon: 'users',
        color: '#FF6600',
        title: 'Attraction',
        scope: 'Scale and Specialization',
        summary:
          'Dedicated structure to fill hundreds of annual technology openings, optimized with AI-assisted recruiting platforms and methodologies.',
        stats: [
          { value: '80', label: 'Average hires per month' },
          { value: '17 days', label: 'Average time to fill' },
          { value: '22', label: 'Specialized recruiters' },
        ],
        groups: [
          {
            title: 'Speed',
            items: ['Role kickoff in 24h', 'First profiles in 48–72h', 'Qualified shortlist in up to 5 days'],
          },
          {
            title: 'Strategic attraction channels',
            items: [
              'Training programs (FourCamp and FourCamp Inclusion)',
              'Technology groups and communities',
              'Internal referral program',
              'Talent Mapping & Talent Hubs',
            ],
          },
          {
            title: 'Differentiators',
            items: ['Specialized hunting', 'Active talent pools', 'AI applied to recruiting', 'Technical assessment and cultural fit'],
          },
        ],
      },
      {
        id: 'desenvolvimento',
        icon: 'graduation-cap',
        color: '#8B5CF6',
        title: 'Development',
        scope: 'Technical and Human',
        summary:
          'Intensive training programs, such as FourLeaders for high-performance leadership development and the renowned FourCamp for career acceleration.',
        stats: [
          { value: '+45,000h', label: 'Development in 2026' },
          { value: '2,760', label: 'Participations in 2026' },
          { value: 'NPS 90', label: 'Leadership program' },
        ],
        groups: [
          {
            title: 'Development ecosystem',
            items: [
              'Onboarding and 180-day journey',
              'Technical skills (Java, Cobol, React, .Net, AWS, Azure, AI)',
              'Behavioral skills',
              'Compliance and governance',
            ],
          },
          {
            title: 'FourCamp — talent acceleration',
            items: [
              '+700 hours of development',
              '+120 days of continuous acceleration',
              'Talent ready to code from day zero',
              'Lab validation with simulated projects',
            ],
          },
          {
            title: 'FourLeaders — leadership',
            items: [
              '800 participations (Jan–May/26)',
              '1,200 training hours',
              'Assertive communication and emotional intelligence',
              'Management rituals and conflict management',
            ],
          },
        ],
      },
      {
        id: 'retencao',
        icon: 'heart',
        color: '#4ADE80',
        title: 'Retention',
        scope: 'Culture and Climate',
        summary:
          'Excellence workplace consecutively certified by Great Place to Work (GPTW), focused on well-being and mutual development.',
        stats: [
          { value: '85%', label: 'GPTW favorability' },
          { value: '91%', label: 'Pride in work done' },
          { value: '90%', label: 'Cross-team collaboration' },
        ],
        groups: [
          {
            title: 'We listen',
            items: ['Climate surveys and pulses', 'Continuous feedback', 'Recurring 1:1s', 'Active listening from HRBPs'],
          },
          {
            title: 'We develop',
            items: ['Academy', 'FourLeaders', 'Growth journey', 'FourCamp'],
          },
          {
            title: 'We care (well-being)',
            items: [
              'Wellz — psychological support (up to 53 sessions/year)',
              'Wellhub — gyms and well-being',
              'Internal mental health campaigns',
              'SulAmérica Health + Rede D’Or',
            ],
          },
        ],
      },
      {
        id: 'governanca',
        icon: 'shield-check',
        color: '#3B82F6',
        title: 'Governance',
        scope: 'Compliance and Security',
        summary:
          'Risk mitigation supported by international standards ISO 9001, ISO 27001, ISO 27701 and SAFe framework practices for agile scale.',
        stats: [
          { value: 'ISO 9001', label: 'Quality' },
          { value: 'ISO 27001/27701', label: 'Security and privacy' },
          { value: 'SAFe', label: 'Agile scale' },
        ],
        groups: [
          {
            title: 'Compliance',
            items: ['Legal obligations and charges', 'Standardized processes', 'Risk mitigation'],
          },
          {
            title: 'Security and privacy',
            items: ['LGPD', 'ISO 27001 and ISO 27701', 'Mandatory training'],
          },
          {
            title: 'Corporate governance & ESG',
            items: [
              'Code of ethics and audits',
              'Internal controls and traceable processes',
              'ESG Committee, Global Compact and FourLives',
            ],
          },
        ],
      },
    ],
    platform: {
      intro:
        'Foursys uses Fourmakers, its proprietary organizational intelligence platform, as the main environment for the integrated management of people, processes, data and Artificial Intelligence agents.',
      title: 'Fourmakers Platform',
      description:
        'Built on 4 pillars of organizational transformation, it promotes intelligent service, AI integration, automation and human development, ensuring scalability, traceability and strategic alignment.',
      pillars: [
        {
          title: 'Digital HR',
          icon: 'clipboard-list',
          items: [
            'Time and attendance management',
            'Vacation and leave',
            'Timesheet and team allocation',
            'Third-party management',
            'Contracts and partnerships',
          ],
        },
        {
          title: 'Human Development',
          icon: 'graduation-cap',
          items: [
            'Performance evaluation',
            'Individual Development Plan (IDP)',
            'Learning paths',
            'Corporate training',
            '360° recognition',
          ],
        },
        {
          title: 'Communication',
          icon: 'network',
          items: [
            'Corporate feed',
            'Announcements and campaigns',
            'Organizational surveys',
            'Gamification',
            'AI-assisted service center',
          ],
        },
        {
          title: 'Strategic Management',
          icon: 'target',
          items: [
            'Recruitment and selection',
            'AI-assisted recruitment',
            'Salary simulation',
            'Payroll review',
            'Reimbursement management',
          ],
        },
      ],
    },
    integrated: {
      title: 'Integrated Talent Strategy',
      description:
        'We connect talent, leadership and operations to ensure operational continuity, scalability and delivery excellence.',
      steps: [
        { stage: 'Attract', action: 'Find the right talent' },
        { stage: 'Integrate', action: 'Accelerate productivity' },
        { stage: 'Develop', action: 'Expand competencies' },
        { stage: 'Orchestrate', action: 'Allocate intelligently' },
        { stage: 'Engage', action: 'Strengthen belonging' },
        { stage: 'Sustain', action: 'Ensure operational continuity' },
      ],
      stats: [
        { value: '44,370h', label: 'Of training and development (2025)' },
        { value: '85%', label: 'GPTW favorability (2025)' },
      ],
      note: 'Our talent strategy was designed to ensure the right professionals are on the right projects, stay engaged and sustain results for our clients.',
    },
    valueTitle: 'What this generates for our clients',
    values: [
      { icon: 'zap', title: 'Speed', description: 'Agile mobilization of qualified professionals for critical demands.' },
      { icon: 'shield-check', title: 'Continuity', description: 'Lower risk of team disruption and knowledge preservation.' },
      { icon: 'target', title: 'Alignment', description: 'Professionals aligned technically, behaviorally and culturally.' },
      { icon: 'lock', title: 'Security', description: 'Governance, compliance and information protection in reliable operations.' },
      { icon: 'trending-up', title: 'Performance', description: 'Teams prepared to deliver consistent, high-quality results.' },
      { icon: 'rocket', title: 'Scalability', description: 'Growth with quality, predictability and sustainability.' },
    ],
    closing:
      'At Foursys, delivery excellence starts with the people strategy. Right people. Prepared leaders. Solid governance.',
  },
}

const atracaoDrillI18n: Record<'pt' | 'en', AtracaoDrill> = {
  pt: {
    badge: 'Drill down · Atração de Talentos',
    title: 'Atração de Talentos — Conteúdo Completo',
    subtitle: 'Canais estratégicos, atração em escala e benefícios para atrair e reconhecer.',
    closeLabel: 'Fechar',
    pages: [
      {
        page: 'Página 5',
        title: 'Canais de Atração Estratégica',
        intro:
          'Diversificação de fontes de captação de talentos e fortalecimento de marca empregadora para atendimento de demandas críticas.',
        blocks: [
          {
            heading: 'Canais para grandes demandas',
            items: [
              { name: 'Programas de Formação (FourCamp e FourCamp Inclusion)', desc: 'Somos especialistas na formação e desenvolvimento de mão de obra especializada sob medida.' },
              { name: 'Grupos e Comunidades de Tecnologia', desc: 'Segmentação técnica focada com engajamento de longo prazo nas comunidades.' },
              { name: 'Programa de Indicação Interna', desc: 'Rede ativa de talentos qualificados através de indicações diretas e estimuladas.' },
              { name: 'Talent Mapping & Hubs de Talentos', desc: 'Mapeamento contínuo de mercado e busca ativa direcionada para antecipar tendências.' },
            ],
          },
          {
            heading: 'Atração e posicionamento de marca',
            items: [
              { name: 'Workshops Especializados', desc: 'Produção e disseminação de conteúdo de alta relevância técnica no ecossistema.' },
              { name: 'Mentorias e Parcerias Acadêmicas', desc: 'Presença ativa e mentoria em instituições de ensino de nível técnico e superior.' },
              { name: 'Grandes Feiras e Eventos Tech', desc: 'Participação estratégica nos principais palcos de tecnologia do país.' },
            ],
          },
        ],
        note: 'Nossa engrenagem de canais e posicionamento consolida a Foursys como marca empregadora altamente atrativa, assegurando a agilidade e a excelência que os nossos maiores parceiros exigem.',
      },
      {
        page: 'Página 6',
        title: 'Atração de Talentos em Escala',
        intro: 'Estrutura especializada para atender demandas críticas com velocidade, qualidade e capacidade de escala.',
        stats: [
          { value: '80', label: 'Contratações médias por mês' },
          { value: '17 dias', label: 'Tempo médio de fechamento' },
          { value: '22', label: 'Recrutadores especializados' },
        ],
        blocks: [
          {
            heading: 'Velocidade',
            items: [
              { name: '24h', desc: 'Kickoff da vaga' },
              { name: '48–72h', desc: 'Primeiros perfis' },
              { name: 'Até 5 dias', desc: 'Shortlist qualificada' },
            ],
          },
          {
            heading: 'Diferenciais',
            items: [
              { desc: 'Hunting especializado' },
              { desc: 'Talent Pools ativos' },
              { desc: 'IA aplicada ao recrutamento' },
              { desc: 'Avaliação técnica' },
              { desc: 'Fit cultural' },
            ],
          },
        ],
        note: 'Combinamos velocidade, especialização e inteligência de mercado para garantir a disponibilidade dos talentos necessários à execução dos projetos.',
      },
      {
        page: 'Página 7',
        title: 'Benefícios para atrair e reconhecer',
        intro:
          'Custos subsidiados — 100% Empresa: nossa empresa subsidia integralmente o custo dos principais benefícios de saúde e bem-estar para o titular colaborador, garantindo custo zero de adesão.',
        table: {
          headers: ['Categoria de benefício', 'Elegibilidade', 'Subsídio & Parcerias'],
          rows: [
            ['Assistência Médica e Odonto', 'Imediato (Admissão)', 'Médica: 100% Empresa | Odonto: Desconto Simbólico'],
            ['iFood Benefícios (Vale-Refeição)', 'Imediato (Admissão)', '100% custo pela Foursys'],
            ['Parcerias e Reembolso Educacional', 'Imediato (Admissão)', 'Anhanguera, Conquer, FIAP, etc.'],
            ['Wellhub (Gympass) & Wellz (Psico)', 'Imediato (Admissão)', 'Wellz 100% | Descontos especiais no Wellhub'],
            ['Férias e Licença Parental', 'Conforme Legislação', 'Férias (12 meses) | Licença Parental Ampliada'],
          ],
        },
        blocks: [
          {
            heading: 'Saúde e bem-estar',
            subtitle: 'Profissionais mais saudáveis, engajados e preparados para entregar alta performance.',
            items: [
              { desc: 'SulAmérica Saúde com acomodação em apartamento e Rede D’Or' },
              { desc: 'Plataforma de teleconsulta Dr.Alper' },
              { desc: 'Odontoprev com cobertura nacional e ampla rede credenciada' },
              { desc: 'Wellhub com acesso a academias, esportes e plataformas de bem-estar' },
              { desc: 'Apoio psicológico com até 53 sessões anuais (Wellz)' },
              { desc: 'Gestão de saúde ocupacional digital e simplificada, com autoatendimento' },
              { desc: 'Seguro de vida Metlife com valor 3x o previsto para a categoria' },
            ],
          },
          {
            heading: 'Educação e desenvolvimento',
            subtitle: 'Garantimos que nosso time use as tecnologias mais recentes por meio de parcerias de alto nível e incentivo constante aos estudos.',
            items: [
              { desc: 'FIAP, Conquer e Descomplica' },
              { desc: 'Open English e Alpha Idiomas' },
              { desc: 'Reembolso educacional ativo e simplificado' },
              { desc: 'FourCamp: programa próprio de formação e aceleração de talentos' },
            ],
          },
          {
            heading: 'Qualidade de vida',
            subtitle: 'Cuidamos das pessoas em todas as etapas de sua jornada, promovendo bem-estar, proteção e apoio à família.',
            items: [
              { desc: 'Vale-Refeição e Vale-Alimentação, com flexibilidade para transferência de saldo entre as carteiras' },
              { desc: 'Licença Parental Ampliada' },
              { desc: 'Programa Melhor Natalidade para apoio à gestação e primeira infância' },
              { desc: 'Auxílio Creche até 6 anos e filhos com deficiência sem limite de idade' },
              { desc: 'Seguro de Vida com coberturas para morte, invalidez, doenças graves, assistência funeral e apoio à família' },
              { desc: 'Benefícios para a família e lazer (Parque da Mônica e parcerias corporativas)' },
            ],
          },
        ],
      },
    ],
  },
  en: {
    badge: 'Drill down · Talent Attraction',
    title: 'Talent Attraction — Full Content',
    subtitle: 'Strategic channels, attraction at scale and benefits to attract and recognize.',
    closeLabel: 'Close',
    pages: [
      {
        page: 'Page 5',
        title: 'Strategic Attraction Channels',
        intro:
          'Diversification of talent sourcing and strengthening of the employer brand to meet critical demands.',
        blocks: [
          {
            heading: 'Channels for large demands',
            items: [
              { name: 'Training programs (FourCamp and FourCamp Inclusion)', desc: 'We specialize in tailor-made training and development of specialized workforce.' },
              { name: 'Technology groups and communities', desc: 'Focused technical segmentation with long-term community engagement.' },
              { name: 'Internal referral program', desc: 'Active network of qualified talent through direct and incentivized referrals.' },
              { name: 'Talent Mapping & Talent Hubs', desc: 'Continuous market mapping and targeted active sourcing to anticipate trends.' },
            ],
          },
          {
            heading: 'Brand attraction and positioning',
            items: [
              { name: 'Specialized workshops', desc: 'Production and dissemination of highly relevant technical content in the ecosystem.' },
              { name: 'Mentoring and academic partnerships', desc: 'Active presence and mentoring at technical and higher education institutions.' },
              { name: 'Major tech fairs and events', desc: 'Strategic participation in the country’s main technology stages.' },
            ],
          },
        ],
        note: 'Our engine of channels and positioning consolidates Foursys as a highly attractive employer brand, ensuring the agility and excellence our largest partners require.',
      },
      {
        page: 'Page 6',
        title: 'Talent Attraction at Scale',
        intro: 'Specialized structure to meet critical demands with speed, quality and scale capacity.',
        stats: [
          { value: '80', label: 'Average hires per month' },
          { value: '17 days', label: 'Average time to fill' },
          { value: '22', label: 'Specialized recruiters' },
        ],
        blocks: [
          {
            heading: 'Speed',
            items: [
              { name: '24h', desc: 'Role kickoff' },
              { name: '48–72h', desc: 'First profiles' },
              { name: 'Up to 5 days', desc: 'Qualified shortlist' },
            ],
          },
          {
            heading: 'Differentiators',
            items: [
              { desc: 'Specialized hunting' },
              { desc: 'Active talent pools' },
              { desc: 'AI applied to recruiting' },
              { desc: 'Technical assessment' },
              { desc: 'Cultural fit' },
            ],
          },
        ],
        note: 'We combine speed, specialization and market intelligence to ensure the availability of the talent required to execute projects.',
      },
      {
        page: 'Page 7',
        title: 'Benefits to attract and recognize',
        intro:
          'Subsidized costs — 100% Company: the company fully subsidizes the cost of the main health and well-being benefits for the employee, ensuring zero enrollment cost.',
        table: {
          headers: ['Benefit category', 'Eligibility', 'Subsidy & Partnerships'],
          rows: [
            ['Medical and Dental Assistance', 'Immediate (Hiring)', 'Medical: 100% Company | Dental: Symbolic discount'],
            ['iFood Benefits (Meal Voucher)', 'Immediate (Hiring)', '100% cost by Foursys'],
            ['Partnerships and Educational Reimbursement', 'Immediate (Hiring)', 'Anhanguera, Conquer, FIAP, etc.'],
            ['Wellhub (Gympass) & Wellz (Psych)', 'Immediate (Hiring)', 'Wellz 100% | Special discounts on Wellhub'],
            ['Vacation and Parental Leave', 'Per Legislation', 'Vacation (12 months) | Extended Parental Leave'],
          ],
        },
        blocks: [
          {
            heading: 'Health and well-being',
            subtitle: 'Healthier, more engaged professionals prepared to deliver high performance.',
            items: [
              { desc: 'SulAmérica Health with private room and Rede D’Or' },
              { desc: 'Dr.Alper teleconsultation platform' },
              { desc: 'Odontoprev with national coverage and broad network' },
              { desc: 'Wellhub with access to gyms, sports and well-being platforms' },
              { desc: 'Psychological support with up to 53 annual sessions (Wellz)' },
              { desc: 'Digital, simplified occupational health management with self-service' },
              { desc: 'Metlife life insurance worth 3x the standard for the category' },
            ],
          },
          {
            heading: 'Education and development',
            subtitle: 'We ensure our team uses the latest technologies through high-level partnerships and constant study incentives.',
            items: [
              { desc: 'FIAP, Conquer and Descomplica' },
              { desc: 'Open English and Alpha Idiomas' },
              { desc: 'Active and simplified educational reimbursement' },
              { desc: 'FourCamp: in-house talent training and acceleration program' },
            ],
          },
          {
            heading: 'Quality of life',
            subtitle: 'We care for people at every stage of their journey, promoting well-being, protection and family support.',
            items: [
              { desc: 'Meal and Food vouchers, with flexibility to transfer balance between wallets' },
              { desc: 'Extended Parental Leave' },
              { desc: 'Better Birth Program supporting pregnancy and early childhood' },
              { desc: 'Childcare assistance up to age 6 and children with disabilities with no age limit' },
              { desc: 'Life insurance covering death, disability, critical illness, funeral assistance and family support' },
              { desc: 'Family and leisure benefits (Parque da Mônica and corporate partnerships)' },
            ],
          },
        ],
      },
    ],
  },
}

const retencaoDrillI18n: Record<'pt' | 'en', AtracaoDrill> = {
  pt: {
    badge: 'Drill down · Retenção de Talentos',
    title: 'Retenção de Talentos — Conteúdo Completo',
    subtitle: 'Orquestração, gestão de talentos e continuidade, e a cultura que sustenta a retenção.',
    closeLabel: 'Fechar',
    pages: [
      {
        page: 'Página 8',
        title: 'Orquestração de Talentos para sustentar Performance e Continuidade',
        intro:
          'A área de Orquestração conecta demanda, capacidade e competências para garantir a melhor alocação dos profissionais e maximizar o valor entregue aos clientes.',
        blocks: [
          {
            heading: 'Antecipar',
            items: [{ name: 'Análise de Capacity Plan', desc: 'Mapeamento contínuo da demanda futura versus disponibilidade de talentos.' }],
          },
          {
            heading: 'Alocar',
            items: [{ name: 'Realocação de profissionais', desc: 'Aproveitamento rápido de profissionais em bench ou encerramento de projetos.' }],
          },
          {
            heading: 'Estruturar',
            items: [{ name: 'Formação de equipes', desc: 'Composição equilibrada entre senioridade, competências e necessidades do cliente.' }],
          },
          {
            heading: 'Desenvolver',
            items: [{ name: 'Levantamento de carências', desc: 'Identificação de gaps técnicos e direcionamento de desenvolvimento.' }],
          },
          {
            heading: 'Conectar',
            items: [{ name: 'Oportunidades quentes', desc: 'Antecipação de necessidades a partir do pipeline comercial.' }],
          },
          {
            heading: 'Impacto para os clientes',
            items: [
              { desc: 'Profissionais certos nos projetos certos' },
              { desc: 'Maior estabilidade das equipes' },
              { desc: 'Menor tempo de substituição' },
              { desc: 'Melhor aproveitamento do conhecimento' },
              { desc: 'Continuidade das entregas' },
            ],
          },
          {
            heading: 'Resultados gerados',
            items: [
              { desc: 'Menor bench' },
              { desc: 'Maior engajamento' },
              { desc: 'Maior retenção' },
              { desc: 'Maior performance' },
            ],
          },
        ],
        note: 'A pessoa certa. No projeto certo. No momento certo.',
      },
      {
        page: 'Página 9',
        title: 'Gestão de Talentos e Continuidade do Negócio',
        intro:
          'A gestão de talentos permite antecipar riscos, desenvolver sucessores e preservar conhecimento crítico para garantir estabilidade das operações.',
        blocks: [
          {
            heading: 'Avaliar',
            items: [{ desc: 'Desempenho atual' }, { desc: 'Potencial estratégico' }, { desc: 'Engajamento' }],
          },
          {
            heading: 'Priorizar',
            items: [{ desc: 'Cargo crítico' }, { desc: 'Posição-chave' }, { desc: 'Risco de saída' }, { desc: 'Impacto da saída' }],
          },
          {
            heading: 'Preparar',
            items: [{ desc: 'Sucessor identificado' }, { desc: 'Prontidão' }, { desc: 'Ações de desenvolvimento' }],
          },
          {
            heading: 'Sustentar',
            items: [{ desc: 'Continuidade operacional' }, { desc: 'Mapeamento de talentos' }],
          },
          {
            heading: 'Impacto para nossos clientes',
            items: [
              { desc: 'Maior estabilidade das equipes' },
              { desc: 'Menor dependência de profissionais-chave' },
              { desc: 'Antecipação de impactos operacionais' },
              { desc: 'Continuidade das entregas' },
              { desc: 'Formação de futuras lideranças' },
            ],
          },
        ],
        note: 'Garantimos maior estabilidade das operações ao preservar conhecimento crítico, preparar sucessores e reduzir riscos associados à movimentação de talentos.',
      },
      {
        page: 'Página 10',
        title: 'Cultura e Experiência que Sustentam Retenção',
        intro:
          'A retenção é resultado de uma experiência que combina crescimento, cuidado e pertencimento ao longo de toda a jornada do colaborador.',
        stats: [
          { value: '85%', label: 'Favorabilidade GPTW' },
          { value: '90%', label: 'Colaboração entre equipes' },
          { value: '90%', label: 'Posso ser eu mesmo aqui' },
          { value: '91%', label: 'Orgulho do trabalho realizado' },
        ],
        blocks: [
          {
            heading: 'Escutamos',
            subtitle: 'As pessoas se sentem ouvidas.',
            items: [
              { desc: 'Pesquisa de Clima e Pulses' },
              { desc: 'Feedbacks contínuos' },
              { desc: '1:1 recorrente' },
              { desc: 'Escuta ativa dos HRBPs' },
            ],
          },
          {
            heading: 'Desenvolvemos',
            subtitle: 'As pessoas enxergam evolução.',
            items: [{ desc: 'Academy' }, { desc: 'FourLeaders' }, { desc: 'Jornada de crescimento' }, { desc: 'FourCamp' }],
          },
          {
            heading: 'Cuidamos',
            subtitle: 'As pessoas se sentem apoiadas.',
            items: [
              { desc: 'Wellz: estímulo à terapia' },
              { desc: 'Wellhub: estímulo aos exercícios' },
              { desc: 'Campanhas internas de saúde mental' },
              { desc: 'Mapeamento da NR-01' },
            ],
          },
        ],
        note: 'Retemos talentos ao combinar escuta, desenvolvimento e cuidado, criando um ambiente onde as pessoas permanecem engajadas e preparadas para gerar valor aos nossos clientes. Como resultado: equipes mais engajadas, maior estabilidade das equipes, menor risco de rotatividade e continuidade das entregas.',
      },
    ],
  },
  en: {
    badge: 'Drill down · Talent Retention',
    title: 'Talent Retention — Full Content',
    subtitle: 'Orchestration, talent management and continuity, and the culture that sustains retention.',
    closeLabel: 'Close',
    pages: [
      {
        page: 'Page 8',
        title: 'Talent Orchestration to sustain Performance and Continuity',
        intro:
          'The Orchestration area connects demand, capacity and competencies to ensure the best allocation of professionals and maximize the value delivered to clients.',
        blocks: [
          {
            heading: 'Anticipate',
            items: [{ name: 'Capacity Plan analysis', desc: 'Continuous mapping of future demand versus talent availability.' }],
          },
          {
            heading: 'Allocate',
            items: [{ name: 'Professional reallocation', desc: 'Quick reuse of professionals on bench or rolling off projects.' }],
          },
          {
            heading: 'Structure',
            items: [{ name: 'Team building', desc: 'Balanced composition of seniority, skills and client needs.' }],
          },
          {
            heading: 'Develop',
            items: [{ name: 'Gap assessment', desc: 'Identification of technical gaps and development direction.' }],
          },
          {
            heading: 'Connect',
            items: [{ name: 'Hot opportunities', desc: 'Anticipation of needs from the commercial pipeline.' }],
          },
          {
            heading: 'Impact for clients',
            items: [
              { desc: 'Right professionals on the right projects' },
              { desc: 'Greater team stability' },
              { desc: 'Shorter replacement time' },
              { desc: 'Better knowledge leverage' },
              { desc: 'Delivery continuity' },
            ],
          },
          {
            heading: 'Generated results',
            items: [{ desc: 'Lower bench' }, { desc: 'Higher engagement' }, { desc: 'Higher retention' }, { desc: 'Higher performance' }],
          },
        ],
        note: 'The right person. On the right project. At the right time.',
      },
      {
        page: 'Page 9',
        title: 'Talent Management and Business Continuity',
        intro:
          'Talent management allows anticipating risks, developing successors and preserving critical knowledge to ensure operational stability.',
        blocks: [
          {
            heading: 'Assess',
            items: [{ desc: 'Current performance' }, { desc: 'Strategic potential' }, { desc: 'Engagement' }],
          },
          {
            heading: 'Prioritize',
            items: [{ desc: 'Critical role' }, { desc: 'Key position' }, { desc: 'Attrition risk' }, { desc: 'Exit impact' }],
          },
          {
            heading: 'Prepare',
            items: [{ desc: 'Identified successor' }, { desc: 'Readiness' }, { desc: 'Development actions' }],
          },
          {
            heading: 'Sustain',
            items: [{ desc: 'Operational continuity' }, { desc: 'Talent mapping' }],
          },
          {
            heading: 'Impact for our clients',
            items: [
              { desc: 'Greater team stability' },
              { desc: 'Less dependency on key professionals' },
              { desc: 'Anticipation of operational impacts' },
              { desc: 'Delivery continuity' },
              { desc: 'Development of future leaders' },
            ],
          },
        ],
        note: 'We ensure greater operational stability by preserving critical knowledge, preparing successors and reducing risks associated with talent movement.',
      },
      {
        page: 'Page 10',
        title: 'Culture and Experience that Sustain Retention',
        intro:
          'Retention is the result of an experience that combines growth, care and belonging throughout the entire employee journey.',
        stats: [
          { value: '85%', label: 'GPTW favorability' },
          { value: '90%', label: 'Cross-team collaboration' },
          { value: '90%', label: 'I can be myself here' },
          { value: '91%', label: 'Pride in work done' },
        ],
        blocks: [
          {
            heading: 'We listen',
            subtitle: 'People feel heard.',
            items: [
              { desc: 'Climate surveys and pulses' },
              { desc: 'Continuous feedback' },
              { desc: 'Recurring 1:1s' },
              { desc: 'Active listening from HRBPs' },
            ],
          },
          {
            heading: 'We develop',
            subtitle: 'People see growth.',
            items: [{ desc: 'Academy' }, { desc: 'FourLeaders' }, { desc: 'Growth journey' }, { desc: 'FourCamp' }],
          },
          {
            heading: 'We care',
            subtitle: 'People feel supported.',
            items: [
              { desc: 'Wellz: therapy encouragement' },
              { desc: 'Wellhub: exercise encouragement' },
              { desc: 'Internal mental health campaigns' },
              { desc: 'NR-01 mapping' },
            ],
          },
        ],
        note: 'We retain talent by combining listening, development and care, creating an environment where people stay engaged and ready to generate value for our clients. As a result: more engaged teams, greater stability, lower turnover risk and delivery continuity.',
      },
    ],
  },
}

const desenvolvimentoDrillI18n: Record<'pt' | 'en', AtracaoDrill> = {
  pt: {
    badge: 'Drill down · Desenvolvimento de Talentos',
    title: 'Desenvolvimento (Técnico e Humano) — Conteúdo Completo',
    subtitle: 'Integração, desenvolvimento contínuo, aceleração com o FourCamp e formação de lideranças.',
    closeLabel: 'Fechar',
    pages: [
      {
        page: 'Página 11',
        title: 'Integração e Aceleração da Produtividade',
        intro:
          'Uma jornada estruturada que transforma novos talentos em profissionais preparados para gerar valor desde os primeiros dias.',
        stats: [{ value: '+3.000h', label: 'De onboarding e capacitação' }],
        blocks: [
          {
            heading: 'Cultura e conexão',
            subtitle: 'Objetivo: fortalecer pertencimento.',
            items: [
              { desc: 'Imersão na cultura Foursys' },
              { desc: 'Propósito e valores' },
              { desc: 'Jeito Foursys de entregar' },
            ],
          },
          {
            heading: 'Governança e compliance',
            subtitle: 'Objetivo: mitigar riscos operacionais.',
            items: [
              { desc: 'Código de Ética' },
              { desc: 'LGPD' },
              { desc: 'Segurança da Informação' },
              { desc: 'Certificações ISO' },
            ],
          },
          {
            heading: 'Ferramentas e conhecimento',
            subtitle: 'Objetivo: acelerar a curva de aprendizagem.',
            items: [
              { desc: 'Academy' },
              { desc: 'Processos internos' },
              { desc: 'Metodologias' },
              { desc: 'Treinamentos obrigatórios' },
            ],
          },
          {
            heading: 'Liderança e acompanhamento',
            subtitle: 'Objetivo: fortalecer adaptação e retenção.',
            items: [{ desc: 'Jornada 180 dias' }, { desc: 'Gestor' }, { desc: '1:1' }, { desc: 'Feedback' }],
          },
        ],
        note: 'Prontidão para entrega = Produtividade + Conformidade + Continuidade Operacional. A integração é o primeiro passo da nossa estratégia para acelerar produtividade, fortalecer retenção e sustentar a excelência nas entregas.',
      },
      {
        page: 'Página 12',
        title: 'Desenvolvimento Contínuo para Sustentar Performance',
        intro:
          'Investimos continuamente no desenvolvimento técnico, comportamental e regulatório dos nossos profissionais para sustentar a qualidade das entregas e acompanhar a evolução do mercado.',
        stats: [
          { value: '44.370h', label: 'Horas em 2025 (2.675 participações)' },
          { value: '45.780h', label: 'Horas em 2026 (2.760 participações)' },
          { value: '+45.000h', label: 'Desenvolvimento realizado em 2026' },
        ],
        blocks: [
          {
            heading: 'Integração',
            items: [{ desc: 'Jornada 180 dias e Onboarding — Guia Técnico, Programas Internos, Sistemas e Políticas' }],
          },
          {
            heading: 'Competências técnicas',
            items: [{ desc: 'TechLead, Java, Cobol, React, .Net, AWS, Azure, IA, Design Thinking e Agilidade' }],
          },
          {
            heading: 'Competências comportamentais',
            items: [{ desc: 'Comunicação, Trabalho em Equipe, Gestão de Tempo, Pensamento Analítico e Inteligência Emocional' }],
          },
          {
            heading: 'Compliance e governança',
            items: [{ desc: 'Segurança da Informação e Privacidade de Dados, Ética e Compliance' }],
          },
          {
            heading: 'Liderança',
            items: [{ desc: 'FourLeaders — Rituais de Gestão, Comunicação Assertiva, Inteligência Emocional e Gestão de Conflitos' }],
          },
        ],
      },
      {
        page: 'Página 13',
        title: 'Aceleração de Talentos com Alinhamento de Negócio',
        intro:
          'O FourCamp, programa de aceleração de talentos, desenvolve profissionais por um filtro técnico rígido focado na necessidade do mercado e de nossos clientes, garantindo a renovação de profissionais em tecnologia.',
        stats: [
          { value: '+700h', label: 'Desenvolvimento técnico, comportamental e cultura' },
          { value: '+120 dias', label: 'De aceleração contínua e desafios reais' },
        ],
        blocks: [
          {
            heading: 'Diferenciais para o negócio',
            items: [
              { name: 'Mitigação da curva', desc: 'Talentos prontos para codificar e cooperar desde o dia zero.' },
              { name: 'DNA Foursys', desc: 'Imersão profunda em cultura inovadora e agilidade.' },
              { name: 'Segurança técnica', desc: 'Validação em laboratório com projetos simulados.' },
            ],
          },
          {
            heading: 'Hard skills consolidadas',
            items: [{ desc: 'Domínio de stacks modernas, práticas de clean code, arquitetura de software de alta performance e ferramentas aplicadas às squads parceiras.' }],
          },
          {
            heading: 'Suporte DHO e governança',
            items: [
              { desc: 'Mentoria individual e acompanhamento humano integral.' },
              { desc: 'Transição técnica respaldada pelo DHO, garantindo inteligência emocional, escuta ativa e postura profissional de ponta.' },
            ],
          },
        ],
        note: '“Garantia de prontidão e evolução constante.” — Katlen Delgado, Especialista de DHO (acompanhamento individual e governança comportamental).',
      },
      {
        page: 'Página 14',
        title: 'Lideranças que Sustentam Resultados',
        intro:
          'Investimos no desenvolvimento de líderes capazes de fortalecer engajamento, acelerar o desenvolvimento dos times e sustentar a qualidade das entregas.',
        stats: [
          { value: '800', label: 'Participações (jan–mai/26)' },
          { value: '1.200h', label: 'Horas de formação' },
          { value: 'NPS 90', label: 'Média do programa' },
        ],
        blocks: [
          {
            heading: 'Competência da liderança → impacto para o negócio',
            items: [
              { name: 'Rituais de gestão', desc: 'Maior acompanhamento e direcionamento.' },
              { name: 'Comunicação assertiva', desc: 'Melhor alinhamento entre equipes.' },
              { name: 'Inteligência emocional', desc: 'Tomada de decisão mais madura.' },
              { name: 'Gestão de conflitos', desc: 'Resolução mais rápida de problemas.' },
              { name: 'Ética e compliance', desc: 'Menor exposição a riscos.' },
            ],
          },
        ],
        note: 'Lideranças preparadas fortalecem retenção, produtividade e continuidade operacional, contribuindo diretamente para a qualidade, estabilidade e continuidade das entregas aos clientes.',
      },
    ],
  },
  en: {
    badge: 'Drill down · Talent Development',
    title: 'Development (Technical and Human) — Full Content',
    subtitle: 'Onboarding, continuous development, FourCamp acceleration and leadership development.',
    closeLabel: 'Close',
    pages: [
      {
        page: 'Page 11',
        title: 'Onboarding and Productivity Acceleration',
        intro:
          'A structured journey that turns new talent into professionals ready to generate value from the very first days.',
        stats: [{ value: '+3,000h', label: 'Of onboarding and training' }],
        blocks: [
          {
            heading: 'Culture and connection',
            subtitle: 'Goal: strengthen belonging.',
            items: [{ desc: 'Immersion in Foursys culture' }, { desc: 'Purpose and values' }, { desc: 'The Foursys way of delivering' }],
          },
          {
            heading: 'Governance and compliance',
            subtitle: 'Goal: mitigate operational risks.',
            items: [{ desc: 'Code of Ethics' }, { desc: 'LGPD' }, { desc: 'Information Security' }, { desc: 'ISO certifications' }],
          },
          {
            heading: 'Tools and knowledge',
            subtitle: 'Goal: accelerate the learning curve.',
            items: [{ desc: 'Academy' }, { desc: 'Internal processes' }, { desc: 'Methodologies' }, { desc: 'Mandatory training' }],
          },
          {
            heading: 'Leadership and follow-up',
            subtitle: 'Goal: strengthen adaptation and retention.',
            items: [{ desc: '180-day journey' }, { desc: 'Manager' }, { desc: '1:1' }, { desc: 'Feedback' }],
          },
        ],
        note: 'Delivery readiness = Productivity + Compliance + Operational Continuity. Onboarding is the first step of our strategy to accelerate productivity, strengthen retention and sustain delivery excellence.',
      },
      {
        page: 'Page 12',
        title: 'Continuous Development to Sustain Performance',
        intro:
          'We continuously invest in the technical, behavioral and regulatory development of our professionals to sustain delivery quality and keep pace with market evolution.',
        stats: [
          { value: '44,370h', label: 'Hours in 2025 (2,675 participations)' },
          { value: '45,780h', label: 'Hours in 2026 (2,760 participations)' },
          { value: '+45,000h', label: 'Development delivered in 2026' },
        ],
        blocks: [
          {
            heading: 'Onboarding',
            items: [{ desc: '180-day journey and Onboarding — Technical Guide, Internal Programs, Systems and Policies' }],
          },
          {
            heading: 'Technical skills',
            items: [{ desc: 'TechLead, Java, Cobol, React, .Net, AWS, Azure, AI, Design Thinking and Agility' }],
          },
          {
            heading: 'Behavioral skills',
            items: [{ desc: 'Communication, Teamwork, Time Management, Analytical Thinking and Emotional Intelligence' }],
          },
          {
            heading: 'Compliance and governance',
            items: [{ desc: 'Information Security and Data Privacy, Ethics and Compliance' }],
          },
          {
            heading: 'Leadership',
            items: [{ desc: 'FourLeaders — Management Rituals, Assertive Communication, Emotional Intelligence and Conflict Management' }],
          },
        ],
      },
      {
        page: 'Page 13',
        title: 'Talent Acceleration with Business Alignment',
        intro:
          'FourCamp, the talent acceleration program, develops professionals through a strict technical filter focused on market and client needs, ensuring the renewal of technology professionals.',
        stats: [
          { value: '+700h', label: 'Technical, behavioral and cultural development' },
          { value: '+120 days', label: 'Of continuous acceleration and real challenges' },
        ],
        blocks: [
          {
            heading: 'Business differentiators',
            items: [
              { name: 'Curve mitigation', desc: 'Talent ready to code and collaborate from day zero.' },
              { name: 'Foursys DNA', desc: 'Deep immersion in innovative culture and agility.' },
              { name: 'Technical safety', desc: 'Lab validation with simulated projects.' },
            ],
          },
          {
            heading: 'Consolidated hard skills',
            items: [{ desc: 'Mastery of modern stacks, clean code practices, high-performance software architecture and tools applied to partner squads.' }],
          },
          {
            heading: 'DHO support and governance',
            items: [
              { desc: 'Individual mentoring and full human support.' },
              { desc: 'Technical transition backed by DHO, ensuring emotional intelligence, active listening and top-tier professional posture.' },
            ],
          },
        ],
        note: '“Assurance of readiness and constant evolution.” — Katlen Delgado, DHO Specialist (individual follow-up and behavioral governance).',
      },
      {
        page: 'Page 14',
        title: 'Leaders that Sustain Results',
        intro:
          'We invest in developing leaders capable of strengthening engagement, accelerating team development and sustaining delivery quality.',
        stats: [
          { value: '800', label: 'Participations (Jan–May/26)' },
          { value: '1,200h', label: 'Training hours' },
          { value: 'NPS 90', label: 'Program average' },
        ],
        blocks: [
          {
            heading: 'Leadership competency → business impact',
            items: [
              { name: 'Management rituals', desc: 'Greater follow-up and direction.' },
              { name: 'Assertive communication', desc: 'Better alignment between teams.' },
              { name: 'Emotional intelligence', desc: 'More mature decision-making.' },
              { name: 'Conflict management', desc: 'Faster problem resolution.' },
              { name: 'Ethics and compliance', desc: 'Lower risk exposure.' },
            ],
          },
        ],
        note: 'Prepared leaders strengthen retention, productivity and operational continuity, contributing directly to the quality, stability and continuity of deliveries to clients.',
      },
    ],
  },
}

const governancaDrillI18n: Record<'pt' | 'en', AtracaoDrill> = {
  pt: {
    badge: 'Drill down · Governança e Estratégia Integrada',
    title: 'Governança, Compliance e Segurança — Conteúdo Completo',
    subtitle: 'Governança para escalar com confiança e a estratégia integrada de talentos que gera valor.',
    closeLabel: 'Fechar',
    pages: [
      {
        page: 'Página 15',
        title: 'Governança, Compliance e Segurança para Escalar com Confiança',
        intro:
          'Garantimos conformidade, rastreabilidade e segurança operacional por meio de processos estruturados, certificações e controles que sustentam o crescimento da Foursys.',
        blocks: [
          {
            heading: 'Compliance',
            subtitle: 'Resultado: menor exposição a passivos e riscos.',
            items: [
              { desc: 'Obrigações legais' },
              { desc: 'Encargos' },
              { desc: 'Processos padronizados' },
              { desc: 'Mitigação de riscos' },
            ],
          },
          {
            heading: 'Segurança e privacidade',
            subtitle: 'Resultado: proteção de dados e aderência regulatória.',
            items: [
              { desc: 'LGPD' },
              { desc: 'ISO 27001' },
              { desc: 'ISO 27701' },
              { desc: 'Treinamentos obrigatórios' },
            ],
          },
          {
            heading: 'Governança corporativa',
            subtitle: 'Resultado: maior transparência e confiabilidade.',
            items: [
              { desc: 'Código de Ética' },
              { desc: 'Auditorias' },
              { desc: 'Controles internos' },
              { desc: 'Processos rastreáveis' },
            ],
          },
          {
            heading: 'ESG',
            subtitle: 'Resultado: sustentabilidade e responsabilidade corporativa.',
            items: [{ desc: 'Comitê ESG' }, { desc: 'Pacto Global' }, { desc: 'FourLives' }],
          },
          {
            heading: 'Impacto para os clientes',
            items: [
              { desc: 'Segurança da informação' },
              { desc: 'Conformidade regulatória' },
              { desc: 'Processos auditáveis' },
              { desc: 'Menor exposição a riscos' },
              { desc: 'Continuidade operacional' },
            ],
          },
        ],
        note: 'Nossa estrutura de governança e compliance assegura que o crescimento da operação aconteça com segurança, conformidade e aderência aos padrões exigidos pelos nossos clientes.',
      },
      {
        page: 'Página 16',
        title: 'Uma Estratégia Integrada de Talentos que Gera Valor para Nossos Clientes',
        intro:
          'Da atração à retenção, conectamos pessoas, liderança, governança e operação para sustentar entregas de alta performance em escala.',
        blocks: [
          {
            heading: 'O que isso gera para nossos clientes',
            items: [
              { name: 'Velocidade', desc: 'Mobilização ágil de profissionais qualificados para atender demandas críticas.' },
              { name: 'Continuidade', desc: 'Menor risco de ruptura nas equipes e preservação do conhecimento.' },
              { name: 'Aderência', desc: 'Profissionais alinhados técnica, comportamental e culturalmente aos desafios do cliente.' },
              { name: 'Segurança', desc: 'Governança, compliance e proteção da informação sustentando operações confiáveis.' },
              { name: 'Performance', desc: 'Equipes preparadas para gerar resultados consistentes e de alta qualidade.' },
              { name: 'Escalabilidade', desc: 'Capacidade de crescimento com qualidade, previsibilidade e sustentabilidade.' },
            ],
          },
        ],
        note: 'Na Foursys, a excelência das entregas começa na estratégia de pessoas. Pessoas certas. Lideranças preparadas. Governança sólida. É assim que transformamos talento em resultado e sustentamos valor para os nossos clientes.',
      },
    ],
  },
  en: {
    badge: 'Drill down · Governance & Integrated Strategy',
    title: 'Governance, Compliance and Security — Full Content',
    subtitle: 'Governance to scale with confidence and the integrated talent strategy that generates value.',
    closeLabel: 'Close',
    pages: [
      {
        page: 'Page 15',
        title: 'Governance, Compliance and Security to Scale with Confidence',
        intro:
          'We ensure compliance, traceability and operational security through structured processes, certifications and controls that sustain Foursys growth.',
        blocks: [
          {
            heading: 'Compliance',
            subtitle: 'Result: lower exposure to liabilities and risks.',
            items: [
              { desc: 'Legal obligations' },
              { desc: 'Charges' },
              { desc: 'Standardized processes' },
              { desc: 'Risk mitigation' },
            ],
          },
          {
            heading: 'Security and privacy',
            subtitle: 'Result: data protection and regulatory adherence.',
            items: [{ desc: 'LGPD' }, { desc: 'ISO 27001' }, { desc: 'ISO 27701' }, { desc: 'Mandatory training' }],
          },
          {
            heading: 'Corporate governance',
            subtitle: 'Result: greater transparency and reliability.',
            items: [
              { desc: 'Code of Ethics' },
              { desc: 'Audits' },
              { desc: 'Internal controls' },
              { desc: 'Traceable processes' },
            ],
          },
          {
            heading: 'ESG',
            subtitle: 'Result: sustainability and corporate responsibility.',
            items: [{ desc: 'ESG Committee' }, { desc: 'Global Compact' }, { desc: 'FourLives' }],
          },
          {
            heading: 'Impact for clients',
            items: [
              { desc: 'Information security' },
              { desc: 'Regulatory compliance' },
              { desc: 'Auditable processes' },
              { desc: 'Lower risk exposure' },
              { desc: 'Operational continuity' },
            ],
          },
        ],
        note: 'Our governance and compliance structure ensures that operational growth happens with security, compliance and adherence to the standards required by our clients.',
      },
      {
        page: 'Page 16',
        title: 'An Integrated Talent Strategy that Generates Value for Our Clients',
        intro:
          'From attraction to retention, we connect people, leadership, governance and operations to sustain high-performance delivery at scale.',
        blocks: [
          {
            heading: 'What this generates for our clients',
            items: [
              { name: 'Speed', desc: 'Agile mobilization of qualified professionals to meet critical demands.' },
              { name: 'Continuity', desc: 'Lower risk of team disruption and knowledge preservation.' },
              { name: 'Alignment', desc: 'Professionals aligned technically, behaviorally and culturally to client challenges.' },
              { name: 'Security', desc: 'Governance, compliance and information protection sustaining reliable operations.' },
              { name: 'Performance', desc: 'Teams prepared to deliver consistent, high-quality results.' },
              { name: 'Scalability', desc: 'Capacity to grow with quality, predictability and sustainability.' },
            ],
          },
        ],
        note: 'At Foursys, delivery excellence starts with the people strategy. Right people. Prepared leaders. Solid governance. This is how we turn talent into results and sustain value for our clients.',
      },
    ],
  },
}

// ─── Modal de drill-down do pilar ───────────────────────────────────────────────

function PillarDrillModal({
  content,
  accent,
  icon,
  onClose,
}: {
  content: AtracaoDrill
  accent: string
  icon: string
  onClose: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="relative z-10 w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl bg-foursys-bg border border-white/[0.1] overflow-hidden"
        style={{ boxShadow: `0 0 60px ${accent}20, 0 25px 50px rgba(0,0,0,0.5)` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fixo */}
        <div className="flex items-center justify-between gap-3 p-5 md:p-6 border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${accent}22`, border: `1px solid ${accent}55` }}
            >
              <DynIcon name={icon} size={20} style={{ color: accent }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
                {content.badge}
              </p>
              <h3 className="text-base md:text-xl font-black text-white leading-tight">{content.title}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.15] active:scale-95 flex items-center justify-center transition-all flex-shrink-0"
            aria-label={content.closeLabel}
          >
            <X size={18} className="text-white/70" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="overflow-y-auto stealth-scrollbar p-5 md:p-7 space-y-8">
          <p className="text-sm text-foursys-text-muted leading-relaxed">{content.subtitle}</p>

          {content.pages.map((page) => (
            <div key={page.page}>
              {/* Cabeçalho da página */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                  style={{ background: `${accent}1f`, color: accent, border: `1px solid ${accent}40` }}
                >
                  {page.page}
                </span>
                <h4 className="text-lg md:text-xl font-black text-white">{page.title}</h4>
              </div>

              {page.intro && (
                <p className="text-sm text-foursys-text-muted leading-relaxed mb-4">{page.intro}</p>
              )}

              {/* Stats */}
              {page.stats && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {page.stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-foursys-surface/40 border border-white/[0.06] p-3 text-center">
                      <div className="text-lg md:text-2xl font-black" style={{ color: accent }}>{stat.value}</div>
                      <div className="text-[10px] text-foursys-text-dim mt-1 leading-snug">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tabela */}
              {page.table && (
                <div className="overflow-x-auto mb-4 rounded-xl border border-white/[0.08]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        {page.table.headers.map((h) => (
                          <th
                            key={h}
                            className="text-[10px] font-bold uppercase tracking-[0.1em] text-foursys-primary p-3 bg-foursys-surface/50 border-b border-white/[0.08]"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {page.table.rows.map((row, ri) => (
                        <tr key={ri} className="even:bg-white/[0.02]">
                          {row.map((cell, ci) => (
                            <td key={ci} className="text-xs text-foursys-text-muted p-3 align-top border-b border-white/[0.04] leading-snug">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Blocos */}
              {page.blocks && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {page.blocks.map((block) => (
                    <div key={block.heading} className="rounded-xl bg-foursys-surface/40 border border-white/[0.06] p-4">
                      <div
                        className="text-[11px] font-bold uppercase tracking-[0.12em] pb-2 mb-2 border-b-2"
                        style={{ color: accent, borderColor: `${accent}55` }}
                      >
                        {block.heading}
                      </div>
                      {block.subtitle && (
                        <p className="text-[11px] text-foursys-text-dim leading-snug mb-3">{block.subtitle}</p>
                      )}
                      <ul className="space-y-2">
                        {block.items.map((item, ii) => (
                          <li key={ii} className="flex items-start gap-2 text-xs text-foursys-text-muted leading-snug">
                            <span className="flex-shrink-0 mt-0.5" style={{ color: accent }}>✓</span>
                            <span>
                              {item.name && <span className="font-semibold text-white">{item.name}</span>}
                              {item.name ? ` — ${item.desc}` : item.desc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {page.note && (
                <p className="text-xs md:text-sm text-foursys-text-muted italic leading-relaxed mt-4 pl-3 border-l-2" style={{ borderColor: `${accent}66` }}>
                  {page.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Painel de detalhe do pilar ─────────────────────────────────────────────────

function PillarDetail({
  pillar,
  label,
  onDrill,
  drillLabel,
}: {
  pillar: Pillar
  label: string
  onDrill?: () => void
  drillLabel?: string
}) {
  return (
    <motion.div
      key={pillar.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border p-5 md:p-7"
      style={{ borderColor: `${pillar.color}40`, background: `linear-gradient(135deg, ${pillar.color}12, transparent 70%)` }}
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${pillar.color}22`, border: `1px solid ${pillar.color}55` }}
          >
            <DynIcon name={pillar.icon} size={22} style={{ color: pillar.color }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: pillar.color }}>
              {label}
            </p>
            <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
              {pillar.title} <span className="text-foursys-text-muted font-semibold">· {pillar.scope}</span>
            </h3>
          </div>
        </div>
        {onDrill && (
          <button
            type="button"
            onClick={onDrill}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
            style={{ background: `${pillar.color}22`, border: `1px solid ${pillar.color}66` }}
          >
            <Maximize2 size={14} style={{ color: pillar.color }} />
            {drillLabel}
            <ArrowRight size={14} style={{ color: pillar.color }} />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {pillar.stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-foursys-bg/40 border border-white/[0.06] p-3 text-center">
            <div className="text-base md:text-xl font-black leading-tight" style={{ color: pillar.color }}>
              {stat.value}
            </div>
            <div className="text-[10px] text-foursys-text-dim mt-1 leading-snug">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Grupos de detalhe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pillar.groups.map((group) => (
          <div key={group.title} className="rounded-xl bg-foursys-surface/40 border border-white/[0.06] p-4">
            <div
              className="text-[11px] font-bold uppercase tracking-[0.12em] pb-2 mb-3 border-b-2"
              style={{ color: pillar.color, borderColor: `${pillar.color}55` }}
            >
              {group.title}
            </div>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-foursys-text-muted leading-snug">
                  <span className="flex-shrink-0 mt-0.5" style={{ color: pillar.color }}>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Componente principal ───────────────────────────────────────────────────────

export function SectionRHTalentos() {
  const { lang } = useLanguage()
  const content = useMemo(() => rhContentI18n[lang], [lang])
  const drillMap = useMemo<Record<string, AtracaoDrill>>(
    () => ({
      atracao: atracaoDrillI18n[lang],
      desenvolvimento: desenvolvimentoDrillI18n[lang],
      retencao: retencaoDrillI18n[lang],
      governanca: governancaDrillI18n[lang],
    }),
    [lang],
  )
  const [activeId, setActiveId] = useState<string>(content.pillars[0].id)
  const [drillPillarId, setDrillPillarId] = useState<string | null>(null)

  const activePillar = content.pillars.find((p) => p.id === activeId) ?? content.pillars[0]
  const drillPagesLabel: Record<string, string> = {
    atracao: lang === 'pt' ? 'Ver conteúdo completo (págs. 5–7)' : 'View full content (pp. 5–7)',
    desenvolvimento: lang === 'pt' ? 'Ver conteúdo completo (págs. 11–14)' : 'View full content (pp. 11–14)',
    retencao: lang === 'pt' ? 'Ver conteúdo completo (págs. 8–10)' : 'View full content (pp. 8–10)',
    governanca: lang === 'pt' ? 'Ver conteúdo completo (págs. 15–16)' : 'View full content (pp. 15–16)',
  }
  const drillPillar = drillPillarId ? content.pillars.find((p) => p.id === drillPillarId) : null

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">
        {/* ── Página principal (réplica da imagem) ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 md:mb-10 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-3">{content.badge}</p>
          <h2 className="text-xl md:text-3xl font-black text-foursys-primary leading-tight max-w-4xl mx-auto mb-4">
            {content.title}
          </h2>
          <p className="text-sm md:text-base text-foursys-text-muted leading-relaxed max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        {/* ── 4 Boxes / Pilares ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-10">
          {content.pillars.map((pillar, i) => {
            const isActive = pillar.id === activeId
            const isDrillable = !!drillMap[pillar.id]
            return (
              <motion.button
                key={pillar.id}
                type="button"
                onClick={() => {
                  setActiveId(pillar.id)
                  if (isDrillable) setDrillPillarId(pillar.id)
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="group relative text-left rounded-2xl p-5 md:p-6 pl-6 md:pl-7 bg-foursys-surface/40 border transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: isActive ? `${pillar.color}80` : 'rgba(255,255,255,0.08)',
                  boxShadow: isActive ? `0 0 32px ${pillar.color}25` : 'none',
                }}
                aria-pressed={isActive}
              >
                {isDrillable && (
                  <span
                    className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-1 rounded-full"
                    style={{ background: `${pillar.color}1f`, color: pillar.color, border: `1px solid ${pillar.color}40` }}
                  >
                    <Maximize2 size={10} />
                    {lang === 'pt' ? 'Drill down' : 'Drill down'}
                  </span>
                )}
                {/* Barra de acento lateral */}
                <span
                  className="absolute left-0 top-4 bottom-4 w-1.5 rounded-full transition-all duration-300"
                  style={{ background: pillar.color, opacity: isActive ? 1 : 0.7 }}
                />
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                    style={{ background: `${pillar.color}1f`, border: `1px solid ${pillar.color}40` }}
                  >
                    <DynIcon name={pillar.icon} size={22} style={{ color: pillar.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-black text-white leading-tight mb-1.5">
                      {pillar.title}{' '}
                      <span className="text-sm font-semibold text-foursys-text-muted">({pillar.scope})</span>
                    </h3>
                    <p className="text-xs md:text-sm text-foursys-text-muted leading-relaxed">{pillar.summary}</p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* ── Detalhamento do pilar selecionado ── */}
        <div className="mb-8 md:mb-10">
          <AnimatePresence mode="wait">
            <PillarDetail
              pillar={activePillar}
              label={content.detailLabel}
              onDrill={drillMap[activePillar.id] ? () => setDrillPillarId(activePillar.id) : undefined}
              drillLabel={drillPagesLabel[activePillar.id]}
            />
          </AnimatePresence>
        </div>

        {/* ── Plataforma Fourmakers (pág. 3 do PDF) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-8 md:mb-10 rounded-2xl bg-foursys-surface/30 border border-white/[0.08] p-5 md:p-7"
        >
          <p className="text-sm md:text-base text-foursys-text-muted leading-relaxed mb-4 max-w-4xl">
            {content.platform.intro}
          </p>
          <h3 className="text-lg md:text-2xl font-black text-foursys-primary leading-tight mb-1.5">
            {content.platform.title}
          </h3>
          <p className="text-xs md:text-sm text-foursys-text-muted leading-relaxed mb-6 max-w-4xl">
            {content.platform.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.platform.pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
                className="rounded-xl bg-foursys-bg/40 border border-white/[0.08] p-4 hover:border-foursys-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-foursys-primary/15 border border-foursys-primary/30">
                    <DynIcon name={pillar.icon} size={18} className="text-foursys-primary" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-white leading-tight">
                    {pillar.title}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {pillar.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] text-foursys-text-muted leading-snug">
                      <DynIcon name="check-circle" size={13} className="text-foursys-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Estratégia Integrada de Talentos (pág. 4 do PDF) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="mb-8 md:mb-10"
        >
          <h3 className="text-lg md:text-2xl font-black text-foursys-primary leading-tight mb-1.5">
            {content.integrated.title}
          </h3>
          <p className="text-xs md:text-sm text-foursys-text-muted leading-relaxed mb-6 max-w-4xl">
            {content.integrated.description}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {content.integrated.steps.map((step, i) => (
              <motion.div
                key={step.stage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 + i * 0.05, duration: 0.32 }}
                className="relative rounded-xl bg-foursys-surface/40 border border-white/[0.08] p-3.5 text-center"
              >
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-foursys-primary text-foursys-bg text-[11px] font-black flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="mt-2 text-sm font-black text-white uppercase tracking-wide">{step.stage}</p>
                <p className="text-[10px] text-foursys-text-muted leading-snug mt-1">{step.action}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {content.integrated.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-foursys-primary/10 border border-foursys-primary/25 p-4 flex items-center gap-3"
              >
                <span className="text-2xl md:text-3xl font-black text-foursys-primary leading-none">{stat.value}</span>
                <span className="text-[11px] md:text-xs font-semibold text-foursys-text-muted leading-snug uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm md:text-base text-foursys-text-muted leading-relaxed max-w-4xl">
            {content.integrated.note}
          </p>
        </motion.div>

        {/* ── Valor gerado para os clientes ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="pt-6 border-t border-white/[0.06]"
        >
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-foursys-primary mb-5">
            {content.valueTitle}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
            {content.values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl bg-foursys-surface/30 border border-white/[0.08] p-4 hover:border-foursys-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <DynIcon name={value.icon} size={18} className="text-foursys-primary" />
                  <span className="text-sm font-bold text-white">{value.title}</span>
                </div>
                <p className="text-[11px] text-foursys-text-muted leading-snug">{value.description}</p>
              </div>
            ))}
          </div>
          <p className="text-sm md:text-base text-foursys-text-muted leading-relaxed text-center max-w-3xl mx-auto">
            {content.closing}
          </p>
        </motion.div>
      </div>

      {/* ── Drill-down do pilar (Atração: págs. 5–7 · Retenção: págs. 8–10) ── */}
      <AnimatePresence>
        {drillPillarId && drillPillar && (
          <PillarDrillModal
            content={drillMap[drillPillarId]}
            accent={drillPillar.color}
            icon={drillPillar.icon}
            onClose={() => setDrillPillarId(null)}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
