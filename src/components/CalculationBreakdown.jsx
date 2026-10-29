import { formatMoney, formatNumber, formatPercent } from '../utils/formatting.js';

function Step({ n, title, big, lines }) {
  return (
    <li className="step">
      <span className="step-n" aria-hidden="true">{n}</span>
      <h3>{title}</h3>
      <div className="step-big">{big}</div>
      <ul className="step-lines">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </li>
  );
}

export default function CalculationBreakdown({ result, currency, symbol }) {
  if (!result) return null;
  const m = (v) => formatMoney(v, currency);
  const label = symbol.trim() || 'coin';
  const q = formatNumber(result.quantity);
  const keep = formatNumber(1 - result.sellFeePct / 100, 8);

  return (
    <section className="card journey-card" aria-labelledby="journey-title">
      <h2 id="journey-title">The journey from buy to break-even</h2>
      <ol className="journey">
        <Step
          n="1"
          title="You buy"
          big={m(result.principalCost)}
          lines={[`Q × P = ${q} × ${m(result.purchasePrice)}`, 'This is your principal.']}
        />
        <Step
          n="2"
          title="Buying fee added"
          big={m(result.totalCost)}
          lines={[`${m(result.principalCost)} × ${formatPercent(result.buyFeePct)} = ${m(result.buyingFee)}`, 'Principal + fee = total paid in.']}
        />
        <Step
          n="3"
          title={`Sell each ${label} at`}
          big={m(result.requiredSellingPrice)}
          lines={[`Total ÷ (Q × (1 − selling fee))`, `${m(result.totalCost)} ÷ (${q} × ${keep})`, `Gross proceeds: ${m(result.grossProceeds)}`]}
        />
        <Step
          n="4"
          title="Selling fee taken"
          big={m(result.netProceeds)}
          lines={[`${m(result.grossProceeds)} × ${formatPercent(result.sellFeePct)} = ${m(result.sellingFee)}`, `Net proceeds − total paid in = ${m(result.netProfit)}`]}
        />
      </ol>
      <p className="micro">
        Q = number of coins, P = average purchase price. The price is divided by (1 − selling fee) because the selling fee
        comes out of the gross proceeds. That is why the break-even is {formatPercent(result.pctIncrease)} (
        {m(result.priceDifference)}) above what you paid.
      </p>
    </section>
  );
}
