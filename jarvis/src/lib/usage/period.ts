/** Primeiro dia do mês UTC (YYYY-MM-01) para chave de usage_logs. */
export function currentUsageMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

export const FREE_MONTHLY_MINUTES = 15;
