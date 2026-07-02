import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Icon from "../components/Icon";
import PerceptionVisualStage, {
  type PerceptionMode,
  type PerceptionParameters,
  type PerceptionVisualHandle,
} from "../components/perception/PerceptionVisualStage";
import "../styles/perception.css";

type PerceptionInteractionPageProps = {
  onBack: () => void;
};

type CameraStatus = "loading" | "tracking" | "camera-only" | "simulator" | "unsupported";

type Landmark = {
  x: number;
  y: number;
  z?: number;
};

type HandsResults = {
  multiHandLandmarks?: Landmark[][];
};

type HandsInstance = {
  setOptions: (options: Record<string, number>) => void;
  onResults: (callback: (results: HandsResults) => void) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
  close?: () => void | Promise<void>;
};

type HandsConstructor = new (options: { locateFile: (file: string) => string }) => HandsInstance;

declare global {
  interface Window {
    Hands?: HandsConstructor;
    HAND_CONNECTIONS?: unknown;
    drawConnectors?: (
      context: CanvasRenderingContext2D,
      landmarks: Landmark[],
      connections: unknown,
      style: Record<string, string | number>,
    ) => void;
    drawLandmarks?: (
      context: CanvasRenderingContext2D,
      landmarks: Landmark[],
      style: Record<string, string | number>,
    ) => void;
  }
}

const INITIAL_PARAMETERS: PerceptionParameters = {
  spacing: 1.36,
  intensity: 1.44,
  diffusion: 1.1,
};

const MEDIAPIPE_SCRIPTS = [
  {
    id: "mediapipe-camera-utils",
    src: "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
  },
  {
    id: "mediapipe-drawing-utils",
    src: "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
  },
  {
    id: "mediapipe-hands",
    src: "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
  },
] as const;

function loadScript(id: string, source: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing ?? document.createElement("script");
    const handleLoad = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    const handleError = () => {
      script.remove();
      reject(new Error(`Unable to load ${id}`));
    };
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    if (!existing) {
      script.id = id;
      script.src = source;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  });
}

async function loadMediaPipe() {
  if (window.Hands && window.drawConnectors && window.drawLandmarks) return;
  await Promise.all(MEDIAPIPE_SCRIPTS.map((script) => loadScript(script.id, script.src)));
}

function WaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12h3l2-7 3 14 3-12 3 10 2-5h4" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4v5h5" />
      <path d="M5.4 9A8 8 0 1 1 6 16.2" />
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 8 4-8 4-8-4Z" />
      <path d="m4 7v10l8 4 8-4V7M12 11v10" />
    </svg>
  );
}

function TrailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

function ConsoleAction({
  icon,
  title,
  subtitle,
  onClick,
  pressed,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      className="perception-console-card"
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
    >
      <span className="perception-console-card__icon">{icon}</span>
      <span className="perception-console-card__copy">
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
    </button>
  );
}

const statusLabels: Record<CameraStatus, string> = {
  loading: "连接中",
  tracking: "识别中",
  "camera-only": "实时画面",
  simulator: "模拟器",
  unsupported: "不可用",
};

