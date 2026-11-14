// Deterministic synthetic monthly accounts; GBP, accrual basis, no real organisations.
export const records = [2025, 2026]
  .flatMap((year) =>
    Array.from({ length: 12 }, (_, month) =>
      ["Cloud services", "Consulting", "Licensing"].map((division, d) => {
        const growth = (year - 2025) * 0.12;
        const seasonal = [
          0.88, 0.91, 1.02, 0.96, 1.04, 1.08, 1.01, 0.95, 1.13, 1.17, 1.2, 1.28,
        ][month];
        const revenue = Math.round(
          (68000 + d * 24000) * (1 + growth) * seasonal + month * 1700,
        );
        const payroll = Math.round((31000 + d * 11000) * (1 + growth * 0.5));
        const operations = Math.round(revenue * (0.13 + d * 0.015));
        const marketing = Math.round(7000 + month * 390 + d * 1400);
        return {
          id: `${year}-${month + 1}-${d}`,
          year,
          month: month + 1,
          division,
          revenue,
          payroll,
          operations,
          marketing,
          expenses: payroll + operations + marketing,
          budgetRevenue: Math.round(
            (71000 + d * 24000) * (1 + growth) * (1 + month * 0.025),
          ),
          budgetExpenses: Math.round(
            (48000 + d * 14500) * (1 + growth * 0.6) * (1 + month * 0.008),
          ),
        };
      }),
    ),
  )
  .flat();
