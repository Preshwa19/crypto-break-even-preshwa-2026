import { ShieldAlert } from 'lucide-react';

export default function Disclaimer() {
  return (
    <aside className="disclaimer" aria-label="Assumptions and disclaimer">
      <ShieldAlert size={20} aria-hidden="true" />
      <div>
        <p>
          <strong>Assumptions:</strong> fees are percentages of the traded value and are estimates. Break-even means recovering
          the full modeled investment cost after the included fees, not necessarily every possible expense. The currency
          selector changes formatting only; amounts are never converted.
        </p>
        <p>
          This calculator provides estimates for educational purposes only. Results depend on the inputs and fee assumptions
          provided. It does not predict cryptocurrency prices or provide financial advice. Taxes, slippage, spreads, funding
          costs, and other charges are excluded unless explicitly included in the inputs.
        </p>
      </div>
    </aside>
  );
}
