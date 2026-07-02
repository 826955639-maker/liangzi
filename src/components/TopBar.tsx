import { useState } from "react";
import Icon from "./Icon";

export default function TopBar() {
  const [query, setQuery] = useState("");

  return (
    <header className="top-bar">
      <div className="system-time" aria-label="当前时间和日期">
        <strong>9:41</strong>
        <span>6月10日 周一</span>
      </div>

      <div className="top-actions">
        <form
          className="search-box"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            console.log("搜索", query);
          }}
        >
          <Icon name="search" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="搜索展项或展区"
            placeholder="搜索展项 / 展区"
          />
        </form>

        <button className="round-button" type="button" aria-label="扫码" onClick={() => console.log("扫码")}>
          <Icon name="scan" />
        </button>
        <button className="round-button" type="button" aria-label="通知" onClick={() => console.log("通知")}>
          <Icon name="bell" />
        </button>
        <button className="round-button" type="button" aria-label="用户中心" onClick={() => console.log("用户中心")}>
          <Icon name="user" />
          <span className="user-base" aria-hidden="true" />
        </button>
      </div>

      <div className="system-status" aria-label="网络良好，电量百分之百">
        <Icon name="wifi" />
        <span>100%</span>
        <Icon className="battery-icon" name="battery" />
      </div>
    </header>
  );
}
