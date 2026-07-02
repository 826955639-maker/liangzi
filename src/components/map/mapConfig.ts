export type MapLocationId = "entrance" | "creation" | "perception" | "future";
export type ZoneLocationId = Exclude<MapLocationId, "entrance">;

export type MapHotspot = {
  id: MapLocationId;
  label: string;
  detail: string;
  position: [number, number, number];
};

export type CameraView = {
  position: [number, number, number];
  target: [number, number, number];
};

export const HOTSPOTS: readonly MapHotspot[] = [
  {
    id: "entrance",
    label: "入口",
    detail: "请从入口走廊进入展区",
    position: [-2.85, 0.34, 2.25],
  },
  {
    id: "creation",
    label: "创见区",
    detail: "观察与灵感的认知起点",
    position: [-2.1, 0.34, 0.28],
  },
  {
    id: "perception",
    label: "感知区",
    detail: "在互动中感受量子现象",
    position: [0.15, 0.34, -0.72],
  },
  {
    id: "future",
    label: "引领区",
    detail: "探索量子科技的未来应用",
    position: [2.45, 0.34, 0.42],
  },
] as const;

export const CAMERA_VIEWS: Record<"reset" | "panorama" | MapLocationId, CameraView> = {
  reset: { position: [7.2, 6.1, 8.2], target: [0, 0, 0] },
  panorama: { position: [0.15, 10.2, 7.4], target: [0, -0.1, 0] },
  entrance: { position: [5.9, 5.3, 8.7], target: [-2.25, 0, 1.6] },
  creation: { position: [5.5, 4.7, 7.4], target: [-1.85, 0, 0.15] },
  perception: { position: [6.8, 4.8, 6.4], target: [0.15, 0, -0.55] },
  future: { position: [7.9, 4.9, 5.3], target: [2.15, 0, 0.25] },
};
