import { CircleAlert, ExternalLink, LineChart } from 'lucide-react';
import { CURRENCIES, formatMoney } from '../utils/formatting.js';
import { EXCHANGES } from '../data/marketSnapshot.js';
import { COIN_CHIPS } from '../utils/presets.js';
import { findExchange } from '../utils/market.js';

function NumberField({ id, label, hint, value, onChange, onBlur, error, suffix, placeholder }) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ');
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy || undefined}
        />
        {suffix ? <span className="suffix">{suffix}</span> : null}
      </div>
      {hint ? (
        <p className="micro" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="error-text" id={`${id}-error`} role="alert">
          <CircleAlert size={14} aria-hidden="true" /> {error}
        </p>
      ) : null}
    </div>
  );
}

export default function CalculatorForm({
  inputs,
  errors,
  currency,
  marketPrice,
  onChange,
  onBlurField,
  onExchange,
  onCoin,
  onUseMarket,
}) {
  const c = CURRENCIES[currency];
  const symbolLabel = inputs.symbol.trim() || 'coin';
  const active = findExchange(inputs.buyFeePct, inputs.sellFeePct);

  return (
    <>
      <section className="card position-card no-print" aria-labelledby="pos-title">
        <h2 id="pos-title">
          <span className="num">1</span> What you hold
        </h2>

        <div className="field">
          <label htmlFor="symbol">Coin name or symbol</label>
          <div className="input-wrap">
            <input
              id="symbol"
              type="text"
              autoComplete="off"
              maxLength={12}
              value={inputs.symbol}
              placeholder="BTC, ETH, SOL…"
              onChange={(e) => onChange('symbol', e.target.value)}
              aria-describedby="symbol-hint"
            />
          </div>
          <div className="pills" aria-label="Common coin symbols">
            {COIN_CHIPS.map((coin) => (
              <button
                key={coin}
                type="button"
                className={`pill small ${inputs.symbol === coin ? 'on' : ''}`}
                onClick={() => onCoin(coin)}
              >
                {coin}
              </button>
            ))}
          </div>
          <p className="micro" id="symbol-hint">
            A label only. The app never looks up live prices.
          </p>
        </div>

        <NumberField
          id="quantity"
          label="Number of coins owned"
          hint="Decimals are fine, e.g. 0.5 or 0.00012."
          value={inputs.quantity}
          onChange={(v) => onChange('quantity', v)}
          onBlur={() => onBlurField('quantity')}
          error={errors.quantity}
          suffix={symbolLabel}
          placeholder="e.g. 0.5"
        />

        <NumberField
          id="purchasePrice"
          label={`Average purchase price per ${symbolLabel}`}
          hint={`In ${c.code} (${c.symbol}). Switching currency changes formatting only; amounts are not converted.`}
          value={inputs.purchasePrice}
          onChange={(v) => onChange('purchasePrice', v)}
          onBlur={() => onBlurField('purchasePrice')}
          error={errors.purchasePrice}
          suffix={c.symbol}
          placeholder="e.g. 80000"
        />

        {marketPrice !== null ? (
          <button type="button" className="pill market-btn" onClick={() => onUseMarket(marketPrice)}>
            <LineChart size={14} aria-hidden="true" /> Use snapshot price: {formatMoney(marketPrice, currency)}
          </button>
        ) : null}
      </section>

      <section className="card fees-card no-print" aria-labelledby="fees-title">
        <h2 id="fees-title">
          <span className="num">2</span> What you paid in fees
        </h2>

        <p className="micro lead">Pick an exchange to use its published base fees, or type your own.</p>
        <div className="pills" role="group" aria-label="Exchange fee presets">
          {EXCHANGES.map((e) => (
            <button
              key={e.key}
              type="button"
              className={`pill small ${active?.key === e.key ? 'on' : ''}`}
              aria-pressed={active?.key === e.key}
              onClick={() => onExchange(e)}
            >
              {e.name} {e.buy}%
            </button>
          ))}
        </div>

        {active ? (
          <p className="exchange-note">
            <strong>{active.name}:</strong> {active.basis} <span className="muted">As of {active.asOf}.</span>{' '}
            <a href={active.source.url} target="_blank" rel="noopener noreferrer">
              {active.source.name} <ExternalLink size={12} aria-hidden="true" />
            </a>
          </p>
        ) : null}

        <div className="field-row">
          <NumberField
            id="buyFeePct"
            label="Buying fee"
            value={inputs.buyFeePct}
            onChange={(v) => onChange('buyFeePct', v)}
            onBlur={() => onBlurField('buyFeePct')}
            error={errors.buyFeePct}
            suffix="%"
            placeholder="0.1"
          />
          <NumberField
            id="sellFeePct"
            label="Selling fee"
            value={inputs.sellFeePct}
            onChange={(v) => onChange('sellFeePct', v)}
            onBlur={() => onBlurField('sellFeePct')}
            error={errors.sellFeePct}
            suffix="%"
            placeholder="0.2"
          />
        </div>
        <p className="micro">
          Fees are estimates. Your actual charges depend on your account tier, order type and any discounts, so check
          your exchange&rsquo;s current fee page.
        </p>
      </section>
    </>
  );
}
