export default function ZoneNode({ zone, completedRatio, selected, onSelect }) {
  return (
    <button
      className={selected ? "zone-node selected" : "zone-node"}
      style={{ "--x": `${zone.mapPosition.x}%`, "--y": `${zone.mapPosition.y}%` }}
      type="button"
      onClick={onSelect}
      aria-label={`查看${zone.name}`}
    >
      <span className="node-pulse" />
      <span className="node-core" />
      <strong>{zone.name}</strong>
      <small>{Math.round(completedRatio * 100)}%</small>
    </button>
  );
}
