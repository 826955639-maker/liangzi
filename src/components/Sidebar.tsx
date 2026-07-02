import Icon, { type IconName } from "./Icon";

export type NavigationId = "home" | "map" | "zones" | "record" | "settings";

type SidebarProps = {
  selected: NavigationId;
  onSelect: (id: NavigationId) => void;
};

const navigation: Array<{ id: NavigationId; label: string; icon: IconName }> = [
  { id: "home", label: "首页", icon: "home" },
  { id: "map", label: "地图导览", icon: "map" },
  { id: "zones", label: "展区总览", icon: "cube" },
  { id: "record", label: "探索记录", icon: "record" },
];

function AtomLogo() {
  return (
    <svg className="atom-logo" viewBox="0 0 70 58" aria-hidden="true">
      <defs>
        <radialGradient id="atomCore" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#f7f3ff" />
          <stop offset=".22" stopColor="#9f7aea" />
          <stop offset=".72" stopColor="#0a0a25" />
          <stop offset="1" stopColor="#02020c" />
        </radialGradient>
      </defs>
      <path d="m35 1 7 9H28Z" fill="#8359ee" />
      <circle cx="35" cy="29" r="20" fill="url(#atomCore)" stroke="#16112f" strokeWidth="2" />
      <ellipse cx="35" cy="29" rx="29" ry="10" stroke="#8367ff" strokeWidth="1.5" />
      <ellipse cx="35" cy="29" rx="29" ry="10" transform="rotate(60 35 29)" stroke="#a995ff" strokeWidth="1.5" />
      <ellipse cx="35" cy="29" rx="29" ry="10" transform="rotate(120 35 29)" stroke="#5740c5" strokeWidth="1.5" />
      <circle cx="35" cy="29" r="3.8" fill="white" />
      <circle cx="8" cy="29" r="2.6" fill="white" />
      <circle cx="49" cy="6" r="2.6" fill="#bba7ff" />
      <circle cx="49" cy="52" r="2.6" fill="#7b5ff0" />
    </svg>
  );
}

export default function Sidebar({ selected, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <AtomLogo />
        <strong>量子探微馆</strong>
        <small>QUANTUM EXPLORATION</small>
      </div>

      <nav className="side-nav" aria-label="主导航">
        {navigation.map((item) => (
          <button
            className={`nav-item${selected === item.id ? " is-selected" : ""}`}
            key={item.id}
            type="button"
            aria-current={selected === item.id ? "page" : undefined}
            onClick={() => onSelect(item.id)}
          >
            <span className="nav-icon">
              <Icon name={item.icon} />
            </span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        className={`nav-item settings-item${selected === "settings" ? " is-selected" : ""}`}
        type="button"
        aria-current={selected === "settings" ? "page" : undefined}
        onClick={() => onSelect("settings")}
      >
        <span className="nav-icon">
          <Icon name="settings" />
        </span>
        <span className="nav-label">设置</span>
      </button>
    </aside>
  );
}
