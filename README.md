# FinanceFlow

Financial analytics for revenue, costs and budget decisions.

A responsive, accessible-by-design portfolio application built with vanilla JavaScript, HTML and CSS. All application logic runs locally in the browser. No API keys, paid services or production packages are required.

![Checks](https://github.com/DivySolanki19/FinanceFlow/actions/workflows/pages.yml/badge.svg)

## Features

- Revenue, expense, operating profit and margin KPIs
- Year, division and quarter filters applied consistently to charts, tables and exports
- Interactive monthly revenue/expense chart with keyboard-accessible values
- Revenue and expense budgets, expense variance and favourable/adverse profit variance
- Three-period linear trend forecast with a −30% to +30% revenue scenario
- Cost breakdown, generated analyst summary and filtered CSV export

## Run locally

Install Node.js 22 or newer, then:

```sh
git clone https://github.com/DivySolanki19/FinanceFlow.git
cd FinanceFlow
npm start
```

Open `http://127.0.0.1:4173`. No `npm install` step is needed. ES modules require HTTP serving; opening `index.html` directly from disk is not supported. Set `PORT` if another application uses 4173.

```sh
npm test       # Node's built-in automated test runner
npm run build # Copy deployable assets into dist/
```

## Two-minute demonstration

Choose Consulting and Q2. Inspect a chart column, compare actual profit with budget, then increase the revenue scenario to 10%. Export the filtered accounts.

## Data and persistence

72 deterministic monthly accounts: 2025–2026, three fictional divisions. GBP amounts, no real transactions.

Financial accounts are bundled read-only. Filters and scenario settings reset on reload.

All datasets are synthetic. Do not enter confidential business information or personal data into the demo.

## Architecture and interview preparation

- [Architecture and design decisions](docs/ARCHITECTURE.md)
- [Interview guide and extension exercises](docs/INTERVIEW.md)
- [Testing and manual verification](docs/TESTING.md)
- [AI-assisted development disclosure](AI_DISCLOSURE.md)

## GitHub Pages

The repository includes `.github/workflows/pages.yml`. Pull requests run tests and build; pushes to `main` also deploy `dist/` with GitHub Pages.

1. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
2. Merge the reviewed application pull request into `main`.
3. Check **Actions → Test and deploy** for the deployment URL.

Expected address after a successful deployment: `https://DivySolanki19.github.io/FinanceFlow/`. This is an expected address, not a claim of an active deployment. Relative asset paths support project subdirectories. The workflow requires Pages to be enabled; no custom domain or paid infrastructure is needed.

See [GitHub’s publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Scope and limitations

Linear regression uses the selected months only and clamps negative predictions to zero. No seasonality, backtesting or uncertainty intervals. Figures are operating accounts, not cash flow; taxes and financing are excluded.

This is a single-user portfolio demonstration, not a production business system. There is no authentication, server-side database, audit log or multi-user synchronisation. Accessible controls, text equivalents, focus states, responsive layouts and semantic tables are included, but no formal WCAG conformance certification is claimed.

## Authorship

Portfolio owner: [DivySolanki19](https://github.com/DivySolanki19). Development was AI-assisted; see the disclosure for the role of AI and the review expectations. The existing repository heading and history are retained.
