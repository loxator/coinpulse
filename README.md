## Coinpulse

**Coinpulse** is a crypto market dashboard built with Next.js that surfaces live market data, detailed coin pages with candlestick charts, and a simple conversion tool powered by the CoinGecko Pro API.

### Features

- **Home overview**
  - Market overview cards, trending coins, and curated categories on the `/` route.
- **All coins listing**
  - Paginated table of coins at `/coins` with rank, token info, price, 24h change, and market cap.
- **Coin details**
  - Detailed coin page at `/coins/[id]` with:
    - Live OHLC data visualized in an interactive candlestick chart.
    - Period switching (e.g. daily/weekly/monthly).
    - Optional live update intervals for streaming OHLCV data.
    - External links to website, explorer, and community.
- **Converter**
  - Per‑coin converter widget that lets you convert a chosen amount into multiple fiat/crypto currencies using current prices.
- **Modern UI**
  - Responsive layout, shadcn/ui components, Tailwind CSS v4, and `lightweight-charts` for rich charting.

### Tech stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript, React 19
- **Styling**: Tailwind CSS v4
- **UI components**: shadcn/ui, Radix UI, `lucide-react`
- **Charts**: `lightweight-charts`
- **Data**: CoinGecko Pro API (and on‑chain pools via GeckoTerminal endpoints)

## Getting Started

### Prerequisites

- **Node.js**: v20+ recommended
- **Package manager**: npm (bundled with Node) or your preferred alternative
- A **CoinGecko Pro API key**

### Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url> coinpulse
cd coinpulse
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```bash
COINGECKO_BASE_URL=https://pro-api.coingecko.com/api/v3
COINGECKO_API_KEY=your_coin_gecko_pro_api_key
```

- **`COINGECKO_BASE_URL`**: Base URL for CoinGecko Pro API (the above is a common default; adjust if your plan uses a different host).
- **`COINGECKO_API_KEY`**: Your CoinGecko Pro API key used in `lib/coin-gecko-actions.ts`.

### Running the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to view the app.

### Production build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project structure

Some key files and directories:

- **`app/page.tsx`**: Home page with overview, trending coins, and categories.
- **`app/coins/page.tsx`**: Paginated list of all coins.
- **`app/coins/[id]/page.tsx`**: Coin details view with candlestick chart and converter.
- **`components/`**: Reusable UI and feature components:
  - `CandlestickChart.tsx` – interactive OHLC candlestick chart.
  - `Converter.tsx` – coin amount converter.
  - `DataTable.tsx`, `CoinsPagination.tsx`, `home/*` – table, pagination, and home widgets.
- **`lib/coin-gecko-actions.ts`**: Server-side CoinGecko fetchers and pool lookup.
- **`lib/utils.ts`**: Utility helpers (formatting, class name helpers, etc.).

## Deployment

Coinpulse is a standard Next.js App Router project and can be deployed to any Next.js‑compatible platform (e.g. Vercel, Node server, or containerized environment).  
Follow the platform’s Next.js deployment guide and ensure your production environment variables match those in `.env.local`.
