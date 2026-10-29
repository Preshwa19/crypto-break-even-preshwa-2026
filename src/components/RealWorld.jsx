import { ExternalLink, Landmark } from 'lucide-react';
import { INDIA_TAX } from '../data/marketSnapshot.js';

export default function RealWorld({ currency = 'INR' }) {
  return (
    <section className="card realworld-card no-print" aria-labelledby="rw-title">
      <h2 id="rw-title">
        <Landmark size={18} aria-hidden="true" /> Real-world costs this price does not include
      </h2>
      <ul className="rw-list">
        {currency === 'INR' ? (
          <li>
          <strong>Tax.</strong> {INDIA_TAX.summary} Neither is in the break-even price above, so your real break-even after tax
          can be higher. <span className="muted">As of {INDIA_TAX.asOf}.</span>{' '}
          <a href={INDIA_TAX.source.url} target="_blank" rel="noopener noreferrer">
            {INDIA_TAX.source.name} <ExternalLink size={12} aria-hidden="true" />
          </a>
        </li>
        ) : null}
        <li>
          <strong>Spread and slippage.</strong> The price you actually get can differ from the price on screen, especially on
          thinly traded coins or large orders.
        </li>
        <li>
          <strong>Other charges.</strong> Deposit, withdrawal and network fees, GST on fees where it applies, and funding costs
          are not modeled.
        </li>
      </ul>
      <p className="micro">Information only, not tax advice. Rules change, so confirm current rates with a qualified professional.</p>
    </section>
  );
}
