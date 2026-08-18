# PONTOS DO USUÁRIO — Enriquecimento Questionário CIO Praia Forte

Diretrizes permanentes (pós-piloto Vilma / Dea Guzella). Aplicar em TODOS os briefings da Fase 2+.

## P1 — Sem “erro de preenchimento” no HTML
- **NÃO** colocar no briefing alertas de divergência / inconsistência / erro de preenchimento entre planilha, LinkedIn, imprensa ou outras fontes.
- Exemplos proibidos no HTML: “Divergência colaboradores…”, “fontes divergem…”, “preservar planilha vs realidade…”, “erro de preenchimento…”.
- Se houver divergência: **constatar só no chat/relatório do lote** (para o time), nunca no artefato cliente.
- No HTML: usar o valor do **Questionário CIO** como FATO principal nos campos cobertos pelo ATI_26 (colaboradores, faturamento faixa, orçamento TI, etc.). Fontes abertas entram como contexto complementar **sem linguagem de conflito**.

## P2 — Demais regras do piloto (mantidas)
- Enriquecimento, não recriação. Preservar B→A→C e `<style>` Praia Forte.
- FATO vs HIPÓTESE. Sem inventar número. Sem dado → “Não localizado”.
- `opportunities` = contagem de status **SEM fornecedor** (projeto definido, ainda NÃO tem fornecedor).
- Scores de oferta justificados pelo questionário.
- Banner: Questionário CIO Praia do Forte 10/08.
- Card: atualizar `revenue`, `opportunities`, `topOffer`, `topScore` só do alvo; merge no `.ts` só pelo orquestrador.

## Registro
- Piloto: Dea Guzella / Vilma Alimentos — alerta de divergência headcount removido do HTML (2026-08-17).
- Chat (piloto): Questionário = 1.000–4.999 colab.; LinkedIn/Datanyze ~500–550; fontes setoriais >2 mil — **só constado aqui**, não no arquivo.
