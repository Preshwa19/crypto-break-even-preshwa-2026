import { Building2 } from 'lucide-react';
import { compareExchanges } from '../utils/calculations.js';
import { EXCHANGES } from '../data/marketSnapshot.js';
import { formatMoney, formatPercent } from '../utils/formatting.js';

export default function ExchangeCompare({ inputs, currency, symbol }) {
  const rows = compareExchanges(inputs);
  if (rows.length === 0) return null;
  const label = symbol.trim() || 'coin';
  const byKey = Object.fromEntries(EXCHANGES.map((e) => [e.key, e]));

  return (
    <section className="card compare-card" aria-labelledby="compare-title">
      <h2 id="compare-title">
        <Building2 size={18} aria-hidden="true" /> Same holding, different exchanges
      </h2>
      <div className="table-wrap">
        <table className="compare">
          <thead>
            <tr>
              <th scope="col">Exchange</th>
              <th scope="col">Buy / sell fee</th>
              <th scope="col">Break-even per {label}</th>
              <th scope="col">Above purchase price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className={r.isYours ? 'yours' : ''}>
                <th scope="row">
                  {r.name}
                  {byKey[r.key] ? <span className="sub">as of {byKey[r.key].asOf}</span> : <span className="sub">the fees you entered</span>}
                </th>
                <td>
                  {formatPercent(r.buy)} / {formatPercent(r.sell)}
                </td>
                <td>{formatMoney(r.price, currency)}</td>
                <td>+{formatPercent(r.pctIncrease)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="micro">
        Published base-tier rates, applied to the coins and purchase price you entered. Your own tier, order type and
        discounts can differ. Sources are listed at the bottom of the page.
      </p>
    </section>
  );
}
