import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MAP_MODEL_URL } from "../../config/mapAssets";

const EMISSIVE_NAME = /(light|glow|screen|path|line|neon)/i;

function tuneMaterial(material: THREE.Material, meshName: string) {
  const next = material.clone();

  if (next instanceof THREE.MeshStandardMaterial) {
    const materialIdentity = `${next.name} ${meshName}`;

    next.metalness = Math.max(next.metalness, 0.5);
    next.roughness = THREE.MathUtils.clamp(next.roughness, 0.27, 0.42);
    next.envMapIntensity = 1.9;
    next.color.lerp(new THREE.Color("#304b91"), 0.08);
    next.toneMapped = true;

    if (EMISSIVE_NAME.test(materialIdentity)) {
      next.emissive.set("#b8d8ff");
      next.emissiveIntensity = Math.max(next.emissiveIntensity, 1.8);
    } else if (next.emissive.getHex() !== 0) {
      next.emissiveIntensity = Math.max(next.emissiveIntensity, 0.9);
    } else if (next.map) {
      // The supplied model uses one baked PBR material. Reusing its color map as a
      // low-intensity emissive map lifts screens and neon paths without flattening shadows.
      next.emissiveMap = next.map;
      next.emissive.set("#7ca8ff");
      next.emissiveIntensity = 0.34;
    }

    next.needsUpdate = true;
  }

  return next;
}

export default function MapModel() {
  const { scene } = useGLTF(MAP_MODEL_URL);

  const prepared = useMemo(() => {
    const model = scene.clone(true);

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = true;
      child.receiveShadow = true;
      child.material = Array.isArray(child.material)
        ? child.material.map((material) => tuneMaterial(material, child.name))
        : tuneMaterial(child.material, child.name);
    });

    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z, 0.001);
    const scale = 8.55 / largestDimension;

    model.position.sub(center);

    return { model, scale };
  }, [scene]);

  return (
    <group scale={prepared.scale} position={[0, 0.02, 0]}>
      <primitive object={prepared.model} />
    </group>
  );
}
