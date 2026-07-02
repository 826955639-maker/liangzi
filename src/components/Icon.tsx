import type { SVGProps } from "react";

export type IconName =
  | "home"
  | "map"
  | "zones"
  | "record"
  | "heart"
  | "settings"
  | "search"
  | "scan"
  | "bell"
  | "user"
  | "wifi"
  | "battery"
  | "shield"
  | "cube"
  | "play"
  | "return"
  | "arrow-right"
  | "chevron-right"
  | "location";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

export default function Icon({ name, ...props }: IconProps) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, React.ReactNode> = {
    home: (
      <>
        <path d="m3.5 10.5 8.5-7 8.5 7" />
        <path d="M5.5 9.5v10h13v-10M9.5 19.5v-6h5v6" />
      </>
    ),
    map: (
      <>
        <circle cx="12" cy="11" r="4.3" />
        <path d="M5 20.5c.6-3.1 2.8-5.1 5.1-5.5M19 20.5c-.6-3.1-2.8-5.1-5.1-5.5" />
        <path d="M4.2 4.5C2.8 6.3 2 8.6 2 11s.8 4.7 2.2 6.5M19.8 4.5C21.2 6.3 22 8.6 22 11s-.8 4.7-2.2 6.5" />
      </>
    ),
    zones: (
      <>
        <rect x="3.5" y="4" width="17" height="16" rx="2.8" />
        <path d="M7 8h4M7 12h7M7 16h5" />
        <path d="m16.2 7.7 2.2 2.2-2.2 2.2" />
      </>
    ),
    record: (
      <>
        <path d="M6 3.5h9l3 3v14H6z" />
        <path d="M14.5 3.5v4H18M9 11h6M9 14.5h6M9 18h4" />
      </>
    ),
    heart: <path d="M20.8 5.9a5.2 5.2 0 0 0-7.4 0L12 7.3l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 22l8.8-8.7a5.2 5.2 0 0 0 0-7.4Z" />,
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.9l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.9-.34 1.7 1.7 0 0 0-1 1.55V21H10v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.9.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.9l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3h4v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.9-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08a1.7 1.7 0 0 0-1.52 1Z" />
      </>
    ),
    search: (
      <>
        <circle cx="10.7" cy="10.7" r="6.7" />
        <path d="m16 16 4.2 4.2" />
      </>
    ),
    scan: (
      <>
        <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
        <path d="M7 12h10" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 8.5h18C21 15 18 15 18 8Z" />
        <path d="M14.2 20a2.5 2.5 0 0 1-4.4 0" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21c.6-4 3.2-6.4 7-6.4s6.4 2.4 7 6.4" />
      </>
    ),
    wifi: (
      <>
        <path d="M2.5 8.6a15 15 0 0 1 19 0M5.8 12a10 10 0 0 1 12.4 0M9.2 15.4a4.5 4.5 0 0 1 5.6 0" />
        <circle cx="12" cy="19" r=".8" fill="currentColor" stroke="none" />
      </>
    ),
    battery: (
      <>
        <rect x="2.5" y="6.5" width="17" height="11" rx="2" />
        <path d="M21 10v4" />
        <rect x="4.5" y="8.5" width="12.5" height="7" rx=".8" fill="currentColor" stroke="none" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.1 8.5-8 10-4.9-1.5-8-5-8-10V6Z" />
        <path d="m8.5 11.5 2.2 2.2 4.8-5" />
      </>
    ),
    cube: (
      <>
        <path d="m12 2.8 8 4.5v9.4l-8 4.5-8-4.5V7.3Z" />
        <path d="m4.5 7.6 7.5 4.3 7.5-4.3M12 12v9" />
      </>
    ),
    play: <path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none" />,
    return: (
      <>
        <rect x="6" y="3.5" width="12" height="9" rx="1.5" />
        <path d="M9.5 7.5h5M12 3.5V1.8M9.8 1.8h4.4" />
        <path d="M4 19.5c2.3-2.7 4.8-4.2 7.5-4.2H18l-2.2 4.2H11L8 22H3Z" />
      </>
    ),
    "arrow-right": <path d="M5 12h14m-5-5 5 5-5 5" />,
    "chevron-right": <path d="m9 4 8 8-8 8" />,
    location: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.2" />
      </>
    ),
  };

  return (
    <svg {...common} {...props}>
      {paths[name]}
    </svg>
  );
}
