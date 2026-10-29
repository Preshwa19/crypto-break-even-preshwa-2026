/**
 * Starting points for the form. Scenarios are built into form values by scenarioInputs() in market.js:
 * the purchase price is the dated market snapshot price moved by vsMarketPct, and the fees come from the
 * named exchange's published base tier. Everything here only fills in form fields.
 */

export const COIN_CHIPS = ['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'DOGE'];

/**
 * Real situations. Every symbol has a snapshot price in both INR and USD.
 * vsMarketPct: how far the purchase price sits from the snapshot price (+10 means bought 10% above it).
 */
export const SCENARIOS = [
  {
    id: 'btc-above',
    label: 'Bought BTC 10% above today',
    symbol: 'BTC',
    quantity: '0.05',
    exchange: 'binance',
    vsMarketPct: 10,
  },
  {
    id: 'eth-below',
    label: 'Bought ETH 15% below today',
    symbol: 'ETH',
    quantity: '2',
    exchange: 'coindcx',
    vsMarketPct: -15,
  },
  {
    id: 'sol-today',
    label: 'Small SOL buy at today’s price',
    symbol: 'SOL',
    quantity: '25',
    exchange: 'coinswitch-pro',
    vsMarketPct: 0,
  },
];
