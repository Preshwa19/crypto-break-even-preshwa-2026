import { validateInputs } from './validation.js';
import { EXCHANGES } from '../data/marketSnapshot.js';

/**
 * Core break-even calculation. Pure and currency-independent.
 *
 * Accepts raw inputs (strings or numbers):
 *   { quantity, purchasePrice, buyFeePct, sellFeePct }
 *
 * Returns { ok: true, errors: {}, result } or { ok: false, errors, result: null }.
 * Full precision is kept internally; round only when displaying.
 */
export function calculateBreakEven(inputs) {
  const { errors, values } = validateInputs(inputs ?? {});
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, result: null };
  }

  const Q = values.quantity;
  const P = values.purchasePrice;
  const Fb = values.buyFeePct / 100;
  const Fs = values.sellFeePct / 100;

  const principalCost = Q * P;
  const buyingFee = principalCost * Fb;
  const totalCost = principalCost + buyingFee;

  const requiredSellingPrice = totalCost / (Q * (1 - Fs));
  const grossProceeds = Q * requiredSellingPrice;
  const sellingFee = grossProceeds * Fs;
  const netProceeds = grossProceeds - sellingFee;

  let netProfit = netProceeds - totalCost;
  // Remove floating-point residue so break-even reports exactly zero.
  if (Math.abs(netProfit) <= 1e-9 * Math.max(1, totalCost)) netProfit = 0;

  const priceDifference = requiredSellingPrice - P;
  const pctIncrease = (priceDifference / P) * 100;

  const result = {
    quantity: Q,
    purchasePrice: P,
    buyFeePct: values.buyFeePct,
    sellFeePct: values.sellFeePct,
    principalCost,
    buyingFee,
    totalCost,
    requiredSellingPrice,
    grossProceeds,
    sellingFee,
    netProceeds,
    netProfit,
    priceDifference,
    pctIncrease,
  };

  const numericKeys = [
    'principalCost',
    'buyingFee',
    'totalCost',
    'requiredSellingPrice',
    'grossProceeds',
    'sellingFee',
    'netProceeds',
    'netProfit',
    'priceDifference',
    'pctIncrease',
  ];
  if (!numericKeys.every((k) => Number.isFinite(result[k])) || totalCost <= 0 || requiredSellingPrice <= 0) {
    return {
      ok: false,
      errors: {
        general: 'These values are too large or too small to calculate reliably. Try more moderate numbers.',
      },
      result: null,
    };
  }

  return { ok: true, errors: {}, result };
}

/**
 * Break-even price for the same holding under each exchange's published base fees,
 * plus a row for the user's own fees.
 * Returns rows { key, name, buy, sell, price, pctIncrease, isYours }.
 */
export function compareExchanges(inputs) {
  const mine = calculateBreakEven(inputs);
  if (!mine.ok) return [];
  const rows = [];
  for (const e of EXCHANGES) {
    const out = calculateBreakEven({ ...inputs, buyFeePct: e.buy, sellFeePct: e.sell });
    if (!out.ok) continue;
    rows.push({
      key: e.key,
      name: e.name,
      buy: e.buy,
      sell: e.sell,
      price: out.result.requiredSellingPrice,
      pctIncrease: out.result.pctIncrease,
      isYours: false,
    });
  }
  rows.push({
    key: 'yours',
    name: 'Your fees',
    buy: mine.result.buyFeePct,
    sell: mine.result.sellFeePct,
    price: mine.result.requiredSellingPrice,
    pctIncrease: mine.result.pctIncrease,
    isYours: true,
  });
  rows.sort((x, y) => x.price - y.price);
  return rows;
}

/**
 * Splits the break-even price per coin into the three things it pays for:
 * the purchase price, the buying fee and the selling fee.
 * purchase + buyFee + sellFee === requiredSellingPrice
 */
export function priceStack(result) {
  const purchase = result.purchasePrice;
  const buyFee = result.buyingFee / result.quantity;
  const sellFee = result.sellingFee / result.quantity;
  return { purchase, buyFee, sellFee, total: result.requiredSellingPrice };
}
