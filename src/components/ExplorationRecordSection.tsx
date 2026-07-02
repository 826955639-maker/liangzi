import { useState } from "react";
import Icon from "./Icon";
import BadgeMedal, { type BadgeType } from "./BadgeMedal";

/* ── Small line icons ── */

function IconSparkle() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 2.5c.6 3.2 1.8 4.4 5 5-3.2.6-4.4 1.8-5 5-.6-3.2-1.8-4.4-5-5 3.2-.6 4.4-1.8 5-5Z" />
      <path d="M15.5 12.5c.3 1.4.8 1.9 2.2 2.2-1.4.3-1.9.8-2.2 2.2-.3-1.4-.8-1.9-2.2-2.2 1.4-.3 1.9-.8 2.2-2.2Z" />
    </svg>
  );
}

function IconMedal() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="8" r="5" />
      <path d="m7.5 12.3-1.5 5 4-2.2 4 2.2-1.5-5" />
      <path d="m10 5.7.9 1.8 2 .3-1.45 1.4.35 2L10 10.3l-1.8.9.35-2L7.1 7.8l2-.3Z" />
    </svg>
  );
}

function IconBookHead() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4.5C3 3.7 3.7 3 4.5 3H10v14H4.5A1.5 1.5 0 0 1 3 15.5Z" />
      <path d="M10 3h5.5A1.5 1.5 0 0 1 17 4.5v11A1.5 1.5 0 0 1 15.5 17H10Z" />
      <path d="M10 3v14" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

/* Interaction row icons */
function CatSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6V4l3 3M20 6V4l-3 3" />
      <path d="M20 10c0 5-3 8-8 8S4 15 4 10c0-3.3 1.8-5 4-5h8c2.2 0 4 1.7 4 5Z" />
      <circle cx="9" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="11" r="1" fill="currentColor" stroke="none" />
      <path d="M10 14c.6.5 1 .7 2 .7s1.4-.2 2-.7" />
    </svg>
  );
}
function WaveSVG() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 25h4l3-9 5 20 5-29 5 34 5-25 4 17 3-8h4" />
    </svg>
  );
}
function MazeSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M3 9h5M3 15h4M9 3v5M15 3v4M21 9h-4M21 15h-6M9 21v-5M15 21v-4M11 9h2v6h-2z" />
    </svg>
  );
}
/* Tab icons */
function TabSmiley() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TabCap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9l10-4 10 4-10 4Z" />
      <path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" />
      <path d="M22 9v5" />
    </svg>
  );
}
function TabAtom() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-60 12 12)" />
    </svg>
  );
}

/* Next-step icons */
function IconBranch() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="5" cy="4" r="2" />
      <circle cx="5" cy="16" r="2" />
      <circle cx="15" cy="10" r="2" />
      <path d="M5 6v8M7 4h4a2 2 0 0 1 2 2v2M7 16h4a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}
function IconDocCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 2.5h7L18 7v13.5a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1Z" fill="#ffffff" fillOpacity="0.16" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M13 2.6V7.2h4.4" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="m8.6 13.4 2.1 2.1 4.1-4.6" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8.8 3.6 3.4 6v13.4l5.4-2.4 6.4 2.4 5.4-2.4V3.6l-5.4 2.4-6.4-2.4Z" fill="#ffffff" fillOpacity="0.16" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.8 3.6v13.4M15.2 6v13.4" stroke="#fff" strokeWidth="1.2" strokeOpacity="0.7" />
      <path d="M12 8.2a2.6 2.6 0 0 0-2.6 2.6c0 1.9 2.6 4.2 2.6 4.2s2.6-2.3 2.6-4.2A2.6 2.6 0 0 0 12 8.2Z" fill="#fff" />
    </svg>
  );
}

/* ── Layered-explanation thumbnails ── */
function ThumbPossibility() {
  return (
    <svg viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="rp-glow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3b1f7a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rp-cube" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <ellipse cx="65" cy="56" rx="52" ry="40" fill="url(#rp-glow)" />
      {/* ghost cat faces */}
      <g stroke="#c4b5fd" strokeWidth="1.2" fill="none" opacity="0.55">
        <path d="M32 30l-2-4 4 2M44 30l2-4-4 2" />
        <path d="M46 30c0 4-3 6-7 6s-7-2-7-6c0-3 2-4 3.5-4h7c1.5 0 3.5 1 3.5 4Z" />
        <circle cx="36.5" cy="31" r=".7" fill="#c4b5fd" />
        <circle cx="41.5" cy="31" r=".7" fill="#c4b5fd" />
      </g>
      <g stroke="#c4b5fd" strokeWidth="1.2" fill="none" opacity="0.55">
        <path d="M86 30l-2-4 4 2M98 30l2-4-4 2" />
        <path d="M100 30c0 4-3 6-7 6s-7-2-7-6c0-3 2-4 3.5-4h7c1.5 0 3.5 1 3.5 4Z" />
        <circle cx="90.5" cy="31" r=".7" fill="#c4b5fd" />
        <circle cx="95.5" cy="31" r=".7" fill="#c4b5fd" />
      </g>
      {/* central cube */}
      <g stroke="#e8dcff" strokeWidth="1.4">
        <path d="M65 40 44 50v22l21 11 21-11V50Z" fill="url(#rp-cube)" fillOpacity="0.35" />
        <path d="m44 50 21 11 21-11M65 61v22" strokeOpacity="0.7" />
      </g>
      <circle cx="65" cy="61" r="3" fill="#f4f0ff" />
      {/* sparkles */}
      <circle cx="24" cy="60" r="1.5" fill="#a78bfa" />
      <circle cx="106" cy="62" r="1.5" fill="#a78bfa" />
      <circle cx="65" cy="22" r="1.5" fill="#f59e0b" />
    </svg>
  );
}

