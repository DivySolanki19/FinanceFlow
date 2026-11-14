export function selectRecords(
  rows,
  { year, division = "All divisions", quarter = "All quarters" },
) {
  return rows.filter(
    (r) =>
      r.year === Number(year) &&
      (division === "All divisions" || r.division === division) &&
      (quarter === "All quarters" ||
        Math.ceil(r.month / 3) === Number(quarter)),
  );
}
export function totals(rows) {
  const result = rows.reduce(
    (a, r) => {
      for (const key of [
        "revenue",
        "expenses",
        "budgetRevenue",
        "budgetExpenses",
        "payroll",
        "operations",
        "marketing",
      ])
        a[key] += r[key];
      return a;
    },
    {
      revenue: 0,
      expenses: 0,
      budgetRevenue: 0,
      budgetExpenses: 0,
      payroll: 0,
      operations: 0,
      marketing: 0,
    },
  );
  return {
    ...result,
    profit: result.revenue - result.expenses,
    margin: result.revenue
      ? ((result.revenue - result.expenses) / result.revenue) * 100
      : 0,
    variance:
      result.revenue -
      result.expenses -
      (result.budgetRevenue - result.budgetExpenses),
  };
}
export function monthly(rows) {
  return [...new Set(rows.map((r) => r.month))]
    .sort((a, b) => a - b)
    .map((month) => ({
      month,
      ...totals(rows.filter((r) => r.month === month)),
    }));
}
// Ordinary least squares trend; predictions floored at zero. Scenario is an explicit assumption.
export function forecast(values, horizon = 3, scenario = 0) {
  if (
    !Number.isInteger(horizon) ||
    horizon < 1 ||
    horizon > 12 ||
    !Number.isFinite(scenario) ||
    scenario < -50 ||
    scenario > 50 ||
    !values.length ||
    values.some((v) => !Number.isFinite(v) || v < 0)
  )
    throw new Error("Invalid forecast inputs");
  const n = values.length,
    xMean = (n - 1) / 2,
    yMean = values.reduce((a, b) => a + b, 0) / n;
  const denominator = values.reduce((sum, _, i) => sum + (i - xMean) ** 2, 0);
  const slope = denominator
    ? values.reduce((sum, y, i) => sum + (i - xMean) * (y - yMean), 0) /
      denominator
    : 0;
  return Array.from({ length: horizon }, (_, i) =>
    Math.round(
      Math.max(0, (yMean + slope * (n + i - xMean)) * (1 + scenario / 100)),
    ),
  );
}
