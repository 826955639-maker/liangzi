import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import CreationScene, {
  type CreationResult,
  type CreationSceneHandle,
} from "../components/creation/CreationScene";
import useCreationAudio from "../components/creation/useCreationAudio";
import "../styles/creation-interaction.css";

type CreationInteractionPageProps = {
  onBack: () => void;
};

type ExperimentState = "A" | "B" | "C";
type CameraStatus = "idle" | "loading" | "tracking" | "camera-only" | "unavailable";

type Landmark = { x: number; y: number; z?: number };
type HandsResults = { multiHandLandmarks?: Landmark[][] };
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
  }
}

const CHARGE_DURATION = 2500;
const HANDS_SCRIPT = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js";
const CAMERA_SCRIPT = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js";

function loadScript(id: string, source: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => {
      script.remove();
      reject(new Error(`Unable to load ${id}`));
    }, { once: true });
    if (!existing) {
      script.id = id;
      script.src = source;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  });
}

async function loadCreationMediaPipe() {
  if (window.Hands) return;
  await Promise.all([
    loadScript("mediapipe-camera-utils", CAMERA_SCRIPT),
    loadScript("mediapipe-hands", HANDS_SCRIPT),
  ]);
}

function AtomIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="10" ry="3.7" transform="rotate(45 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="3.7" transform="rotate(-45 12 12)" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h4l5 4V6L8 10Z" />
      {muted ? <path d="m17 9 4 6M21 9l-4 6" /> : <path d="M16 9c1.5 1.6 1.5 4.4 0 6M19 6c3 3.3 3 8.7 0 12" />}
    </svg>
  );
}

function HandSymbol({ type }: { type: "open" | "scan" | "fist" | "rotate" }) {
  const labels = { open: "手", scan: "↔", fist: "拳", rotate: "旋" } as const;
  return <span aria-hidden="true">{labels[type]}</span>;
}

const stateCopy = {
  A: ["未观察", "猫咪处于生死叠加态中"],
  B: ["观察中", "外界干涉中，粒子概率波振荡"],
  C: ["已观察", "波函数坍缩，命运已定格"],
} as const;