function ThumbLightForms() {
  return (
    <svg viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="rl-wave" x1="0" x2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* left waves */}
      <g stroke="url(#rl-wave)" fill="none">
        <path d="M8 38c6-10 10 10 16 0s10 10 16 0" strokeWidth="2" />
        <path d="M8 50c6-10 10 10 16 0s10 10 16 0" strokeWidth="1.6" opacity="0.7" />
        <path d="M8 62c6-10 10 10 16 0s10 10 16 0" strokeWidth="1.2" opacity="0.45" />
      </g>
      {/* barrier slit */}
      <rect x="58" y="24" width="4" height="20" rx="2" fill="#a78bfa" />
      <rect x="58" y="56" width="4" height="20" rx="2" fill="#a78bfa" />
      {/* right circular diffraction */}
      <g stroke="#c4b5fd" fill="none">
        <path d="M64 50a18 18 0 0 1 34 0" strokeWidth="1.6" transform="rotate(-90 64 50)" opacity="0.85" />
        <path d="M64 50a28 28 0 0 1 52 0" strokeWidth="1.3" transform="rotate(-90 64 50)" opacity="0.6" />
        <path d="M64 50a38 38 0 0 1 66 0" strokeWidth="1" transform="rotate(-90 64 50)" opacity="0.4" />
      </g>
      {/* particle dots */}
      <circle cx="100" cy="30" r="2" fill="#f4f0ff" />
      <circle cx="112" cy="50" r="2" fill="#c4b5fd" />
      <circle cx="100" cy="70" r="2" fill="#f4f0ff" />
    </svg>
  );
}

function ThumbMultipath() {
  return (
    <svg viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="rm-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0d0a24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rm-trace" x1="0" x2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="130" height="100" fill="url(#rm-glow)" />
      {/* faint circuit-board grid */}
      <g stroke="#4a3a86" strokeWidth="0.5" strokeOpacity="0.3">
        <path d="M0 25h130M0 50h130M0 75h130M32 0v100M65 0v100M98 0v100" />
      </g>
      {/* right-angled circuit traces (multiple paths source→target) */}
      <g stroke="url(#rm-trace)" strokeWidth="1.6" fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d="M16 50H40V24H72V50H98V32H114" />
        <path d="M16 50H30V72H58V50" opacity="0.85" />
        <path d="M72 50V76H98V68H114" opacity="0.85" />
      </g>
      {/* solder nodes */}
      <g fill="#0d0a24" stroke="#c4b5fd" strokeWidth="1.3">
        <circle cx="40" cy="24" r="3" />
        <circle cx="72" cy="24" r="3" />
        <circle cx="72" cy="50" r="3" />
        <circle cx="30" cy="72" r="3" />
        <circle cx="58" cy="50" r="3" />
        <circle cx="98" cy="32" r="3" />
        <circle cx="98" cy="68" r="3" />
      </g>
      {/* source + target terminals */}
      <circle cx="16" cy="50" r="6" fill="#a78bfa" />
      <circle cx="16" cy="50" r="9" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.5" />
      <circle cx="114" cy="32" r="4" fill="#8b5cf6" />
      <circle cx="114" cy="68" r="4" fill="#8b5cf6" />
      {/* travelling pulses */}
      <circle cx="55" cy="24" r="1.6" fill="#fbe7a6" />
      <circle cx="98" cy="50" r="1.4" fill="#fff" opacity="0.8" />
    </svg>
  );
}

/* ── Data ── */
const completed = [
  { id: "cat", title: "薛定谔的猫", desc: "理解叠加态与观测效应", glyph: <CatSVG /> },
  { id: "wave", title: "跳动的光波", desc: "探索光的波动性与干涉", glyph: <WaveSVG /> },
  { id: "maze", title: "量子迷宫", desc: "体验多路径与概率分布", glyph: <MazeSVG /> },
];

const badges: Array<{ id: string; title: string; desc: string; medal: BadgeType }> = [
  { id: "observer", title: "观察者徽章", desc: "理解观测如何影响结果", medal: "eye" },
  { id: "wave", title: "光波探索徽章", desc: "掌握光的波动性知识", medal: "wave" },
  { id: "maze", title: "迷宫挑战徽章", desc: "完成多路径探索挑战", medal: "maze" },
];

