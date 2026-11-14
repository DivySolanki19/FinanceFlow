import { records } from "./data.js";
import { selectRecords, totals, monthly, forecast } from "./domain.js";
import {
  money,
  number,
  escapeHTML as e,
  stat,
  bars,
  bindCharts,
  download,
  announce,
} from "./common.js";
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let filters = {
    year: 2026,
    division: "All divisions",
    quarter: "All quarters",
  },
  scenario = 0;
document.querySelector("#app").innerHTML =
  `<section id="overview" class="hero"><div><div class="eyebrow">Finance workspace</div><h1>Your financial picture. <span>In focus.</span></h1><p>Revenue, costs and the decisions that shape your next quarter.</p></div><div class="actions"><button id="export" class="primary">↓ Export CSV</button></div></section><section class="toolbar" aria-label="Financial filters"><label>Financial year<select id="year"><option>2026</option><option>2025</option></select></label><label>Business division<select id="division"><option>All divisions</option><option>Cloud services</option><option>Consulting</option><option>Licensing</option></select></label><label>Period<select id="quarter"><option>All quarters</option><option value="1">Q1 · Jan–Mar</option><option value="2">Q2 · Apr–Jun</option><option value="3">Q3 · Jul–Sep</option><option value="4">Q4 · Oct–Dec</option></select></label><span class="muted">GBP · Synthetic monthly accounts</span></section><div id="results"></div>`;
function render() {
  const rows = selectRecords(records, filters),
    t = totals(rows),
    m = monthly(rows);
  const revenue = forecast(
      m.map((x) => x.revenue),
      3,
      scenario,
    ),
    expenses = forecast(m.map((x) => x.expenses));
  document.querySelector("#results").innerHTML =
    `<section class="stats" aria-label="Key financial indicators">${stat("Total revenue", money(t.revenue), "Recognised revenue for selected period")}${stat("Operating expenses", money(t.expenses), "Payroll, operations and marketing")}${stat("Operating profit", money(t.profit), number(t.margin) + "% operating margin")}${stat("Profit vs budget", (t.variance >= 0 ? "+" : "") + money(t.variance), t.variance >= 0 ? "Favourable variance" : "Adverse variance")}</section><div class="grid"><section class="panel" id="performance"><div class="panel-head"><div><h2>Revenue & expenses</h2><span class="muted">Monthly performance · ${filters.year}</span></div><span class="badge">${e(filters.division)}</span></div>${bars(
      m.map((x) => months[x.month - 1]),
      [
        { name: "Revenue", values: m.map((x) => x.revenue) },
        { name: "Expenses", values: m.map((x) => x.expenses) },
      ],
      money,
    )}</section><section class="panel" id="forecast"><div class="panel-head"><div><h2>A view of what’s next</h2><span class="muted">Three months after the selected period</span></div></div><label for="scenario">Revenue scenario adjustment: <output id="scenario-label">${scenario}%</output><input id="scenario" type="range" min="-30" max="30" step="5" value="${scenario}"></label>${revenue
      .map((r, i) => {
        const date = new Date(Date.UTC(filters.year, m.at(-1).month + i, 1));
        return `<div class="forecast-row"><span>${date.toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" })}<small class="muted" style="display:block">Profit ${money(r - expenses[i])}</small></span><strong>${money(r)}</strong></div>`;
      })
      .join(
        "",
      )}<p class="subtext">Linear trend of selected monthly actuals. The scenario adjusts revenue only; costs follow their own trend. An illustrative projection, not a validated prediction.</p></section></div><section class="panel"><div class="panel-head"><div><h2>Budget performance</h2><span class="muted">Positive profit variance is favourable; expense variance is actual minus budget.</span></div></div><div class="table-wrap"><table><caption class="muted">Monthly actuals compared with planned revenue and expenses</caption><thead><tr><th>Month</th><th class="number">Revenue</th><th class="number">Revenue budget</th><th class="number">Expenses</th><th class="number">Expense budget</th><th class="number">Expense variance</th><th class="number">Profit</th><th class="number">Profit variance</th></tr></thead><tbody>${m.map((x) => `<tr><td>${months[x.month - 1]}</td><td class="number">${money(x.revenue)}</td><td class="number">${money(x.budgetRevenue)}</td><td class="number">${money(x.expenses)}</td><td class="number">${money(x.budgetExpenses)}</td><td class="number ${x.expenses > x.budgetExpenses ? "bad" : "good"}">${money(x.expenses - x.budgetExpenses)}</td><td class="number">${money(x.profit)}</td><td class="number ${x.variance < 0 ? "bad" : "good"}">${x.variance >= 0 ? "+" : ""}${money(x.variance)}</td></tr>`).join("")}</tbody></table></div></section><div class="grid"><section class="panel"><h2>Where the money goes</h2>${["payroll", "operations", "marketing"].map((key) => `<div class="forecast-row"><span>${key[0].toUpperCase() + key.slice(1)}</span><strong>${money(t[key])} <small class="muted">${number((t[key] / t.expenses) * 100)}%</small></strong></div>`).join("")}</section><section class="panel"><h2>Analyst notes</h2><p class="subtext">${e(filters.division)} generated ${money(t.profit)} in operating profit at a ${number(t.margin)}% margin. Profit is ${money(Math.abs(t.variance))} ${t.variance >= 0 ? "above" : "below"} budget for the selected period.</p><details><summary>How these metrics work</summary><p>Profit = revenue − expenses. Margin = profit ÷ revenue. Profit variance = actual profit − budget profit. Figures exclude interest, tax, capital expenditure and cash-flow timing. Forecasts ignore seasonality and uncertainty; compare scenarios before drawing conclusions.</p></details></section></div>`;
  bindCharts();
  document.querySelector("#scenario").addEventListener("change", (event) => {
    scenario = Number(event.target.value);
    render();
    document.querySelector("#scenario").focus();
  });
  document
    .querySelector("#scenario")
    .addEventListener(
      "input",
      (event) =>
        (document.querySelector("#scenario-label").textContent =
          event.target.value + "%"),
    );
}
for (const key of ["year", "division", "quarter"])
  document.querySelector("#" + key).addEventListener("change", (event) => {
    filters[key] = event.target.value;
    render();
    announce(
      "Financial analysis updated for " +
        filters.year +
        ", " +
        filters.division +
        ".",
    );
  });
document.querySelector("#export").onclick = () => {
  const rows = selectRecords(records, filters);
  download("financeflow-" + filters.year + ".csv", [
    [
      "Year",
      "Month",
      "Division",
      "Revenue GBP",
      "Expenses GBP",
      "Profit GBP",
      "Budget revenue GBP",
      "Budget expenses GBP",
      "Profit variance GBP",
    ],
    ...rows.map((r) => [
      r.year,
      r.month,
      r.division,
      r.revenue,
      r.expenses,
      r.revenue - r.expenses,
      r.budgetRevenue,
      r.budgetExpenses,
      r.revenue - r.expenses - (r.budgetRevenue - r.budgetExpenses),
    ]),
  ]);
  announce("Exported " + rows.length + " records for the current filters.");
};
try {
  render();
} catch (error) {
  announce("The dashboard could not be calculated. Reload to try again.");
  console.error(error);
}

// Keep navigation state aligned with the section selected by mouse or keyboard.
function updateNavigation() {
  const active = location.hash || "#overview";
  document.querySelectorAll("nav a").forEach((link) => {
    if (link.getAttribute("href") === active)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
window.addEventListener("hashchange", updateNavigation);
updateNavigation();
