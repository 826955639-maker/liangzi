export default function RouteCard({ route, selected, onSelect }) {
  return (
    <button className={selected ? "route-card selected" : "route-card"} type="button" onClick={onSelect}>
      <div className="route-card-top">
        <span>{route.duration}</span>
        <i aria-hidden="true" />
      </div>
      <h3>{route.title}</h3>
      <p>{route.description}</p>
      <div className="route-stops">
        {route.stops.map((stop) => (
          <small key={stop}>{stop}</small>
        ))}
      </div>
    </button>
  );
}
