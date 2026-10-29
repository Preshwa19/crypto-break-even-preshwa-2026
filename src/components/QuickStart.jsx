import { FlaskConical, RotateCcw, Sparkles } from 'lucide-react';
import { SCENARIOS } from '../utils/presets.js';
import { SNAPSHOT } from '../data/marketSnapshot.js';

export default function QuickStart({ onScenario, onLoadExample, onReset }) {
  return (
    <section className="quick no-print" aria-label="Quick start">
      <div className="quick-label">
        <Sparkles size={16} aria-hidden="true" />
        <span>Start from a real situation</span>
      </div>
      <div className="quick-actions">
        {SCENARIOS.map((sc) => (
          <button key={sc.id} type="button" className="pill" onClick={() => onScenario(sc)}>
            {sc.label}
          </button>
        ))}
        <span className="quick-gap" aria-hidden="true" />
        <button type="button" className="pill ghost" onClick={onLoadExample}>
          <FlaskConical size={14} aria-hidden="true" /> Load example
        </button>
        <button type="button" className="pill ghost" onClick={onReset}>
          <RotateCcw size={14} aria-hidden="true" /> Reset
        </button>
      </div>
      <p className="micro">
        Scenarios use the market snapshot from {SNAPSHOT.retrieved} and one exchange&rsquo;s published base fees. Edit
        anything afterwards.
      </p>
    </section>
  );
}
