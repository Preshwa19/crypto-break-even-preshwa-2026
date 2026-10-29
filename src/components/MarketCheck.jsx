import { LineChart } from 'lucide-react';
import { marketCheck } from '../utils/market.js';
import { SNAPSHOT } from '../data/marketSnapshot.js';
import { formatMoney, formatPercent } from '../utils/formatting.js';

export default function MarketCheck({ result, symbol, currency }) {
  const label = symbol.trim() || 'coin';
  const mc = marketCheck(result, symbol, currency);
  const m = (v) => formatMoney(v, currency);
  const src = SNAPSHOT.sources[currency];

  if (!mc.available) {
    return (
      <section className="card market-card" aria-labelledby="market-title">
        <h2 id="market-title">
          <LineChart size={18} aria-hidden="true" /> Market snapshot vs your break-even
        </h2>
        <p className="micro">
          No snapshot price was collected for {label} in {currency}. The snapshot covers{' '}
          {Object.keys(SNAPSHOT.prices[currency]).join(', ')} in {currency}. You can still type any coin label and price.
        </p>
      </section>
    );
  }

  const points = [
    { key: 'purchase', label: 'Your purchase price', value: result.purchasePrice, className: 'pt-purchase' },
    { key: 'be', label: 'Break-even price', value: result.requiredSellingPrice, className: 'pt-be' },
    { key: 'market', label: `Snapshot price (${mc.asOf})`, value: mc.price, className: 'pt-market' },
  ];
  const values = points.map((p) => p.value);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = (hi - lo) * 0.15 || hi * 0.02;
  const pos = (v) => ((v - (lo - pad)) / (hi + pad - (lo - pad))) * 100;
  const rel = mc.vsBreakEvenPct;
  const verdict =
    Math.abs(rel) < 0.005
      ? `The snapshot price of ${label} is about the same as your break-even price.`
      : `The snapshot price of ${label} is ${formatPercent(Math.abs(rel), 2)} ${rel < 0 ? 'below' : 'above'} your break-even price.`;

  return (
    <section className="card market-card" aria-labelledby="market-title">
      <h2 id="market-title">
        <LineChart size={18} aria-hidden="true" /> Market snapshot vs your break-even
      </h2>
      <div className="track" role="img" aria-label={points.map((p) => `${p.label}: ${m(p.value)}`).join('; ')}>
        <div className="track-line" />
        {points.map((p) => (
          <span key={p.key} className={`track-dot ${p.className}`} style={{ left: `${pos(p.value)}%` }} />
        ))}
      </div>
      <ul className="legend">
        {points.map((p) => (
          <li key={p.key}>
            <span className={`dot ${p.className}`} aria-hidden="true" /> {p.label}: <strong>{m(p.value)}</strong>
          </li>
        ))}
      </ul>
      <p className="verdict">{verdict}</p>
      <p className="micro">
        A fixed snapshot from {src.name}, not live data, and not a forecast. Prices move constantly and the dots show only
        where three numbers sit today. Check a live source before acting on anything.
      </p>
    </section>
  );
}