export default function CreationInteractionPage({ onBack }: CreationInteractionPageProps) {
  const sceneRef = useRef<CreationSceneHandle>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handCanvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<ExperimentState>("A");
  const progressRef = useRef(0);
  const resultRef = useRef<CreationResult | null>(null);
  const resultHistoryRef = useRef<CreationResult[]>([]);
  const gestureRef = useRef({ fist: false, fistFrames: 0, openFrames: 0, missingFrames: 0 });
  const timersRef = useRef<number[]>([]);

  const [launched, setLaunched] = useState(false);
  const [experimentState, setExperimentState] = useState<ExperimentState>("A");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CreationResult | null>(null);
  const [resultVisible, setResultVisible] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle");
  const [handStatus, setHandStatus] = useState("正在初始化摄像头...");
  const [muted, setMutedState] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [glitching, setGlitching] = useState(false);
  const [logs, setLogs] = useState<string[]>(["[00:00:00] 等待量子相控仪激活..."]);
  const [probability, setProbability] = useState({ alive: 50, dead: 50 });

  const addLog = useCallback((message: string) => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((current) => [...current.slice(-24), `[${time}] ${message}`]);
  }, []);

  const { initialize: initializeAudio, transition: transitionAudio, sweep: sweepAudio, setMuted } = useCreationAudio(addLog);

  const resetExperiment = useCallback((writeResetLog = false) => {
    stateRef.current = "A";
    progressRef.current = 0;
    resultRef.current = null;
    gestureRef.current = { fist: false, fistFrames: 0, openFrames: 0, missingFrames: 0 };
    setExperimentState("A");
    setProgress(0);
    setResult(null);
    setResultVisible(false);
    sceneRef.current?.reset();
    transitionAudio("A");
    if (writeResetLog) addLog("系统受到物理重置，波函数复原。");
  }, [addLog, transitionAudio]);

  const transitionState = useCallback((nextState: ExperimentState) => {
    const oldState = stateRef.current;
    if (oldState === nextState) return;

    if (nextState === "A") {
      addLog(`系统状态变更：[${stateCopy[oldState][0]}] -> [未观察]`);
      resetExperiment(false);
      return;
    }

    if (nextState === "B") {
      stateRef.current = "B";
      progressRef.current = 0;
      setExperimentState("B");
      setProgress(0);
      setResultVisible(false);
      sceneRef.current?.beginMeasurement();
      transitionAudio("B");
      addLog(`系统状态变更：[${stateCopy[oldState][0]}] -> [观察中]`);
      return;
    }

    if (progressRef.current < 100) {
      addLog("看得不够仔细！视线聚焦不够，系统归回波函数叠加态。");
      resetExperiment(false);
      return;
    }

    let nextResult: CreationResult = Math.random() < 0.5 ? "alive" : "dead";
    const history = resultHistoryRef.current;
    if (history.length >= 2 && history.at(-1) === history.at(-2)) {
      nextResult = history.at(-1) === "alive" ? "dead" : "alive";
    }
    history.push(nextResult);
    if (history.length > 4) history.shift();

    stateRef.current = "C";
    resultRef.current = nextResult;
    setExperimentState("C");
    setResult(nextResult);
    sceneRef.current?.collapse(nextResult);
    transitionAudio("C", nextResult);
    addLog(`波函数崩溃！观测结果是：[${nextResult === "alive" ? "猫咪还活着！" : "猫咪安详沉睡"}]`);
    setGlitching(true);
    timersRef.current.push(window.setTimeout(() => setGlitching(false), 250));
    timersRef.current.push(window.setTimeout(() => setResultVisible(true), 200));
  }, [addLog, resetExperiment, transitionAudio]);

  useEffect(() => {
    if (experimentState !== "B") return;
    const startedAt = performance.now() - (progressRef.current / 100) * CHARGE_DURATION;
    let frame = 0;
    const update = (time: number) => {
      const next = Math.min(100, ((time - startedAt) / CHARGE_DURATION) * 100);
      progressRef.current = next;
      setProgress(next);
      sceneRef.current?.updateProgress(next);
      sweepAudio(next);
      frame = window.requestAnimationFrame(update);
    };
    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [experimentState, sweepAudio]);

  useEffect(() => {
    let frame = 0;
    let lastUpdate = 0;
    const update = (time: number) => {
      if (time - lastUpdate > 80) {
        lastUpdate = time;
        if (stateRef.current === "A") {
          const noise = Math.sin(time * 0.002) * 0.08;
          const alive = Math.floor((0.5 + noise) * 100);
          setProbability({ alive, dead: 100 - alive });
        } else if (stateRef.current === "B") {
          const currentProgress = progressRef.current;
          const noise = Math.sin(time * 0.05 * (1 + currentProgress / 50)) * 0.45 * (1 - currentProgress / 100);
          const alive = Math.floor((0.5 + noise) * 100);
          setProbability({ alive, dead: 100 - alive });
        } else {
          setProbability(resultRef.current === "alive" ? { alive: 100, dead: 0 } : { alive: 0, dead: 100 });
        }
      }
      frame = window.requestAnimationFrame(update);
    };
    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const drawSkeleton = useCallback((landmarks: Landmark[]) => {
    const canvas = handCanvasRef.current;
    const video = videoRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !video || !context) return;
    if (video.videoWidth && (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight)) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(168,85,247,.85)";
    context.lineWidth = 4;
    context.fillStyle = "#ec4899";
    const connections = [
      [0, 1, 2, 3, 4], [0, 5, 6, 7, 8], [0, 9, 10, 11, 12],
      [0, 13, 14, 15, 16], [0, 17, 18, 19, 20], [5, 9, 13, 17, 5],
    ];
    connections.forEach((path) => {
      context.beginPath();
      path.forEach((index, pointIndex) => {
        const point = landmarks[index];
        if (!point) return;
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;
        if (pointIndex === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.stroke();
    });
    landmarks.forEach((point) => {
      context.beginPath();
      context.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, Math.PI * 2);
      context.fill();
    });
  }, []);

  const handleHandsResults = useCallback((results: HandsResults) => {
    const landmarks = results.multiHandLandmarks?.[0];
    const gesture = gestureRef.current;
    const context = handCanvasRef.current?.getContext("2d");
    if (!landmarks) {
      if (context && handCanvasRef.current) context.clearRect(0, 0, handCanvasRef.current.width, handCanvasRef.current.height);
      gesture.missingFrames += 1;
      gesture.fistFrames = 0;
      gesture.openFrames = 0;
      setHandStatus("未检测到手势，请让单手入镜");
      if (gesture.fist && gesture.missingFrames >= 8) {
        gesture.fist = false;
        if (stateRef.current === "B") transitionState("C");
      }
      return;
    }

    drawSkeleton(landmarks);
    const tips = [8, 12, 16, 20];
    const mcps = [5, 9, 13, 17];
    const curled = tips.reduce((count, tip, index) => (
      landmarks[tip] && landmarks[mcps[index]] && landmarks[tip].y > landmarks[mcps[index]].y ? count + 1 : count
    ), 0);
    const fist = curled >= 3;
    gesture.missingFrames = 0;

    if (fist) {
      gesture.fistFrames += 1;
      gesture.openFrames = 0;
      setHandStatus("已识别：握拳，正在关盒蓄力");
      if (!gesture.fist && gesture.fistFrames >= 3) {
        gesture.fist = true;
        if (stateRef.current === "A") transitionState("B");
        else if (stateRef.current === "C") transitionState("A");
      }
    } else {
      gesture.openFrames += 1;
      gesture.fistFrames = 0;
      setHandStatus("已识别：张开手掌，触发观察");
      if (gesture.fist && gesture.openFrames >= 4) {
        gesture.fist = false;
        if (stateRef.current === "B") transitionState("C");
      }
    }
  }, [drawSkeleton, transitionState]);

  useEffect(() => {
    if (!launched) return;
    let cancelled = false;
    let processing = false;
    let processingFrame = 0;
    let stream: MediaStream | null = null;
    let hands: HandsInstance | null = null;

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
        setCameraStatus("unavailable");
        setHandStatus("当前设备不支持摄像头访问");
        return;
      }
      setCameraStatus("loading");
      addLog("激活相控传感器取景矩阵...");
      try {
        const nextStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } },
          audio: false,
        });
        if (cancelled) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = nextStream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        setCameraStatus("camera-only");
        setHandStatus("相机预览已开启，正在加载手势模型");
        addLog("相控相机连接建立，等待捕捉。");
      } catch {
        setCameraStatus("unavailable");
        setHandStatus("设备激活失败，展项仍可浏览");
        setAlertMessage("无法激活摄像头，请确认设备连接，并允许浏览器使用摄像头权限。");
        addLog("相机启动失败：权限或设备不可用");
        return;
      }

      try {
        addLog("正在同步 MediaPipe 人工智能动作检测引擎...");
        await loadCreationMediaPipe();
        if (cancelled || !window.Hands) return;
        hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.55,
          minTrackingConfidence: 0.55,
        });
        hands.onResults(handleHandsResults);
        processing = true;
        processingFrame = window.requestAnimationFrame(processFrame);
        setCameraStatus("tracking");
        setHandStatus("雷达捕捉中，等待手势");
        addLog("MediaPipe 检测引擎装载完成。");
      } catch {
        setCameraStatus("camera-only");
        setHandStatus("相机预览已开启，手势模型离线");
        addLog("相机预览已上线；MediaPipe 辅助驱动暂不可用。");
      }
    };

    void start();
    return () => {
      cancelled = true;
      processing = false;
      window.cancelAnimationFrame(processingFrame);
      stopStream();
      if (hands?.close) void Promise.resolve(hands.close()).catch(() => undefined);
    };
  }, [addLog, handleHandsResults, launched]);

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const launch = () => {
    initializeAudio();
    setLaunched(true);
    addLog("量子实验舱启动，等待相控设备授权。");
  };

  const toggleMuted = () => {
    setMutedState((current) => {
      const next = !current;
      setMuted(next);
      return next;
    });
  };

  const gaugeOffset = 163.3 - (progress / 100) * 163.3;
  const statusTitle = experimentState === "A" ? "还未开始观察" : experimentState === "B" ? "正在聚焦观察" : "观察已完成";
  const statusDescription = experimentState === "A" ? "请在镜头前握拳蓄力" : experimentState === "B" ? "保持手部动作不要动" : "再次握拳可物理重置";

  return (
    <section className={`creation-page ${glitching ? "is-glitching" : ""}`} aria-labelledby="creation-title">
      <button className="creation-back" type="button" onClick={onBack}>
        <Icon name="arrow-right" />
        <span>返回展区总览</span>
      </button>

      {!launched ? (
        <div className="creation-launch-overlay">
          <div className="creation-launch-panel">
            <span className="creation-launch-atom"><AtomIcon /></span>
            <h2>薛定谔的猫 · 量子探微实验室</h2>
            <p>
              欢迎来到前沿物理手势互动展项。本系统完全由
              <strong> AI 动作捕捉摄像头手势 </strong>
              进行无触碰操控。请准备好摄像头设备，并允许授权申请。
            </p>
            <button type="button" onClick={launch}>
              <Icon name="scan" />
              <span>开启量子相机 &amp; 声音共振</span>
            </button>
            <small>物理引擎基于 WebGL 3D 与 MediaPipe 手势追踪驱动</small>
          </div>
        </div>
      ) : null}

      <header className="creation-header">
        <div className="creation-title-line">
          <span>04 手势互动页 A：创见区</span>
          <i>|</i>
          <strong id="creation-title">薛定谔的猫</strong>
        </div>
        <div className="creation-header-tools">
          <label>
            <Icon name="search" />
            <input aria-label="搜索展项或展区" placeholder="搜索展项 / 展区" />
          </label>
          <button type="button" aria-label="扫码"><Icon name="scan" /></button>
          <button type="button" aria-label="通知"><Icon name="bell" /></button>
          <button type="button" aria-label="用户中心"><Icon name="user" /></button>
        </div>
      </header>

      <main className="creation-content">
        <aside className="creation-telemetry" aria-label="实验状态与观察指标">
          <section className="creation-glass creation-intro-card">
            <h1>薛定谔的猫</h1>
            <span>打开之前，会发生什么？</span>
            <p>核心问题：如果不打开盒子，我们能确定里面的结果吗？</p>
          </section>

          <section className="creation-glass creation-state-card">
            <span className="creation-card-label">实验状态</span>
            {(["A", "B", "C"] as ExperimentState[]).map((state) => (
              <div className={`creation-state-row ${experimentState === state ? "is-active" : ""}`} key={state}>
                <i><b /></i>
                <span><strong>{stateCopy[state][0]}</strong><small>{stateCopy[state][1]}</small></span>
              </div>
            ))}
          </section>

          <section className="creation-glass creation-strength-card">
            <span className="creation-card-label">可能性强度</span>
            <div><strong>存活 {probability.alive}%</strong><strong>死亡 {probability.dead}%</strong></div>
            <span className="creation-strength-track">
              <i className="is-alive" style={{ width: `${probability.alive}%` }} />
              <i className="is-dead" style={{ width: `${probability.dead}%` }} />
            </span>
          </section>

          <section className="creation-glass creation-progress-card">
            <span className="creation-gauge">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="26" />
                <circle cx="32" cy="32" r="26" style={{ strokeDashoffset: gaugeOffset }} />
              </svg>
              <strong>{Math.floor(progress)}%</strong>
            </span>
            <span className="creation-progress-copy">
              <small>观察进度</small>
              <strong>{statusTitle}</strong>
              <em>{statusDescription}</em>
            </span>
          </section>
        </aside>

        <section className="creation-center-scene" aria-label="量子黑箱与粒子猫">
          <CreationScene ref={sceneRef} />
          {experimentState === "B" ? (
            <div className="creation-measuring">
              <strong>正在关盒蓄力...（握拳中）</strong>
              <span><i style={{ width: `${progress}%` }} /></span>
              <small>{Math.floor(progress)}% 视线聚焦度</small>
            </div>
          ) : null}

          {experimentState === "C" && result && resultVisible ? (
            <div className="creation-result-overlay">
              <div className={`creation-result-panel is-${result}`}>
                <span>观测结果已确定</span>
                <h2>{result === "alive" ? "猫咪百分百活着！" : "猫咪去喵星了..."}</h2>
                <strong>{result === "alive" ? "|↑⟩ 量子状态：活泼伸展" : "|↓⟩ 量子状态：化为星座，安详沉睡"}</strong>
                <p>
                  {result === "alive"
                    ? "多重可能的波函数已经合并，小家伙正健康地伸展四肢。"
                    : "波函数坍缩完成，猫咪化为美丽的星空星座，安详沉眠。"}
                </p>
                <small>在摄像头前再次握拳，可将系统物理初始化</small>
              </div>
            </div>
          ) : null}

          <div className="creation-probability-hud">
            <span><small>ALIVE PROB</small><strong>存活 {probability.alive}%</strong></span>
            <i>Ψ</i>
            <span><small>DECAY PROB</small><strong>死亡 {probability.dead}%</strong></span>
          </div>
        </section>

        <aside className="creation-camera-column" aria-label="手势识别与实验日志">
          <section className="creation-glass creation-camera-card">
            <div className="creation-camera-heading">
              <strong><i />手势识别 · 实时画面</strong>
              <button type="button" aria-label={muted ? "开启声音" : "静音"} onClick={toggleMuted}><VolumeIcon muted={muted} /></button>
            </div>
            <div className="creation-camera-frame">
              <video ref={videoRef} autoPlay muted playsInline aria-label="创见区实时摄像头画面" />
              <canvas ref={handCanvasRef} aria-label="MediaPipe 手部骨骼画面" />
              <i className="creation-camera-corner is-tl" /><i className="creation-camera-corner is-tr" />
              <i className="creation-camera-corner is-bl" /><i className="creation-camera-corner is-br" />
              <span className={`creation-hand-status is-${cameraStatus}`}>{handStatus}</span>
            </div>
            <p>已启用高灵敏度抓取识别模型，请确保单只手掌在对焦框中央。</p>
          </section>

          <section className="creation-glass creation-quote-card">
            <span className="creation-quote-mark">“</span>
            <p>观察之前，盒子里保留着多种可能；观察之后，我们得到其中一个结果。</p>
            <div className="creation-system-log">
              <strong>实验观测日志</strong>
              <div>{logs.map((log, index) => <span key={`${log}-${index}`}>&gt; {log}</span>)}</div>
            </div>
          </section>
        </aside>
      </main>

      <footer className="creation-footer">
        <div className="creation-gesture-guide">
          {([
            ["open", "触发观察", "张开手掌 · 开始观察过程"],
            ["scan", "扫描盒子", "左右滑动 · 扫描盒子状态"],
            ["fist", "打开盒子", "握拳并上抬 · 揭示实验结果"],
            ["rotate", "切换假设", "旋转手掌 · 切换可能性视角"],
          ] as const).map(([type, title, subtitle]) => (
            <div key={type}>
              <HandSymbol type={type} />
              <span><strong>{title}</strong><small>{subtitle}</small></span>
            </div>
          ))}
        </div>
        <div className="creation-footer-meta">
          <span>提示：请保持在摄像头识别范围内，光线适中，手势清晰可获得更佳体验。</span>
          <span>量子科普基地 © 2026</span>
          <button type="button" onClick={() => {
            initializeAudio();
            resetExperiment(true);
          }}>系统物理重置</button>
        </div>
      </footer>

      {alertMessage ? (
        <div className="creation-alert" role="alertdialog" aria-modal="true">
          <strong>系统提示</strong>
          <p>{alertMessage}</p>
          <button type="button" onClick={() => setAlertMessage(null)}>我知道了</button>
        </div>
      ) : null}
    </section>
  );
}