export default function PerceptionInteractionPage({ onBack }: PerceptionInteractionPageProps) {
  const visualRef = useRef<PerceptionVisualHandle>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const virtualControllerRef = useRef<HTMLDivElement>(null);
  const parametersRef = useRef<PerceptionParameters>(INITIAL_PARAMETERS);
  const draggingRef = useRef(false);
  const gestureTimersRef = useRef(new Map<number, number>());

  const [mode, setMode] = useState<PerceptionMode>("wave");
  const [parameters, setParameters] = useState<PerceptionParameters>(INITIAL_PARAMETERS);
  const [paused, setPaused] = useState(false);
  const [trailsEnabled, setTrailsEnabled] = useState(true);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("loading");
  const [hasTrackedHand, setHasTrackedHand] = useState(false);
  const [activeGestureRows, setActiveGestureRows] = useState<Set<number>>(() => new Set());
  const [virtualHand, setVirtualHand] = useState({ x: 0.4, y: 0.3 });

  const updateParameters = useCallback((patch: Partial<PerceptionParameters>) => {
    const next = { ...parametersRef.current, ...patch };
    parametersRef.current = next;
    visualRef.current?.setParameters(next);
    setParameters(next);
  }, []);

  const flashGesture = useCallback((row: number) => {
    setActiveGestureRows((current) => {
      if (current.has(row)) return current;
      const next = new Set(current);
      next.add(row);
      return next;
    });
    const currentTimer = gestureTimersRef.current.get(row);
    if (currentTimer) window.clearTimeout(currentTimer);
    const timer = window.setTimeout(() => {
      gestureTimersRef.current.delete(row);
      setActiveGestureRows((current) => {
        const next = new Set(current);
        next.delete(row);
        return next;
      });
    }, 360);
    gestureTimersRef.current.set(row, timer);
  }, []);

  useEffect(() => () => {
    gestureTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    gestureTimersRef.current.clear();
  }, []);

  const handleHandsResults = useCallback((results: HandsResults) => {
    const canvas = overlayRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const landmarks = results.multiHandLandmarks?.[0];
    if (!landmarks) {
      setHasTrackedHand(false);
      return;
    }
    setHasTrackedHand(true);

    if (window.drawConnectors && window.drawLandmarks) {
      window.drawConnectors(context, landmarks, window.HAND_CONNECTIONS ?? [], {
        color: "#9B5CFF",
        lineWidth: 4,
      });
      window.drawLandmarks(context, landmarks, {
        color: "#FFD36A",
        lineWidth: 1,
        radius: 5,
      });
    }

    const wrist = landmarks[0];
    const indexTip = landmarks[8];
    const indexPip = landmarks[6];
    const middleTip = landmarks[12];
    const middlePip = landmarks[10];
    const ringTip = landmarks[16];
    const ringPip = landmarks[14];
    const pinkyTip = landmarks[20];
    const pinkyPip = landmarks[18];
    if (!wrist || !indexTip || !indexPip || !middleTip || !middlePip || !ringTip || !ringPip || !pinkyTip || !pinkyPip) return;

    const handScale = Math.max(Math.hypot(wrist.x - middlePip.x, wrist.y - middlePip.y), 0.0001);
    const isFist = [indexTip, middleTip, ringTip].every((point) => (
      Math.hypot(point.x - wrist.x, point.y - wrist.y) / handScale < 1.3
    ));
    if (isFist) {
      flashGesture(4);
      updateParameters({ spacing: 0.01, intensity: 0.01, diffusion: 0.01 });
      visualRef.current?.collapseWave();
      return;
    }

    const handAngle = Math.atan2(middlePip.y - wrist.y, -(middlePip.x - wrist.x)) + Math.PI / 2;
    visualRef.current?.setHandAngle(handAngle);

    const palmOpen = indexTip.y < indexPip.y
      && middleTip.y < middlePip.y
      && ringTip.y < ringPip.y
      && pinkyTip.y < pinkyPip.y;
    if (palmOpen) {
      flashGesture(1);
      updateParameters({ diffusion: 5.5 });
    }

    const relativeX = Math.min(Math.max(1 - wrist.x, 0), 1);
    const relativeY = Math.min(Math.max(wrist.y, 0), 1);
    updateParameters({
      spacing: 0.3 + relativeX * 3.2,
      intensity: 0.3 + (1 - relativeY) * 3.2,
    });
    flashGesture(2);
    flashGesture(3);
    setVirtualHand({ x: relativeX, y: relativeY });
    visualRef.current?.triggerRipple((relativeX - 0.5) * 16, (0.5 - relativeY) * 16);
  }, [flashGesture, updateParameters]);

  useEffect(() => {
    let cancelled = false;
    let processing = false;
    let processingFrame = 0;
    let stream: MediaStream | null = null;
    let hands: HandsInstance | null = null;

    const resizeOverlay = () => {
      const canvas = overlayRef.current;
      if (!canvas) return;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    window.addEventListener("resize", resizeOverlay);

    const stopStream = () => {
      stream?.getTracks().forEach((track) => track.stop());
      stream = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    const processFrame = async () => {
      const video = videoRef.current;
      if (!processing || !video || !hands) return;
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        try {
          await hands.send({ image: video });
        } catch {
          if (!cancelled) setCameraStatus("camera-only");
        }
      }
      if (processing && !cancelled) processingFrame = window.requestAnimationFrame(processFrame);
    };

    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus("unsupported");
        return;
      }

      try {
        const nextStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: { ideal: "user" },
          },
          audio: false,
        });
        if (cancelled) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = nextStream;
        const video = videoRef.current;
        if (!video) {
          stopStream();
          return;
        }
        video.srcObject = nextStream;
        await video.play();
        resizeOverlay();
        setCameraStatus("camera-only");
      } catch {
        if (!cancelled) setCameraStatus("simulator");
        return;
      }

      try {
        await loadMediaPipe();
        if (cancelled || !window.Hands) return;
        hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        hands.onResults(handleHandsResults);
        processing = true;
        setCameraStatus("tracking");
        processingFrame = window.requestAnimationFrame(processFrame);
      } catch {
        if (!cancelled) setCameraStatus("camera-only");
      }
    };

    void start();

    return () => {
      cancelled = true;
      processing = false;
      window.cancelAnimationFrame(processingFrame);
      window.removeEventListener("resize", resizeOverlay);
      stopStream();
      if (hands?.close) void Promise.resolve(hands.close()).catch(() => undefined);
    };
  }, [handleHandsResults]);

  const selectMode = (nextMode: PerceptionMode) => {
    setMode(nextMode);
    visualRef.current?.setMode(nextMode);
  };

  const moveVirtualHand = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;
    const controller = virtualControllerRef.current;
    if (!controller) return;
    const bounds = controller.getBoundingClientRect();
    const x = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0.05), 0.95);
    const y = Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0.05), 0.95);
    setVirtualHand({ x, y });
    updateParameters({ spacing: 0.3 + x * 3.2, intensity: 0.3 + (1 - y) * 3.2 });
    flashGesture(2);
    flashGesture(3);
    visualRef.current?.triggerRipple((x - 0.5) * 16, (0.5 - y) * 16);
  };

  const resetExperiment = () => {
    parametersRef.current = INITIAL_PARAMETERS;
    setParameters(INITIAL_PARAMETERS);
    setMode("wave");
    setVirtualHand({ x: 0.4, y: 0.3 });
    visualRef.current?.reset();
  };

  const togglePause = () => {
    setPaused((current) => {
      const next = !current;
      visualRef.current?.setPaused(next);
      return next;
    });
  };

  const toggleTrails = () => {
    setTrailsEnabled((current) => {
      const next = !current;
      visualRef.current?.setTrails(next);
      return next;
    });
  };

  const cameraLabel = cameraStatus === "tracking"
    ? (hasTrackedHand ? "手势稳定" : "等待手势")
    : cameraStatus === "camera-only"
      ? "实时画面已连接"
      : cameraStatus === "loading"
        ? "正在连接设备"
        : cameraStatus === "unsupported"
          ? "设备不支持摄像头"
          : "模拟器运行中";

  return (
    <section className="perception-page" aria-labelledby="perception-title">
      <PerceptionVisualStage ref={visualRef} />

      <button className="perception-back" type="button" onClick={onBack}>
        <Icon name="arrow-right" />
        <span>返回展区总览</span>
      </button>

      <header className="perception-header">
        <div className="perception-title-block">
          <span>05 手势互动页 B：感知区 | 跳动的光波</span>
          <div>
            <h1 id="perception-title">跳动的光波</h1>
            <i>|</i>
            <strong>让光有节奏地运动</strong>
          </div>
          <p>光是一条直线，还是会跳动的波？</p>
        </div>

        <div className="perception-header-tools">
          <label className="perception-search">
            <Icon name="search" />
            <input aria-label="搜索展项或展区" placeholder="搜索展项 / 展区" />
          </label>
          <button type="button" aria-label="扫码"><Icon name="scan" /></button>
          <button type="button" aria-label="通知"><Icon name="bell" /></button>
        </div>
      </header>

      <main className="perception-content">
        <aside className="perception-glass perception-control-panel" aria-label="光波状态控制">
          <div className="perception-panel-heading">
            <WaveIcon />
            <strong>光波状态</strong>
          </div>

          <div className="perception-mode-list">
            <span className="perception-field-label">当前模式</span>
            {([
              ["wave", "光波模式", "呈现波纹扩散效果"],
              ["photon", "光点模式", "呈现光点跳动效果"],
              ["mix", "混合模式", "波纹与光点结合"],
            ] as const).map(([value, title, subtitle]) => (
              <button
                className={`perception-mode ${mode === value ? "is-active" : ""}`}
                type="button"
                aria-pressed={mode === value}
                onClick={() => selectMode(value)}
                key={value}
              >
                <span className="perception-radio"><i /></span>
                <span>
                  <strong>{title}</strong>
                  <small>{subtitle}</small>
                </span>
              </button>
            ))}
          </div>

          <div className="perception-sliders">
            {([
              ["spacing", "波纹间距"],
              ["intensity", "光点能量"],
              ["diffusion", "扩散范围"],
            ] as const).map(([key, label]) => (
              <label className="perception-slider" key={key}>
                <span>
                  <span><i />{label}</span>
                  <strong>{Math.round((parameters[key] / 2) * 100)}%</strong>
                </span>
                <input
                  type="range"
                  min="0.1"
                  max="4"
                  step="0.02"
                  value={parameters[key]}
                  onChange={(event) => updateParameters({ [key]: Number(event.target.value) })}
                />
              </label>
            ))}
          </div>
        </aside>

        <section className="perception-core" aria-label="光波粒子交互视觉">
          <span className="perception-core-reticle" aria-hidden="true"><i /></span>
        </section>

        <aside className="perception-right-column" aria-label="手势识别与说明">
          <section className="perception-glass perception-camera-panel">
            <div className="perception-camera-heading">
              <strong>手势识别 · 实时画面</strong>
              <span className={`perception-camera-state is-${cameraStatus}`}>
                <i />{statusLabels[cameraStatus]}
              </span>
            </div>

            <div className="perception-camera-frame" ref={virtualControllerRef}>
              <video ref={videoRef} autoPlay muted playsInline aria-label="实时摄像头画面" />
              <canvas ref={overlayRef} aria-label="MediaPipe 手势识别结果" />
              <button
                className="perception-virtual-hand"
                type="button"
                aria-label="拖拽虚拟手势以控制光波"
                style={{ left: `${virtualHand.x * 100}%`, top: `${virtualHand.y * 100}%` }}
                onPointerDown={(event) => {
                  draggingRef.current = true;
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={moveVirtualHand}
                onPointerUp={(event) => {
                  draggingRef.current = false;
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onPointerCancel={() => {
                  draggingRef.current = false;
                }}
              >
                <span aria-hidden="true">手</span>
              </button>
              <span className="perception-camera-help">可拖拽虚拟手势交互测试</span>
              <span className="perception-camera-label">{cameraLabel}</span>
              <i className="perception-corner perception-corner--tl" />
              <i className="perception-corner perception-corner--tr" />
              <i className="perception-corner perception-corner--bl" />
              <i className="perception-corner perception-corner--br" />
            </div>
            <span className="perception-stability">
              <i style={{ width: cameraStatus === "tracking" ? (hasTrackedHand ? "100%" : "30%") : "72%" }} />
            </span>
          </section>

          <section className="perception-glass perception-gesture-guide">
            <strong className="perception-gesture-title">手势说明</strong>
            {([
              [1, "手", "伸展手掌", "增大扩散范围", "波动爆发"],
              [2, "↔", "左右移动", "调整波纹间距", "间距缩放"],
              [3, "↕", "上下移动", "调整光点能量", "能量调幅"],
              [4, "拳", "握拳", "重置光波效果", "脉冲重置"],
            ] as const).map(([row, symbol, title, subtitle, action]) => (
              <div className={`perception-gesture-row ${activeGestureRows.has(row) ? "is-active" : ""}`} key={row}>
                <span className="perception-gesture-symbol">{symbol}</span>
                <span className="perception-gesture-copy">
                  <strong>{title}</strong>
                  <small>{subtitle}</small>
                </span>
                <em>{action}</em>
              </div>
            ))}
          </section>
        </aside>
      </main>

      <footer className="perception-footer">
        <div className="perception-console">
          <button className="perception-master-pulse" type="button" aria-label="触发光波脉冲" onClick={() => visualRef.current?.pulse()}>
            <span><Icon name="play" /></span>
          </button>
          <ConsoleAction
            icon={paused ? <Icon name="play" /> : <span className="perception-pause-icon" />}
            title="开始 / 暂停"
            subtitle="启动或暂停光波"
            onClick={togglePause}
            pressed={paused}
          />
          <ConsoleAction icon={<ResetIcon />} title="重置实验" subtitle="恢复初始状态" onClick={resetExperiment} />
          <ConsoleAction icon={<ViewIcon />} title="切换视角" subtitle="多视角观察光波" onClick={() => visualRef.current?.cycleView()} />
          <button className="perception-console-card perception-trail-toggle" type="button" onClick={toggleTrails} aria-pressed={trailsEnabled}>
            <span className="perception-console-card__icon"><TrailIcon /></span>
            <span className="perception-console-card__copy">
              <strong>粒子轨迹</strong>
              <small>显示能量轨迹</small>
            </span>
            <span className={`perception-switch ${trailsEnabled ? "is-on" : ""}`}><i /></span>
          </button>
        </div>

        <div className="perception-complete-bar">
          <span className="perception-complete-spark" aria-hidden="true">✦</span>
          <strong>探索完成！</strong>
          <p>同一道光，在不同观察方式下会呈现不同样子：有时像波一样扩散，有时像一个个小光点传递能量。</p>
          <button type="button" onClick={() => console.log("继续探索")}>继续探索 <Icon name="chevron-right" /></button>
        </div>
      </footer>
    </section>
  );
}