const tabs = [
  { id: "kid", title: "儿童版", sub: "轻松有趣", glyph: <TabSmiley /> },
  { id: "normal", title: "普通版", sub: "通俗易懂", glyph: <TabCap /> },
  { id: "deep", title: "深度版", sub: "专业深入", glyph: <TabAtom /> },
] as const;

const levels = [
  {
    num: "01",
    title: "多种可能",
    desc: "在被观测前，粒子可以同时处于多种状态，这就是叠加态。",
    tags: ["叠加态", "量子态"],
    thumb: <ThumbPossibility />,
  },
  {
    num: "02",
    title: "光的两种样子",
    desc: "光既能像波一样产生干涉，又能像粒子一样被探测，展现出波粒二象性。",
    tags: ["波动性", "粒子性"],
    thumb: <ThumbLightForms />,
  },
  {
    num: "03",
    title: "多路径探索",
    desc: "粒子可以同时经过多条路径，不同路径的干涉决定了最终出现的概率分布。",
    tags: ["干涉", "概率"],
    thumb: <ThumbMultipath />,
  },
];

type ExplorationRecordSectionProps = {
  onViewReport?: () => void;
  onReturnToMap?: () => void;
};

export default function ExplorationRecordSection({ onViewReport, onReturnToMap }: ExplorationRecordSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("normal");

  return (
    <section className="record-section" aria-label="探索记录详情">
      {/* Left column */}
      <div className="rec-left">
        {/* 本次完成互动 */}
        <article className="rec-card">
          <header className="rec-head">
            <span className="rec-head__icon"><IconSparkle /></span>
            <div>
              <h2>本次完成互动</h2>
              <p>你已完成 3 项互动探索</p>
            </div>
          </header>
          <ul className="rec-done-list">
            {completed.map((item) => (
              <li key={item.id}>
                <span className="rec-done__icon">{item.glyph}</span>
                <span className="rec-done__copy">
                  <strong>{item.title}</strong>
                  <small>{item.desc}</small>
                </span>
                <span className="rec-done__pill">
                  已完成 <IconCheck />
                </span>
              </li>
            ))}
          </ul>
        </article>

        {/* 获得徽章 */}
        <article className="rec-card">
          <header className="rec-head">
            <span className="rec-head__icon"><IconMedal /></span>
            <div>
              <h2>获得徽章</h2>
              <p>恭喜你获得 3 枚徽章</p>
            </div>
          </header>
          <div className="rec-badges">
            {badges.map((badge) => (
              <figure className="rec-badge" key={badge.id}>
                <span className="rec-badge__medal">
                  <BadgeMedal type={badge.medal} />
                </span>
                <figcaption>
                  <strong>{badge.title}</strong>
                  <small>{badge.desc}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </article>
      </div>

      {/* Right column: 分层讲解 */}
      <article className="rec-card rec-layers">
        <header className="rec-head">
          <span className="rec-head__icon"><IconBookHead /></span>
          <div>
            <h2>分层讲解</h2>
            <p>根据你的兴趣，选择适合的讲解深度</p>
          </div>
        </header>

        <div className="rec-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={activeTab === tab.id}
              className={`rec-tab${activeTab === tab.id ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="rec-tab__icon">{tab.glyph}</span>
              <span className="rec-tab__copy">
                <strong>{tab.title}</strong>
                <small>{tab.sub}</small>
              </span>
            </button>
          ))}
        </div>

        <ol className="rec-levels">
          {levels.map((level) => (
            <li className="rec-level" key={level.num}>
              <div className="rec-level__thumb">{level.thumb}</div>
              <div className="rec-level__body">
                <span className="rec-level__num">{level.num}</span>
                <h3>{level.title}</h3>
                <p>{level.desc}</p>
                <div className="rec-level__tags">
                  {level.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <button className="rec-level__arrow" type="button" aria-label={`查看${level.title}详情`}>
                <Icon name="arrow-right" />
              </button>
            </li>
          ))}
        </ol>
      </article>

      {/* 下一步 */}
      <article className="rec-card rec-next">
        <div className="rec-next__intro">
          <span className="rec-next__icon"><IconBranch /></span>
          <div>
            <h2>下一步</h2>
            <p>继续你的量子探索之旅</p>
          </div>
        </div>
        <div className="rec-next__actions">
          <button className="rec-next__action" type="button" onClick={onViewReport}>
            <span className="rec-next__action-icon"><IconDocCheck /></span>
            <span className="rec-next__action-copy">
              <strong>查看我的探索报告</strong>
              <small>回顾学习成果，生成专属报告</small>
            </span>
            <Icon name="arrow-right" className="rec-next__action-arrow" />
          </button>
          <button className="rec-next__action" type="button" onClick={onReturnToMap}>
            <span className="rec-next__action-icon"><IconMapPin /></span>
            <span className="rec-next__action-copy">
              <strong>返回地图继续探索</strong>
              <small>发现更多展项，解锁新的知识</small>
            </span>
            <Icon name="arrow-right" className="rec-next__action-arrow" />
          </button>
        </div>
      </article>
    </section>
  );
}
