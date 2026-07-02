import { useState, type ReactNode } from "react";
import Icon from "../components/Icon";
import "../styles/settings-lite.css";

type NarrationMode = "儿童版" | "标准版" | "深度版";
type LanguageMode = "中文" | "English";
type FontSizeMode = "小" | "中" | "大";
type DialogKind = "tutorial" | "return" | "privacy" | null;
type SettingsGlyphName = "experience" | "display" | "guide" | "privacy" | "clear" | "return";

const EXPERIENCE_STORAGE_PREFIXES = ["quantum-", "quantum_", "museum-", "museum_", "guide-", "guide_"];

function SettingsGlyph({ name }: { name: SettingsGlyphName }) {
  const glyphs: Record<SettingsGlyphName, ReactNode> = {
    experience: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.2 2.5 3.4 5.3 3.4 8.5S14.2 18 12 20.5M12 3.5C9.8 6 8.6 8.8 8.6 12s1.2 6 3.4 8.5" />
      </>
    ),
    display: (
      <>
        <rect x="3.5" y="5" width="17" height="13" rx="2.2" />
        <path d="M8 21h8M12 18v3M7.5 9h9M7.5 13h5" />
      </>
    ),
    guide: (
      <>
        <path d="M5 14v-2a7 7 0 0 1 14 0v2" />
        <rect x="3.8" y="13.2" width="3.4" height="5" rx="1.2" />
        <rect x="16.8" y="13.2" width="3.4" height="5" rx="1.2" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    privacy: (
      <>
        <path d="M12 3.5 19 6.2v5.1c0 4.6-2.7 7.7-7 9.2-4.3-1.5-7-4.6-7-9.2V6.2Z" />
        <path d="m9 12 2 2.1 4.2-4.6" />
      </>
    ),
    clear: (
      <>
        <path d="m15.8 3.5 4.7 4.7-8 8-4.7-4.7Z" />
        <path d="M10 14.2 5.2 19M4 20h9.5" />
      </>
    ),
    return: (
      <>
        <rect x="6.5" y="3.5" width="11" height="8" rx="1.5" />
        <path d="M4 19c2.2-2.6 4.5-4 7-4h7l-2.2 4H11l-3 2.5H3Z" />
        <path d="M10 7.5h4" />
      </>
    ),
  };

  return (
    <svg className="settings-lite-glyph" viewBox="0 0 24 24" aria-hidden="true">
      {glyphs[name]}
    </svg>
  );
}

function SegmentControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="settings-lite-segment" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          className={option === value ? "is-active" : ""}
          key={option}
          type="button"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ToggleControl({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      className={`settings-lite-toggle${checked ? " is-on" : ""}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span>{checked ? "开" : "关"}</span>
      <i aria-hidden="true" />
    </button>
  );
}

function ModuleCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: SettingsGlyphName;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="settings-lite-module">
      <header>
        <span className="settings-lite-module__icon" aria-hidden="true"><SettingsGlyph name={icon} /></span>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </header>
      <div className="settings-lite-module__body">{children}</div>
    </section>
  );
}

function SettingLine({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="settings-lite-line">
      <strong>{label}</strong>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [narrationMode, setNarrationMode] = useState<NarrationMode>("标准版");
  const [languageMode, setLanguageMode] = useState<LanguageMode>("中文");
  const [fontSize, setFontSize] = useState<FontSizeMode>("中");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [subtitles, setSubtitles] = useState(true);
  const [voice, setVoice] = useState(true);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [feedback, setFeedback] = useState("");

  const applyHighContrast = (enabled: boolean) => {
    setHighContrast(enabled);
    document.documentElement.classList.toggle("guide-high-contrast", enabled);
  };

  const applyReducedMotion = (enabled: boolean) => {
    setReducedMotion(enabled);
    document.documentElement.classList.toggle("reduced-motion", enabled);
  };

  const restartTutorial = () => setDialog("tutorial");
  const showReturnGuide = () => setDialog("return");

  const clearStoredExperience = () => {
    sessionStorage.clear();
    for (const key of Object.keys(localStorage)) {
      if (EXPERIENCE_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        localStorage.removeItem(key);
      }
    }
  };

  const clearSessionData = () => {
    clearStoredExperience();
    setFeedback("本次体验记录已清除");
  };

  const endExperience = () => {
    clearStoredExperience();
    setFeedback("本次体验已结束，正在返回欢迎页…");
    window.setTimeout(() => window.location.reload(), 900);
  };

  const dialogContent: Record<Exclude<DialogKind, null>, { title: string; body: ReactNode }> = {
    tutorial: {
      title: "操作教程",
      body: (
        <ol className="settings-lite-tutorial-list">
          <li><strong>拖动地图</strong><span>单指旋转，双指缩放与平移</span></li>
          <li><strong>切换展区</strong><span>使用左侧导航或展区快捷入口</span></li>
          <li><strong>开启互动</strong><span>扫描展项二维码进入数字体验</span></li>
          <li><strong>返回页面</strong><span>使用页面左上角返回按钮退出互动</span></li>
        </ol>
      ),
    },
    return: {
      title: "设备归还指引",
      body: (
        <div className="settings-lite-return-guide">
          <SettingsGlyph name="return" />
          <p>探索结束后，请携带 iPad 前往入口服务台，由工作人员确认设备状态并完成归还。</p>
          <strong>归还位置：量子探微馆入口服务台</strong>
        </div>
      ),
    },
    privacy: {
      title: "隐私说明",
      body: <p className="settings-lite-privacy-copy">本设备仅保存本次参观所需的临时设置、探索进度与收藏记录。清除记录或结束体验后，相关本地数据将被移除。</p>,
    },
  };

  return (
    <section className="settings-lite-layout" aria-labelledby="settings-title">
      <header className="settings-lite-heading">
        <h1 id="settings-title">设置</h1>
        <p>调整本次参观体验与离场选项</p>
      </header>

      <div className="settings-lite-grid" aria-label="设置选项">
        <ModuleCard icon="experience" title="当前体验" subtitle="调整本次参观的语言与讲解深度">
          <SettingLine label="讲解模式">
            <SegmentControl
              label="讲解模式"
              options={["儿童版", "标准版", "深度版"] as const}
              value={narrationMode}
              onChange={setNarrationMode}
            />
          </SettingLine>
          <SettingLine label="语言">
            <SegmentControl
              label="语言"
              options={["中文", "English"] as const}
              value={languageMode}
              onChange={setLanguageMode}
            />
          </SettingLine>
        </ModuleCard>

        <ModuleCard icon="display" title="显示辅助" subtitle="优化文字、对比度与动画舒适度">
          <SettingLine label="字号">
            <SegmentControl
              label="字号"
              options={["小", "中", "大"] as const}
              value={fontSize}
              onChange={setFontSize}
            />
          </SettingLine>
          <SettingLine label="高对比模式">
            <ToggleControl label="高对比模式" checked={highContrast} onChange={applyHighContrast} />
          </SettingLine>
          <SettingLine label="减少动效">
            <ToggleControl label="减少动效" checked={reducedMotion} onChange={applyReducedMotion} />
          </SettingLine>
        </ModuleCard>

        <ModuleCard icon="guide" title="讲解辅助" subtitle="控制字幕、语音与操作教程">
          <div className="settings-lite-assist-toggles">
            <SettingLine label="字幕">
              <ToggleControl label="字幕" checked={subtitles} onChange={setSubtitles} />
            </SettingLine>
            <SettingLine label="语音">
              <ToggleControl label="语音" checked={voice} onChange={setVoice} />
            </SettingLine>
          </div>
          <button className="settings-lite-secondary-button" type="button" onClick={restartTutorial}>
            重新查看教程 <Icon name="chevron-right" />
          </button>
        </ModuleCard>

        <ModuleCard icon="privacy" title="离场与隐私" subtitle="归还设备前清除本次体验记录">
          <div className="settings-lite-exit-actions">
            <button type="button" onClick={showReturnGuide}><SettingsGlyph name="return" />归还指引</button>
            <button type="button" onClick={clearSessionData}><SettingsGlyph name="clear" />一键清除</button>
            <button className="is-primary" type="button" onClick={endExperience}>结束体验</button>
          </div>
          <button className="settings-lite-text-button" type="button" onClick={() => setDialog("privacy")}>查看隐私说明</button>
        </ModuleCard>
      </div>

      <aside className="settings-lite-summary" aria-label="本次体验状态">
        <header>
          <span aria-hidden="true"><SettingsGlyph name="experience" /></span>
          <div><h2>本次体验状态</h2><p>设置将实时应用于当前参观</p></div>
        </header>
        <dl>
          <div><dt>当前语言</dt><dd>{languageMode}</dd></div>
          <div><dt>讲解模式</dt><dd>{narrationMode}</dd></div>
          <div><dt>字幕</dt><dd className={subtitles ? "is-on" : ""}>{subtitles ? "已开启" : "未开启"}</dd></div>
          <div><dt>语音</dt><dd className={voice ? "is-on" : ""}>{voice ? "已开启" : "未开启"}</dd></div>
          <div><dt>高对比</dt><dd className={highContrast ? "is-on" : ""}>{highContrast ? "已开启" : "未开启"}</dd></div>
          <div><dt>归还提醒</dt><dd className="is-on">已开启</dd></div>
        </dl>
        <button className="settings-lite-end-button" type="button" onClick={endExperience}>
          结束本次体验并清除记录
          <Icon name="arrow-right" />
        </button>
      </aside>

      <div className="settings-lite-hint">
        <span aria-hidden="true">!</span>
        <p>设置仅影响本次 iPad 使用，归还后将自动恢复默认状态</p>
      </div>

      {dialog ? (
        <div className="settings-lite-dialog-backdrop" role="presentation" onMouseDown={() => setDialog(null)}>
          <section
            className="settings-lite-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <h2 id="settings-dialog-title">{dialogContent[dialog].title}</h2>
              <button type="button" aria-label="关闭" onClick={() => setDialog(null)}>×</button>
            </header>
            {dialogContent[dialog].body}
            <button className="settings-lite-dialog-confirm" type="button" onClick={() => setDialog(null)}>我知道了</button>
          </section>
        </div>
      ) : null}

      {feedback ? (
        <div className="settings-lite-feedback" role="status">
          <span aria-hidden="true">✓</span>{feedback}
          <button type="button" aria-label="关闭提示" onClick={() => setFeedback("")}>×</button>
        </div>
      ) : null}
    </section>
  );
}
