import ProgressPanel from "../components/ProgressPanel.jsx";
import RouteCard from "../components/RouteCard.jsx";

export default function Home({
  routes,
  selectedRouteId,
  completedCount,
  totalCount,
  collectedCount,
  onSelectRoute,
  onNavigate
}) {
  return (
    <div className="page home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="section-kicker">SMART GUIDE SYSTEM</span>
          <h1>量子探微馆智慧导览</h1>
          <p className="hall-name">安徽省科技馆 · 量子探微馆</p>
          <p className="hero-intro">通过 3D 地图、扫码探索和互动展示，理解看不见的量子世界</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => onNavigate("map")}>
              进入 3D 地图
            </button>
            <button className="ghost-button" type="button" onClick={() => onNavigate("scan")}>
              扫码探索
            </button>
          </div>
        </div>

        <div className="quantum-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
          <i />
        </div>
      </section>

      <section className="content-grid">
        <div className="wide-section">
          <div className="section-heading">
            <span className="section-kicker">RECOMMENDED ROUTES</span>
            <h2>首页推荐路线</h2>
          </div>
          <div className="route-grid">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                selected={route.id === selectedRouteId}
                onSelect={() => onSelectRoute(route.id)}
              />
            ))}
          </div>
        </div>

        <ProgressPanel completedCount={completedCount} totalCount={totalCount} collectedCount={collectedCount} />
      </section>
    </div>
  );
}
