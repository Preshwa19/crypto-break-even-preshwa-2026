import { Target } from 'lucide-react';
import { formatMoney, formatPercent } from '../utils/formatting.js';

export default function HeroResult({ status, result, currency, symbol }) {
  const label = symbol.trim() || 'coin';
  const m = (v) => formatMoney(v, currency);

  return (
    <div className="hero-wrap">
      <section className={`hero ${status === 'ready' ? 'ready' : ''}`} aria-live="polite" aria-label="Break-even result">
        <div className="hero-main">
          <span className="hero-eyebrow">
            <Target size={14} aria-hidden="true" /> Break-even selling price per {label}
          </span>
          {status === 'ready' ? (
            <div className="hero-value" data-testid="hero-value">{m(result.requiredSellingPrice)}</div>
          ) : (
            <div className="hero-empty">
              {status === 'invalid'
                ? 'Fix the highlighted fields to see your price.'
                : 'Enter your coins and purchase price to see your price.'}
            </div>
          )}
        </div>
        {status === 'ready' ? (
          <dl className="hero-stats">
            <div>
              <dt>Total paid in</dt>
              <dd>{m(result.totalCost)}</dd>
            </div>
            <div>
              <dt>Above purchase price</dt>
              <dd>
                +{formatPercent(result.pctIncrease)} ({m(result.priceDifference)})
              </dd>
            </div>
            <div>
              <dt>Profit at this price</dt>
              <dd>{m(result.netProfit)}</dd>
            </div>
          </dl>
        ) : null}
      </section>
    </div>
  );
}
