const navItems = [
  { id: "home", label: "首页", code: "01" },
  { id: "map", label: "3D 地图", code: "02" },
  { id: "scan", label: "扫码探索", code: "03" },
  { id: "knowledge", label: "知识卡片", code: "04" },
  { id: "report", label: "我的报告", code: "05" }
];

export default function Sidebar({ currentPage, onNavigate, completedCount, totalCount }) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <span className="brand-mark">Q</span>
        <div>
          <p>安徽省科技馆</p>
          <strong>量子探微馆</strong>
        </div>
      </div>

      <nav className="side-nav" aria-label="主导航">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={currentPage === item.id ? "nav-item active" : "nav-item"}
            type="button"
            onClick={() => onNavigate(item.id)}
          >
            <span>{item.code}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-status">
        <span>探索进度</span>
        <strong>
          {completedCount} / {totalCount}
        </strong>
        <div className="mini-progress" aria-hidden="true">
          <i style={{ width: `${(completedCount / totalCount) * 100}%` }} />
        </div>
      </div>
    </aside>
  );
}
