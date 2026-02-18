# Vanuatu Courts Dashboard

A static, client-side-only React dashboard for Vanuatu Judiciary annual reports statistics. No backend, server, or database.

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

## GitHub Pages

A GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) builds and deploys on push to `main`.

**Setup:**
1. Push the repo to GitHub.
2. Go to **Settings → Pages** → Source: **GitHub Actions**.
3. Push to `main`; the workflow will build and deploy.
4. Site URL: `https://<your-username>.github.io/react_only_dashboard/`

> **Note:** `base` in `vite.config.ts` is set to `/react_only_dashboard/`. If your repo has a different name, update it in `vite.config.ts` (e.g. `base: '/your-repo-name/'`).

The build process:
1. Runs `npm run generate-data` to create yearly CSVs from source files (`gender_analysis.csv`, `court_metrics.csv`, `case_outcomes.csv`)
2. Outputs to `public/data/*.csv` (copied to `dist/data/` on build)
3. Bundles the app with Vite

## Data Format

Yearly CSVs use the format:
```
Court,Year,Metric,Value,Unit
Supreme Court,2024,Filings,879,
Supreme Court,2024,ClearanceRate,93,%
...
```

## Adding New Year (e.g. 2025)

**Option A – Use source CSVs (recommended):**  
1. Add 2025 rows to the three source CSVs in `data/`:  
   - `data/gender_analysis.csv`  
   - `data/court_metrics.csv`  
   - `data/case_outcomes.csv`  
2. Run `npm run generate-data` to regenerate `public/data/*.csv` and `public/data/years.json`  
3. Rebuild with `npm run build`

**Option B – Add yearly CSV manually:**  
1. Create `public/data/2025.csv` in the same format as existing files (Court,Year,Metric,Value,Unit)  
2. Update `public/data/years.json` to include `2025` in the `years` array  
3. Rebuild with `npm run build`
