# Testing

Run `npm test` with Node.js 22+. The suite contains 12 tests covering domain calculations, boundaries, dataset invariants, CSV escaping, HTML escaping, corrupt saved state and storage failures. `npm run build` verifies the static packaging step.

The automated suite is focused on pure functions and adapters. It is not a browser end-to-end suite. Browser checks are recorded separately below; no full cross-browser or screen-reader audit is claimed.

## Manual acceptance checklist

1. Start the server and verify the dashboard loads with populated cards and tables.
2. Choose Consulting and Q2. Inspect a chart column, compare actual profit with budget, then increase the revenue scenario to 10%. Export the filtered accounts.
3. Export the current view; verify CSV headers and filtered row count.
4. Navigate controls using Tab, Enter and arrow keys. Check visible focus.
5. Inspect the layout at a narrow viewport; tables should scroll inside their containers.
6. Check scenario zero, positive and negative adjustments and forecast date rollover.
7. Review quarter totals against the exported monthly rows.

## CI

Every pull request runs the same Node tests and static build on Ubuntu. Only the default branch uploads the Pages artifact and deploys. A deployment failure caused by disabled Pages does not imply the unit tests failed; configure the publishing source as documented in the README.

## Verification record — 14 November 2026

- `npm test`: 12 passing tests, zero failures.
- `npm run build`: successful.
- Browser: Chromium-based in-app browser; desktop rendering and 390-pixel viewport inspected, no page-level horizontal overflow.
- Verified year/division/quarter controls, recalculated tables, chart selection, keyboard scenario adjustment, and downloaded CSV (36 rows; revenue reconciles to GBP 4,240,786).
- Full cross-browser, screen-reader and automated browser coverage remain future work.
