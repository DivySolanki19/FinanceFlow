# Interview preparation: FinanceFlow

## A concise demonstration

Choose Consulting and Q2. Inspect a chart column, compare actual profit with budget, then increase the revenue scenario to 10%. Export the filtered accounts.

Explain the problem, demonstrate a decision-changing input, trace it to a pure domain function, and show a test for its boundary behaviour. Describe the AI assistance honestly and explain what you have personally reviewed or extended.

## Questions to practise

### Explain a favourable variance.

Actual profit exceeds budget profit. Revenue variance alone can hide an overspend: compare actual revenue minus actual expenses with budget revenue minus budget expenses.

### Why a linear forecast?

It is transparent and testable with small datasets. Explain ordinary least squares and show [100, 200, 300] forecasting [400, 500, 600]. A production model needs holdout evaluation, seasonality and uncertainty.

### How would you avoid misleading aggregation?

Sum revenue and profit first, then calculate the overall margin. Averaging division percentages gives small divisions too much influence.

### How would this support a finance interview?

Walk through the gap between operating profit and cash flow, favourable/adverse sign conventions, and how a scenario is an assumption rather than a forecast guarantee.

### How did you handle unreliable browser storage?

Reads are parsed and validated; failures return a cloned demo dataset with a warning. Writes return a success flag. The user is told when edits are temporary. A future backend would replace the storage adapter and add conflict detection.

### How did you make charts accessible?

Interactive marks use native buttons with descriptive names. Tables or textual values expose the data, and meaning is not conveyed only through colour. Filters use labelled native controls. Formal assistive-technology testing remains a separate activity.

### What did testing establish?

Unit tests exercise business examples and edge cases such as zero demand, threshold boundaries or declining forecasts, as applicable. They also cover corrupt storage and formula-safe exports. Explain the difference between those guarantees and browser or production validation.

## Practical extension exercise

Add one stakeholder-driven feature with an acceptance example, implement it at the correct boundary and add a regression test. Good options are forecast backtesting, supplier delivery-date tracking or a risk review history. Avoid inventing impact metrics or client results; use measured test outcomes from your own work.
