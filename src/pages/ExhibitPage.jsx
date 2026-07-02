import { useEffect, useState } from "react";
import { timeline } from "../data/mockData.js";

export default function ExhibitPage({ exhibit, onComplete, onNavigate, onOpenKnowledge }) {
  const [waveMix, setWaveMix] = useState(50);
  const [boxOpen, setBoxOpen] = useState(false);
  const [energy, setEnergy] = useState(42);
  const [transmission, setTransmission] = useState("idle");
  const [timelineNode, setTimelineNode] = useState(timeline[0].id);

  useEffect(() => {
    setWaveMix(50);
    setBoxOpen(false);
    setEnergy(42);
    setTransmission("idle");
    setTimelineNode(timeline[0].id);
  }, [exhibit?.id]);

  if (!exhibit) {
    return (
      <div className="page">
        <div className="empty-state">
          <h1>请选择一个展项</h1>
          <button className="primary-button" type="button" onClick={() => onNavigate("scan")}>
            前往扫码探索
          </button>
        </div>
      </div>
    );
  }

  const activeTimeline = timeline.find((item) => item.id === timelineNode) || timeline[0];

  const renderInteraction = () => {
    if (exhibit.id === "wave-particle") {
      return (
        <div className="interaction-card wave-demo">
          <div className="wave-field" style={{ "--particle-opacity": waveMix / 100, "--wave-opacity": 1 - waveMix / 150 }}>
            <div className="wave-line line-one" />
            <div className="wave-line line-two" />
            <div className="particle-cloud">
              {Array.from({ length: 18 }).map((_, index) => (
                <i key={index} style={{ "--delay": `${index * 0.16}s`, "--x": `${12 + ((index * 19) % 78)}%` }} />
              ))}
            </div>
          </div>
          <label className="control-row">
            <span>波动状态</span>
            <input type="range" min="0" max="100" value={waveMix} onChange={(event) => setWaveMix(Number(event.target.value))} />
            <span>粒子状态</span>
          </label>
          <p>光在不同实验条件下，会呈现不同特征。</p>
        </div>
      );
    }

    if (exhibit.id === "schrodinger-cat") {
      return (
        <div className="interaction-card cat-demo">
          <div className={boxOpen ? "quantum-box opened" : "quantum-box"}>
            <div className="box-lid" />
            <div className="box-body">
              <strong>{boxOpen ? "观察结果" : "叠加态"}</strong>
              <span>{boxOpen ? "状态已确定" : "可能性共存"}</span>
            </div>
          </div>
          <button className="primary-button" type="button" onClick={() => setBoxOpen((value) => !value)}>
            {boxOpen ? "重置盒子" : "打开盒子"}
          </button>
          <p>在量子世界中，测量会改变系统状态。</p>
        </div>
      );
    }

    if (exhibit.id === "quantum-tunnel") {
      const tunneled = energy >= 66;
      return (
        <div className="interaction-card tunnel-demo">
          <div className={tunneled ? "tunnel-stage active" : "tunnel-stage"}>
            <span className="tunnel-particle" />
            <span className="barrier" />
            <span className="target-glow" />
          </div>
          <label className="control-row">
            <span>能量</span>
            <input type="range" min="0" max="100" value={energy} onChange={(event) => setEnergy(Number(event.target.value))} />
            <strong>{energy}</strong>
          </label>
          <p>{tunneled ? "粒子已经穿过势垒。" : "继续提升能量，观察隧穿概率变化。"} 微观粒子存在穿过势垒的概率。</p>
        </div>
      );
    }

    if (exhibit.id === "quantum-communication") {
      return (
        <div className="interaction-card communication-demo">
          <div className={transmission === "alert" ? "comm-stage alert" : "comm-stage"}>
            <div className="terminal sender">发送端</div>
            <div className="signal-line">
              <i />
            </div>
            <div className="terminal eavesdropper">窃听者</div>
            <div className="signal-line second">
              <i />
            </div>
            <div className="terminal receiver">接收端</div>
          </div>
          <button
            className="primary-button"
            type="button"
            onClick={() => setTransmission((value) => (value === "alert" ? "safe" : "alert"))}
          >
            开始传输
          </button>
          <p>{transmission === "alert" ? "检测到窃听扰动，系统已发出警报。" : "量子通信可以帮助发现信息是否被窃听。"}</p>
        </div>
      );
    }

    return (
      <div className="interaction-card timeline-demo">
        <div className="timeline-rail">
          {timeline.map((item) => (
            <button
              key={item.id}
              className={item.id === timelineNode ? "active" : ""}
              type="button"
              onClick={() => setTimelineNode(item.id)}
            >
              <i />
              {item.title}
            </button>
          ))}
        </div>
        <div className="timeline-copy">
          <span>城市科创节点</span>
          <h3>{activeTimeline.title}</h3>
          <p>{activeTimeline.text}</p>
        </div>
        <p>合肥的量子科技成果正在形成城市科创名片。</p>
      </div>
    );
  };

  return (
    <div className="page exhibit-page">
      <div className="page-heading exhibit-heading">
        <span className="section-kicker">{exhibit.zone}</span>
        <h1>{exhibit.name}</h1>
        <p>{exhibit.question}</p>
      </div>

      <section className="exhibit-layout">
        {renderInteraction()}

        <aside className="exhibit-side">
          <span className={exhibit.completed ? "status-pill done" : "status-pill"}>{exhibit.completed ? "已完成" : "待探索"}</span>
          <h2>结果反馈</h2>
          <p>{exhibit.shortIntro}</p>
          <div className="exhibit-actions">
            <button className="primary-button" type="button" onClick={() => onComplete(exhibit.id)}>
              完成任务
            </button>
            <button className="ghost-button" type="button" onClick={() => onOpenKnowledge(exhibit.id)}>
              查看知识卡片
            </button>
            <button className="text-button" type="button" onClick={() => onNavigate("map")}>
              返回地图
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
