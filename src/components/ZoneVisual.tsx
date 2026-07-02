export type ZoneVisualType = "creation" | "perception" | "future";

type ZoneVisualProps = {
  type: ZoneVisualType;
};

function CreationVisual() {
  return (
    <svg className="zone-visual zone-visual--creation" viewBox="0 0 420 190" aria-hidden="true">
      <defs>
        <radialGradient id="creation-energy" cx="55%" cy="69%" r="58%">
          <stop offset="0" stopColor="#e2d7ff" stopOpacity=".72" />
          <stop offset=".24" stopColor="#9a6cff" stopOpacity=".42" />
          <stop offset=".62" stopColor="#5f38c8" stopOpacity=".13" />
          <stop offset="1" stopColor="#2c165e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="creation-cube" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#7450dc" stopOpacity=".32" />
          <stop offset=".48" stopColor="#e1d7ff" stopOpacity=".92" />
          <stop offset="1" stopColor="#7651e5" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id="creation-orbit" x1="0" x2="1">
          <stop stopColor="#5837bc" stopOpacity=".08" />
          <stop offset=".4" stopColor="#956bff" stopOpacity=".72" />
          <stop offset=".7" stopColor="#eee8ff" stopOpacity=".92" />
          <stop offset="1" stopColor="#6944d7" stopOpacity=".12" />
        </linearGradient>
        <filter id="creation-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <ellipse className="zone-visual__energy" cx="250" cy="139" rx="145" ry="53" fill="url(#creation-energy)" />

      <g className="zone-visual__orbits" fill="none" stroke="url(#creation-orbit)">
        <ellipse cx="246" cy="121" rx="150" ry="37" transform="rotate(-10 246 121)" strokeWidth="1.1" />
        <ellipse cx="246" cy="121" rx="141" ry="31" transform="rotate(12 246 121)" strokeWidth=".8" opacity=".72" />
        <ellipse cx="246" cy="121" rx="115" ry="58" transform="rotate(24 246 121)" strokeWidth=".75" opacity=".54" />
        <ellipse cx="246" cy="121" rx="103" ry="68" transform="rotate(-34 246 121)" strokeWidth=".65" opacity=".35" />
        <path d="M83 146c67-2 112-37 154-69 40-31 87-32 132-11" strokeWidth="1.1" opacity=".5" />
      </g>

      <g className="zone-visual__cube" fill="none" stroke="url(#creation-cube)" strokeWidth="1.25">
        <path d="m210 38 86 8 1 93-85-7Z" />
        <path d="m210 38 38-18 87 8-39 18M297 46l38-18v91l-38 20M212 132l37-19 86 6" />
        <path d="M248 20v93M210 84l87 7M296 91l39-17" opacity=".3" />
        <path d="m212 132 0-94M249 113l-1-93M335 119V28" opacity=".24" />
      </g>

      <g className="zone-visual__cat" fill="#080719" stroke="#aa89ff" strokeWidth="1.25">
        <path d="M244 80c-5-14-1-26 9-32l-1-11 9 7 10-7-2 12c10 7 13 20 7 32-4 9-4 20 1 31h-45c6-11 7-23 2-32Z" />
        <path d="M276 101c16-4 28 2 28 13 0 9-11 14-18 8 11 2 13-9 6-12-6-3-12 2-16 7" fill="none" />
        <path d="M238 112c-6 6-9 13-9 20M273 112c7 5 10 12 10 20" fill="none" opacity=".75" />
        <circle cx="256" cy="57" r="1.5" fill="#f7f2ff" stroke="none" />
        <circle cx="266" cy="57" r="1.5" fill="#f7f2ff" stroke="none" />
      </g>

      <g className="zone-visual__stars" fill="#c9b7ff">
        <circle cx="96" cy="121" r="2.2" />
        <circle cx="126" cy="77" r="1.3" />
        <circle cx="157" cy="139" r="1.7" />
        <circle cx="189" cy="58" r="1.4" />
        <circle cx="325" cy="61" r="1.7" />
        <circle cx="365" cy="100" r="2.4" />
        <circle cx="338" cy="151" r="1.5" />
        <circle cx="283" cy="166" r="1.2" />
      </g>
      <g className="zone-visual__sparkles" fill="#fff">
        <path d="m121 105 1.8 4.2 4.2 1.8-4.2 1.8-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8Z" />
        <path d="m343 78 1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2Z" />
      </g>
      <circle className="zone-visual__moving-dot zone-visual__moving-dot--one" cx="145" cy="88" r="3" fill="#e8dfff" />
      <circle className="zone-visual__moving-dot zone-visual__moving-dot--two" cx="324" cy="132" r="2.6" fill="#aa80ff" />
      <ellipse cx="249" cy="147" rx="54" ry="9" fill="#9d71ff" opacity=".22" filter="url(#creation-soft-glow)" />
    </svg>
  );
}

function PerceptionVisual() {
  return (
    <svg className="zone-visual zone-visual--perception" viewBox="0 0 420 190" aria-hidden="true">
      <defs>
        <linearGradient id="perception-wave" x1="0" x2="1">
          <stop stopColor="#6a45d2" stopOpacity=".12" />
          <stop offset=".4" stopColor="#f1ecff" />
          <stop offset=".7" stopColor="#ba8dff" />
          <stop offset="1" stopColor="#d468e7" stopOpacity=".34" />
        </linearGradient>
        <radialGradient id="perception-glow" cx="73%" cy="55%" r="42%">
          <stop stopColor="#b57cff" stopOpacity=".4" />
          <stop offset="1" stopColor="#6f43dc" stopOpacity="0" />
        </radialGradient>
        <filter id="perception-wave-glow" x="-30%" y="-80%" width="180%" height="260%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      <ellipse cx="305" cy="101" rx="103" ry="71" fill="url(#perception-glow)" />
      <g className="zone-visual__grid" fill="none" stroke="#7254ca" strokeWidth=".52">
        <path d="M31 167h362M52 148h318M73 130h276M94 113h232" />
        <path d="M31 167 137 113M94 167l74-54M160 167l39-54M228 167l3-54M296 167l-34-54M363 167l-70-54" />
      </g>

      <path className="zone-visual__wave-glow" d="M31 110c27 0 28-58 54-58s26 93 52 93 26-105 53-105 25 84 51 84 29-50 57-50" fill="none" stroke="#bca0ff" strokeWidth="5" opacity=".2" filter="url(#perception-wave-glow)" />
      <g className="zone-visual__wave" fill="none" stroke="url(#perception-wave)" strokeLinecap="round">
        <path d="M31 110c27 0 28-58 54-58s26 93 52 93 26-105 53-105 25 84 51 84 29-50 57-50" strokeWidth="2.35" />
        <path d="M31 120c27 0 28-47 54-47s26 75 52 75 26-84 53-84 25 67 51 67 29-40 57-40" strokeWidth=".9" opacity=".58" />
        <path d="M31 98c27 0 28-70 54-70s26 112 52 112 26-126 53-126 25 101 51 101 29-61 57-61" strokeWidth=".7" opacity=".28" />
      </g>

      <g className="zone-visual__prism" fill="rgba(126,83,228,.05)" stroke="#ae8cff" strokeWidth="1.15">
        <path d="m302 39 43 92-91-15Z" />
        <path d="m302 39 8 68 35 24M254 116l56-9" fill="none" opacity=".74" />
        <path d="m302 39-17 66 25 2Z" fill="rgba(202,181,255,.08)" opacity=".72" />
      </g>

      <g className="zone-visual__rays" fill="none" strokeLinecap="round">
        <path d="M236 99 310 107" stroke="#a886ff" strokeWidth="1.3" />
        <path d="M310 107 406 60" stroke="#de70e7" strokeWidth="1.2" />
        <path d="M310 109 407 90" stroke="#a18cff" strokeWidth=".9" opacity=".7" />
        <path d="M310 111 402 123" stroke="#755bed" strokeWidth=".7" opacity=".45" />
      </g>

      <g className="zone-visual__wave-particles" fill="#e9e1ff">
        <circle cx="71" cy="71" r="2.2" />
        <circle cx="126" cy="137" r="1.7" />
        <circle cx="185" cy="44" r="2" />
        <circle cx="238" cy="120" r="1.5" />
      </g>
      <g className="zone-visual__stars" fill="#c7b2ff">
        <circle cx="53" cy="44" r="1.3" />
        <circle cx="112" cy="29" r="1" />
        <circle cx="223" cy="50" r="1.5" />
        <circle cx="369" cy="43" r="1.6" />
        <circle cx="381" cy="139" r="1.1" />
      </g>
    </svg>
  );
}

function FutureVisual() {
  return (
    <svg className="zone-visual zone-visual--future" viewBox="0 0 420 190" aria-hidden="true">
      <defs>
        <radialGradient id="future-glow" cx="58%" cy="72%" r="52%">
          <stop stopColor="#b27dff" stopOpacity=".42" />
          <stop offset="1" stopColor="#6740cc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="future-line" x1="0" x2="1">
          <stop stopColor="#5a38b3" stopOpacity=".22" />
          <stop offset=".5" stopColor="#c9b7ff" stopOpacity=".9" />
          <stop offset="1" stopColor="#613dc2" stopOpacity=".2" />
        </linearGradient>
        <filter id="future-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <ellipse cx="243" cy="137" rx="135" ry="54" fill="url(#future-glow)" />
      <g className="zone-visual__data-streams" stroke="#6f4bd0" strokeWidth=".7" strokeDasharray="3 6" opacity=".48">
        <path d="M117 69v71M145 45v96M174 76v68M269 57v87M302 40v99M338 66v75" />
      </g>

      <g className="zone-visual__connections" fill="none" stroke="#a785ff" strokeWidth="1.05">
        <path d="M139 69 221 88 306 61" />
        <path d="M221 112v22" />
      </g>
      <g className="zone-visual__connection-dots" fill="#dacaff">
        <circle cx="166" cy="75" r="3" />
        <circle cx="271" cy="72" r="3" />
        <circle cx="221" cy="125" r="2.7" />
      </g>

      <g className="zone-visual__floating-cube zone-visual__floating-cube--left" fill="#120b35" stroke="#9f79ff" strokeWidth="1.05">
        <path d="m119 38 24 9v28l-24 11-24-10V48Z" />
        <path d="m95 48 24 10 24-11M119 58v28" fill="none" />
      </g>
      <g className="zone-visual__floating-cube zone-visual__floating-cube--center" fill="#130b38" stroke="#b38fff" strokeWidth="1.15">
        <path d="m221 61 29 11v34l-29 13-29-12V73Z" />
        <path d="m192 73 29 12 29-13M221 85v34" fill="none" />
        <circle cx="221" cy="90" r="2" fill="#f0e9ff" stroke="none" />
      </g>
      <g className="zone-visual__floating-cube zone-visual__floating-cube--right" fill="#120b35" stroke="#9f79ff" strokeWidth="1.05">
        <path d="m306 33 23 9v27l-23 10-23-10V43Z" />
        <path d="m283 43 23 10 23-11M306 53v26" fill="none" />
      </g>

      <g className="zone-visual__platform" fill="none" stroke="url(#future-line)" strokeWidth="1.05">
        <path d="m121 146 101-44 108 39-105 48Z" />
        <path d="m139 151 84-37 88 31-88 40Z" />
        <path d="m163 153 61-27 64 23-65 29Z" />
        <path d="m192 153 32-14 33 12-34 15Z" />
      </g>
      <path className="zone-visual__platform-scan" d="m148 146 76-33 80 28-80 36Z" fill="none" stroke="#d7c3ff" strokeWidth="1.25" opacity=".65" />

      <g className="zone-visual__data-points" fill="#bfa6ff">
        <circle cx="103" cy="115" r="1.5" />
        <circle cx="132" cy="126" r="1.1" />
        <circle cx="155" cy="98" r="1.5" />
        <circle cx="286" cy="112" r="1.3" />
        <circle cx="318" cy="124" r="1.7" />
        <circle cx="347" cy="103" r="1.2" />
      </g>
      <g className="zone-visual__stars" fill="#d8c8ff">
        <circle cx="84" cy="74" r="1.4" />
        <circle cx="171" cy="29" r="1.7" />
        <circle cx="259" cy="31" r="1.2" />
        <circle cx="362" cy="73" r="1.6" />
      </g>
      <circle cx="221" cy="151" r="12" fill="#9c70ff" opacity=".16" filter="url(#future-soft-glow)" />
    </svg>
  );
}

export default function ZoneVisual({ type }: ZoneVisualProps) {
  if (type === "creation") return <CreationVisual />;
  if (type === "perception") return <PerceptionVisual />;
  return <FutureVisual />;
}
