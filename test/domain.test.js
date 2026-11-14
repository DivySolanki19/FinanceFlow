import test from "node:test";
import assert from "node:assert/strict";
import { totals, monthly, selectRecords, forecast } from "../public/domain.js";
import { records } from "../public/data.js";
test("Synthetic accounts reconcile across 72 records", () => {
  assert.equal(records.length, 72);
  for (const r of records) {
    assert.equal(r.expenses, r.payroll + r.operations + r.marketing);
    assert.ok(r.revenue > 0);
  }
  assert.equal(new Set(records.map((r) => r.id)).size, 72);
});
test("Filters intersect year, quarter and division", () => {
  const rows = selectRecords(records, {
    year: 2025,
    division: "Consulting",
    quarter: 2,
  });
  assert.equal(rows.length, 3);
  assert.deepEqual(
    rows.map((r) => r.month),
    [4, 5, 6],
  );
});
test("Profit and favourable variance use correct signs", () => {
  const t = totals([
    {
      revenue: 100,
      expenses: 70,
      budgetRevenue: 90,
      budgetExpenses: 75,
      payroll: 30,
      operations: 30,
      marketing: 10,
    },
  ]);
  assert.equal(t.profit, 30);
  assert.equal(t.variance, 15);
  assert.equal(t.margin, 30);
  assert.equal(totals([]).margin, 0);
});
test("Monthly aggregation preserves totals and order", () => {
  const rows = selectRecords(records, { year: 2026 });
  const m = monthly(rows.toReversed());
  assert.deepEqual(
    m.map((r) => r.month),
    Array.from({ length: 12 }, (_, i) => i + 1),
  );
  assert.equal(
    m.reduce((s, r) => s + r.revenue, 0),
    totals(rows).revenue,
  );
});
test("Forecast extrapolates known trend and scenario", () => {
  assert.deepEqual(forecast([100, 200, 300]), [400, 500, 600]);
  assert.deepEqual(forecast([100, 200, 300], 1, 10), [440]);
  assert.deepEqual(forecast([50]), [50, 50, 50]);
  assert.deepEqual(forecast([30, 20, 10]), [0, 0, 0]);
});
test("Forecast rejects invalid input", () => {
  for (const args of [
    [[]],
    [[NaN]],
    [[1], 0],
    [[1], 2, Infinity],
    [[1], 2, 51],
    [[1], 1.5],
  ])
    assert.throws(() => forecast(...args));
});
