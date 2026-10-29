import { SNAPSHOT, EXCHANGES, FX } from '../data/marketSnapshot.js';

/** Snapshot price for a coin symbol in a currency, or null when none was collected. */
export function snapshotPrice(symbol, currency) {
  const key = String(symbol ?? '').trim().toUpperCase();
  const value = SNAPSHOT.prices[currency]?.[key];
  return typeof value === 'number' ? value : null;
}

export function snapshotDate(symbol, currency) {
  const key = String(symbol ?? '').trim().toUpperCase();
  const dates = SNAPSHOT.dates[currency] ?? {};
  return dates[key] ?? dates.default ?? SNAPSHOT.retrieved;
}

/** Round to a sensible form value: 2 decimals for prices >= 1, 4 significant digits below. */
export function roundPrice(value) {
  return value >= 1 ? Math.round(value * 100) / 100 : Number(value.toPrecision(4));
}

export function findExchange(buyFeePct, sellFeePct) {
  const b = String(buyFeePct ?? '').trim();
  const s = String(sellFeePct ?? '').trim();
  return EXCHANGES.find((e) => String(e.buy) === b && String(e.sell) === s) ?? null;
}

/** Form inputs for a scenario in the given currency, or null if there is no snapshot price. */
export function scenarioInputs(scenario, currency) {
  const base = snapshotPrice(scenario.symbol, currency);
  const exchange = EXCHANGES.find((e) => e.key === scenario.exchange);
  if (base === null || !exchange) return null;
  return {
    symbol: scenario.symbol,
    quantity: scenario.quantity,
    purchasePrice: String(roundPrice(base * (1 + scenario.vsMarketPct / 100))),
    buyFeePct: String(exchange.buy),
    sellFeePct: String(exchange.sell),
  };
}

/** Compare the snapshot price with a calculated result. */
export function marketCheck(result, symbol, currency) {
  const price = snapshotPrice(symbol, currency);
  if (price === null) return { available: false };
  return {
    available: true,
    price,
    asOf: snapshotDate(symbol, currency),
    vsBreakEvenPct: (price / result.requiredSellingPrice - 1) * 100,
    vsPurchasePct: (price / result.purchasePrice - 1) * 100,
  };
}

/**
 * How far the snapshot INR price sits above (positive) or below the USD price converted at the snapshot
 * USD/INR rate. Null when either price is missing.
 */
export function inrPremium(symbol) {
  const usd = snapshotPrice(symbol, 'USD');
  const inr = snapshotPrice(symbol, 'INR');
  if (usd === null || inr === null) return null;
  const converted = usd * FX.usdInr;
  return { usd, inr, converted, premiumPct: (inr / converted - 1) * 100 };
}
