import { Component, type ErrorInfo, type ReactNode, useCallback, useMemo, useState } from "react";
import Icon from "../components/Icon";
import MapScene, { type CameraCommand } from "../components/map/MapScene";
import {
  CAMERA_VIEWS,
  HOTSPOTS,
  type MapLocationId,
  type ZoneLocationId,
} from "../components/map/mapConfig";
import "../styles/map-guide.css";

type SceneBoundaryProps = { children: ReactNode };
type SceneBoundaryState = { failed: boolean };

class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("三维地图加载失败", error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return <div className="map-scene-error">三维地图加载失败，请检查模型文件。</div>;
    }

    return this.props.children;
  }
}

type MapGlyphName = "reset" | "panorama" | "creation" | "perception" | "future" | "spark";

function MapGlyph({ name }: { name: MapGlyphName }) {
  if (name === "reset") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 8.2A8 8 0 1 1 4 14" /><path d="M4.5 4.5v4.4h4.4" /></svg>
    );
  }
  if (name === "panorama") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5C5.8 5.8 8.8 5 12 5s6.2.8 9 2.5v9C18.2 18.2 15.2 19 12 19s-6.2-.8-9-2.5Z" /><path d="M8 12h8M12 8v8" /></svg>
    );
  }
  if (name === "creation") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-3.8 10.6c.8.7 1.3 1.6 1.4 2.4h4.8c.1-.8.6-1.7 1.4-2.4A6 6 0 0 0 12 3Z" /><path d="M9.5 19h5M10.5 21h3" /></svg>
    );
  }
  if (name === "perception") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.7" /></svg>
    );
  }
  if (name === "future") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 8 4 3 4-6 4 6 4-3-1.4 9H5.4Z" /><path d="M6 20h12" /></svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5Z" /></svg>
  );
}

const zoneButtons: ReadonlyArray<{ id: ZoneLocationId; label: string }> = [
  { id: "creation", label: "创见区" },
  { id: "perception", label: "感知区" },
  { id: "future", label: "引领区" },
];

export default function MapGuidePage() {
  const [activeLocation, setActiveLocation] = useState<MapLocationId>("entrance");
  const [isCameraMoving, setIsCameraMoving] = useState(false);
  const [cameraCommand, setCameraCommand] = useState<CameraCommand>(() => ({
    ...CAMERA_VIEWS.reset,
    sequence: 0,
  }));

  const currentLocation = useMemo(
    () => HOTSPOTS.find((hotspot) => hotspot.id === activeLocation) ?? HOTSPOTS[0],
    [activeLocation],
  );

  const moveCamera = useCallback((view: keyof typeof CAMERA_VIEWS) => {
    setCameraCommand((previous) => ({ ...CAMERA_VIEWS[view], sequence: previous.sequence + 1 }));
  }, []);

  const selectLocation = useCallback((location: MapLocationId) => {
    setActiveLocation(location);
    moveCamera(location);
    console.log(HOTSPOTS.find((hotspot) => hotspot.id === location)?.label ?? location);
  }, [moveCamera]);

  return (
    <section className="map-guide-layout" aria-labelledby="map-guide-title">
      <header className="map-guide-heading">
        <h1 id="map-guide-title">地图导览</h1>
        <p>拖动三维地图，快速定位展区与展项</p>
      </header>

      <div
        className="map-guide-stage"
        aria-label="量子探微馆三维空间地图"
        data-camera-state={isCameraMoving ? "moving" : "idle"}
      >
        <p className="map-guide-stage__caption">量子探微馆 · 三维空间地图</p>
        <div className="map-controls-overlay" aria-label="地图视角控制">
          <button type="button" aria-label="重置视角" title="重置视角" onClick={() => moveCamera("reset")}>
            <MapGlyph name="reset" />
          </button>
          <button type="button" aria-label="全景视角" title="全景视角" onClick={() => moveCamera("panorama")}>
            <MapGlyph name="panorama" />
          </button>
        </div>
        <div className="map-guide-stage__glow" aria-hidden="true" />
        <SceneBoundary>
          <MapScene
            activeLocation={activeLocation}
            cameraCommand={cameraCommand}
            onCameraMoveStateChange={setIsCameraMoving}
          />
        </SceneBoundary>
      </div>

      <aside className="map-guide-side" aria-label="地图导览信息">
        <section className="map-current-card">
          <div className="map-current-card__topline">
            <span className="map-current-card__pin" aria-hidden="true"><Icon name="location" /></span>
            <h2>当前位置</h2>
          </div>
          <div className="map-current-card__body">
            <div className="map-radar" aria-hidden="true"><i /><i /><span /></div>
            <div>
              <strong>{currentLocation.label === "入口" ? "入口导览区" : currentLocation.label}</strong>
              <p>{currentLocation.detail}</p>
            </div>
          </div>
        </section>

        <section className="map-zone-card">
          <h2>展区快捷定位</h2>
          <div className="map-zone-buttons">
            {zoneButtons.map((zone) => (
              <button
                key={zone.id}
                className={activeLocation === zone.id ? "is-active" : ""}
                type="button"
                aria-pressed={activeLocation === zone.id}
                onClick={() => selectLocation(zone.id)}
              >
                <span aria-hidden="true"><MapGlyph name={zone.id} /></span>
                {zone.label}
              </button>
            ))}
          </div>
        </section>

        <p className="map-gesture-note">单指旋转 · 双指缩放 · 双指平移</p>
      </aside>

      <div className="map-guide-tip">
        <span className="map-guide-tip__icon" aria-hidden="true"><Icon name="location" /></span>
        <p>拖动三维地图查看空间布局，点击展区节点可快速定位目标展项</p>
        <span className="map-guide-tip__spark" aria-hidden="true"><MapGlyph name="spark" /></span>
      </div>
    </section>
  );
}
