# Crypto Break-Even Price Calculator

A browser-based calculator that works out the selling price per coin you need to recover your full investment after
estimated buying and selling fees (before tax). It performs arithmetic only. It does not predict prices or give
investment advice.

Everything runs in the browser. There is no backend, database, API key or network request. The real-world values
(prices, exchange fees, tax note) are a **dated snapshot stored in the app**, not live data.

## Features

- Inputs: coin symbol (a label only), quantity, average purchase price, buying and selling fee, INR or USD formatting.
- A large break-even price in a gradient hero, plus nine result tiles: principal, buying fee, total cost, gross
  proceeds, selling fee, net proceeds, net profit or loss (zero at break-even), price difference and percentage
  increase over the purchase price.
- Real-world values from a snapshot collected on 29 Oct 2026:
  - **Scenarios**: three one-click situations built from the snapshot price and an exchange's published fees.
  - **Exchange fee presets** (CoinDCX, CoinSwitch Pro, Mudrex, Binance, Coinbase Advanced) and a comparison table
    showing the break-even price for your holding on each.
  - **Market snapshot vs your break-even**: where the snapshot price sits against your purchase and break-even prices.
  - **India tax note** (30% gains tax, 1% TDS) shown as information only, for INR.
  - A **sources** list with links and dates.
- A bar splitting one coin's break-even price into purchase price, buying fee and selling fee (drawn to scale).
- Step-by-step "journey" breakdown of the calculation.
- Inline validation for empty, zero, negative, non-numeric, oversized and out-of-range values. Invalid input never
  produces `NaN` or `Infinity`, and no results are shown while required inputs are invalid.
- Load example, reset, copy results (with success and error messages) and a print-friendly view.
- Responsive layout (desktop, tablet, mobile), light theme by default and a dark theme toggle that remembers your choice.

## Technology stack

React 18, Vite 8, JavaScript (ES6+), CSS3, Lucide React icons, Vitest, npm.

## Prerequisites

