import { Layers } from 'lucide-react';
import { priceStack } from '../utils/calculations.js';
import { formatMoney } from '../utils/formatting.js';

export default function PriceStack({ result, currency, symbol }) {
  const label = symbol.trim() || 'coin';
  const st = priceStack(result);
  const segs = [
    { key: 'p', label: 'Purchase price', value: st.purchase, className: 'sg-purchase' },
    { key: 'b', label: 'Buying fee', value: st.buyFee, className: 'sg-buy' },
    { key: 's', label: 'Selling fee', value: st.sellFee, className: 'sg-sell' },
  ];
  const m = (v) => formatMoney(v, currency);

  return (
    <section className="card stack-card" aria-labelledby="stack-title">
      <h2 id="stack-title">
        <Layers size={18} aria-hidden="true" /> What one {label} has to sell for
      </h2>
      <div className="stack-bar" role="img" aria-label={segs.map((s) => `${s.label}: ${m(s.value)}`).join('; ')}>
        {segs.map((s) => (
          <span key={s.key} className={s.className} style={{ width: `${(s.value / st.total) * 100}%` }} />
        ))}
      </div>
      <ul className="legend">
        {segs.map((s) => (
          <li key={s.key}>
            <span className={`dot ${s.className}`} aria-hidden="true" /> {s.label}: <strong>{m(s.value)}</strong>
          </li>
        ))}
        <li>
          = Break-even price: <strong>{m(st.total)}</strong>
        </li>
      </ul>
      <p className="micro">Bar widths are to scale: the fee slivers show how small or large the fees are next to what you paid.</p>
    </section>
  );
}
