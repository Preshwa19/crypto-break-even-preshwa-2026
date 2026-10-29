import { describe, it, expect } from 'vitest';
import { calculateBreakEven, compareExchanges, priceStack } from '../utils/calculations.js';
import { EXCHANGES, SNAPSHOT, FX } from '../data/marketSnapshot.js';
import { snapshotPrice, scenarioInputs, marketCheck, findExchange, roundPrice, inrPremium } from '../utils/market.js';
import { SCENARIOS } from '../utils/presets.js';
import { parseNumeric } from '../utils/validation.js';
import { formatMoney, formatPercent, buildSummary } from '../utils/formatting.js';

const base = { quantity: '0.5', purchasePrice: '80000', buyFeePct: '0.1', sellFeePct: '0.2' };
const calc = (o = {}) => calculateBreakEven({ ...base, ...o });

describe('example: 0.5 BTC @ 80,000, fees 0.1% / 0.2%', () => {
  const { ok, result } = calc();

  it('is valid', () => expect(ok).toBe(true));
  it('principal cost', () => expect(result.principalCost).toBeCloseTo(40000, 8));
  it('buying fee', () => expect(result.buyingFee).toBeCloseTo(40, 8));
  it('total investment cost', () => expect(result.totalCost).toBeCloseTo(40040, 8));
  it('break-even price = 40040 / (0.5 x 0.998)', () => {
    expect(result.requiredSellingPrice).toBeCloseTo(40040 / (0.5 * 0.998), 8);
    expect(result.requiredSellingPrice).toBeCloseTo(80240.480962, 5);
  });
  it('gross proceeds', () => expect(result.grossProceeds).toBeCloseTo(40120.240481, 5));
  it('selling fee', () => expect(result.sellingFee).toBeCloseTo(80.240481, 5));
  it('net proceeds equal total cost', () => expect(result.netProceeds).toBeCloseTo(40040, 6));
  it('net profit is zero at break-even', () => expect(result.netProfit).toBe(0));
  it('price difference', () => expect(result.priceDifference).toBeCloseTo(240.480962, 5));
  it('percentage increase over purchase price', () => expect(result.pctIncrease).toBeCloseTo(0.300601, 5));
});

describe('fee combinations', () => {
  it('no fees: break-even equals purchase price', () => {
    const { result } = calc({ buyFeePct: '0', sellFeePct: '0' });
    expect(result.requiredSellingPrice).toBeCloseTo(80000, 8);
    expect(result.totalCost).toBeCloseTo(40000, 8);
    expect(result.priceDifference).toBeCloseTo(0, 8);
    expect(result.pctIncrease).toBeCloseTo(0, 8);
    expect(result.netProfit).toBe(0);
  });

  it('buying fee only', () => {
    const { result } = calc({ quantity: '2', purchasePrice: '100', buyFeePct: '1', sellFeePct: '0' });
    expect(result.totalCost).toBeCloseTo(202, 10);
    expect(result.requiredSellingPrice).toBeCloseTo(101, 10);
    expect(result.sellingFee).toBe(0);
    expect(result.grossProceeds).toBeCloseTo(result.netProceeds, 10);
    expect(result.pctIncrease).toBeCloseTo(1, 8);
  });

  it('selling fee only', () => {
    const { result } = calc({ quantity: '2', purchasePrice: '100', buyFeePct: '0', sellFeePct: '2' });
    expect(result.buyingFee).toBe(0);
    expect(result.totalCost).toBeCloseTo(200, 10);
    expect(result.requiredSellingPrice).toBeCloseTo(100 / 0.98, 8);
    expect(result.sellingFee).toBeCloseTo(result.grossProceeds * 0.02, 8);
    expect(result.netProceeds).toBeCloseTo(200, 8);
  });

  it('both fees: price = P x (1 + Fb) / (1 - Fs)', () => {
    const { result } = calc({ quantity: '3', purchasePrice: '250', buyFeePct: '1.5', sellFeePct: '2.5' });
    expect(result.requiredSellingPrice).toBeCloseTo((250 * 1.015) / 0.975, 8);
    expect(result.pctIncrease).toBeCloseTo((1.015 / 0.975 - 1) * 100, 8);
  });

  it('gross - selling fee = net, and net - total cost = 0', () => {
    const { result } = calc({ buyFeePct: '0.75', sellFeePct: '1.25' });
    expect(result.grossProceeds - result.sellingFee).toBeCloseTo(result.netProceeds, 8);
    expect(result.netProceeds - result.totalCost).toBeCloseTo(0, 8);
    expect(result.netProfit).toBe(0);
  });
});

