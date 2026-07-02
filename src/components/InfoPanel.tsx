import Icon from "./Icon";
import DeviceReturnCard from "./ActionCards";

const information = [
  { icon: "shield" as const, text: "本设备由场馆提供" },
  { icon: "cube" as const, text: "可用于展区导览、展项互动、知识收藏与探索报告生成" },
  { icon: "heart" as const, text: "离馆前请归还 iPad" },
];

export default function InfoPanel() {
  return (
    <aside className="info-panel" aria-label="设备信息与探索概览">
      <section className="welcome-card">
        <h2>欢迎使用官方 iPad 设备</h2>
        <div className="welcome-list">
          {information.map((item) => (
            <div className="welcome-row" key={item.text}>
              <Icon name={item.icon} />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="progress-card">
        <div>
          <h2>探索进度</h2>
          <strong>
            0<small>%</small>
          </strong>
          <p>已探索 0 / 3 个展区</p>
        </div>
        <div className="radar" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <span />
        </div>
      </section>

      <section className="route-card">
        <h2>推荐路线</h2>
        <p>创见区 → 感知区 → 引领区</p>
        <div className="route-line" aria-label="创见区到感知区再到引领区">
          <span><i />创见区</span>
          <span><i />感知区</span>
          <span><i />引领区</span>
        </div>
      </section>

      <DeviceReturnCard />
    </aside>
  );
}
