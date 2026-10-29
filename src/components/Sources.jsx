import { Database, ExternalLink } from 'lucide-react';
import { EXCHANGES, FX, SNAPSHOT } from '../data/marketSnapshot.js';
import { inrPremium } from '../utils/market.js';

export default function Sources() {
  const gap = inrPremium('BTC');
  return (
    <section className="card sources-card no-print" aria-labelledby="src-title">
      <h2 id="src-title">
        <Database size={18} aria-hidden="true" /> Where the real-world values come from
      </h2>
      <p className="micro">
        Collected by hand on {SNAPSHOT.retrieved} and stored in the app. Nothing is fetched while you use it, so these are
        snapshots that go out of date.
      </p>
      <ul className="src-list">
        <li>
          <strong>USD prices:</strong>{' '}
          <a href={SNAPSHOT.sources.USD.url} target="_blank" rel="noopener noreferrer">
            {SNAPSHOT.sources.USD.name} <ExternalLink size={12} aria-hidden="true" />
          </a>{' '}
          market table, {SNAPSHOT.dates.USD.default}.
        </li>
        <li>
          <strong>INR prices:</strong>{' '}
          <a href={SNAPSHOT.sources.INR.url} target="_blank" rel="noopener noreferrer">
            {SNAPSHOT.sources.INR.name} <ExternalLink size={12} aria-hidden="true" />
          </a>{' '}
          (an Indian exchange), BTC and ETH on {SNAPSHOT.dates.INR.default}, SOL on {SNAPSHOT.dates.INR.SOL}. INR and USD
          prices come from different sources and are not conversions of each other.
        </li>
        {gap ? (
          <li>
            <strong>Why INR and USD examples differ:</strong> at USD/INR {FX.usdInr} ({FX.date},{' '}
            <a href={FX.source.url} target="_blank" rel="noopener noreferrer">
              {FX.source.name} <ExternalLink size={12} aria-hidden="true" />
            </a>
            ) the dollar BTC price converts to about {Math.round(gap.converted).toLocaleString('en-IN')} rupees, while the
            INR snapshot is {Math.round(gap.inr).toLocaleString('en-IN')}, about {gap.premiumPct.toFixed(1)}% {gap.premiumPct >= 0 ? 'higher' : 'lower'}. Prices on Indian
            exchanges can differ from the converted global price, so the INR and USD scenarios are not the same trade.
          </li>
        ) : null}
        {EXCHANGES.map((e) => (
          <li key={e.key}>
            <strong>{e.name} fees:</strong> {e.buy}% per side, as of {e.asOf}.{' '}
            <a href={e.source.url} target="_blank" rel="noopener noreferrer">
              {e.source.name} <ExternalLink size={12} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <p className="micro">
        Several fee figures come from third-party comparison articles rather than the exchanges themselves. Treat them as a
        guide and confirm on the exchange.
      </p>
    </section>
  );
}
