import { Moon, Scale, Sun } from 'lucide-react';
import { CURRENCIES } from '../utils/formatting.js';

export default function Header({ currency, onCurrencyChange, theme, onToggleTheme }) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <Scale size={20} />
        </span>
        <div className="brand-text">
          <h1>Crypto Break-Even Price Calculator</h1>
          <p>The price your coins must sell at to get every rupee or dollar back after fees.</p>
        </div>
      </div>

      <div className="topbar-controls no-print">
        <div className="seg" role="radiogroup" aria-label="Currency">
          {Object.values(CURRENCIES).map((c) => (
            <button
              key={c.code}
              type="button"
              role="radio"
              aria-checked={currency === c.code}
              className={currency === c.code ? 'on' : ''}
              onClick={() => onCurrencyChange(c.code)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${nextTheme} theme`}
          title={`Switch to ${nextTheme} theme`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
