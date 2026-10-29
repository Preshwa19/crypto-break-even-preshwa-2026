export default function Tile({ label, value, hint, icon: Icon, accent = 'indigo', tone }) {
  return (
    <div className={`tile a-${accent} ${tone ? `tone-${tone}` : ''}`}>
      <div className="tile-top">
        <span className="tile-icon" aria-hidden="true">{Icon ? <Icon size={16} /> : null}</span>
        <span className="tile-label">{label}</span>
      </div>
      <div className="tile-value">{value}</div>
      {hint ? <div className="tile-hint">{hint}</div> : null}
    </div>
  );
}
