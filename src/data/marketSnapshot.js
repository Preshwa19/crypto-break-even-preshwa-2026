/**
 * Real-world reference data, collected by hand on 29 Oct 2026 and stored as a STATIC SNAPSHOT.
 * The app never fetches live data. Prices and fees change, so always check the source.
 */

export const SNAPSHOT = {
  retrieved: '29 Oct 2026',
  prices: {
    // USD: one CoinGecko market table.
    USD: { BTC: 79818.16, ETH: 2305.81, XRP: 1.29, BNB: 749.02, SOL: 99.74, DOGE: 0.07775 },
    // INR: Mudrex (an Indian exchange). Only coins with a dated INR price are listed.
    INR: { BTC: 8131267.94, ETH: 235277.33, SOL: 10253.74 },
  },
  dates: {
    USD: { default: '29 Oct 2026' },
    INR: { default: '29 Oct 2026', SOL: '26 Oct 2026' },
  },
  sources: {
    USD: { name: 'CoinGecko', url: 'https://www.coingecko.com/' },
    INR: { name: 'Mudrex', url: 'https://mudrex.com/coins/bitcoin' },
  },
};

/** USD/INR close used only to sanity-check the INR prices against the USD prices. */
export const FX = {
  usdInr: 95.1675,
  date: '26 Oct 2026',
  source: { name: 'Pound Sterling Live', url: 'https://www.poundsterlinglive.com/history/USD-INR-2026' },
};

/** Published base-tier spot fees (percent per side). Both sides use the same figure here. */
export const EXCHANGES = [
  {
    key: 'coindcx',
    name: 'CoinDCX',
    buy: 0.5,
    sell: 0.5,
    basis: 'Base tier (Regular 1), maker and taker. Falls with 30-day volume.',
    asOf: '16 Oct 2026',
    source: {
      name: 'Finowings comparison',
      url: 'https://www.finowings.com/Crypto-Currency/coindcx-vs-coinswitch-vs-mudrex-vs-delta-exchange-crypto-exchanges-india-fees-features',
    },
  },
  {
    key: 'coinswitch-pro',
    name: 'CoinSwitch Pro',
    buy: 0.1,
    sell: 0.1,
    basis: 'Taker rate for market orders (maker is 0%). The main CoinSwitch app builds costs into the spread instead.',
    asOf: '16 Oct 2026',
    source: {
      name: 'Finowings comparison',
      url: 'https://www.finowings.com/Crypto-Currency/coindcx-vs-coinswitch-vs-mudrex-vs-delta-exchange-crypto-exchanges-india-fees-features',
    },
  },
  {
    key: 'mudrex',
    name: 'Mudrex',
    buy: 0.45,
    sell: 0.45,
    basis: 'Spot fee under ₹2 lakh 30-day volume. Lower Alpha tiers go down to 0.12%.',
    asOf: '16 Oct 2026',
    source: {
      name: 'Finowings comparison',
      url: 'https://www.finowings.com/Crypto-Currency/coindcx-vs-coinswitch-vs-mudrex-vs-delta-exchange-crypto-exchanges-india-fees-features',
    },
  },
  {
    key: 'binance',
    name: 'Binance',
    buy: 0.1,
    sell: 0.1,
    basis: 'Regular User tier, maker and taker. 0.075% if the fee is paid in BNB. Availability depends on your country.',
    asOf: '24 Oct 2026',
    source: { name: 'CryptoTicker', url: 'https://cryptoticker.io/en/binance-fees-spot-futures/' },
  },
  {
    key: 'coinbase',
    name: 'Coinbase Advanced',
    buy: 0.6,
    sell: 0.6,
    basis: 'Entry tier taker rate (maker is 0.40%).',
    asOf: '20 Aug 2026',
    source: { name: 'DataWallet', url: 'https://www.datawallet.com/crypto/coinbase-fees' },
  },
];

/** Tax context for India. Shown as information only. It is NOT part of the calculation. */
export const INDIA_TAX = {
  summary:
    'India taxes crypto gains at a flat 30% and withholds 1% TDS on transfers. Reports say Budget 2026-27 kept both unchanged.',
  asOf: '2 Feb 2026',
  source: {
    name: 'KuCoin News (citing ChainCatcher and CoinDesk)',
    url: 'https://www.kucoin.com/news/flash/india-2026-budget-maintains-30-crypto-tax-and-1-tds-introduces-fines-for-non-compliance',
  },
};
