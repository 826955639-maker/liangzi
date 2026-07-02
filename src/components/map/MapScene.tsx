import { Suspense, useCallback, useEffect, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Grid, Html, OrbitControls, Sparkles } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import MapModel from "./MapModel";
import { CAMERA_VIEWS, HOTSPOTS, type CameraView, type MapLocationId } from "./mapConfig";

export type CameraCommand = CameraView & { sequence: number };

type MapSceneProps = {
  activeLocation: MapLocationId;
  cameraCommand: CameraCommand;
  onCameraMoveStateChange: (isMoving: boolean) => void;
};

type CameraMove = {
  elapsed: number;
  duration: number;
  fromPosition: THREE.Vector3;
  toPosition: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
};

type CameraMotionProps = {
  command: CameraCommand;
  controlsRef: React.RefObject<OrbitControlsImpl>;
  activeMoveRef: MutableRefObject<CameraMove | null>;
  onMoveStateChange: (isMoving: boolean) => void;
};

function CameraMotion({ command, controlsRef, activeMoveRef, onMoveStateChange }: CameraMotionProps) {
  const { camera } = useThree();

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    // Each command creates one finite camera flight. OrbitControls remains enabled,
    // and the move reference is cleared as soon as the flight finishes.
    controls.enabled = true;
    activeMoveRef.current = {
      elapsed: 0,
      duration: 0.9,
      fromPosition: camera.position.clone(),
      toPosition: new THREE.Vector3(...command.position),
      fromTarget: controls.target.clone(),
      toTarget: new THREE.Vector3(...command.target),
    };
    onMoveStateChange(true);

    return () => {
      activeMoveRef.current = null;
    };
  }, [activeMoveRef, camera, command.sequence, controlsRef, onMoveStateChange]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    const move = activeMoveRef.current;
    if (!controls || !move) return;

    move.elapsed = Math.min(move.elapsed + delta, move.duration);
    const progress = move.elapsed / move.duration;
    const eased = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(move.fromPosition, move.toPosition, eased);
    controls.target.lerpVectors(move.fromTarget, move.toTarget, eased);
    controls.update();

    if (progress >= 1) {
      camera.position.copy(move.toPosition);
      controls.target.copy(move.toTarget);
      controls.update();
      controls.enabled = true;
      activeMoveRef.current = null;
      onMoveStateChange(false);
    }
  });

  return null;
}

function MapHotspots({ activeLocation }: Pick<MapSceneProps, "activeLocation">) {
  return (
    <>
      {HOTSPOTS.map((hotspot) => (
        <group key={hotspot.id} position={hotspot.position}>
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.072, 20, 20]} />
            <meshBasicMaterial color={activeLocation === hotspot.id ? "#ffffff" : "#a98bff"} toneMapped={false} />
          </mesh>
          <pointLight color="#b9ceff" intensity={activeLocation === hotspot.id ? 3.4 : 1.6} distance={2.4} />
          <Html center distanceFactor={8.5} position={[0, 0.34, 0]} style={{ pointerEvents: "none" }}>
            <div className={`map-hotspot${activeLocation === hotspot.id ? " is-active" : ""}`} aria-hidden="true">
              <span aria-hidden="true" />
              {hotspot.label}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

function LoadingMap() {
  return (
    <Html center>
      <div className="map-scene-loading">
        <span aria-hidden="true" />
        正在加载三维导览地图...
      </div>
    </Html>
  );
}

export default function MapScene({ activeLocation, cameraCommand, onCameraMoveStateChange }: MapSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const activeMoveRef = useRef<CameraMove | null>(null);

  const cancelCameraMove = useCallback(() => {
    if (!activeMoveRef.current) return;

    activeMoveRef.current = null;
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
      controlsRef.current.update();
    }
    onCameraMoveStateChange(false);
  }, [onCameraMoveStateChange]);

  return (
    <Canvas
      className="map-scene-canvas"
      camera={{ position: CAMERA_VIEWS.reset.position, fov: 43, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.18;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <fog attach="fog" args={["#08091d", 12, 25]} />
      <ambientLight intensity={0.9} color="#c6d4ff" />
      <hemisphereLight args={["#9fb8ff", "#090817", 1.35]} />
      <directionalLight
        castShadow
        color="#dbe5ff"
        intensity={2.8}
        position={[5, 8, 6]}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight color="#9177ff" intensity={21} distance={13} position={[-4, 3.3, -1]} />
      <pointLight color="#70caff" intensity={16} distance={12} position={[4.5, 2.8, 2.4]} />
      <pointLight color="#d7e8ff" intensity={11} distance={11} position={[0, 4.2, -4]} />

      <Grid
        position={[0, -0.16, 0]}
        args={[15, 15]}
        cellColor="#282254"
        sectionColor="#6042bb"
        cellSize={0.55}
        sectionSize={2.2}
        cellThickness={0.45}
        sectionThickness={0.8}
        fadeDistance={12}
        fadeStrength={1.5}
        infiniteGrid
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <circleGeometry args={[5.5, 72]} />
        <meshBasicMaterial color="#4c63d8" transparent opacity={0.16} depthWrite={false} />
      </mesh>

      <Suspense fallback={<LoadingMap />}>
        <MapModel />
        <MapHotspots activeLocation={activeLocation} />
        <ContactShadows position={[0, -0.11, 0]} opacity={0.48} scale={11} blur={2.8} far={4} color="#301f6e" />
      </Suspense>

      <Sparkles count={72} scale={[11, 4.5, 9]} size={1.55} speed={0.18} opacity={0.62} color="#c9dcff" />
      <CameraMotion
        command={cameraCommand}
        controlsRef={controlsRef}
        activeMoveRef={activeMoveRef}
        onMoveStateChange={onCameraMoveStateChange}
      />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        panSpeed={0.62}
        minDistance={4.8}
        maxDistance={14}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.15}
        target={CAMERA_VIEWS.reset.target}
        onStart={cancelCameraMove}
      />
    </Canvas>
  );
}
