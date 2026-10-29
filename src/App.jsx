import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import QuickStart from './components/QuickStart.jsx';
import HeroResult from './components/HeroResult.jsx';
import CalculatorForm from './components/CalculatorForm.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';
import PriceStack from './components/PriceStack.jsx';
import MarketCheck from './components/MarketCheck.jsx';
import ExchangeCompare from './components/ExchangeCompare.jsx';
import CalculationBreakdown from './components/CalculationBreakdown.jsx';
import RealWorld from './components/RealWorld.jsx';
import Education from './components/Education.jsx';
import Sources from './components/Sources.jsx';
import Disclaimer from './components/Disclaimer.jsx';
import { calculateBreakEven } from './utils/calculations.js';
import { buildSummary } from './utils/formatting.js';
import { snapshotPrice, scenarioInputs, roundPrice } from './utils/market.js';

const DEFAULT_INPUTS = {
  symbol: 'BTC',
  quantity: '',
  purchasePrice: '',
  buyFeePct: '0.1',
  sellFeePct: '0.2',
};

// The worked example from the project brief (INR).
const EXAMPLE_INPUTS = {
  symbol: 'BTC',
  quantity: '0.5',
  purchasePrice: '80000',
  buyFeePct: '0.1',
  sellFeePct: '0.2',
};

const THEME_KEY = 'cbep-theme';

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable: fall back to default */
  }
  return 'light';
}

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [touched, setTouched] = useState({});
  const [currency, setCurrency] = useState('INR');
  const [theme, setTheme] = useState(getInitialTheme);
  const [copyStatus, setCopyStatus] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    if (!copyStatus) return undefined;
    const id = setTimeout(() => setCopyStatus(null), 4000);
    return () => clearTimeout(id);
  }, [copyStatus]);

  const calc = useMemo(() => calculateBreakEven(inputs), [inputs]);

  // Show an error once the field has been touched or contains something.
  const visibleErrors = useMemo(() => {
    const out = {};
    for (const [field, message] of Object.entries(calc.errors)) {
      const hasValue = String(inputs[field] ?? '').trim() !== '';
      if (field === 'general' || touched[field] || hasValue) out[field] = message;
    }
    return out;
  }, [calc.errors, inputs, touched]);

  const errorCount = Object.keys(visibleErrors).length;
  const anyEntered = ['quantity', 'purchasePrice'].some((f) => String(inputs[f] ?? '').trim() !== '');
  const status = calc.ok ? 'ready' : errorCount > 0 ? 'invalid' : anyEntered ? 'incomplete' : 'empty';
  const ready = status === 'ready';
  const marketPrice = snapshotPrice(inputs.symbol, currency);

  const clearFeedback = () => setCopyStatus(null);

  const handleChange = (field, value) => {
    const next = field === 'symbol' ? value.toUpperCase().replace(/[^A-Z0-9._-]/g, '').slice(0, 12) : value;
    setInputs((prev) => ({ ...prev, [field]: next }));
    clearFeedback();
  };

  const handleBlurField = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setTouched({});
    setCurrency('INR');
    clearFeedback();
  };

  const handleLoadExample = () => {
    setInputs(EXAMPLE_INPUTS);
    setTouched({});
    setCurrency('INR');
    clearFeedback();
  };

  const handleScenario = (scenario) => {
    const next = scenarioInputs(scenario, currency);
    if (!next) return;
    setInputs(next);
    setTouched({});
    clearFeedback();
  };

  const handleExchange = (exchange) => {
    setInputs((prev) => ({ ...prev, buyFeePct: String(exchange.buy), sellFeePct: String(exchange.sell) }));
    clearFeedback();
  };

  const handleCoin = (symbol) => setInputs((prev) => ({ ...prev, symbol }));

  const handleUseMarket = (price) => {
    setInputs((prev) => ({ ...prev, purchasePrice: String(roundPrice(price)) }));
    clearFeedback();
  };

  const handleCopy = async () => {
    if (!calc.ok) return;
    const text = buildSummary({ symbol: inputs.symbol, result: calc.result, currency });
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
        throw new Error('Clipboard API unavailable');
      }
      await navigator.clipboard.writeText(text);
      setCopyStatus({ type: 'success', message: 'Results copied to the clipboard.' });
    } catch {
      setCopyStatus({
        type: 'error',
        message: 'Could not copy. Your browser may have blocked clipboard access.',
      });
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="page">
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      <QuickStart onScenario={handleScenario} onLoadExample={handleLoadExample} onReset={handleReset} />

      <HeroResult status={status} result={calc.result} currency={currency} symbol={inputs.symbol} />

      {calc.errors.general ? (
        <p className="banner-error" role="alert">
          {calc.errors.general}
        </p>
      ) : null}

      <main className="grid">
        <div className="col-form">
          <CalculatorForm
            inputs={inputs}
            errors={visibleErrors}
            currency={currency}
            marketPrice={marketPrice}
            onChange={handleChange}
            onBlurField={handleBlurField}
            onExchange={handleExchange}
            onCoin={handleCoin}
            onUseMarket={handleUseMarket}
          />
        </div>

        <div className="col-results">
          <ResultsDashboard
            status={status}
            result={calc.result}
            currency={currency}
            symbol={inputs.symbol}
            errorCount={errorCount}
            copyStatus={copyStatus}
            onCopy={handleCopy}
            onPrint={handlePrint}
          />
          {ready && (
            <>
              <PriceStack result={calc.result} currency={currency} symbol={inputs.symbol} />
              <MarketCheck result={calc.result} currency={currency} symbol={inputs.symbol} />
              <ExchangeCompare inputs={inputs} currency={currency} symbol={inputs.symbol} />
            </>
          )}
        </div>
      </main>

      {ready && <CalculationBreakdown result={calc.result} currency={currency} symbol={inputs.symbol} />}

      <div className="below">
        {ready && <RealWorld currency={currency} />}
        <Education />
        <Sources />
        <Disclaimer />
      </div>
    </div>
  );
}