describe('numeric ranges', () => {
  it('decimal quantities', () => {
    const { ok, result } = calc({ quantity: '0.00012345', purchasePrice: '6500000' });
    expect(ok).toBe(true);
    expect(result.principalCost).toBeCloseTo(0.00012345 * 6500000, 8);
    expect(result.netProfit).toBe(0);
  });

  it('very small prices', () => {
    const { ok, result } = calc({ quantity: '1000000', purchasePrice: '0.000000012' });
    expect(ok).toBe(true);
    expect(Number.isFinite(result.requiredSellingPrice)).toBe(true);
    expect(result.requiredSellingPrice).toBeGreaterThan(0.000000012);
  });

  it('very large numbers stay finite', () => {
    const { ok, result } = calc({ quantity: '1000000000', purchasePrice: '1000000000' });
    expect(ok).toBe(true);
    for (const v of Object.values(result)) expect(Number.isFinite(v)).toBe(true);
  });

  it('accepts thousands separators', () => {
    const { ok, result } = calc({ purchasePrice: '80,000' });
    expect(ok).toBe(true);
    expect(result.purchasePrice).toBe(80000);
  });

  it('is currency independent', () => {
    expect(calculateBreakEven({ ...base, currency: 'USD' }).result).toEqual(calc().result);
  });

  it('highest supported selling fee stays finite', () => {
    const { ok, result, errors } = calc({ sellFeePct: '99.9999' });
    if (ok) for (const v of Object.values(result)) expect(Number.isFinite(v)).toBe(true);
    else expect(Object.keys(errors).length).toBeGreaterThan(0);
  });
});

describe('invalid inputs', () => {
  const invalid = (overrides, field) => {
    const out = calc(overrides);
    expect(out.ok).toBe(false);
    expect(out.result).toBeNull();
    expect(out.errors[field]).toBeTruthy();
  };

  it('empty fields', () => {
    for (const f of ['quantity', 'purchasePrice', 'buyFeePct', 'sellFeePct']) {
      invalid({ [f]: '' }, f);
      invalid({ [f]: '   ' }, f);
      invalid({ [f]: undefined }, f);
    }
  });

  it('zero quantity', () => invalid({ quantity: '0' }, 'quantity'));
  it('negative quantity', () => invalid({ quantity: '-1' }, 'quantity'));
  it('zero purchase price', () => invalid({ purchasePrice: '0' }, 'purchasePrice'));
  it('negative purchase price', () => invalid({ purchasePrice: '-5' }, 'purchasePrice'));
  it('negative buying fee', () => invalid({ buyFeePct: '-0.1' }, 'buyFeePct'));
  it('negative selling fee', () => invalid({ sellFeePct: '-0.1' }, 'sellFeePct'));
  it('buying fee at 100%', () => invalid({ buyFeePct: '100' }, 'buyFeePct'));
  it('buying fee above 100%', () => invalid({ buyFeePct: '250' }, 'buyFeePct'));
  it('selling fee above 100%', () => invalid({ sellFeePct: '101' }, 'sellFeePct'));

  it('selling fee equal to 100% gives no price', () => {
    const out = calc({ sellFeePct: '100' });
    expect(out.ok).toBe(false);
    expect(out.result).toBeNull();
    expect(out.errors.sellFeePct).toMatch(/100%/);
  });

  it('text and malformed numbers', () => {
    for (const bad of ['abc', '12abc', '1.2.3', '--5', 'NaN', 'Infinity', '1e999', '$100']) {
      invalid({ quantity: bad }, 'quantity');
      invalid({ buyFeePct: bad }, 'buyFeePct');
    }
  });

  it('numbers beyond the supported maximum', () => invalid({ quantity: '1e20' }, 'quantity'));

  it('non-finite numeric inputs', () => {
    invalid({ quantity: NaN }, 'quantity');
    invalid({ purchasePrice: Infinity }, 'purchasePrice');
  });

  it('missing input object does not throw', () => {
    expect(calculateBreakEven(undefined).ok).toBe(false);
    expect(calculateBreakEven({}).ok).toBe(false);
  });

  it('never silently treats invalid values as zero', () => {
    const out = calc({ buyFeePct: 'abc' });
    expect(out.ok).toBe(false);
    expect(out.errors.buyFeePct).toMatch(/valid number/);
  });
});

