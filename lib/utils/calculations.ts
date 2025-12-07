export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("NOK", "kr");
}

export function formatCurrencyDetailed(amount: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace("NOK", "kr");
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function calculatePercentage(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getDayOfMonth(): number {
  return new Date().getDate();
}

export function getCurrentMonth(): number {
  return new Date().getMonth();
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getMonthName(month: number): string {
  return new Date(2024, month).toLocaleString("nb-NO", { month: "long" });
}

export function getMonthNameShort(month: number): string {
  return new Date(2024, month).toLocaleString("nb-NO", { month: "short" });
}

export function calculateDailyAverage(total: number, days: number): number {
  if (days === 0) return 0;
  return total / days;
}

export function calculateProjection(
  currentTotal: number,
  currentDay: number,
  totalDays: number
): number {
  const dailyAverage = calculateDailyAverage(currentTotal, currentDay);
  return dailyAverage * totalDays;
}

export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
