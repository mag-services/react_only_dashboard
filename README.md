# Vanuatu Courts Dashboard

A static, client-side React dashboard for Vanuatu Judiciary annual reports statistics. Built with [Horizon UI](https://horizon-ui.com/)–inspired layout using **Shadcn UI**, **Tailwind CSS**, **Highcharts**, and **TanStack React Table**. No backend, server, or database.

## Features

- **Court filter** – Multi-select dropdown (Court of Appeal, Supreme Court, Magistrates Court, Island Court)
- **Year filter** – Slider to select year range (2018, 2020–2024)
- **Page-specific KPI indicators** – Four cards per data page
- **Court color consistency** – Each court has a distinct color across all charts (e.g. Supreme = dark blue, Magistrates = teal)
- **Chart units** – Tooltips and axes show units (cases, days, %, etc.)
- **Methodology** – PDF links, extraction notes, assumptions, and glossary in one section
- **Responsive layout** – Grid adapts to number of charts per page (2–3 columns)
- **Performance** – Lazy-loading charts when 4+ years selected; memoization for smoother interaction

## Dashboard Sections

| Page | Contents |
|------|----------|
| **Overview** | KPI cards with sparklines (pending, clearance, filings, disposals, DV trend, gender, etc.) |
| **Pending Cases** | Pending & PDR table/chart, Pending by type, Pending age, Pending listed status, Reserved judgments |
| **Workload** | Case workload by type, Location workload by province, DV filings |
| **Performance** | Timeliness (Criminal/Civil days), Attendance rates, Productivity |
| **Outcomes** | Case outcomes, Court of Appeal outcomes *(Island Court has no outcome data)* |
| **Other Metrics** | Charge orders, Gender breakdown |
| — | *separator* |
| **Methodology** | PDFs used, extraction notes (LLM-based), methodology & assumptions, glossary |

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

The build process:
1. Runs `npm run generate-data` to create yearly CSVs from source files in `data/`
2. Outputs to `public/data/*.csv` and `public/data/years.json`
3. Bundles the app with Vite

## Data Sources

Source CSVs in `data/`:

| File | Description |
|------|-------------|
| `court_metrics.csv` | Filings, disposals, clearance, pending, PDR, timeliness, attendance, productivity, reserved judgments |
| `gender_analysis.csv` | Male/Female % |
| `case_outcomes.csv` | Guilty, Not guilty, Withdrawn, Dismissed, etc. |
| `case_workload_by_type.csv` | Filings by case type (Total, Criminal, Civil, PI, Maintenance, Violence) |
| `pending_by_type.csv` | Pending cases by type |
| `pending_listed_status.csv` | With future listing, Under case mgmt, No future date |
| `dv_filings.csv` | Domestic violence / protection order filings |
| `location_workload.csv` | Filings by province |
| `charge_orders.csv` | Charge orders by court |
| `coa_outcomes.csv` | Court of Appeal outcomes (Civil/Criminal: Dismissed, Allowed, Withdrawn) |

## Data Format

Yearly CSVs use:

```
Court,Year,Metric,Value,Unit
Supreme Court,2024,Filings,879,
Supreme Court,2024,ClearanceRate,93,%
...
```

## Adding a New Year (e.g. 2025)

1. Add 2025 rows to the source CSVs in `data/` (see table above)
2. Run `npm run generate-data` to regenerate `public/data/*.csv` and `public/data/years.json`
3. Build with `npm run build`

## Annual Reports (PDFs)

PDF links are configured in `public/annual-reports/reports.json` and shown in the **Methodology** section. Reports point to Vanuatu Courts (courts.gov.vu):

```json
[
  {"year": 2024, "title": "Annual Statistics 2024", "url": "https://courts.gov.vu/..."}
]
```

For local PDFs, use `"file": "2024.pdf"` and place files in `public/annual-reports/`.