describe('break-even holds across many inputs', () => {
  it('net profit is zero and price >= purchase price', () => {
    for (const q of ['0.001', '0.5', '3', '1200'])
      for (const p of ['0.02', '80', '80000'])
        for (const [b, s] of [['0', '0'], ['0.1', '0.2'], ['1', '2.5'], ['0.5', '0']]) {
          const { ok, result } = calc({ quantity: q, purchasePrice: p, buyFeePct: b, sellFeePct: s });
          expect(ok).toBe(true);
          expect(result.netProfit).toBe(0);
          expect(result.requiredSellingPrice).toBeGreaterThanOrEqual(result.purchasePrice * (1 - 1e-12));
          expect(result.pctIncrease).toBeCloseTo(((1 + Number(b) / 100) / (1 - Number(s) / 100) - 1) * 100, 6);
        }
  });
});

describe('parseNumeric', () => {
  it('parses valid values', () => {
    expect(parseNumeric('1.5')).toBe(1.5);
    expect(parseNumeric(' .5 ')).toBe(0.5);
    expect(parseNumeric('1e3')).toBe(1000);
    expect(parseNumeric(7)).toBe(7);
  });
  it('returns null for empty and NaN for invalid', () => {
    expect(parseNumeric('')).toBeNull();
    expect(parseNumeric(null)).toBeNull();
    expect(parseNumeric('x')).toBeNaN();
  });
});

describe('formatting', () => {
  it('formats INR and USD', () => {
    expect(formatMoney(40040, 'INR')).toBe('₹40,040.00');
    expect(formatMoney(1234.5, 'USD')).toBe('$1,234.50');
  });
  it('shows small prices with extra precision', () => expect(formatMoney(0.000123, 'USD')).toBe('$0.000123'));
  it('never prints NaN or Infinity', () => {
    expect(formatMoney(NaN)).toBe('—');
    expect(formatMoney(Infinity)).toBe('—');
    expect(formatPercent(NaN)).toBe('—');
  });
  it('does not print negative zero', () => expect(formatMoney(-0, 'USD')).toBe('$0.00'));
  it('summary contains the key figures', () => {
    const text = buildSummary({ symbol: 'BTC', result: calc().result, currency: 'INR' });
    expect(text).toContain('Break-even selling price per BTC: ₹80,240.48');
    expect(text).toContain('Net profit or loss at break-even: ₹0.00');
  });
});

describe('real-world helpers', () => {
  it('price stack adds up to the break-even price', () => {
    const { result } = calc();
    const st = priceStack(result);
    expect(st.purchase + st.buyFee + st.sellFee).toBeCloseTo(result.requiredSellingPrice, 8);
    expect(st.buyFee).toBeCloseTo(80, 8);
  });

  it('price stack adds up for many fee combinations', () => {
    for (const [b, s] of [['0', '0'], ['1', '1'], ['0.5', '2.5']]) {
      const { result } = calc({ buyFeePct: b, sellFeePct: s });
      const st = priceStack(result);
      expect(st.purchase + st.buyFee + st.sellFee).toBeCloseTo(result.requiredSellingPrice, 8);
    }
  });

  it('exchange comparison covers every exchange plus the user row, cheapest first', () => {
    const rows = compareExchanges(base);
    expect(rows).toHaveLength(EXCHANGES.length + 1);
    expect(rows.filter((r) => r.isYours)).toHaveLength(1);
    for (let i = 1; i < rows.length; i++) expect(rows[i].price).toBeGreaterThanOrEqual(rows[i - 1].price);
    const yours = rows.find((r) => r.isYours);
    expect(yours.price).toBeCloseTo(calc().result.requiredSellingPrice, 8);
  });

  it('exchange comparison uses each exchange fees', () => {
    const rows = compareExchanges(base);
    const coinbase = rows.find((r) => r.key === 'coinbase');
    expect(coinbase.price).toBeCloseTo((80000 * 1.006) / 0.994, 6);
    const binance = rows.find((r) => r.key === 'binance');
    expect(binance.pctIncrease).toBeCloseTo((1.001 / 0.999 - 1) * 100, 6);
  });

  it('exchange comparison is empty for invalid inputs', () => {
    expect(compareExchanges({ ...base, quantity: '' })).toEqual([]);
  });
});

