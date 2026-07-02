import CameraScanner from "../components/CameraScanner";
import Icon from "../components/Icon";
import ZoneVisual, { type ZoneVisualType } from "../components/ZoneVisual";

type Zone = {
  id: string;
  title: string;
  subtitle: string;
  exhibits: string;
  visual: ZoneVisualType;
};

const zones: Zone[] = [
  {
    id: "creation",
    title: "创见区",
    subtitle: "量子世界的想象与发现",
    exhibits: "薛定谔的猫 · 波粒之争 · 原子结构",
    visual: "creation",
  },
  {
    id: "perception",
    title: "感知区",
    subtitle: "光与量子的可视化体验",
    exhibits: "跳动的光波 · 激光应用 · 量子材料",
    visual: "perception",
  },
  {
    id: "future",
    title: "引领区",
    subtitle: "量子科技与未来计算",
    exhibits: "量子迷宫 · 量子计算 · 量子通信",
    visual: "future",
  },
];

function ZoneBadgeIcon({ type }: { type: ZoneVisualType }) {
  if (type === "creation") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M4 24s7-11 20-11 20 11 20 11-7 11-20 11S4 24 4 24Z" />
        <circle cx="24" cy="24" r="5.5" />
        <path d="M24 7v4M9.5 11.5l3 3M38.5 11.5l-3 3M5 24h4M39 24h4M9.5 36.5l3-3M38.5 36.5l-3-3M24 37v4" />
      </svg>
    );
  }

  if (type === "perception") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M5 25h4l3-9 5 20 5-29 5 34 5-25 4 17 3-8h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="m24 8 12 7v14l-12 7-12-7V15Z" />
      <path d="m12 15 12 7 12-7M24 22v14" />
      <circle cx="24" cy="5" r="2" />
      <circle cx="41" cy="14" r="2" />
      <circle cx="41" cy="33" r="2" />
      <circle cx="24" cy="41" r="2" />
      <circle cx="7" cy="33" r="2" />
      <circle cx="7" cy="14" r="2" />
      <path d="M24 7v3M39 15l-3 1M39 32l-3-1M24 38v-3M9 32l3-1M9 15l3 1" />
    </svg>
  );
}

function ResultQuantumGlyph() {
  return (
    <span className="result-quantum" aria-hidden="true">
      <i />
      <i />
      <i />
      <b />
    </span>
  );
}

type ExhibitionOverviewPageProps = {
  onOpenCreation: () => void;
  onOpenPerception: () => void;
  onOpenMaze: () => void;
};

export default function ExhibitionOverviewPage({ onOpenCreation, onOpenPerception, onOpenMaze }: ExhibitionOverviewPageProps) {
  return (
    <section className="overview-layout" aria-labelledby="overview-title">
      <header className="overview-heading">
        <h1 id="overview-title">展区总览</h1>
        <p>三大主题展区，探索量子世界的奥秘</p>
      </header>

      <section className="zone-stack" aria-label="三大主题展区">
        {zones.map((zone) => (
          <article className="zone-card" key={zone.id}>
            <span className="zone-card__icon">
              <ZoneBadgeIcon type={zone.visual} />
            </span>
            <div className="zone-card__copy">
              <h2>{zone.title}</h2>
              <p className="zone-card__subtitle">{zone.subtitle}</p>
              <strong>重点展项</strong>
              <p className="zone-card__exhibits">{zone.exhibits}</p>
            </div>
            <ZoneVisual type={zone.visual} />
            <button
              className="zone-card__arrow"
              type="button"
              aria-label={`查看${zone.title}`}
              onClick={() => {
                if (zone.id === "creation") {
                  onOpenCreation();
                  return;
                }
                if (zone.id === "perception") {
                  onOpenPerception();
                  return;
                }
                if (zone.id === "future") {
                  onOpenMaze();
                  return;
                }
                console.log(`查看${zone.title}`);
              }}
            >
              <Icon name="arrow-right" />
            </button>
          </article>
        ))}
      </section>

      <aside className="overview-actions" aria-label="二维码扫描与互动">
        <section className="scan-card">
          <h2>扫描展区二维码 / 扫描展项二维码</h2>
          <p>将二维码置于框内，自动识别</p>
          <CameraScanner />
        </section>

        <section className="recognition-card">
          <h2>识别结果</h2>
          <div className="recognition-result">
            <ResultQuantumGlyph />
            <div>
              <p className="recognition-name">
                已识别展项名称 <span>示例</span>
              </p>
              <p className="recognition-zone">
                <Icon name="location" />
                所属展区
              </p>
            </div>
          </div>
        </section>

        <button className="start-interaction-card" type="button" onClick={() => console.log("开始互动")}>
          <span className="start-interaction-card__icon" aria-hidden="true">
            <Icon name="play" />
          </span>
          <span className="start-interaction-card__copy">
            <strong>开始互动</strong>
            <small>进入数字内容，开启探索之旅</small>
          </span>
          <span className="start-interaction-card__arrow" aria-hidden="true">
            <Icon name="arrow-right" />
          </span>
        </button>
      </aside>

      <button
        className="guide-hint overview-hint"
        type="button"
        onClick={() => console.log("二维码互动提示")}
      >
        <span className="guide-hint__icon" aria-hidden="true">
          <Icon name="location" />
        </span>
        <span>提示：扫描展区或展项二维码，即可解锁专属数字内容与互动体验</span>
        <Icon name="chevron-right" />
      </button>
    </section>
  );
}