- [Node.js](https://nodejs.org/) **22.12 or newer** (current LTS is fine; includes npm).
- [Visual Studio Code](https://code.visualstudio.com/) (optional, recommended).

```powershell
node -v
npm -v
```

## Installation and VS Code setup

1. Unzip `Crypto_Break_Even_Calculator.zip` (right-click > **Extract All**).
2. Open the extracted folder in VS Code. It is the folder that directly contains `package.json`:

   ```powershell
   cd path\to\Crypto_Break_Even_Calculator
   code .
   ```

   If `npm install` says it cannot find `package.json`, your terminal is in the wrong folder. Run `dir` and make
   sure `package.json` is listed, or `cd` into the subfolder that contains it.
3. Open the integrated terminal (**Terminal > New Terminal**) and install dependencies:

   ```powershell
   npm install
   ```

## Run the development server

```powershell
npm run dev
```

Open the address printed in the terminal (usually http://localhost:5173).

## Run the tests

```powershell
npm test
```

## Production build

```powershell
npm run build
npm run preview
```

The build output is written to `dist/`.

## Deployment

The app is a static site: only the `dist/` folder created by `npm run build` needs hosting. The build uses a
relative `base`, so it works from a root domain, a sub-folder or GitHub Pages without extra configuration.

- `netlify.toml` and `vercel.json`: build command, output folder, security and cache headers.
- `public/manifest.webmanifest`, `public/robots.txt`, `public/favicon.svg`: web manifest, crawler rules and icon.
- `index.html`: page title, description, social-card tags and theme colour.

**Netlify or Vercel:** import the repository; settings are read from the files above. **Any other static host:**
run `npm run build` and upload the contents of `dist/`. Use Node 22.12 or newer as the build version.

## Folder structure

```
Crypto_Break_Even_Calculator/
├── public/  (favicon.svg, manifest.webmanifest, robots.txt)
├── src/
│   ├── components/
│   │   ├── Header.jsx              # brand, currency switch, theme toggle
│   │   ├── QuickStart.jsx          # scenario pills, load example, reset
│   │   ├── HeroResult.jsx          # the main break-even price
│   │   ├── CalculatorForm.jsx      # inputs, coin and exchange pills
│   │   ├── ResultsDashboard.jsx    # nine result tiles, copy, print
│   │   ├── Tile.jsx
│   │   ├── PriceStack.jsx          # purchase price + buying fee + selling fee
│   │   ├── MarketCheck.jsx         # snapshot price vs your prices
│   │   ├── ExchangeCompare.jsx     # break-even per exchange
│   │   ├── CalculationBreakdown.jsx
│   │   ├── RealWorld.jsx           # tax and other costs not modeled
│   │   ├── Education.jsx
│   │   ├── Sources.jsx
│   │   └── Disclaimer.jsx
│   ├── data/marketSnapshot.js      # dated prices, fees, tax note, sources
│   ├── utils/
│   │   ├── calculations.js         # pure calculation logic
│   │   ├── market.js               # snapshot helpers
│   │   ├── presets.js              # coin chips and scenarios
│   │   ├── validation.js
│   │   └── formatting.js
│   ├── tests/calculations.test.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── netlify.toml
├── vercel.json
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
└── .gitignore
```

## Formulas and assumptions

Q = quantity, P = average purchase price, Fb = buying fee ÷ 100, Fs = selling fee ÷ 100.

| Quantity | Formula |
| --- | --- |
| Principal cost | `Q × P` |
| Buying fee | `Principal × Fb` |
| Total investment cost | `Principal + Buying fee` |
| Break-even selling price | `Total cost ÷ (Q × (1 − Fs))` |
| Gross proceeds | `Q × Break-even price` |
| Selling fee | `Gross proceeds × Fs` |
| Net proceeds | `Gross proceeds − Selling fee` |
| Net profit or loss | `Net proceeds − Total cost` (zero at break-even) |
| Price difference | `Break-even price − P` |
| Increase over purchase price | `Price difference ÷ P × 100` |

Equivalently, the break-even price is `P × (1 + Fb) ÷ (1 − Fs)`.

Worked example: 0.5 BTC at ₹80,000, fees 0.1% / 0.2%. Total cost ₹40,040; break-even price ₹80,240.48
(`40,040 ÷ (0.5 × 0.998)`); gross proceeds ₹40,120.24; selling fee ₹80.24; net proceeds ₹40,040; increase over
purchase price about 0.3006%.

Assumptions: fees are percentages of the traded value; the currency selector changes formatting only and never
converts amounts; full precision is used internally and rounding happens only for display. Quantity and price must
be above zero, both fees must be 0% to below 100%, and values above 1,000,000,000,000,000 are rejected.

## Real-world data: what it is and how to refresh it

All real-world values live in `src/data/marketSnapshot.js`, with a source link and date next to each. They were
collected by hand on 29 Oct 2026 and are **not fetched while the app runs**, so they go out of date. Several fee
figures come from third-party comparison articles, not the exchanges. To refresh, edit that file (prices, fees,
dates, sources) and run `npm test`; the tests check that every price and fee is a sane number and that the INR and
USD prices stay within 15% of each other once converted.

## Limitations and disclaimer

- No live prices, exchange integrations, tax calculation, slippage, spreads, funding costs or fixed fees.
- Only INR and USD formatting are supported. The snapshot has INR prices for BTC, ETH and SOL only.
- INR prices (an Indian exchange) and USD prices (a global market table) come from different sources; the INR
  price was about 7% above the converted USD price in this snapshot.
- Copy-to-clipboard depends on browser permissions; an error message is shown if it is blocked.

> This calculator provides estimates for educational purposes only. Results depend on the inputs and fee
> assumptions provided. It does not predict cryptocurrency prices or provide financial advice. Taxes, slippage,
> spreads, funding costs, and other charges are excluded unless explicitly included in the inputs.
"# Break-EvenPriceCalculator-Crypto" 
