import ZoneNode from "../components/ZoneNode.jsx";

export default function MapPage({ zones, exhibits, activeZoneId, onSelectZone, onOpenExhibit, onNavigate }) {
  const activeZone = zones.find((zone) => zone.id === activeZoneId) || zones[0];
  const activeZoneExhibits = activeZone.exhibits.map((id) => exhibits.find((item) => item.id === id)).filter(Boolean);

  const getCompletedRatio = (zone) => {
    const zoneExhibits = zone.exhibits.map((id) => exhibits.find((item) => item.id === id)).filter(Boolean);
    const completed = zoneExhibits.filter((item) => item.completed).length;
    return zoneExhibits.length ? completed / zoneExhibits.length : 0;
  };

  return (
    <div className="page map-page">
      <div className="page-heading">
        <span className="section-kicker">SIMULATED 3D MAP</span>
        <h1>3D 展厅地图</h1>
        <p>倾斜视角展示创见区、感知区、引领区，点击节点查看展区信息。</p>
      </div>

      <section className="map-layout">
        <div className="map-stage">
          <div className="map-shadow" />
          <div className="map-floor">
            <div className="floor-grid" />
            <div className="zone-block zone-block-a">创见区</div>
            <div className="zone-block zone-block-b">感知区</div>
            <div className="zone-block zone-block-c">引领区</div>
            <svg className="route-line" viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 19 37 C 33 22, 42 50, 55 48 S 77 27, 86 30" />
            </svg>
            {zones.map((zone) => (
              <ZoneNode
                key={zone.id}
                zone={zone}
                completedRatio={getCompletedRatio(zone)}
                selected={activeZone.id === zone.id}
                onSelect={() => onSelectZone(zone.id)}
              />
            ))}
          </div>
        </div>

        <aside className="zone-info-card">
          <span>{activeZone.theme}</span>
          <h2>{activeZone.name}</h2>
          <p>{activeZone.description}</p>
          <div className="focus-list">
            <strong>重点展项</strong>
            {activeZoneExhibits.map((item) => (
              <button key={item.id} type="button" onClick={() => onOpenExhibit(item.id)}>
                <i className={item.completed ? "done" : ""} />
                {item.name}
              </button>
            ))}
          </div>
          <div className="card-actions">
            <button className="primary-button" type="button" onClick={() => onOpenExhibit(activeZoneExhibits[0]?.id)}>
              进入展区
            </button>
            <button className="ghost-button" type="button" onClick={() => onNavigate("scan")}>
              扫码探索
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
