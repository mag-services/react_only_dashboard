# Vanuatu Land Cover Accounts Dashboard

A static, client-side React dashboard for Vanuatu land cover statistics (2020–2023). Built with **Shadcn UI**, **Tailwind CSS**, **Highcharts**, **TanStack React Table**, and **react-leaflet**. No backend, server, or database.

## Features

- **Province filter** – Multi-select (Torba, Sanma, Penama, Malampa, Shefa, Tafea, All)
- **Land cover filter** – Multi-select (Agriculture, Dense Forest, Open Forest, Coconut plantations, Grassland, Barelands, Builtup Infrastructure, Mangrove, Water bodies, All)
- **Year view** – Toggle 2020, 2023, or Change (2023−2020)
- **KPI cards** – Total land area, overall change %, Dense Forest (2023) + change, Agriculture (2023) + change
- **Physical Account chart** – Grouped bar (2020 vs 2023) with change spline line
- **Proportion chart** – Donut showing land cover share by category
- **Province stacked chart** – Land cover breakdown per province
- **Interactive map** – Vanuatu provinces (GADM GeoJSON), zooms to selected province(s)
- **Data table** – Sortable, paginated, CSV export
- **Responsive layout** – Mobile-friendly grid
- **PWA** – Installable; offline caching; auto-updates

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
1. Runs `npm run generate-land-cover` to create `public/data/land_cover.json` from `data/Land cover dataset for dashboard.xlsx` (requires Python 3 + openpyxl)
2. Bundles the app with Vite

## Data Source

- **Source:** `data/Land cover dataset for dashboard.xlsx`
- **Output:** `public/data/land_cover.json`
- **Schema:** `years`, `provinces`, `categories`, `kpis`, `proportions_2023`, `physical`, `by_province`

All areas are in **sq km**.

## Regenerating Data

```bash
python3 -m venv .venv
.venv/bin/pip install openpyxl
node scripts/generate-land-cover-data.mjs
```

Or run `npm run generate-land-cover` (uses system Python if openpyxl is installed).

## Progressive Web App (PWA)

The dashboard is a PWA: users can add it to the home screen (mobile) or install it (desktop Chrome). Features:

- **Offline caching** – App shell and data cached for offline use
- **Auto-update** – New versions are fetched when the app regains focus
- **Standalone display** – Installed app opens without browser chrome
