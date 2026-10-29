import {
  ArrowUpRight,
  Banknote,
  Calculator,
  Check,
  CircleAlert,
  Copy,
  Percent,
  Printer,
  Receipt,
  Scale,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Tile from './Tile.jsx';
import { formatMoney, formatNumber, formatPercent } from '../utils/formatting.js';

export default function ResultsDashboard({ status, result, currency, symbol, errorCount, copyStatus, onCopy, onPrint }) {
  const label = symbol.trim() || 'coin';
  const m = (v) => formatMoney(v, currency);
  const ready = status === 'ready';

  return (
    <section className="card results-card" aria-labelledby="results-title">
      <div className="card-head">
        <h2 id="results-title">Your numbers</h2>
        <div className="toolbar no-print">
          <button type="button" className="pill" onClick={onCopy} disabled={!ready}>
            <Copy size={14} aria-hidden="true" /> Copy results
          </button>
          <button type="button" className="pill" onClick={onPrint} disabled={!ready}>
            <Printer size={14} aria-hidden="true" /> Print
          </button>
        </div>
      </div>

      <div className="copy-status no-print" role="status" aria-live="polite">
        {copyStatus ? (
          <span className={copyStatus.type === 'success' ? 'ok' : 'err'}>
            {copyStatus.type === 'success' ? <Check size={14} aria-hidden="true" /> : <CircleAlert size={14} aria-hidden="true" />}{' '}
            {copyStatus.message}
          </span>
        ) : null}
      </div>

      {status === 'empty' && (
        <div className="state">
          <Calculator size={30} aria-hidden="true" />
          <h3>Enter your trade details to begin</h3>
          <p>
            Add the number of coins and your average purchase price. Results update as you type. Or pick a real situation
            above, or press <strong>Load example</strong>.
          </p>
        </div>
      )}

      {status === 'incomplete' && (
        <div className="state">
          <Calculator size={30} aria-hidden="true" />
          <h3>Almost there</h3>
          <p>Fill in the remaining required fields (coins and purchase price) to see your results.</p>
        </div>
      )}

      {status === 'invalid' && (
        <div className="state invalid" role="alert">
          <CircleAlert size={30} aria-hidden="true" />
          <h3>Some inputs need attention</h3>
          <p>
            {errorCount === 1 ? 'One input is' : `${errorCount} inputs are`} missing or invalid. Fix the highlighted field
            {errorCount === 1 ? '' : 's'} to see your results.
          </p>
        </div>
      )}

      {ready && (
        <>
          <p className="micro">
            {formatNumber(result.quantity)} {label} bought at {m(result.purchasePrice)} &middot; fees{' '}
            {formatPercent(result.buyFeePct)} buy / {formatPercent(result.sellFeePct)} sell
          </p>
          <div className="tiles">
            <Tile icon={Wallet} accent="indigo" label="Original principal investment" value={m(result.principalCost)} />
            <Tile icon={Receipt} accent="amber" label="Estimated buying fee" value={m(result.buyingFee)} />
            <Tile icon={Wallet} accent="indigo" label="Total investment cost" value={m(result.totalCost)} hint="Principal + buying fee." />
            <Tile icon={Banknote} accent="sky" label="Gross selling proceeds" value={m(result.grossProceeds)} hint="Before the selling fee. Not profit." />
            <Tile icon={Receipt} accent="violet" label="Estimated selling fee" value={m(result.sellingFee)} />
            <Tile icon={Scale} accent="sky" label="Net selling proceeds" value={m(result.netProceeds)} hint="After the selling fee." />
            <Tile
              icon={TrendingUp}
              accent="green"
              tone={result.netProfit < 0 ? 'negative' : undefined}
              label="Net profit or loss"
              value={m(result.netProfit)}
              hint="Zero at the break-even price."
            />
            <Tile
              icon={ArrowUpRight}
              accent="indigo"
              label="Price difference vs. purchase price"
              value={m(result.priceDifference)}
              hint={`Break-even price minus ${m(result.purchasePrice)}.`}
            />
            <Tile icon={Percent} accent="indigo" label="Increase needed to break even" value={formatPercent(result.pctIncrease)} hint="Over your original purchase price." />
          </div>
          <p className="micro">
            Break-even here means recovering the full modeled investment cost after the fees you entered, not every possible
            expense.
          </p>
        </>
      )}
    </section>
  );
}