describe('market snapshot helpers', () => {
  it('looks up prices case-insensitively and returns null when missing', () => {
    expect(snapshotPrice('btc', 'USD')).toBe(SNAPSHOT.prices.USD.BTC);
    expect(snapshotPrice(' ETH ', 'INR')).toBe(SNAPSHOT.prices.INR.ETH);
    expect(snapshotPrice('XRP', 'INR')).toBeNull();
    expect(snapshotPrice('', 'USD')).toBeNull();
    expect(snapshotPrice('BTC', 'EUR')).toBeNull();
  });

  it('every snapshot price and exchange fee is a sane number', () => {
    for (const cur of Object.values(SNAPSHOT.prices))
      for (const v of Object.values(cur)) {
        expect(Number.isFinite(v)).toBe(true);
        expect(v).toBeGreaterThan(0);
      }
    for (const e of EXCHANGES) {
      expect(e.buy).toBeGreaterThanOrEqual(0);
      expect(e.buy).toBeLessThan(100);
      expect(e.sell).toBeLessThan(100);
      expect(e.source.url).toMatch(/^https:\/\//);
    }
  });

  it('finds an exchange from the fee values', () => {
    expect(findExchange('0.5', '0.5').key).toBe('coindcx');
    expect(findExchange(' 0.1 ', '0.1').key).toBe('coinswitch-pro');
    expect(findExchange('0.1', '0.2')).toBeNull();
  });

  it('every scenario builds valid, calculable inputs in INR and USD', () => {
    for (const cur of ['INR', 'USD'])
      for (const sc of SCENARIOS) {
        const inputs = scenarioInputs(sc, cur);
        expect(inputs).not.toBeNull();
        expect(calculateBreakEven(inputs).ok).toBe(true);
      }
  });

  it('scenario price is relative to the snapshot', () => {
    const inputs = scenarioInputs(SCENARIOS[0], 'USD');
    expect(Number(inputs.purchasePrice)).toBeCloseTo(SNAPSHOT.prices.USD.BTC * 1.1, 1);
    const below = scenarioInputs(SCENARIOS[1], 'INR');
    expect(Number(below.purchasePrice)).toBeCloseTo(SNAPSHOT.prices.INR.ETH * 0.85, 1);
  });

  it('scenarioInputs returns null without a snapshot price', () => {
    expect(scenarioInputs({ ...SCENARIOS[0], symbol: 'XRP' }, 'INR')).toBeNull();
  });

  it('market check compares the snapshot with break-even and purchase price', () => {
    const { result } = calc({ purchasePrice: '8000000', quantity: '0.01' });
    const mc = marketCheck(result, 'BTC', 'INR');
    expect(mc.available).toBe(true);
    expect(mc.vsPurchasePct).toBeCloseTo((SNAPSHOT.prices.INR.BTC / 8000000 - 1) * 100, 8);
    expect(mc.vsBreakEvenPct).toBeCloseTo((SNAPSHOT.prices.INR.BTC / result.requiredSellingPrice - 1) * 100, 8);
    expect(marketCheck(result, 'XRP', 'INR').available).toBe(false);
  });

  it('roundPrice keeps useful precision', () => {
    expect(roundPrice(87810.396)).toBe(87810.4);
    expect(roundPrice(0.085525)).toBeCloseTo(0.08553, 5);
  });
});

describe('INR vs USD snapshot sanity check', () => {
  it('computes the premium of the INR price over the converted USD price', () => {
    const g = inrPremium('BTC');
    expect(g.converted).toBeCloseTo(SNAPSHOT.prices.USD.BTC * FX.usdInr, 6);
    expect(g.premiumPct).toBeCloseTo((SNAPSHOT.prices.INR.BTC / g.converted - 1) * 100, 8);
  });

  it('is null when a price is missing', () => {
    expect(inrPremium('XRP')).toBeNull();
    expect(inrPremium('')).toBeNull();
  });

  it('every coin with both prices is within 15% of the converted price (catches data-entry slips)', () => {
    for (const coin of Object.keys(SNAPSHOT.prices.INR)) {
      const g = inrPremium(coin);
      expect(Math.abs(g.premiumPct)).toBeLessThan(15);
    }
  });
});
