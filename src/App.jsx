import { useState, useMemo } from "react";

/* ================= AGON — 철학 아곤 · STEP 2 =================
   52인 전원 탑재. 색은 오직 대립에만. 시간은 서체로 흐른다.
============================================================= */

const PAPER = "#F4F1EA";
const INK = "#1A1A18";
const REASON = "#0B7285";
const WILL = "#C1440E";
const sideColor = (s) => (s === "reason" ? REASON : WILL);

const ERA_TYPE = {
  1: { fontFamily: "Georgia, 'Times New Roman', 'Noto Serif KR', serif", letterSpacing: "0.18em", fontWeight: 500 },
  2: { fontFamily: "Georgia, 'Noto Serif KR', serif", letterSpacing: "0.01em", fontWeight: 600, lineHeight: 1.25 },
  3: { fontFamily: "Georgia, 'Times New Roman', 'Noto Serif KR', serif", letterSpacing: "0.04em", fontWeight: 400 },
  4: { fontFamily: "Georgia, 'Noto Serif KR', serif", letterSpacing: "-0.01em", fontWeight: 800 },
  5: { fontFamily: "-apple-system, 'Helvetica Neue', 'Apple SD Gothic Neo', sans-serif", letterSpacing: "0.14em", fontWeight: 300 },
};
const ERA_NAME = {
  1: { ko: "고대", en: "Ancient" }, 2: { ko: "중세", en: "Medieval" }, 3: { ko: "근대", en: "Early Modern" },
  4: { ko: "19세기", en: "19th Century" }, 5: { ko: "현대", en: "Contemporary" },
};
const ERA_Q = {
  1: { ko: "잘 산다는 게 뭐냐", en: "What is a good life?" },
  2: { ko: "믿음과 이성은 같이 갈 수 있나", en: "Can faith and reason coexist?" },
  3: { ko: "뭘 진짜로 아는 거냐", en: "What can we truly know?" },
  4: { ko: "세계는 이성적인가, 그냥 개판인가", en: "Is the world rational — or a mess?" },
  5: { ko: "의미 없는 세상에서 어떻게", en: "How to live in a meaningless world?" },
};

/* ================= SVG 비주얼 — 개념 = 하나의 움직이는 그림 ================= */
const VB = "0 0 220 130";
const Visuals = {
  river: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[52, 68, 84].map((y, i) => (
        <path key={y} d={`M-40,${y} q20,-10 40,0 t40,0 t40,0 t40,0 t40,0 t40,0`} fill="none" stroke={i === 1 ? tint : INK} strokeWidth="1.6" opacity={i === 1 ? 0.9 : 0.4}>
          <animateTransform attributeName="transform" type="translate" from="0 0" to="80 0" dur={`${3 + i}s`} repeatCount="indefinite" />
        </path>
      ))}
      <circle cx="110" cy="46" r="5" fill={INK} />
      <line x1="110" y1="51" x2="110" y2="88" stroke={INK} strokeWidth="2.4" />
    </svg>
  ),
  sphere: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <circle cx="110" cy="65" r="40" fill="none" stroke={tint} strokeWidth="2.2" />
      <circle cx="110" cy="65" r="40" fill={INK} opacity="0.06" />
      <path d="M70,65 a40,14 0 0 0 80,0" fill="none" stroke={INK} strokeWidth="0.8" opacity="0.4" />
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45" letterSpacing="2">움직이지 않는다</text>
    </svg>
  ),
  tetractys: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[[110, 28], [96, 52], [124, 52], [82, 76], [110, 76], [138, 76], [68, 100], [96, 100], [124, 100], [152, 100]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={i === 0 ? tint : INK} opacity="0.85">
          <animate attributeName="opacity" values="0.85;0.35;0.85" dur="3s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  ),
  cup: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <path d="M85,40 L135,40 L128,86 L92,86 Z" fill="none" stroke={INK} strokeWidth="2" />
      <line x1="98" y1="92" x2="122" y2="92" stroke={INK} strokeWidth="2" />
      <path d="M92,52 L128,52 L126,66 L94,66 Z" fill={tint} opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.8;0.15" keyTimes="0;0.6;1" dur="6s" repeatCount="indefinite" />
      </path>
    </svg>
  ),
  cave: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <line x1="150" y1="18" x2="150" y2="112" stroke={INK} strokeWidth="2" opacity="0.5" />
      <circle cx="60" cy="65" r="12" fill={tint}>
        <animate attributeName="cy" values="65;52;65" dur="4s" repeatCount="indefinite" />
      </circle>
      <ellipse cx="166" cy="65" rx="7" ry="16" fill={INK} opacity="0.5">
        <animate attributeName="cy" values="65;52;65" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <text x="60" y="112" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">실물</text>
      <text x="166" y="112" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">그림자</text>
    </svg>
  ),
  growth: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <line x1="30" y1="104" x2="190" y2="104" stroke={INK} strokeWidth="1.4" opacity="0.4" />
      <circle cx="110" cy="100" r="4" fill={INK} />
      <path d="M110,100 L110,40 M110,64 L92,50 M110,64 L128,50 M110,84 L96,74 M110,84 L124,74" fill="none" stroke={tint} strokeWidth="2" strokeDasharray="160" strokeDashoffset="160">
        <animate attributeName="stroke-dashoffset" values="160;0;0" keyTimes="0;0.7;1" dur="5s" repeatCount="indefinite" />
      </path>
    </svg>
  ),
  tub: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <path d="M70,60 a40,40 0 1 0 80,0" fill="none" stroke={tint} strokeWidth="2.4" transform="rotate(90 110 65)" />
      <circle cx="110" cy="70" r="7" fill={INK} />
      <rect x="0" y="16" width="52" height="90" fill={INK} opacity="0.18">
        <animate attributeName="x" values="-70;250" dur="7s" repeatCount="indefinite" />
      </rect>
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">왕의 그림자가 지나간다</text>
    </svg>
  ),
  garden: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <rect x="58" y="30" width="104" height="70" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.6" />
      {[46, 65, 84].map((y) => (
        <line key={y} x1="70" y1={y} x2="150" y2={y} stroke={tint} strokeWidth="1.6" strokeDasharray="80" strokeDashoffset="80">
          <animate attributeName="stroke-dashoffset" values="80;0" dur="4s" repeatCount="indefinite" />
        </line>
      ))}
      <circle cx="110" cy="65" r="4" fill={INK} />
    </svg>
  ),
  stoa: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[30, 50, 70, 90].map((y, i) => (
        <line key={y} x1="-40" y1={y} x2="0" y2={y} stroke={INK} strokeWidth="1.4" opacity="0.4">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="300 0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </line>
      ))}
      <rect x="102" y="26" width="16" height="78" fill={tint} />
      <text x="110" y="120" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">폭풍 속의 기둥</text>
    </svg>
  ),
  balance: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <line x1="110" y1="34" x2="110" y2="100" stroke={INK} strokeWidth="2" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-6 110 40;6 110 40;-6 110 40" dur="5s" repeatCount="indefinite" />
        <line x1="52" y1="40" x2="168" y2="40" stroke={tint} strokeWidth="2" />
        <circle cx="52" cy="52" r="8" fill={INK} />
        <circle cx="168" cy="52" r="8" fill={INK} />
      </g>
    </svg>
  ),
  yield_: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <circle cx="110" cy="65" r="18" fill={INK} opacity="0.7" />
      <path d="M10,60 q60,-30 82,-8 M128,78 q40,26 82,4" fill="none" stroke={tint} strokeWidth="2" strokeDasharray="8 6">
        <animate attributeName="stroke-dashoffset" values="56;0" dur="2.5s" repeatCount="indefinite" />
      </path>
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">물은 바위와 싸우지 않는다</text>
    </svg>
  ),
  butterfly: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <g>
        <animate attributeName="opacity" values="1;0;1" dur="6s" repeatCount="indefinite" />
        <circle cx="110" cy="46" r="8" fill={INK} />
        <line x1="110" y1="54" x2="110" y2="92" stroke={INK} strokeWidth="2.4" />
      </g>
      <g opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="6s" repeatCount="indefinite" />
        <path d="M110,65 q-26,-26 -34,0 q8,26 34,0 M110,65 q26,-26 34,0 q-8,26 -34,0" fill={tint} opacity="0.8" />
      </g>
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">누가 누구의 꿈인가</text>
    </svg>
  ),
  flameout: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <line x1="110" y1="70" x2="110" y2="100" stroke={INK} strokeWidth="3" />
      <path d="M110,66 q-9,-14 0,-26 q9,12 0,26" fill={tint}>
        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.55;0.7;0.9;1" dur="7s" repeatCount="indefinite" />
      </path>
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">불어서 끄다 — 니르바나</text>
    </svg>
  ),
  ember: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <line x1="40" y1="30" x2="180" y2="30" stroke={INK} strokeWidth="1.2" opacity="0.4" />
      <circle r="7" fill={tint}>
        <animate attributeName="cx" values="70;150;96;130;110" dur="6s" repeatCount="indefinite" />
        <animate attributeName="cy" values="98;84;66;50;34" dur="6s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">쉴 곳을 찾을 때까지</text>
    </svg>
  ),
  arch: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <path d="M62,104 L62,60 Q62,30 110,30" fill="none" stroke={INK} strokeWidth="2.4" strokeDasharray="110" strokeDashoffset="110">
        <animate attributeName="stroke-dashoffset" values="110;0;0" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite" />
      </path>
      <path d="M158,104 L158,60 Q158,30 110,30" fill="none" stroke={tint} strokeWidth="2.4" strokeDasharray="110" strokeDashoffset="110">
        <animate attributeName="stroke-dashoffset" values="110;0;0" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite" />
      </path>
      <text x="62" y="120" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">믿음</text>
      <text x="158" y="120" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">이성</text>
    </svg>
  ),
  razor: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[40, 55, 70, 85].map((y, i) => (
        <line key={y} x1="50" y1={y} x2="170" y2={y} stroke={INK} strokeWidth="1.6" opacity={i === 2 ? 0.9 : 0.6}>
          {i !== 2 && <animate attributeName="opacity" values="0.6;0.6;0" keyTimes="0;0.5;1" dur="5s" repeatCount="indefinite" />}
        </line>
      ))}
      <line x1="110" y1="20" x2="110" y2="105" stroke={tint} strokeWidth="1.4">
        <animateTransform attributeName="transform" type="rotate" values="-20 110 62;20 110 62" dur="5s" repeatCount="indefinite" />
      </line>
    </svg>
  ),
  lastpoint: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[[52, 40], [160, 34], [76, 92], [148, 88], [40, 66], [176, 64]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill={INK} opacity="0.5">
          <animate attributeName="opacity" values="0.5;0;0;0.5" keyTimes="0;0.4;0.8;1" dur="6s" repeatCount="indefinite" />
        </circle>
      ))}
      <circle cx="110" cy="63" r="8" fill={tint} />
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">모든 게 의심돼도, 의심하는 나는 남는다</text>
    </svg>
  ),
  onesub: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <circle cx="110" cy="65" r="46" fill="none" stroke={tint} strokeWidth="2" />
      {[[92, 52], [128, 50], [104, 82], [132, 76], [88, 70]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={INK} opacity="0.7">
          <animate attributeName="r" values="5;6.5;5" dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="110" y="126" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">전부 하나의 실체 안</text>
    </svg>
  ),
  worlds: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[[52, 60, 16], [96, 42, 13], [150, 56, 15], [120, 90, 12], [70, 96, 11]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={i === 2 ? tint : INK} strokeWidth={i === 2 ? 2.4 : 1.2} opacity={i === 2 ? 1 : 0.4}>
          {i === 2 && <animate attributeName="r" values="15;17;15" dur="3s" repeatCount="indefinite" />}
        </circle>
      ))}
      <text x="150" y="30" fontSize="9" textAnchor="middle" fill={INK} opacity="0.5">최선의 세계</text>
    </svg>
  ),
  reed: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <line x1="20" y1="104" x2="200" y2="104" stroke={INK} strokeWidth="1.2" opacity="0.4" />
      <path d="M110,104 Q110,60 110,30" fill="none" stroke={tint} strokeWidth="2.6">
        <animate attributeName="d" values="M110,104 Q110,60 110,30; M110,104 Q116,60 140,36; M110,104 Q110,60 110,30" dur="4.5s" repeatCount="indefinite" />
      </path>
      <circle cx="110" cy="30" r="4.5" fill={INK}>
        <animate attributeName="cx" values="110;140;110" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="30;36;30" dur="4.5s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">휘지만 꺾이지 않는다 — 생각하는 갈대</text>
    </svg>
  ),
  cage: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <rect x="60" y="30" width="100" height="70" fill="none" stroke={tint} strokeWidth="2.2">
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.45;0.55;1" dur="7s" repeatCount="indefinite" />
      </rect>
      <circle r="6" fill={INK}>
        <animate attributeName="cx" values="40;180;70;150;96;128;110" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cy" values="40;96;110;24;70;58;65" dur="7s" repeatCount="indefinite" />
      </circle>
      <circle r="6" fill={INK} opacity="0.7">
        <animate attributeName="cx" values="190;30;150;80;120;100;112" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cy" values="100;36;20;104;60;72;66" dur="7s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="120" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">늑대들, 그리고 우리(檻)</text>
    </svg>
  ),
  chain: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[64, 88, 112, 136, 160].map((x, i) => (
        <circle key={x} cx={x} cy="65" r="10" fill="none" stroke={i === 2 ? tint : INK} strokeWidth="2" opacity={i === 2 ? 1 : 0.6}>
          {i === 2 && <animate attributeName="stroke-dasharray" values="63 0;40 23;63 0" dur="4s" repeatCount="indefinite" />}
        </circle>
      ))}
      <text x="110" y="110" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">자유롭게 태어나, 사슬에 묶여 있다</text>
    </svg>
  ),
  blankpage: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <rect x="66" y="20" width="88" height="92" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.7" />
      {[36, 50, 64, 78, 92].map((y, i) => (
        <line key={y} x1="76" y1={y} x2={76 + 60 - i * 8} y2={y} stroke={tint} strokeWidth="2" strokeDasharray="70" strokeDashoffset="70">
          <animate attributeName="stroke-dashoffset" values="70;0;0" keyTimes="0;0.7;1" begin={`${i * 0.8}s`} dur="6s" repeatCount="indefinite" />
        </line>
      ))}
    </svg>
  ),
  eye: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <path d="M40,65 Q110,20 180,65 Q110,110 40,65 Z" fill="none" stroke={INK} strokeWidth="1.8" />
      <circle cx="110" cy="65" r="13" fill={tint} />
      <circle cx="176" cy="30" r="9" fill={INK}>
        <animate attributeName="opacity" values="1;1;0.06;0.06;1" keyTimes="0;0.45;0.55;0.9;1" dur="6s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">보이지 않으면, 존재하는가</text>
    </svg>
  ),
  pendulum: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <text x="24" y="118" fontSize="10" fill={INK} opacity="0.55" letterSpacing="2">고통</text>
      <text x="172" y="118" fontSize="10" fill={INK} opacity="0.55" letterSpacing="2">권태</text>
      <circle cx="110" cy="14" r="3" fill={INK} />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-34 110 14; 34 110 14; -34 110 14" dur="3.4s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1" />
        <line x1="110" y1="14" x2="110" y2="96" stroke={tint} strokeWidth="2" />
        <circle cx="110" cy="100" r="9" fill={INK} />
      </g>
    </svg>
  ),
  spiral: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <path d="M30,112 L110,96 L54,80 L128,62 L76,46 L146,30 L110,16" fill="none" stroke={INK} strokeWidth="1.4" opacity="0.35" />
      <circle r="6" fill={tint}>
        <animateMotion path="M30,112 L110,96 L54,80 L128,62 L76,46 L146,30 L110,16" dur="6s" repeatCount="indefinite" />
      </circle>
      <text x="150" y="16" fontSize="9" fill={INK} opacity="0.5" letterSpacing="1">종합</text>
    </svg>
  ),
  ring: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <circle cx="110" cy="65" r="44" fill="none" stroke={INK} strokeWidth="1.4" opacity="0.35" />
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 110 65" to="360 110 65" dur="4.5s" repeatCount="indefinite" />
        <circle cx="110" cy="21" r="7" fill={tint} />
        <circle cx="110" cy="21" r="7" fill={tint} opacity="0.35" transform="rotate(-24 110 65)" />
        <circle cx="110" cy="21" r="7" fill={tint} opacity="0.14" transform="rotate(-48 110 65)" />
      </g>
    </svg>
  ),
  billiard: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <line x1="20" y1="92" x2="200" y2="92" stroke={INK} strokeWidth="1" opacity="0.25" />
      <circle cy="82" r="10" fill={INK}>
        <animate attributeName="cx" values="34;86;86;34" keyTimes="0;0.35;0.92;1" dur="3.6s" repeatCount="indefinite" />
      </circle>
      <circle cy="82" r="10" fill={tint}>
        <animate attributeName="cx" values="106;106;178;178" keyTimes="0;0.35;0.7;1" dur="3.6s" repeatCount="indefinite" />
      </circle>
      <line x1="86" y1="60" x2="106" y2="60" stroke={INK} strokeWidth="1.6" strokeDasharray="4 4">
        <animate attributeName="opacity" values="0;0.6;0;0" keyTimes="0;0.35;0.55;1" dur="3.6s" repeatCount="indefinite" />
      </line>
      <text x="90" y="48" fontSize="13" fill={INK} opacity="0.6">?</text>
    </svg>
  ),
  lens: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <path d="M12,65 q14,-24 28,0 q14,24 28,0 q8,-14 18,-6" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.55" strokeDasharray="60">
        <animate attributeName="stroke-dashoffset" values="120;0" dur="3s" repeatCount="indefinite" />
      </path>
      <circle cx="110" cy="65" r="26" fill="none" stroke={tint} strokeWidth="2.4" />
      <line x1="136" y1="65" x2="208" y2="65" stroke={tint} strokeWidth="1.8" strokeDasharray="60">
        <animate attributeName="stroke-dashoffset" values="60;0" dur="3s" repeatCount="indefinite" />
      </line>
      <text x="96" y="30" fontSize="9" fill={INK} opacity="0.5" letterSpacing="1">안경</text>
    </svg>
  ),
  leap: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <line x1="20" y1="90" x2="96" y2="90" stroke={INK} strokeWidth="2.2" />
      <line x1="140" y1="90" x2="200" y2="90" stroke={INK} strokeWidth="2.2" />
      <circle r="7" fill={tint}>
        <animateMotion path="M60,84 L92,84 Q118,30 146,84 L146,84" keyTimes="0;0.35;0.8;1" keyPoints="0;0.3;1;1" calcMode="linear" dur="4s" repeatCount="indefinite" />
      </circle>
      <text x="118" y="116" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">계산이 끝나는 곳에서, 도약</text>
    </svg>
  ),
  invert: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 110 65;0 110 65;180 110 65;180 110 65;0 110 65" keyTimes="0;0.4;0.55;0.9;1" dur="8s" repeatCount="indefinite" />
        <path d="M110,26 L164,100 L56,100 Z" fill="none" stroke={INK} strokeWidth="2" />
        <circle cx="110" cy="42" r="6" fill={tint} />
        <line x1="80" y1="92" x2="140" y2="92" stroke={INK} strokeWidth="4" opacity="0.6" />
      </g>
      <text x="110" y="124" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">토대가 위를 결정한다 — 뒤집어라</text>
    </svg>
  ),
  manyscale: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <line x1="110" y1="30" x2="110" y2="100" stroke={INK} strokeWidth="2" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 110 36;-9 110 36;-9 110 36" keyTimes="0;0.5;1" dur="5s" repeatCount="indefinite" />
        <line x1="48" y1="36" x2="172" y2="36" stroke={tint} strokeWidth="2" />
        {[[40, 48], [52, 48], [46, 58]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={INK} />)}
        <circle cx="172" cy="48" r="7" fill={INK} />
      </g>
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">쾌락은 수로 센다</text>
    </svg>
  ),
  openfield: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <rect x="26" y="22" width="168" height="86" fill="none" stroke={INK} strokeWidth="1.4" opacity="0.5" strokeDasharray="4 4" />
      <circle r="7" fill={tint}>
        <animateMotion path="M60,65 Q110,30 160,65 Q110,100 60,65" dur="6s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">타인을 해치지 않는 한, 경계선까지 전부 자유</text>
    </svg>
  ),
  iceberg: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <line x1="16" y1="52" x2="204" y2="52" stroke={INK} strokeWidth="1.2" opacity="0.5" />
      <path d="M96,52 L110,28 L126,52 Z" fill={INK} />
      <path d="M78,52 L142,52 L120,108 L92,102 Z" fill={tint} opacity="0.75">
        <animate attributeName="opacity" values="0.75;0.35;0.75" dur="5s" repeatCount="indefinite" />
      </path>
      <text x="160" y="90" fontSize="9" fill={INK} opacity="0.5">무의식</text>
    </svg>
  ),
  bricks: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[[70, 88, 80], [82, 72, 56], [94, 56, 32]].map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height="14" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.8">
          <animate attributeName="opacity" values="0;1;1" keyTimes={`0;${0.2 + i * 0.2};1`} dur="5s" repeatCount="indefinite" />
        </rect>
      ))}
      <circle cx="110" cy="44" r="6" fill={tint}>
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.7;0.85;1" dur="5s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="120" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">수학까지 논리 벽돌로 다시 쌓기</text>
    </svg>
  ),
  silence: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <circle cx="176" cy="60" r="12" fill={INK} opacity="0.75" />
      <line x1="24" y1="60" x2="150" y2="60" stroke={tint} strokeWidth="2.4" strokeDasharray="126" strokeDashoffset="126">
        <animate attributeName="stroke-dashoffset" values="126;28;28;126" keyTimes="0;0.5;0.85;1" dur="6s" repeatCount="indefinite" />
      </line>
      <text x="110" y="96" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">말이 닿지 않는 곳 — 침묵</text>
    </svg>
  ),
  blackswan: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[44, 72, 100, 128, 156].map((x, i) => (
        <circle key={x} cx={x} cy="60" r="9" fill="none" stroke={INK} strokeWidth="1.8" opacity="0.7" />
      ))}
      <circle cx="184" cy="60" r="9" fill={tint}>
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.55;0.7;1" dur="6s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="104" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">흰 백조 만 마리도 '전부 희다'를 증명 못 한다</text>
    </svg>
  ),
  house: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <path d="M70,100 L70,58 L110,30 L150,58 L150,100 Z" fill="none" stroke={tint} strokeWidth="2.2" strokeDasharray="240" strokeDashoffset="240">
        <animate attributeName="stroke-dashoffset" values="240;0;0" keyTimes="0;0.7;1" dur="6s" repeatCount="indefinite" />
      </path>
      <circle cx="110" cy="78" r="5" fill={INK} />
      <text x="110" y="120" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">언어는 존재의 집</text>
    </svg>
  ),
  rows: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <rect key={`${r}${c}`} x={44 + c * 28} y={30 + r * 26} width="16" height="16" fill={r === 1 && c === 2 ? "none" : INK} stroke={r === 1 && c === 2 ? tint : "none"} strokeWidth="2.2" opacity={r === 1 && c === 2 ? 1 : 0.55}>
            {r === 1 && c === 2 && <animateTransform attributeName="transform" type="rotate" values="0 108 64;45 108 64;45 108 64" keyTimes="0;0.4;1" dur="5s" repeatCount="indefinite" />}
          </rect>
        ))
      )}
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">생각하기를 멈춘 대열, 멈추지 않은 하나</text>
    </svg>
  ),
  fork: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <path d="M110,104 L110,66 M110,66 L64,26 M110,66 L156,26" fill="none" stroke={INK} strokeWidth="2" opacity="0.6" />
      <circle r="7" fill={tint}>
        <animateMotion path="M110,100 L110,68 L110,68" keyTimes="0;0.6;1" keyPoints="0;1;1" calcMode="linear" dur="4s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">이정표는 없다. 선택은 전부 네 것</text>
    </svg>
  ),
  becoming: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <circle cx="110" cy="60" r="34" fill="none" stroke={INK} strokeWidth="1.6" strokeDasharray="6 8" opacity="0.5" />
      <circle cx="110" cy="60" r="34" fill="none" stroke={tint} strokeWidth="2.4" strokeDasharray="214" strokeDashoffset="214">
        <animate attributeName="stroke-dashoffset" values="214;0;0" keyTimes="0;0.75;1" dur="6s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="120" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">태어나는 게 아니라, 만들어진다</text>
    </svg>
  ),
  angel: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={60 - i * 4} y={96 - i * 18} width={26 + i * 8} height="16" fill={INK} opacity={0.3 + i * 0.12}>
          <animate attributeName="opacity" values={`${0.3 + i * 0.12};${0.5 + i * 0.12};${0.3 + i * 0.12}`} dur="4s" repeatCount="indefinite" />
        </rect>
      ))}
      <circle cx="150" cy="60" r="9" fill={tint}>
        <animate attributeName="cx" values="150;186" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.2" dur="5s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="122" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">잔해는 쌓이고, 천사는 밀려난다</text>
    </svg>
  ),
  askew: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} x={52 + c * 32} y={28 + r * 28} width="20" height="20" fill="none" stroke={r === 1 && c === 1 ? tint : INK} strokeWidth="1.6" opacity="0.7" transform={`rotate(${(r * 4 + c) % 3 === 0 ? 6 : -5} ${62 + c * 32} ${38 + r * 28})`} />
        ))
      )}
      <text x="110" y="124" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">잘못된 전체 안에 올바른 칸은 없다</text>
    </svg>
  ),
  panopticon: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <circle cx="110" cy="65" r="44" fill="none" stroke={INK} strokeWidth="1.4" opacity="0.4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect key={a} x="104" y="14" width="12" height="12" fill={INK} opacity="0.5" transform={`rotate(${a} 110 65)`} />
      ))}
      <circle cx="110" cy="65" r="7" fill={tint} />
      <line x1="110" y1="65" x2="110" y2="20" stroke={tint} strokeWidth="1.4" opacity="0.8">
        <animateTransform attributeName="transform" type="rotate" from="0 110 65" to="360 110 65" dur="5s" repeatCount="indefinite" />
      </line>
    </svg>
  ),
  margin: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[30, 42, 54, 66, 78, 90].map((y) => (
        <line key={y} x1="60" y1={y} x2="160" y2={y} stroke={INK} strokeWidth="3" opacity="0.6" />
      ))}
      <rect x="164" y="24" width="30" height="74" fill={tint} opacity="0.25">
        <animate attributeName="opacity" values="0.1;0.45;0.1" dur="4s" repeatCount="indefinite" />
      </rect>
      <text x="110" y="118" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">본문이 숨긴 것은 여백에 있다</text>
    </svg>
  ),
  rhizome: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[[40, 40], [90, 26], [150, 38], [190, 70], [60, 84], [120, 66], [96, 102], [166, 98]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={i === 5 ? tint : INK} opacity="0.8" />
      ))}
      <path d="M40,40 L90,26 L150,38 L120,66 L60,84 L40,40 M120,66 L190,70 L166,98 L96,102 L60,84 M90,26 L120,66 M150,38 L166,98" fill="none" stroke={INK} strokeWidth="1" opacity="0.4" strokeDasharray="6 5">
        <animate attributeName="stroke-dashoffset" values="0;-44" dur="3s" repeatCount="indefinite" />
      </path>
      <text x="110" y="124" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">중심도 뿌리도 없이, 옆으로 번진다</text>
    </svg>
  ),
  veil: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      {[[70, 70], [110, 62], [150, 72]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="10" fill={INK} opacity="0.55" />
      ))}
      <rect x="40" y="30" width="140" height="66" fill={PAPER} opacity="0.82">
        <animate attributeName="opacity" values="0.82;0.6;0.82" dur="5s" repeatCount="indefinite" />
      </rect>
      <rect x="40" y="30" width="140" height="66" fill="none" stroke={tint} strokeWidth="2" />
      <text x="110" y="70" fontSize="10" textAnchor="middle" fill={INK} opacity="0.7" letterSpacing="3">무지의 베일</text>
    </svg>
  ),
  circles: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <circle cx="110" cy="65" r="6" fill={INK} />
      {[18, 32, 46].map((r, i) => (
        <circle key={r} cx="110" cy="65" r={r} fill="none" stroke={i === 2 ? tint : INK} strokeWidth="1.6" opacity="0.6">
          <animate attributeName="r" values={`${r};${r + 5};${r}`} dur="4s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="110" y="126" fontSize="9" textAnchor="middle" fill={INK} opacity="0.45">도덕의 원은 넓어진다 — 가족, 이웃, 인류, 동물</text>
    </svg>
  ),
  boulder: ({ tint }) => (
    <svg viewBox={VB} className="w-full">
      <line x1="24" y1="110" x2="176" y2="42" stroke={INK} strokeWidth="1.6" opacity="0.5" />
      <line x1="24" y1="110" x2="200" y2="110" stroke={INK} strokeWidth="1" opacity="0.2" />
      <circle r="11" fill={tint}>
        <animateMotion path="M30,100 L168,38 L30,100" keyTimes="0;0.78;1" keyPoints="0;0.5;1" calcMode="linear" dur="5s" repeatCount="indefinite" />
      </circle>
    </svg>
  ),
};

/* ---------- AI 호출 ----------
   기본값은 Claude 아티팩트 환경용 직접 호출.
   GitHub Pages 등 외부 배포 시에는 .env 에 VITE_AGON_API_URL 을 설정해
   Cloudflare Worker 프록시(worker/ 폴더 참고)를 거치게 하세요.
------------------------------------------------------------------ */
const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_AGON_API_URL) ||
  "https://api.anthropic.com/v1/messages";

async function callJudge(promptText) {
  let lastErr = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: promptText }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "API error");
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("no JSON in response");
      return JSON.parse(m[0]);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/* ================= 데이터 — 52인 전원 ================= */
const P = {
  heraclitus: {
    id: "heraclitus", nameKo: "헤라클레이토스", nameEn: "Heraclitus", years: "c.535–475 BCE",
    era: 1, school: { ko: "만물유전", en: "Flux" }, side: "will", visual: "river",
    caption: { ko: "같은 강에 두 번 들어갈 수 없다", en: "You cannot step into the same river twice" },
    scene: {
      ko: "에페소스의 왕가 혈통. 물려받을 지위를 동생에게 던져버리고 신전 근처에서 아이들과 주사위 놀이를 했다. 시민들이 '왜 정치를 안 하시오' 묻자 — 너희와 나라 꾸리느니 이게 낫다. 사람들은 난해한 그를 '수수께끼를 내는 자', '우는 철학자'라 불렀다.",
      en: "Ephesian royal blood. He tossed his hereditary title to his brother and played dice with children by the temple. Asked why he shunned politics: better this than running a city with you. They called him 'the Riddler' and 'the weeping philosopher.'",
    },
    quote: {
      original: "ποταμοῖσι τοῖσιν αὐτοῖσιν ἐμβαίνουσιν ἕτερα καὶ ἕτερα ὕδατα ἐπιρρεῖ. (potamoisi toisin autoisin embainousin, hetera kai hetera hydata epirrhei)",
      originalLang: "grc",
      en: "Upon those who step into the same rivers, ever different waters flow.",
      ko: "같은 강에 들어가는 자들에게, 늘 다른 물이 흘러든다.",
      source: { ko: "단편 B12", en: "Fragment B12" },
      sting: { ko: "안정된 세계를 믿던 그리스에 — 세계의 본모습은 '흐름'뿐이라는 선언.", en: "To a Greece that believed in a stable world: flux is all there is." },
    },
    weapon: {
      ko: "만물유전(panta rhei). 변화는 예외가 아니라 규칙이다. 낮과 밤, 전쟁과 평화 — 대립의 긴장이 세계를 굴리는 엔진이다.",
      en: "Universal flux. Change is the rule, not the exception. Opposites in tension — day/night, war/peace — are the engine of the world.",
    },
    analogy: {
      ko: "프로필 사진 속 나와 지금의 나. '같은 사람'이라 부르지만 세포도 생각도 다 바뀌었다. 이름만 같은 강.",
      en: "You and your profile photo. Same name, entirely different cells and thoughts — a river that kept only its name.",
    },
    agon: [{ id: "parmenides", clash: {
      ko: "파르메니데스: \"변화는 감각의 착시다. 존재는 하나이고 불변이다.\" — 헤라클레이토스: \"불변? 눈을 떠라. 세계는 살아 있는 불이다.\" 철학사 최초의 정면충돌 — 이후 모든 철학은 이 둘 사이 어딘가에 자리를 잡는다.",
      en: "Parmenides: \"Change is an illusion. Being is one and unchanging.\" — Heraclitus: \"Unchanging? Open your eyes. The world is living fire.\" Philosophy's first head-on collision — everything after picks a seat between these two.",
    } }],
    lineage: { from: [], to: ["plato"], note: {
      ko: "플라톤이 이 둘을 화해시키려다 이데아론을 만든다 — 변하는 세계는 헤라클레이토스에게, 불변의 이데아는 파르메니데스에게 배정했다.",
      en: "Plato's theory of Forms is his peace treaty: the changing world goes to Heraclitus, the eternal Forms to Parmenides.",
    } },
    myth: null,
    dilemma: { ko: "1년 전의 당신과 지금의 당신은 같은 사람입니까? 무엇이 그걸 보증합니까?", en: "Are you the same person as a year ago? What guarantees it?" },
    axes: { reasonVsWill: -40, selfVsCommunity: 30, absoluteVsRelative: -70, meaningVsAbsurd: 10 },
  },

  parmenides: {
    id: "parmenides", nameKo: "파르메니데스", nameEn: "Parmenides", years: "c.515–450 BCE",
    era: 1, school: { ko: "엘레아학파", en: "Eleatic School" }, side: "reason", visual: "sphere",
    caption: { ko: "얼어붙은 구(球) — 존재는 움직이지 않는다", en: "The frozen sphere — Being does not move" },
    scene: {
      ko: "남이탈리아 엘레아. 여신에게 진리를 계시받는 형식의 시 한 편으로 철학사를 반으로 갈랐다. 제자 제논은 스승을 지키기 위해 '날아가는 화살은 정지해 있다' 같은 역설을 제조해 그리스 전체를 도발했다.",
      en: "Elea, southern Italy. One poem — framed as a goddess revealing truth — split philosophy in half. His student Zeno defended him by manufacturing paradoxes ('the flying arrow is at rest') that trolled all of Greece.",
    },
    quote: {
      original: "τὸ γὰρ αὐτὸ νοεῖν ἐστίν τε καὶ εἶναι. (to gar auto noein estin te kai einai)",
      originalLang: "grc",
      en: "For thinking and being are the same.",
      ko: "생각함과 존재함은 같은 것이다.",
      source: { ko: "단편 B3", en: "Fragment B3" },
      sting: { ko: "감각이 보여주는 변화의 세계 전체에 '착각' 딱지 하나를 붙여 기각한 것.", en: "He dismissed the entire world of the senses with a single label: illusion." },
    },
    weapon: {
      ko: "존재의 논리. '없음'은 생각할 수도 말할 수도 없다. 그러므로 생성도 소멸도 불가능 — 존재는 하나이고, 영원하며, 움직이지 않는다. 논리가 눈을 이긴다.",
      en: "The logic of Being. 'Nothing' cannot be thought or spoken. Therefore no becoming, no perishing — Being is one, eternal, motionless. Logic outranks the eyes.",
    },
    analogy: {
      ko: "영화. 스크린 위에선 모든 게 움직이지만 필름은 정지된 프레임의 나열이다. 파르메니데스는 우리가 스크린만 보고 산다고 말한다.",
      en: "A film: everything moves on screen, but the reel is a stack of still frames. Parmenides says we live watching the screen.",
    },
    agon: [{ id: "heraclitus", clash: {
      ko: "헤라클레이토스: \"세계는 흐름이다.\" — 파르메니데스: \"흐름을 '본다'는 그 감각부터 피고인석에 앉혀라. 이성이 불가능하다고 판결한 것을 눈이 뒤집을 수는 없다.\"",
      en: "Heraclitus: \"The world is flux.\" — Parmenides: \"Put the senses themselves in the dock. The eyes cannot overturn what reason has ruled impossible.\"",
    } }],
    lineage: { from: [], to: ["plato"], note: {
      ko: "플라톤이 그를 '아버지'라 부르며 존속 살해를 고민할 만큼(《소피스트》) 그의 논리는 강력했다.",
      en: "So strong was his logic that Plato called him 'father' — and agonized over committing parricide (Sophist).",
    } },
    myth: null,
    dilemma: { ko: "논리가 '불가능하다' 하고 눈이 '보인다' 하면, 당신은 어느 쪽을 믿습니까?", en: "When logic says impossible and your eyes say otherwise — which do you trust?" },
    axes: { reasonVsWill: 95, selfVsCommunity: 0, absoluteVsRelative: 95, meaningVsAbsurd: 60 },
  },

  pythagoras: {
    id: "pythagoras", nameKo: "피타고라스", nameEn: "Pythagoras", years: "c.570–495 BCE",
    era: 1, school: { ko: "피타고라스 교단", en: "Pythagorean Order" }, side: "reason", visual: "tetractys",
    caption: { ko: "테트락티스 — 수가 곧 세계", en: "The tetractys — number as world" },
    scene: {
      ko: "크로톤에 수학 학교이자 종교 공동체인 교단을 세웠다. '콩을 먹지 마라' 같은 계율까지 있었다. 무리수를 발견한 제자가 바다에 던져졌다는 전설이 돌 정도로, 이들에게 수(數)는 학문이 아니라 신앙이었다.",
      en: "In Croton he founded an order — half math school, half religion, with rules like 'abstain from beans.' Legend says a disciple who discovered irrational numbers was thrown into the sea. Number was not a subject; it was a faith.",
    },
    quote: {
      original: "All is number.",
      originalLang: "en",
      en: "All is number.",
      ko: "만물은 수(數)다.",
      source: { ko: "귀속 불확실 — 아리스토텔레스 《형이상학》의 보고", en: "Attribution uncertain — reported in Aristotle's Metaphysics" },
      sting: { ko: "신화로 세계를 설명하던 시대에, 세계의 언어는 이야기가 아니라 수학이라는 선언.", en: "In an age of myth, the declaration that the world's language is mathematics, not story." },
    },
    weapon: {
      ko: "수적 질서. 음정도, 천체의 운행도, 정의도 비율이다. 보이는 것 뒤에 수학적 구조가 있다는 직관 — 현대 물리학의 먼 조상.",
      en: "Numerical order. Musical intervals, planetary motion, justice — all ratio. The intuition that mathematical structure hides behind appearance: modern physics' distant ancestor.",
    },
    analogy: {
      ko: "스트리밍 음악도 결국 0과 1이다. 당신을 울리는 그 발라드의 정체는 숫자의 배열 — 피타고라스가 옳았던 셈.",
      en: "Streaming music is zeros and ones. The ballad that makes you cry is an array of numbers — score one for Pythagoras.",
    },
    agon: [{ id: "heraclitus", clash: {
      ko: "헤라클레이토스는 그를 '박식하나 지혜는 없는 자'라고 저격했다(단편 B40의 취지). 흐름의 철학자에게, 영원한 수의 질서란 세계를 박제하는 짓이었다.",
      en: "Heraclitus sniped that much learning had not taught him wisdom (fragment B40). To the philosopher of flux, an eternal order of number was taxidermy performed on the world.",
    } }],
    lineage: { from: [], to: ["plato"], note: {
      ko: "플라톤의 아카데메이아 입구에 '기하학을 모르는 자는 들어오지 말라'가 걸렸다는 전승 — 그 문패의 지분 절반은 피타고라스 것이다.",
      en: "Tradition says Plato's Academy door read 'Let no one ignorant of geometry enter' — half the credit belongs to Pythagoras.",
    } },
    myth: { ko: "'피타고라스 정리'조차 그가 최초로 증명했는지 불확실하다. 바빌로니아 점토판에 천 년 먼저 등장한다.", en: "Even 'his' theorem may not be his: it appears on Babylonian tablets a millennium earlier." },
    dilemma: { ko: "세계가 수학으로 완벽히 설명된다면, 당신의 사랑도 수식이 됩니까? 그래도 괜찮습니까?", en: "If the world reduces to math, does your love become an equation? Are you fine with that?" },
    axes: { reasonVsWill: 85, selfVsCommunity: -30, absoluteVsRelative: 90, meaningVsAbsurd: 70 },
  },

  socrates: {
    id: "socrates", nameKo: "소크라테스", nameEn: "Socrates", years: "470–399 BCE",
    era: 1, school: { ko: "문답법", en: "Dialectic" }, side: "reason", visual: "cup",
    caption: { ko: "독배 — 도망칠 수 있었는데 안 갔다", en: "The hemlock — he could have fled, and didn't" },
    scene: {
      ko: "기원전 399년 아테네 법정. 죄목은 '청년을 타락시키고 신을 믿지 않음'. 사형 표결 후 친구들이 탈출 자금까지 준비했지만 거절했다 — 평생 아테네의 법 아래 살았으면서 판결이 불리해지자 도망치는 건 자기 철학의 부정이라며. 독배를 스스로 들었다.",
      en: "Athens, 399 BCE. Charged with corrupting the youth and impiety. After the death sentence, friends arranged his escape; he refused — having lived under Athens' laws, fleeing an unfavorable verdict would refute his own philosophy. He raised the hemlock himself.",
    },
    quote: {
      original: "ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ. (ho de anexetastos bios ou biōtos anthrōpō)",
      originalLang: "grc",
      en: "The unexamined life is not worth living.",
      ko: "검토되지 않는 삶은 살 가치가 없다.",
      source: { ko: "플라톤 《변명》 38a", en: "Plato, Apology 38a" },
      sting: { ko: "아테네 시민 전원의 '나는 잘 살고 있다'는 확신에 채점 불가 판정을 내린 것.", en: "He stamped 'ungradable' on every Athenian's certainty of living well." },
    },
    weapon: {
      ko: "문답법. 답을 주지 않고 질문만 던진다. 상대가 스스로 모순에 부딪히게 — 앎의 출발은 무지의 자각이다.",
      en: "The elenchus. No answers, only questions, until you collide with your own contradiction. Knowledge begins at the awareness of ignorance.",
    },
    analogy: {
      ko: "\"그거 왜 그렇게 생각해?\"를 다섯 번 연속 묻는 친구. 짜증나지만, 다섯 번째쯤 내 생각이 사실 내 것이 아니었음을 깨닫는다.",
      en: "The friend who asks 'why do you think that?' five times in a row. Annoying — until round five, when you realize the opinion was never yours.",
    },
    agon: [{ id: "sophist", name: "소피스트", nameEnOv: "The Sophists", clash: {
      ko: "프로타고라스: \"인간이 만물의 척도다. 진리는 각자에게 각자의 것.\" — 소크라테스: \"그렇다면 '네 말이 틀렸다'는 내 진리도 참이겠군.\" 돈 받고 이기는 법을 팔던 시대에, 그는 무료로 지는 법 — 자기 무지의 인정 — 을 가르쳤다.",
      en: "Protagoras: \"Man is the measure of all things.\" — Socrates: \"Then my truth that you are wrong is also true.\" While sophists sold winning for a fee, he taught losing — admitting ignorance — for free.",
    } }],
    lineage: { from: [], to: ["plato"], note: {
      ko: "그는 한 줄도 쓰지 않았다. 우리가 아는 소크라테스는 전부 제자 플라톤의 기록 — 스승의 죽음이 플라톤 철학 전체의 출발점이 된다.",
      en: "He wrote nothing. Everything we know is Plato's record — and the master's death became the starting point of Plato's philosophy.",
    } },
    myth: { ko: "\"내가 아는 유일한 것은 내가 모른다는 것\" — 이 정확한 문장을 말한 기록은 없다. 플라톤의 여러 대목을 후대가 압축한 통용구다.", en: "\"I know that I know nothing\" — no record of this exact sentence. It's a later compression of Platonic passages." },
    dilemma: { ko: "당신이 확신하는 신념 하나를 적고, 스스로에게 '왜?'를 세 번 물어보세요. 끝까지 버팁니까?", en: "Write one firm belief and ask yourself 'why?' three times. Does it survive?" },
    axes: { reasonVsWill: 80, selfVsCommunity: 20, absoluteVsRelative: 60, meaningVsAbsurd: 70 },
  },

  plato: {
    id: "plato", nameKo: "플라톤", nameEn: "Plato", years: "c.428–348 BCE",
    era: 1, school: { ko: "이데아론", en: "Theory of Forms" }, side: "reason", visual: "cave",
    caption: { ko: "동굴 벽의 그림자", en: "Shadows on the cave wall" },
    scene: {
      ko: "스무 살 무렵, 스승이 민주주의의 표결로 독배를 받는 것을 지켜봤다. 그 법정이 그의 원점이다 — 다수결이 현자를 죽일 수 있다면 정치는 처음부터 다시 설계돼야 한다. 그가 세운 학교 아카데메이아는 이후 900년을 갔다.",
      en: "In his twenties he watched democracy vote his teacher a cup of hemlock. That courtroom is his origin — if majority rule can kill the wisest man, politics must be redesigned from scratch. The Academy he founded ran for 900 years.",
    },
    quote: {
      original: "ἀπείκασον τοιούτῳ πάθει τὴν ἡμετέραν φύσιν. (apeikason toioutō pathei tēn hēmeteran physin)",
      originalLang: "grc",
      en: "Compare our nature to a condition such as this.",
      ko: "우리의 본성을 이런 처지에 비유해 보게.",
      source: { ko: "《국가》 514a — 동굴 비유의 첫 문장", en: "Republic 514a — the opening of the Cave" },
      sting: { ko: "이어지는 이야기가 그 동굴이다 — 당신이 현실이라 부르는 것은 벽에 비친 그림자라는 비유.", en: "What follows is the Cave: what you call reality is shadow on a wall." },
    },
    weapon: {
      ko: "이데아. 눈에 보이는 모든 것은 완전한 원본의 열화 복사본이다. 완벽한 원을 본 적도 없는데 '완벽한 원'을 아는 이유 — 앎은 감각이 아니라 상기(想起)다.",
      en: "The Forms. Everything visible is a degraded copy of a perfect original. You've never seen a perfect circle, yet you know one — because knowing is recollection, not sensation.",
    },
    analogy: {
      ko: "우리는 실물 대신 피드에 비친 그림자를 보며 세계를 안다고 믿는다. 플라톤의 동굴에는 이제 와이파이가 있다.",
      en: "We know the world through shadows on a feed. Plato's cave now has wifi.",
    },
    agon: [{ id: "aristotle", clash: {
      ko: "아리스토텔레스: \"본질은 저 하늘의 이데아계가 아니라 사물 안에 있습니다. 개는 '개의 이데아'의 그림자가 아니라 그냥 개입니다.\" — 플라톤은 그를 '내 학교의 지성'이라 불렀고, 그 지성은 학교를 떠나 정반대의 철학을 세웠다.",
      en: "Aristotle: \"Essence lives in things, not in a heaven of Forms. A dog is not the shadow of Doghood — it's a dog.\" Plato called him 'the mind of the school' — and that mind left to build the opposite philosophy.",
    } }],
    lineage: { from: ["socrates"], to: ["aristotle"], note: {
      ko: "화이트헤드의 유명한 평 — 서양철학사는 플라톤에 대한 각주의 연속이다. 과장이지만, 반박하려는 시도조차 그의 질문지 위에서 이루어진다.",
      en: "Whitehead's verdict: Western philosophy is footnotes to Plato. An exaggeration — but even the rebuttals are written on his question sheet.",
    } },
    myth: null,
    dilemma: { ko: "지금 당신이 '현실'이라 부르는 것 중, 사실은 화면에 비친 그림자에 가까운 것은 무엇입니까?", en: "Of what you call reality, which part is closest to a shadow on a screen?" },
    axes: { reasonVsWill: 85, selfVsCommunity: -40, absoluteVsRelative: 95, meaningVsAbsurd: 85 },
  },

  aristotle: {
    id: "aristotle", nameKo: "아리스토텔레스", nameEn: "Aristotle", years: "384–322 BCE",
    era: 1, school: { ko: "소요학파", en: "Peripatetic School" }, side: "reason", visual: "growth",
    caption: { ko: "도토리는 참나무를 향해 자란다 — 목적", en: "The acorn grows toward the oak — telos" },
    scene: {
      ko: "플라톤 문하에서 20년. 후계자가 되지 못하자 떠나, 알렉산더 대왕의 가정교사를 거쳐 아테네에 자기 학교를 열었다. 걸으면서 가르쳐 '소요학파'. 스승이 하늘의 이데아를 가리킬 때, 그는 땅의 생물을 해부하고 있었다.",
      en: "Twenty years under Plato. Passed over as successor, he left — tutored Alexander the Great, then opened his own school, teaching while walking. While his teacher pointed at the Forms, he was dissecting animals on the ground.",
    },
    quote: {
      original: "Πάντες ἄνθρωποι τοῦ εἰδέναι ὀρέγονται φύσει. (pantes anthrōpoi tou eidenai oregontai physei)",
      originalLang: "grc",
      en: "All men by nature desire to know.",
      ko: "모든 인간은 본성상 앎을 욕구한다.",
      source: { ko: "《형이상학》 1권 첫 문장", en: "Metaphysics, Book I, first sentence" },
      sting: { ko: "앎이 소수의 소명이 아니라 인간의 기본 설정이라는 선언 — 철학의 문을 전 인류에게 연 문장.", en: "Knowing is the human default, not a calling for the few — the sentence that opened philosophy's door to everyone." },
    },
    weapon: {
      ko: "목적론. 모든 것은 자기 목적(telos)을 향해 자란다. 도토리의 목적은 참나무, 인간의 목적은 이성의 탁월한 발휘 — 행복(에우다이모니아)은 기분이 아니라 활동이다.",
      en: "Teleology. Everything grows toward its telos. The acorn's is the oak; the human's is the excellent exercise of reason. Happiness is not a mood — it's an activity.",
    },
    analogy: {
      ko: "'갓생'. 좋은 삶은 복권처럼 오는 게 아니라 반복된 루틴으로 만드는 것 — '탁월함은 습관이다'라는 그의 결론과 같은 말이다.",
      en: "The disciplined-life trend: a good life is built by routine, not won like a lottery. Which is his conclusion — excellence is a habit.",
    },
    agon: [{ id: "plato", clash: {
      ko: "플라톤: \"감각계는 그림자다. 진짜는 이데아.\" — 아리스토텔레스: \"그림자를 이토록 정교하게 설명하는 학문이 왜 필요합니까. 진짜는 여기, 만지고 해부할 수 있는 것들 속에 있습니다.\" 라파엘로의 〈아테네 학당〉이 이 대립을 한 장으로 그린다 — 하늘을 가리키는 손과 땅을 가리키는 손.",
      en: "Plato: \"The sensible world is shadow.\" — Aristotle: \"Then why such exquisite science of shadows? The real is here, in what can be touched and dissected.\" Raphael's School of Athens paints the quarrel in two hands — one pointing up, one down.",
    } }],
    lineage: { from: ["plato"], to: ["aquinas"], note: {
      ko: "중세는 그를 이름 없이 '그 철학자(The Philosopher)'라고만 불렀다. 아퀴나스가 그를 기독교와 결혼시킨다.",
      en: "The Middle Ages called him simply 'The Philosopher.' Aquinas would officiate his marriage to Christianity.",
    } },
    myth: null,
    dilemma: { ko: "당신 삶의 '목적'을 한 문장으로 적을 수 있습니까? 적어보세요. 안 써지면 그 이유도.", en: "Can you write your life's telos in one sentence? Try. If you can't, write why." },
    axes: { reasonVsWill: 75, selfVsCommunity: -20, absoluteVsRelative: 60, meaningVsAbsurd: 85 },
  },

  diogenes: {
    id: "diogenes", nameKo: "디오게네스", nameEn: "Diogenes", years: "c.412–323 BCE",
    era: 1, school: { ko: "견유학파", en: "Cynicism" }, side: "will", visual: "tub",
    caption: { ko: "통 하나, 그 위로 지나가는 왕의 그림자", en: "One tub, and a king's shadow passing over" },
    scene: {
      ko: "코린토스. 알렉산더 대왕이 직접 찾아와 말했다. \"원하는 걸 말하라, 무엇이든 주겠다.\" 통 속의 남자가 답했다 — \"햇빛을 가리니 조금만 비켜서 주시오.\" 대왕은 돌아서며 말했다고 전해진다. \"내가 알렉산더가 아니었다면, 디오게네스이고 싶었을 것이다.\"",
      en: "Corinth. Alexander the Great came in person: \"Ask me for anything.\" The man in the tub replied: \"Stand a little out of my sun.\" Walking away, the king reportedly said: \"Were I not Alexander, I would wish to be Diogenes.\"",
    },
    quote: {
      original: "μικρὸν ἀπὸ τοῦ ἡλίου μετάστηθι. (mikron apo tou hēliou metastēthi)",
      originalLang: "grc",
      en: "Stand a little out of my sun.",
      ko: "햇빛을 가리니 조금 비켜서 주시오.",
      source: { ko: "디오게네스 라에르티오스 《철학자 열전》 전거", en: "Reported in Diogenes Laertius, Lives of the Philosophers" },
      sting: { ko: "세계 최강자의 '무엇이든'에 '아무것도 필요 없음'으로 응수 — 권력의 화폐를 통째로 위조지폐 취급한 것.", en: "To power's 'anything,' he answered 'nothing needed' — declaring its entire currency counterfeit." },
    },
    weapon: {
      ko: "견유(犬儒). 문명의 관습 대부분은 허영이다. 부끄러움 없이, 소유 없이, 개처럼 자연대로 살기 — 논증 대신 퍼포먼스로 싸운 실천 철학자.",
      en: "Cynicism, the way of the dog. Most conventions are vanity. Live shameless, possessionless, natural — a philosopher who fought with performances instead of arguments.",
    },
    analogy: {
      ko: "무소유 미니멀리즘의 원조. 다만 그는 '비우는 삶' 브이로그로 수익을 창출하지 않았다는 점이 결정적으로 다르다.",
      en: "The original minimalist. The decisive difference: he never monetized a decluttering vlog.",
    },
    agon: [{ id: "plato", clash: {
      ko: "플라톤이 인간을 '깃털 없는 두발짐승'이라 정의하자, 그는 털 뽑은 닭을 강의실에 던지며 외쳤다. \"여기 플라톤의 인간이 있다!\" 플라톤은 정의에 '넓은 발톱을 가진'을 덧붙여야 했다. 이론은 실물 하나에 진다 — 그의 평생 논증법이었다.",
      en: "When Plato defined man as a 'featherless biped,' Diogenes flung a plucked chicken into the lecture: \"Behold — Plato's man!\" The definition gained an amendment: 'with broad nails.' Theory loses to one exhibit — his lifelong method.",
    } }],
    lineage: { from: ["socrates"], to: ["epictetus"], note: {
      ko: "'미친 소크라테스'가 그의 별명이었다. 그의 자족(自足)이 스토아 학파의 뿌리가 된다.",
      en: "They called him 'Socrates gone mad.' His self-sufficiency became the taproot of Stoicism.",
    } },
    myth: null,
    dilemma: { ko: "지금 가진 것의 90%가 사라져도 당신은 당신입니까? 끝까지 붙잡을 10%는 무엇입니까?", en: "If 90% of what you own vanished, are you still you? What's in the 10% you'd keep?" },
    axes: { reasonVsWill: -60, selfVsCommunity: 90, absoluteVsRelative: -30, meaningVsAbsurd: 20 },
  },

  epicurus: {
    id: "epicurus", nameKo: "에피쿠로스", nameEn: "Epicurus", years: "341–270 BCE",
    era: 1, school: { ko: "정원학파", en: "The Garden" }, side: "will", visual: "garden",
    caption: { ko: "정원 — 숨어서 잘 살기", en: "The Garden — live well, hidden" },
    scene: {
      ko: "아테네 외곽에 정원을 사서 공동체를 꾸렸다. 여성도 노예도 받았다 — 당시로선 스캔들. 원칙은 하나, 쾌락이 최고선이다. 그런데 그 쾌락의 실체는 잔치가 아니라 빵과 물, 그리고 좋은 친구들과의 대화였다.",
      en: "He bought a garden outside Athens and built a community admitting women and slaves — scandalous then. One principle: pleasure is the highest good. And that pleasure turned out to be bread, water, and good friends talking.",
    },
    quote: {
      original: "ὁ θάνατος οὐδὲν πρὸς ἡμᾶς. (ho thanatos ouden pros hēmas)",
      originalLang: "grc",
      en: "Death is nothing to us.",
      ko: "죽음은 우리에게 아무것도 아니다.",
      source: { ko: "〈메노이케우스에게 보내는 편지〉", en: "Letter to Menoeceus" },
      sting: { ko: "그리스인의 근원 공포를 논리 한 줄로 해체 — 내가 있는 동안 죽음은 없고, 죽음이 오면 내가 없다.", en: "The Greek terror of death, dissolved in one line: while I am, death is not; when death is, I am not." },
    },
    weapon: {
      ko: "쾌락주의 — 오해된 버전 말고. 쾌락 = 고통과 불안의 부재(아타락시아). 욕망을 키워서가 아니라 줄여서 도달한다. 필요한 것은 생각보다 훨씬 적다.",
      en: "Hedonism — the real version. Pleasure = absence of pain and anxiety (ataraxia), reached by shrinking desires, not feeding them. You need far less than you think.",
    },
    analogy: {
      ko: "'소확행'의 원조 특허권자. 다만 그는 소확행이 취향이 아니라 엄밀한 계산의 결과라 말한다 — 어떤 쾌락은 이자가 고통으로 붙는다.",
      en: "The original patent on 'small certain happiness' — except for him it's strict accounting: some pleasures charge interest, payable in pain.",
    },
    agon: [{ id: "epictetus", clash: {
      ko: "에픽테토스: \"쾌락을 좇는 삶은 운에 인질 잡힌 삶이다. 덕만이 흔들리지 않는다.\" — 에피쿠로스: \"당신들의 그 '덕'도 결국 평온이 좋아서 아닌가. 솔직해집시다.\" 고대의 양대 자기계발 학파는 서로를 수백 년간 저격했다.",
      en: "Epictetus: \"A life chasing pleasure is hostage to luck. Only virtue stands.\" — Epicurus: \"And you keep your 'virtue' because tranquility feels good. Let's be honest.\" Antiquity's two great self-help schools sniped at each other for centuries.",
    } }],
    lineage: { from: [], to: ["bentham"], note: {
      ko: "쾌락을 계산한다는 아이디어의 첫 판 — 2천 년 뒤 벤담이 이 계산기를 사회 전체 크기로 확대한다.",
      en: "The first draft of pleasure-as-calculation. Two millennia later Bentham scales the calculator to society size.",
    } },
    myth: { ko: "'에피쿠리언 = 미식가·향락가'는 역사적 누명이다. 그의 식단은 빵과 물이었고, 치즈가 오면 잔칫날이라 했다.", en: "'Epicurean = gourmand' is historical slander. His diet was bread and water; cheese made it a feast day." },
    dilemma: { ko: "요즘 당신을 가장 괴롭히는 욕망 하나 — 그걸 채우는 게 답입니까, 줄이는 게 답입니까?", en: "Your most nagging desire — is the answer feeding it, or shrinking it?" },
    axes: { reasonVsWill: -30, selfVsCommunity: 60, absoluteVsRelative: -40, meaningVsAbsurd: 30 },
  },

  seneca: {
    id: "seneca", nameKo: "세네카", nameEn: "Seneca", years: "c.4 BCE–65 CE",
    era: 1, school: { ko: "스토아", en: "Stoicism" }, side: "reason", visual: "stoa",
    caption: { ko: "폭풍 속의 기둥 — 시간의 회계사", en: "A pillar in the storm — the accountant of time" },
    scene: {
      ko: "네로 황제의 스승이자 로마 최고 부자 철학자 — '말과 삶이 다르다'는 비난을 평생 받았다. 결국 제자 네로가 반역 혐의를 씌워 자결을 명했다. 그는 친구들 앞에서 담담히 정맥을 열었다. 평생 글로 연습해 온 죽음이었다.",
      en: "Nero's tutor and Rome's richest philosopher — dogged by the charge that his words and wealth didn't match. In the end his own student ordered his suicide. Before his friends, calmly, he opened his veins — the death he had rehearsed in writing all his life.",
    },
    quote: {
      original: "Non exiguum temporis habemus, sed multum perdidimus.",
      originalLang: "la",
      en: "It is not that we have a short time to live, but that we waste much of it.",
      ko: "우리에게 시간이 적은 것이 아니라, 우리가 많이 버리는 것이다.",
      source: { ko: "《인생의 짧음에 관하여》", en: "On the Shortness of Life" },
      sting: { ko: "'인생은 짧다'는 만국 공통의 한탄을 정면 반박 — 짧은 것은 인생이 아니라 당신의 주의력이다.", en: "Humanity's oldest complaint, rebutted head-on: what's short is not life but your attention." },
    },
    weapon: {
      ko: "시간의 회계. 돈은 아까워하면서 시간은 아무에게나 퍼주는 모순을 겨눈다. 미래 걱정과 과거 후회에 지출되는 시간이 진짜 낭비다.",
      en: "Time accounting. We guard our money and hand our hours to anyone. The real waste: time spent worrying forward and regretting backward.",
    },
    analogy: {
      ko: "주 40시간이 찍힌 스크린타임 리포트 앞에서 '시간이 없다'고 말하는 우리 — 세네카는 2천 년 전에 이미 그 리포트를 발송했다.",
      en: "Saying 'I have no time' over a 40-hour screen-time report. Seneca mailed that report two thousand years ago.",
    },
    agon: [{ id: "epicurus", clash: {
      ko: "에피쿠로스: \"숨어서 살라. 정치는 평온의 적이다.\" — 세네카: \"도망이 평온인가. 폭풍의 한가운데서 흔들리지 않는 것이 평온이다.\" 흥미로운 건, 그가 편지에서 에피쿠로스를 즐겨 인용했다는 사실 — 좋은 문장 앞에서는 학파도 잊는 사람이었다.",
      en: "Epicurus: \"Live hidden; politics is tranquility's enemy.\" — Seneca: \"Is flight tranquility? Tranquility is standing unshaken in the middle of the storm.\" Yet he loved quoting Epicurus — a man who forgot school lines before a good sentence.",
    } }],
    lineage: { from: ["diogenes"], to: ["aurelius"], note: {
      ko: "에픽테토스, 아우렐리우스와 함께 로마 스토아 삼두. 노예와 황제가 같은 학파라는 사실 자체가 스토아의 요점이다.",
      en: "With Epictetus and Marcus Aurelius, the Roman Stoic trio. That a slave and an emperor share one school is the point of Stoicism.",
    } },
    myth: null,
    dilemma: { ko: "지난 일주일에서 '버린 시간' 하나를 회수할 수 있다면, 어디에 다시 쓰겠습니까?", en: "If you could reclaim one wasted hour from last week, where would you respend it?" },
    axes: { reasonVsWill: 70, selfVsCommunity: 10, absoluteVsRelative: 60, meaningVsAbsurd: 70 },
  },

  epictetus: {
    id: "epictetus", nameKo: "에픽테토스", nameEn: "Epictetus", years: "c.50–135",
    era: 1, school: { ko: "스토아", en: "Stoicism" }, side: "reason", visual: "stoa",
    caption: { ko: "통제의 이분법 — 내 것과 내 것 아닌 것", en: "The dichotomy of control — mine and not mine" },
    scene: {
      ko: "절름발이 노예로 태어났다. 주인이 다리를 비틀자 \"부러질 겁니다\"라고 담담히 말했고, 부러지자 \"부러진다고 했잖습니까\"라고 했다는 일화가 전해진다. 해방 후 철학 교사가 되었고, 그의 강의록은 훗날 로마 황제의 애독서가 된다.",
      en: "Born a lame slave. As his master twisted his leg he said calmly, \"It will break\" — and when it broke: \"I told you it would.\" Freed, he became a teacher; his lecture notes ended up at a Roman emperor's bedside.",
    },
    quote: {
      original: "Τῶν ὄντων τὰ μέν ἐστιν ἐφ' ἡμῖν, τὰ δὲ οὐκ ἐφ' ἡμῖν. (tōn ontōn ta men estin eph' hēmin, ta de ouk eph' hēmin)",
      originalLang: "grc",
      en: "Some things are within our power, and some are not.",
      ko: "어떤 것들은 우리에게 달려 있고, 어떤 것들은 그렇지 않다.",
      source: { ko: "《엥케이리디온》 1장", en: "Enchiridion, ch. 1" },
      sting: { ko: "노예였던 자가 '자유는 신분이 아니라 판단의 문제'라고 선언 — 로마의 자유인들이 뜨끔했다.", en: "A former slave declaring freedom a matter of judgment, not status — Rome's freemen felt it land." },
    },
    weapon: {
      ko: "통제의 이분법. 평판, 건강, 타인의 마음 — 내 것 아님. 나의 판단과 반응 — 내 것. 불행은 이 두 목록을 혼동하는 데서 온다.",
      en: "The dichotomy of control. Reputation, health, other minds — not yours. Your judgments and responses — yours. Misery is filing things in the wrong column.",
    },
    analogy: {
      ko: "악플. 달리는 건 통제 밖, 읽고 밤새는 건 통제 안. 에픽테토스라면 알림이 아니라 '그 말이 나를 정의하는가'라는 판단을 껐을 것이다.",
      en: "Hate comments: their arrival is outside your control; the sleepless night is inside it. Epictetus would mute not the notification but the judgment.",
    },
    agon: [{ id: "epicurus", clash: {
      ko: "에피쿠로스: \"고통은 피하는 것이 상책.\" — 에픽테토스: \"피할 수 없는 고통은 어쩔 텐가. 당신 철학은 날씨가 좋을 때만 작동한다. 내 철학은 다리가 부러지는 동안에도 작동했다.\"",
      en: "Epicurus: \"Best to avoid pain.\" — Epictetus: \"And unavoidable pain? Your philosophy runs only in fair weather. Mine ran while my leg was breaking.\"",
    } }],
    lineage: { from: ["diogenes"], to: ["aurelius"], note: {
      ko: "그의 강의록이 황제 마르쿠스의 침대맡에 놓였다. 노예의 철학이 제국을 다스린 셈이다.",
      en: "His notes sat at Emperor Marcus's bedside. A slave's philosophy governed the empire.",
    } },
    myth: null,
    dilemma: { ko: "지금 당신을 괴롭히는 일에서 '통제 가능한 부분'만 골라내 보세요. 전체의 몇 %입니까?", en: "Take what's troubling you and isolate the controllable part. What percent is it?" },
    axes: { reasonVsWill: 75, selfVsCommunity: 30, absoluteVsRelative: 70, meaningVsAbsurd: 60 },
  },

  aurelius: {
    id: "aurelius", nameKo: "아우렐리우스", nameEn: "Marcus Aurelius", years: "121–180",
    era: 1, school: { ko: "스토아", en: "Stoicism" }, side: "reason", visual: "stoa",
    caption: { ko: "황제의 일기 — 제목은 '나 자신에게'", en: "An emperor's diary, titled 'To Himself'" },
    scene: {
      ko: "로마 제국 전성기의 황제. 전염병, 전쟁, 측근의 반란 속에서 진중 막사의 등불 아래 그리스어로 일기를 썼다. 출판할 생각이 전혀 없던 메모 — 제목부터 '나 자신에게'다. 그것이 《명상록》, 세계 최고 권력자의 셀프 상담 기록이다.",
      en: "Emperor at Rome's height. Amid plague, war, and betrayal he wrote a diary in Greek by lamplight in army camps — never meant for publication, titled 'To Himself.' That is the Meditations: the self-therapy log of the world's most powerful man.",
    },
    quote: {
      original: "ὁ κόσμος ἀλλοίωσις, ὁ βίος ὑπόληψις. (ho kosmos alloiōsis, ho bios hypolēpsis)",
      originalLang: "grc",
      en: "The universe is change; life is judgment.",
      ko: "우주는 변화이고, 삶은 판단이다.",
      source: { ko: "《명상록》 4.3", en: "Meditations 4.3" },
      sting: { ko: "황제가 매일 스스로에게 되뇐 것 — 네가 다스릴 수 있는 것은 제국이 아니라 네 해석뿐이다.", en: "What the emperor repeated daily to himself: what you govern is not the empire but your interpretation." },
    },
    weapon: {
      ko: "관점의 훈련. 사건과 해석을 분리하라 — 모욕은 내가 모욕이라 '판단'할 때 완성된다. 매일 아침 '오늘 무례한 자들을 만날 것이다'라고 예습하는 실전 기술.",
      en: "Training of perspective. Separate event from reading — an insult completes only when judged one. The drill: rehearse each morning, 'today I will meet the rude.'",
    },
    analogy: {
      ko: "회사 단톡방의 그 말투. 사건은 텍스트 한 줄, 지옥은 내 해석이 짓는다 — 황제도 같은 문제로 일기를 썼다.",
      en: "That tone in the group chat: the event is one line of text; the hell is built by your reading. The emperor kept a diary about the same problem.",
    },
    agon: [{ id: "self", name: "자기 자신", nameEnOv: "Himself", clash: {
      ko: "《명상록》의 대전은 전부 내전이다. 분노하려는 마르쿠스 대(對) 황제여야 하는 마르쿠스. 그는 매일 졌고, 매일 다시 썼다 — 이 책이 2천 년을 산 이유다.",
      en: "Every battle in the Meditations is a civil war: Marcus who wants to rage vs. Marcus who must be emperor. He lost daily, and wrote again daily — which is why the book has lived two thousand years.",
    } }],
    lineage: { from: ["epictetus"], to: [], note: {
      ko: "노예 에픽테토스의 강의록을 황제가 배웠다 — 스토아가 신분의 철학이 아니라는 살아 있는 증명.",
      en: "An emperor learning from a slave's notes — living proof that Stoicism is no philosophy of rank.",
    } },
    myth: null,
    dilemma: { ko: "오늘 가장 거슬렸던 일을 '사건'과 '내 해석'으로 나눠 적어보세요. 해석을 빼면 무엇이 남습니까?", en: "Split today's most irritating moment into 'event' and 'my reading.' Remove the reading — what's left?" },
    axes: { reasonVsWill: 70, selfVsCommunity: -10, absoluteVsRelative: 55, meaningVsAbsurd: 65 },
  },

  confucius: {
    id: "confucius", nameKo: "공자", nameEn: "Confucius", years: "551–479 BCE",
    era: 1, east: true, school: { ko: "유가", en: "Confucianism" }, side: "reason", visual: "balance",
    caption: { ko: "저울 — 관계의 균형", en: "The balance — equilibrium of relations" },
    scene: {
      ko: "춘추시대의 난세. 자기 사상을 채용해 줄 군주를 찾아 14년을 떠돌았고 번번이 거절당했다. '상갓집 개 같다'는 조롱까지 들었다. 정치로는 실패한 남자 — 그의 어록이 이후 2천 년 동아시아의 운영체제가 될 줄은 본인도 몰랐다.",
      en: "The chaos of the Spring and Autumn period. For 14 years he wandered, pitching his ideas to ruler after ruler, rejected every time — mocked as 'a stray dog at a house of mourning.' A political failure whose sayings became East Asia's operating system for two millennia.",
    },
    quote: {
      original: "學而時習之，不亦說乎。",
      originalLang: "zh",
      en: "To learn, and in due time to practice it — is this not a joy?",
      ko: "배우고 때에 맞게 익히니, 또한 기쁘지 아니한가.",
      source: { ko: "《논어》 학이편 — 첫 문장", en: "Analects, Book I — the opening line" },
      sting: { ko: "배움을 출세의 수단이 아니라 기쁨 그 자체로 놓은 개막 선언.", en: "The opening declaration that learning is a joy in itself, not a ladder." },
    },
    weapon: {
      ko: "인(仁)과 예(禮). 사람다움(仁)은 타고나는 것이 아니라 관계 속 훈련(禮)으로 빚어진다. 좋은 사회는 제도보다 먼저 좋은 습관에서 온다.",
      en: "Ren and li. Humaneness is not innate but forged through ritual practice within relationships. Good societies come from good habits before good institutions.",
    },
    analogy: {
      ko: "'매너가 사람을 만든다'. 공자는 이 대사를 2500년 먼저, 훨씬 진지하게 했다 — 형식이 마음을 조각한다고.",
      en: "'Manners maketh man.' Confucius delivered the line 2,500 years earlier, and meant it more deeply: form sculpts the heart.",
    },
    agon: [{ id: "laozi", clash: {
      ko: "노자: \"예(禮)? 인위다. 자연스러움을 깎아내는 끌이다.\" — 공자: \"자연대로 두면 강한 자의 자연만 남는다. 문명은 약자를 위한 발명품이다.\" 전설에 따르면 공자는 노자를 만나고 돌아와 제자들에게 말했다 — 오늘 용을 본 것 같다.",
      en: "Laozi: \"Ritual? Artifice — a chisel carving away the natural.\" — Confucius: \"Leave things natural, and only the strong man's nature survives. Civilization is an invention for the weak.\" Legend says Confucius returned from meeting Laozi and told his students: today I think I saw a dragon.",
    } }],
    lineage: { from: [], to: [], note: {
      ko: "과거제도, 족보, 제사, '어른 앞에서는'으로 시작하는 모든 문장 — 당신이 동아시아에 산다면 그의 계보 안에 산다.",
      en: "Civil examinations, family registers, ancestral rites — if you live in East Asia, you live inside his lineage.",
    } },
    myth: null,
    dilemma: { ko: "지키기 귀찮지만 계속 지키는 예의 하나 — 왜 계속합니까?", en: "One courtesy you find tiresome yet keep observing — why do you keep it?" },
    axes: { reasonVsWill: 55, selfVsCommunity: -85, absoluteVsRelative: 60, meaningVsAbsurd: 80 },
  },

  laozi: {
    id: "laozi", nameKo: "노자", nameEn: "Laozi", years: "전설상 6C BCE",
    era: 1, east: true, school: { ko: "도가", en: "Taoism" }, side: "will", visual: "yield_",
    caption: { ko: "물은 바위와 싸우지 않는다", en: "Water does not fight the rock" },
    scene: {
      ko: "실존 여부부터 논쟁인 인물. 전설에 따르면 주나라 도서관 사서였고, 세상에 질려 물소를 타고 서쪽 관문을 나서려 하자 문지기가 붙잡았다 — 떠나시려면 가르침을 남기고 가시라. 그렇게 5천 자를 쓰고 사라졌다. 그것이 《도덕경》이다.",
      en: "Whether he existed is itself debated. Legend: a Zhou archivist who, weary of the world, rode a water buffalo toward the western pass — where the gatekeeper stopped him: leave your teaching before you leave. He wrote five thousand characters and vanished. That is the Tao Te Ching.",
    },
    quote: {
      original: "道可道，非常道。",
      originalLang: "zh",
      en: "The Tao that can be spoken is not the eternal Tao.",
      ko: "도라고 말할 수 있는 도는 영원한 도가 아니다.",
      source: { ko: "《도덕경》 1장", en: "Tao Te Ching, ch. 1" },
      sting: { ko: "책의 첫 문장이 '이 책은 진짜를 담을 수 없다'는 자기 부정 — 언어의 한계 선언으로 시작하는 유일한 고전.", en: "A book that opens by denying itself — the only classic that begins with a disclaimer about language." },
    },
    weapon: {
      ko: "무위(無爲). 안 하는 것이 아니라 억지로 하지 않는 것. 물처럼 — 가장 부드럽지만 바위를 이긴다. 통치도 삶도, 힘을 뺄수록 강해진다.",
      en: "Wu wei — not inaction, but unforced action. Like water: softest of all, yet it defeats the rock. In ruling as in living, strength grows as force is released.",
    },
    analogy: {
      ko: "억지로 잠들려 할수록 잠이 달아나는 밤. 노자의 처방은 모든 영역에서 같다 — 움켜쥔 손을 펴라.",
      en: "The harder you chase sleep, the further it runs. Laozi's prescription is the same everywhere: open the clenched hand.",
    },
    agon: [{ id: "confucius", clash: {
      ko: "공자: \"어지러운 세상일수록 배우고 다듬어야 한다.\" — 노자: \"그 '다듬음'이 어지러움의 원인이다. 큰 도가 무너지자 인의(仁義)가 생겨났다 — 도덕을 소리 높여 외치는 사회는 이미 병든 사회다.\"",
      en: "Confucius: \"The more chaotic the world, the more we must learn and refine.\" — Laozi: \"That refinement is the cause. When the great Tao declined, 'benevolence' appeared — a society preaching virtue is already sick.\"",
    } }],
    lineage: { from: [], to: ["zhuangzi"], note: {
      ko: "장자가 그의 5천 자를 우화와 농담의 우주로 확장한다.",
      en: "Zhuangzi expands his five thousand characters into a universe of fables and jokes.",
    } },
    myth: null,
    dilemma: { ko: "지금 애쓸수록 꼬이는 일이 있습니까? 손을 놓으면 무슨 일이 벌어질 것 같습니까?", en: "What in your life tangles further the harder you try? What might happen if you let go?" },
    axes: { reasonVsWill: -70, selfVsCommunity: 40, absoluteVsRelative: -60, meaningVsAbsurd: 40 },
  },

  zhuangzi: {
    id: "zhuangzi", nameKo: "장자", nameEn: "Zhuangzi", years: "c.369–286 BCE",
    era: 1, east: true, school: { ko: "도가", en: "Taoism" }, side: "will", visual: "butterfly",
    caption: { ko: "나비의 꿈 — 누가 누구의 꿈인가", en: "The butterfly dream — who dreams whom?" },
    scene: {
      ko: "재상 자리를 제안받자 진흙탕의 거북이 얘기로 거절했다 — 죽어 비단에 싸여 모셔지느니, 진흙에서 꼬리 끌며 살겠소. 아내가 죽자 대야를 두드리며 노래해 문상 온 친구를 경악시켰다. 슬픔이 없어서가 아니라, 삶과 죽음이 계절의 순환 같음을 보았기 때문이라 했다.",
      en: "Offered the prime ministership, he declined with a turtle story: better to drag my tail in the mud alive than be venerated dead in silk. When his wife died he drummed a basin and sang, horrifying a mourner — not for lack of grief, he said, but because life and death had shown themselves as seasons.",
    },
    quote: {
      original: "不知周之夢為胡蝶與？胡蝶之夢為周與？",
      originalLang: "zh",
      en: "Am I a man who dreamt of being a butterfly — or a butterfly now dreaming it is a man?",
      ko: "내가 나비 꿈을 꾼 것인가, 나비가 지금 내 꿈을 꾸는 것인가?",
      source: { ko: "《장자》 제물론", en: "Zhuangzi, 'On the Equality of Things'" },
      sting: { ko: "'나'라는 확실성의 바닥을 빼버린 질문 — 데카르트보다 1900년 빠르다.", en: "The question that pulled the floor from under 'I' — 1,900 years before Descartes." },
    },
    weapon: {
      ko: "물화(物化)와 소요유(逍遙遊). 옳고 그름, 나와 남, 꿈과 현실의 경계는 관점의 산물이다. 경계가 흐려질 때 열리는 것 — 어디에도 매이지 않는 노닒.",
      en: "Transformation and free roaming. Right/wrong, self/other, dream/waking — boundaries are artifacts of perspective. When they blur, something opens: a wandering bound to nothing.",
    },
    analogy: {
      ko: "게임 캐릭터에 몰입한 새벽 3시 — 로그아웃하면 어느 쪽이 본체인가. 장자는 그 질문을 웃으면서 던지고, 답은 주지 않는다.",
      en: "3 a.m., deep in your game character — when you log out, which is the main body? Zhuangzi asks it smiling, and leaves the answer out.",
    },
    agon: [{ id: "huishi", name: "혜시", nameEnOv: "Hui Shi", clash: {
      ko: "논리학자 혜시는 평생의 친구이자 논적이었다. 혜시: \"자네 말은 크기만 하고 쓸모가 없네.\" — 장자: \"쓸모없는 땅이라고 다 파버리면 자네가 선 땅도 꺼지네. 쓸모는 쓸모없음 위에 서 있는 걸세.\" 혜시가 죽자 장자는 말했다 — 이제 더불어 말할 사람이 없구나.",
      en: "The logician Hui Shi was his lifelong friend and sparring partner. Hui Shi: \"Your words are vast and useless.\" — Zhuangzi: \"Dig away all the 'useless' ground and the patch you stand on collapses. Usefulness stands on uselessness.\" When Hui Shi died: now there is no one left to talk with.",
    } }],
    lineage: { from: ["laozi"], to: [], note: {
      ko: "선불교의 유머와 역설, 동아시아 예술의 여백 — 그의 나비가 앉았다 간 자리들이다.",
      en: "Zen's humor and paradox, the empty space in East Asian art — places his butterfly briefly landed.",
    } },
    myth: null,
    dilemma: { ko: "'이것만은 절대 나다'라고 할 것 하나를 적고, 그것이 꿈이어도 성립하는지 따져보세요.", en: "Name one thing that is absolutely you — then test whether it survives being a dream." },
    axes: { reasonVsWill: -75, selfVsCommunity: 70, absoluteVsRelative: -85, meaningVsAbsurd: -10 },
  },

  buddha: {
    id: "buddha", nameKo: "붓다", nameEn: "The Buddha", years: "c.5–4C BCE",
    era: 1, east: true, school: { ko: "불교", en: "Buddhism" }, side: "will", visual: "flameout",
    caption: { ko: "불어서 끄다 — 니르바나", en: "Blown out — nirvana" },
    scene: {
      ko: "왕자였다. 스물아홉에 성 밖에서 노인, 병자, 시신, 그리고 수행자를 차례로 보고 성을 떠났다. 6년의 고행으로 몸을 부수다가 — 고행 역시 답이 아님을 깨닫고 보리수 아래 앉았다. 새벽별이 뜰 때, '깨어난 자(붓다)'가 되었다.",
      en: "A prince. At 29, outside the palace walls, he saw in turn an old man, a sick man, a corpse, and an ascetic — and left. Six years of austerity broke his body before he saw that too was no answer, and sat beneath the Bodhi tree. As the morning star rose, he became the Awakened One.",
    },
    quote: {
      original: "Manopubbaṅgamā dhammā manoseṭṭhā manomayā.",
      originalLang: "pi",
      en: "Mind precedes all things; mind is their chief; they are mind-made.",
      ko: "모든 것은 마음이 앞서 가고, 마음이 이끌며, 마음으로 이루어진다.",
      source: { ko: "《법구경》 제1게", en: "Dhammapada, verse 1" },
      sting: { ko: "고통의 범인으로 세계가 아니라 마음의 습관을 지목 — 수사의 방향을 통째로 바꾼 것.", en: "Naming the culprit of suffering not the world but the habits of mind — redirecting the entire investigation." },
    },
    weapon: {
      ko: "사성제. 삶에 고통이 있다(苦), 원인은 갈애다(集), 갈애가 꺼지면 고통도 꺼진다(滅), 그 길이 있다(道). 진단-원인-예후-처방, 의사의 문법으로 짠 철학.",
      en: "The Four Noble Truths: there is suffering; its cause is craving; craving extinguished, suffering ends; there is a path. A philosophy in a physician's grammar — diagnosis, cause, prognosis, prescription.",
    },
    analogy: {
      ko: "위시리스트를 비우니 사고 싶은 것 자체가 줄어드는 역설. 욕망은 채워서가 아니라 시들게 해서 끝난다 — 붓다는 그것을 시스템 전체에 적용했다.",
      en: "Empty the wishlist and the wanting itself shrinks. Desire ends not by feeding but by withering — applied to the whole system.",
    },
    agon: [{ id: "nietzsche", clash: {
      ko: "니체는 불교를 '수동적 허무주의'라 불렀다 — \"고통을 끄겠다고? 그것은 삶의 볼륨을 끄는 것이다.\" 붓다 쪽의 응수는 간단했을 것이다 — 꺼지는 것은 삶이 아니라 갈애다. 불이 꺼진 손은 더 자유롭게 움직인다.",
      en: "Nietzsche called Buddhism 'passive nihilism' — \"Extinguish suffering? You are turning down the volume of life.\" The Buddha's reply would be simple: what goes out is not life but craving. A hand no longer burning moves more freely.",
    } }],
    lineage: { from: [], to: ["schopenhauer"], note: {
      ko: "쇼펜하우어가 그를 유럽에 수입한다 — 그리고 절반쯤 오해한다. 체념과 소멸의 철학으로 읽은 것이다.",
      en: "Schopenhauer imported him to Europe — and half misread him, as resignation and extinction.",
    } },
    myth: null,
    dilemma: { ko: "지금 가장 강한 갈망 하나 — 그것이 이뤄진 다음 날 아침을 상상해 보세요. 무엇이 남아 있습니까?", en: "Your strongest craving — imagine the morning after it's fulfilled. What remains?" },
    axes: { reasonVsWill: -50, selfVsCommunity: -20, absoluteVsRelative: 30, meaningVsAbsurd: -30 },
  },

  augustine: {
    id: "augustine", nameKo: "아우구스티누스", nameEn: "Augustine", years: "354–430",
    era: 2, school: { ko: "교부철학", en: "Patristics" }, side: "will", visual: "ember",
    caption: { ko: "쉴 곳을 찾는 불씨", en: "An ember searching for rest" },
    scene: {
      ko: "젊은 날은 본인 회고 기준으로 방탕 그 자체 — \"저에게 순결을 주소서, 다만 아직은 말고\"라는 기도가 《고백록》에 실제로 나온다. 밀라노의 정원에서 '집어서 읽어라'라는 아이들의 노랫소리를 듣고 성경을 폈다가 인생이 꺾였다. 서른둘이었다.",
      en: "His youth, by his own account, was pure dissipation — the Confessions really contains the prayer \"Give me chastity — but not yet.\" In a Milan garden he heard children singing 'take up and read,' opened the scriptures, and his life broke in two. He was thirty-two.",
    },
    quote: {
      original: "Fecisti nos ad te et inquietum est cor nostrum, donec requiescat in te.",
      originalLang: "la",
      en: "You have made us for yourself, and our heart is restless until it rests in you.",
      ko: "당신을 향해 우리를 지으셨기에, 당신 안에 쉬기까지 우리 마음은 쉼이 없나이다.",
      source: { ko: "《고백록》 1권 1장", en: "Confessions, Book I, ch. 1" },
      sting: { ko: "철학책을 신에게 보내는 편지로 쓴 최초의 인물 — '나'의 내면이 철학의 무대가 된 순간.", en: "The first to write philosophy as a letter to God — the moment the inner 'I' became philosophy's stage." },
    },
    weapon: {
      ko: "내면의 발견. 시간은 어디 있는가 — 과거는 기억에, 미래는 기대에, 현재는 직관에. 전부 마음 안이다. '내면 성찰'이라는 장르의 발명자.",
      en: "The discovery of inwardness. Where is time? Past in memory, future in expectation, present in attention — all inside the mind. He invented introspection as a genre.",
    },
    analogy: {
      ko: "새 폰, 새 연애, 새 직장 — 그때뿐인 채움의 반복. 그의 진단: 무한을 향해 설계된 마음에 유한한 것을 계속 넣고 있어서다.",
      en: "New phone, new romance, new job — the fill that never holds. His diagnosis: you keep loading finite things into a heart designed for the infinite.",
    },
    agon: [{ id: "pelagius", name: "펠라기우스", nameEnOv: "Pelagius", clash: {
      ko: "펠라기우스: \"인간은 스스로의 힘으로 선해질 수 있다.\" — 아우구스티누스: \"그 자신감이야말로 병이다. 의지는 이미 기울어져 있다.\" 자유의지 논쟁의 원형 — 이 싸움은 지금도 '노력이냐 환경이냐'로 이름만 바꿔 계속되고 있다.",
      en: "Pelagius: \"Man can become good by his own power.\" — Augustine: \"That confidence is the disease. The will is already tilted.\" The prototype free-will debate — still running today under the alias 'effort vs. circumstance.'",
    } }],
    lineage: { from: ["plato"], to: ["aquinas"], note: {
      ko: "플라톤을 기독교의 언어로 번역했다. 천 년 뒤 루터가 그의 책에서 종교개혁의 불씨를 꺼낸다.",
      en: "He translated Plato into Christian. A millennium later Luther pulled the Reformation's ember from his pages.",
    } },
    myth: null,
    dilemma: { ko: "당신의 마음이 끝내 쉬지 못하는 지점은 어디입니까? 무엇이면 채워질 것 같습니까?", en: "Where exactly does your heart refuse to rest? What do you imagine would fill it?" },
    axes: { reasonVsWill: -20, selfVsCommunity: -30, absoluteVsRelative: 85, meaningVsAbsurd: 90 },
  },

  aquinas: {
    id: "aquinas", nameKo: "토마스 아퀴나스", nameEn: "Thomas Aquinas", years: "1225–1274",
    era: 2, school: { ko: "스콜라철학", en: "Scholasticism" }, side: "reason", visual: "arch",
    caption: { ko: "믿음과 이성 — 한 아치의 두 다리", en: "Faith and reason — two legs of one arch" },
    scene: {
      ko: "귀족 가문은 그가 탁발 수도회에 들어가는 것을 막으려 1년간 성에 감금했고, 형들은 여자를 방에 들여보내 유혹하게 했다. 그는 벽난로의 불붙은 장작을 들고 쫓아냈다. 별명은 '벙어리 황소' — 과묵한 거구. 그 황소가 중세 최대의 지적 건축물 《신학대전》을 지었다.",
      en: "His noble family locked him in a castle for a year to stop him joining a mendicant order; his brothers sent a woman to tempt him. He drove her out with a burning log. They called him 'the Dumb Ox' — the silent giant who built the Middle Ages' greatest intellectual cathedral, the Summa.",
    },
    quote: {
      original: "Gratia non tollit naturam, sed perficit.",
      originalLang: "la",
      en: "Grace does not destroy nature, but perfects it.",
      ko: "은총은 자연을 파괴하지 않고 완성한다.",
      source: { ko: "《신학대전》 I q.1 a.8 (통용 인용형)", en: "Summa Theologiae I q.1 a.8 (standard citation form)" },
      sting: { ko: "신앙과 이성이 적이라는 천 년의 전제를 기각 — 이교도 아리스토텔레스를 교회의 기둥으로 세운 문장.", en: "It overruled a millennium-old premise that faith and reason are enemies — installing the pagan Aristotle as a pillar of the Church." },
    },
    weapon: {
      ko: "종합의 건축술. 이성으로 갈 수 있는 데까지 간다(신 존재의 다섯 가지 길). 이성이 끝나는 곳에서 신앙이 이어받는다. 둘은 경쟁자가 아니라 한 아치의 양쪽 다리다.",
      en: "The architecture of synthesis. Go as far as reason carries (the Five Ways); where reason ends, faith takes the handoff. Not rivals — two legs of one arch.",
    },
    analogy: {
      ko: "과학과 종교의 싸움이 지겨울 때 — 아퀴나스는 둘을 담당 구역이 다른 동료로 재배치했다. 13세기의 중재안이 아직 현역이다.",
      en: "Tired of the science-vs-religion brawl? Aquinas reassigned them as colleagues with different jurisdictions. A 13th-century settlement still in service.",
    },
    agon: [{ id: "ockham", clash: {
      ko: "오컴: \"그 웅장한 체계, 면도날로 밀어보면 대부분 장식입니다.\" — 아퀴나스의 대성당에 다음 세대의 오컴이 철거 검토서를 붙였다. 중세의 정점과 중세의 해체가 한 세기 간격으로 마주 선다.",
      en: "Ockham: \"That magnificent system — run a razor over it and most is ornament.\" A generation later, a demolition review was taped to Aquinas's cathedral. The medieval summit and its dismantling, one century apart.",
    } }],
    lineage: { from: ["aristotle", "augustine"], to: [], note: {
      ko: "죽기 몇 달 전 신비 체험 후 절필했다 — \"내가 쓴 모든 것이 지푸라기 같다.\" 미완의 《신학대전》은 그렇게 지푸라기인 채로 서양 사상의 기둥이 됐다.",
      en: "Months before death, after a mystical experience, he stopped writing: \"All I have written seems like straw.\" The unfinished Summa became, straw and all, a pillar of Western thought.",
    } },
    myth: null,
    dilemma: { ko: "당신이 '증명 없이 믿는 것' 하나와 '증명돼야 믿는 것' 하나 — 그 경계선은 어디에 있습니까?", en: "One thing you believe without proof, one that requires proof — where exactly is the line?" },
    axes: { reasonVsWill: 85, selfVsCommunity: -40, absoluteVsRelative: 90, meaningVsAbsurd: 95 },
  },

  ockham: {
    id: "ockham", nameKo: "오컴", nameEn: "William of Ockham", years: "c.1287–1347",
    era: 2, school: { ko: "유명론", en: "Nominalism" }, side: "reason", visual: "razor",
    caption: { ko: "면도날 — 필요 없는 것은 벤다", en: "The razor — cut what is not needed" },
    scene: {
      ko: "청빈 논쟁으로 교황청과 정면충돌해 파문당하고 황제의 궁정으로 망명했다. 전해지는 말 — \"폐하가 칼로 저를 지켜주시면, 저는 펜으로 폐하를 지키겠습니다.\" 중세의 심장부에서, 중세를 해체할 도구를 갈던 사람.",
      en: "He collided with the papacy over the poverty controversy, was excommunicated, and fled to the emperor's court. The attributed line: \"Defend me with the sword, and I will defend you with the pen.\" At the heart of the medieval world, sharpening the tool that would dismantle it.",
    },
    quote: {
      original: "Numquam ponenda est pluralitas sine necessitate.",
      originalLang: "la",
      en: "Plurality is never to be posited without necessity.",
      ko: "필연 없이 여럿을 상정하지 마라.",
      source: { ko: "《오르디나티오》 등 저작", en: "Ordinatio and other works" },
      sting: { ko: "설명에 필요 없는 존재는 전부 삭제 — 중세의 화려한 형이상학에 대한 재고 정리 선언.", en: "Delete every entity the explanation doesn't need — an inventory clearance served on medieval metaphysics." },
    },
    weapon: {
      ko: "면도날 + 유명론. '인간성' 같은 보편자는 실재가 아니라 이름일 뿐 — 실재하는 것은 개별자다. 이 칼질이 실험과학의 길을 닦았다.",
      en: "The razor + nominalism. Universals like 'humanity' are names, not realities — only individuals exist. This cut cleared the road for experimental science.",
    },
    analogy: {
      ko: "음모론 대 단순한 설명. 우연과 실수로 충분한 일에 거대한 배후를 상정하지 말 것 — 오컴의 면도날은 지금도 매일 사용된다.",
      en: "Conspiracy vs. the simple account: never posit a cabal where accident and error suffice. The razor gets daily use.",
    },
    agon: [{ id: "aquinas", clash: {
      ko: "아퀴나스: \"이성은 신학의 시녀로서 봉사한다.\" — 오컴: \"차라리 갈라섭시다. 신앙은 신앙대로, 이성은 이성대로 — 섞으면 둘 다 흐려집니다.\" 이 분리 선언이 훗날 과학의 독립선언문 초안이 된다.",
      en: "Aquinas: \"Reason serves as theology's handmaiden.\" — Ockham: \"Better to separate: faith as faith, reason as reason — blend them and both blur.\" That separation became the rough draft of science's declaration of independence.",
    } }],
    lineage: { from: ["aquinas"], to: ["locke"], note: {
      ko: "개별자만 실재한다는 그의 원칙이 3세기 뒤 경험론으로 발아한다.",
      en: "His principle that only individuals are real sprouts, three centuries on, as empiricism.",
    } },
    myth: { ko: "유명한 문구 '존재자는 필요 이상으로 늘리지 말라(Entia non sunt multiplicanda...)'는 후대의 요약으로, 그의 저작에 그 형태 그대로는 등장하지 않는다.", en: "The famous 'Entia non sunt multiplicanda...' is a later summary — it appears nowhere in his works in that form." },
    dilemma: { ko: "요즘 당신이 하고 있는 복잡한 설명 하나 — 더 단순한 설명이 있는데 피하는 중은 아닙니까? 왜?", en: "One complicated explanation you're running — is there a simpler one you're avoiding? Why?" },
    axes: { reasonVsWill: 80, selfVsCommunity: 30, absoluteVsRelative: 20, meaningVsAbsurd: 40 },
  },

  descartes: {
    id: "descartes", nameKo: "데카르트", nameEn: "René Descartes", years: "1596–1650",
    era: 3, school: { ko: "합리론", en: "Rationalism" }, side: "reason", visual: "lastpoint",
    caption: { ko: "모든 게 지워져도 남는 한 점", en: "The one point that survives every erasure" },
    scene: {
      ko: "1619년 겨울, 독일의 난로 방에 틀어박혀 하루 종일 사색하다 결심했다 — 배운 것 전부를 버리고 학문을 혼자 처음부터 다시 세우겠다고. 늦잠이 평생의 작업 습관이었는데, 말년에 스웨덴 여왕이 새벽 5시 과외를 요구했다. 그 겨울 폐렴으로 죽었다.",
      en: "Winter 1619: shut in a stove-heated room in Germany, he resolved to discard everything he'd learned and rebuild knowledge alone, from zero. Late rising was his lifelong work habit — until the Queen of Sweden demanded 5 a.m. tutorials. He died of pneumonia that winter.",
    },
    quote: {
      original: "Cogito, ergo sum.",
      originalLang: "la",
      en: "I think, therefore I am.",
      ko: "나는 생각한다, 그러므로 존재한다.",
      source: { ko: "《방법서설》(1637, 프랑스어) / 《철학원리》(1644, 라틴어)", en: "Discourse on Method (1637, Fr.) / Principles of Philosophy (1644, La.)" },
      sting: { ko: "신도, 세계도, 내 몸마저 전부 의심한 끝에 남은 단 하나 — 의심하고 있는 나. 확실성의 영점 조정.", en: "After doubting God, world, and his own body, one thing remained: the doubter. The zero-point calibration of certainty." },
    },
    weapon: {
      ko: "방법적 회의. 조금이라도 의심 가능하면 일단 전부 기각한다. 무너지지 않는 지점을 찾아 그 위에 다시 쌓는다 — 근대 철학의 리셋 버튼.",
      en: "Methodical doubt. Reject everything that admits the slightest doubt; find the point that cannot fall, and rebuild on it. Modern philosophy's reset button.",
    },
    analogy: {
      ko: "딥페이크와 AI 생성물의 시대 — '전부 조작이라면?'이라는 그의 사고실험은 이제 사고실험이 아니다. 그의 답: 속고 있는 중에도, 속는 내가 있다는 것만은 참이다.",
      en: "In the age of deepfakes, his thought experiment — 'what if it's all fabricated?' — is no longer a thought experiment. His answer: even while being deceived, the one being deceived exists.",
    },
    agon: [{ id: "hume", clash: {
      ko: "흄: \"그 '나'라는 것도 지각의 다발일 뿐이다. 극장에 무대는 없고, 지나가는 장면들만 있다.\" — 데카르트가 마지막 벽돌이라 믿은 자아를, 흄은 벽돌이 아니라 흐름이라고 했다.",
      en: "Hume: \"That 'I' is only a bundle of perceptions. The theater has no stage — only passing scenes.\" The self Descartes took for the last unshakable brick, Hume declared a current, not a brick.",
    } }],
    lineage: { from: [], to: ["spinoza", "kant"], note: {
      ko: "그가 그은 정신/물질의 이원론이 이후 3세기의 숙제가 된다 — 스피노자가 접합을, 칸트가 재설계를 맡는다.",
      en: "His mind/matter dualism became the next three centuries' homework — Spinoza attempting the weld, Kant the redesign.",
    } },
    myth: null,
    dilemma: { ko: "모든 것이 시뮬레이션이라 해도 흔들리지 않을 당신의 확실성 하나는 무엇입니까?", en: "If everything were simulation, what one certainty of yours would still stand?" },
    axes: { reasonVsWill: 95, selfVsCommunity: 40, absoluteVsRelative: 80, meaningVsAbsurd: 70 },
  },

  spinoza: {
    id: "spinoza", nameKo: "스피노자", nameEn: "Baruch Spinoza", years: "1632–1677",
    era: 3, school: { ko: "합리론", en: "Rationalism" }, side: "reason", visual: "onesub",
    caption: { ko: "전부 하나의 실체 안 — 신 즉 자연", en: "All within one substance — God, or Nature" },
    scene: {
      ko: "스물셋에 암스테르담 유대 공동체에서 최고 수위의 파문을 당했다 — 저주 문구가 낭독됐고, 누구도 그와 말을 섞는 것이 금지됐다. 그는 항소하지 않았다. 렌즈를 갈아 생계를 이었고, 하이델베르크 교수직 제안도 사상의 자유를 이유로 거절했다. 유리 가루가 폐를 갉아 마흔넷에 죽었다.",
      en: "At 23, Amsterdam's Jewish community excommunicated him with its harshest ban — curses read aloud, all contact forbidden. He did not appeal. He ground lenses for a living, declined a Heidelberg professorship to keep his freedom of thought, and died at 44, lungs eaten by glass dust.",
    },
    quote: {
      original: "Sed omnia praeclara tam difficilia, quam rara sunt.",
      originalLang: "la",
      en: "But all things excellent are as difficult as they are rare.",
      ko: "그러나 모든 고귀한 것은 어려운 만큼 드물다.",
      source: { ko: "《에티카》 마지막 문장 (1677, 사후 출간)", en: "Ethics, final sentence (1677, posthumous)" },
      sting: { ko: "기하학 증명 형식으로 쓴 책의 폐회사 — 자유라는 최고 난도 코스를 완주한 자의 담담한 마지막 줄.", en: "The closing line of a book written as geometric proofs — the calm sign-off of a man who finished the hardest course: freedom." },
    },
    weapon: {
      ko: "신 즉 자연(Deus sive Natura). 신은 세계 밖의 감독이 아니라 세계 그 자체다. 기적도 목적도 없다 — 필연의 질서를 이해하는 것이 자유이고, 그 이해가 곧 기쁨이다.",
      en: "Deus sive Natura. God is not a director outside the world but the world itself. No miracles, no purposes — freedom is understanding necessity, and that understanding is joy.",
    },
    analogy: {
      ko: "'왜 하필 나에게'라는 질문을 '이 일은 어떤 원인들의 결과인가'로 바꾸는 순간 억울함이 줄어드는 경험 — 스피노자 치료법의 핵심이다.",
      en: "Swap 'why me?' for 'what causes produced this?' and feel the grievance shrink — the core of the Spinoza treatment.",
    },
    agon: [{ id: "descartes", clash: {
      ko: "데카르트: \"정신과 물질은 별개의 실체다.\" — 스피노자: \"실체가 둘이면 신이 둘이란 말인가. 실체는 하나뿐이고, 정신과 물질은 그 한 실체의 두 얼굴이다.\" 스승의 이원론을 접수해 일원론으로 재건축했다.",
      en: "Descartes: \"Mind and matter are separate substances.\" — Spinoza: \"Two substances — two gods, then? Substance is one; mind and matter are two faces of it.\" He took over the dualism and rebuilt it as monism.",
    } }],
    lineage: { from: ["descartes"], to: ["hegel"], note: {
      ko: "한 세기 뒤 독일에서 '스피노자냐 아니냐'가 지식인의 리트머스가 된다. 헤겔의 평 — 철학을 하려면 먼저 스피노자주의자여야 한다.",
      en: "A century later, 'Spinozist or not' became the German intellectual's litmus test. Hegel's verdict: to philosophize at all, one must first be a Spinozist.",
    } },
    myth: null,
    dilemma: { ko: "당신에게 일어난 나쁜 일 하나를 '누구 탓'이 아니라 '원인의 사슬'로 다시 써보세요. 감정이 달라집니까?", en: "Rewrite one bad event as a chain of causes instead of someone's fault. Does the feeling change?" },
    axes: { reasonVsWill: 90, selfVsCommunity: -20, absoluteVsRelative: 85, meaningVsAbsurd: 75 },
  },

  leibniz: {
    id: "leibniz", nameKo: "라이프니츠", nameEn: "Gottfried Leibniz", years: "1646–1716",
    era: 3, school: { ko: "합리론", en: "Rationalism" }, side: "reason", visual: "worlds",
    caption: { ko: "가능한 세계들 — 그중 최선 하나", en: "Possible worlds — and the best one among them" },
    scene: {
      ko: "미적분을 뉴턴과 독립적으로 발명하고 평생 표절 시비에 시달렸다. 외교관, 궁정 사서, 광산 기술자, 계산기 발명가 — 흔들리는 마차 안에서도 쓰고 또 썼다. '낙관주의'의 대명사가 됐지만, 그의 낙관은 안이함이 아니라 계산이었다.",
      en: "He invented calculus independently of Newton and spent his life fighting the plagiarism charge. Diplomat, court librarian, mining engineer, calculator inventor — he wrote even in jolting carriages. He became the byword for optimism, but his optimism was not complacency. It was computation.",
    },
    quote: {
      original: "le meilleur des mondes possibles",
      originalLang: "fr",
      en: "the best of all possible worlds",
      ko: "가능한 모든 세계 가운데 최선의 세계",
      source: { ko: "《변신론》 (1710)", en: "Théodicée (1710)" },
      sting: { ko: "악의 존재를 부정하지 않으면서 신을 변호하는 최고 난도의 수 — 그리고 볼테르의 평생 놀림감이 된 표현.", en: "The highest-difficulty move: defending God without denying evil — and Voltaire's favorite punching bag ever after." },
    },
    weapon: {
      ko: "충족이유율. 어떤 것도 이유 없이 존재하지 않는다. 신은 무한한 가능 세계를 비교 검토했고, 전체 최적값이 이 세계다 — 부분의 악은 전체 최적화의 비용이라는 주장.",
      en: "The principle of sufficient reason. Nothing exists without a reason. God reviewed infinite possible worlds and selected the global optimum — local evils being the cost of total optimization.",
    },
    analogy: {
      ko: "최적화 알고리즘. 모든 조건을 만족하는 해가 없을 때, 전체 손실을 최소화하는 해를 고른다 — 라이프니츠의 신은 우주 규모의 솔버였다.",
      en: "An optimization algorithm: when no solution satisfies every constraint, pick the one minimizing total loss. Leibniz's God was a universe-scale solver.",
    },
    agon: [{ id: "voltaire", clash: {
      ko: "1755년 리스본 대지진으로 수만 명이 죽자, 볼테르가 《캉디드》로 조롱을 퍼부었다 — \"이것이 최선이라면 대체 최악은 무엇인가?\" 라이프니츠 사후 40년의 일이라 반론은 없었다. 철학사에서 가장 유명한 일방적 구타.",
      en: "When the 1755 Lisbon earthquake killed tens of thousands, Voltaire unloaded Candide on him — \"If this is the best, what on earth is the worst?\" Leibniz had been dead forty years; no rebuttal came. Philosophy's most famous one-sided beating.",
    } }],
    lineage: { from: ["descartes"], to: ["russell"], note: {
      ko: "그의 논리학 노트는 2세기 뒤 러셀이 재발견해 경악한다 — 기호논리학이 이미 절반쯤 그 안에 있었다.",
      en: "Two centuries later Russell rediscovered his logic notebooks in astonishment — symbolic logic already half-built inside.",
    } },
    myth: null,
    dilemma: { ko: "당신 인생의 큰 불운 하나 — 그것 없이 지금의 좋은 것들이 있었을까요? 냉정하게 계산해 보세요.", en: "One major misfortune of yours — would today's good things exist without it? Run the numbers coldly." },
    axes: { reasonVsWill: 90, selfVsCommunity: -10, absoluteVsRelative: 85, meaningVsAbsurd: 90 },
  },

  pascal: {
    id: "pascal", nameKo: "파스칼", nameEn: "Blaise Pascal", years: "1623–1662",
    era: 3, school: { ko: "실존의 선구", en: "Proto-Existentialism" }, side: "will", visual: "reed",
    caption: { ko: "생각하는 갈대", en: "The thinking reed" },
    scene: {
      ko: "열아홉에 계산기를 발명한 천재 수학자. 1654년 11월 23일 밤, 강렬한 신비 체험을 하고 그 기록을 양피지에 적어 죽을 때까지 외투 안감에 꿰매 넣고 다녔다 — '불. 철학자와 학자의 신이 아니라, 아브라함의 신.' 서른아홉에 죽으며 미완의 메모 뭉치를 남겼다. 그것이 《팡세》다.",
      en: "A prodigy who invented a calculator at nineteen. On the night of November 23, 1654, he had an overwhelming mystical experience and sewed the record into his coat lining, where it stayed until his death — 'Fire. God of Abraham — not of the philosophers and scholars.' He died at 39, leaving a bundle of unfinished notes: the Pensées.",
    },
    quote: {
      original: "L'homme n'est qu'un roseau, le plus faible de la nature ; mais c'est un roseau pensant.",
      originalLang: "fr",
      en: "Man is only a reed, the weakest in nature; but he is a thinking reed.",
      ko: "인간은 자연에서 가장 연약한 갈대일 뿐이다. 그러나 생각하는 갈대다.",
      source: { ko: "《팡세》 (1670, 사후)", en: "Pensées (1670, posthumous)" },
      sting: { ko: "위대함과 비참함을 한 문장에 — 우주는 나를 부술 수 있지만, 부서지는 것을 아는 것은 나뿐이다.", en: "Grandeur and misery in one sentence: the universe can crush me, but only I know I am being crushed." },
    },
    weapon: {
      ko: "마음의 논리. \"마음에는 이성이 알지 못하는 이성이 있다.\" 인간은 기분전환(divertissement)으로 자기 비참을 외면하는 존재 — 인간의 모든 불행은 방에 혼자 조용히 앉아 있지 못하는 데서 온다는 진단.",
      en: "The heart's logic: \"The heart has its reasons, which reason does not know.\" Humans dodge their own misery through diversion — all of man's unhappiness, he diagnosed, comes from being unable to sit quietly alone in a room.",
    },
    analogy: {
      ko: "잠들기 전 스크롤을 멈추면 밀려오는 그 정적. 파스칼은 우리가 콘텐츠가 아니라 정적으로부터 도망친다고 봤다 — 17세기에 이미.",
      en: "The silence that floods in when you stop scrolling before sleep. Pascal saw it in the 17th century: we are fleeing not toward content but away from silence.",
    },
    agon: [{ id: "descartes", clash: {
      ko: "파스칼의 메모 — \"데카르트: 무용하고 불확실하다.\" 신을 세계의 첫 손가락 튕김으로만 쓰는 '철학자의 신'에게는 기도할 수 없다는 것. 이성의 건축가와 심장의 도박사 — 근대의 두 기질이 여기서 갈린다.",
      en: "Pascal's note reads: \"Descartes: useless and uncertain.\" One cannot pray to a 'philosopher's God' hired only to flick the first domino. The architect of reason vs. the gambler of the heart — modernity's two temperaments part here.",
    } }],
    lineage: { from: [], to: ["kierkegaard"], note: {
      ko: "체계가 아니라 단독자의 절박함으로 신 앞에 서는 계보 — 2세기 뒤 키르케고르가 이 자리를 이어받는다.",
      en: "Standing before God not with a system but with a single soul's urgency — a lineage Kierkegaard inherits two centuries on.",
    } },
    myth: null,
    dilemma: { ko: "아무것도 하지 않고 방에 30분 혼자 앉아 있을 수 있습니까? 무엇이 제일 먼저 견디기 어려워집니까?", en: "Can you sit alone in a room for 30 minutes doing nothing? What becomes unbearable first?" },
    axes: { reasonVsWill: -40, selfVsCommunity: 20, absoluteVsRelative: 80, meaningVsAbsurd: 85 },
  },

  hobbes: {
    id: "hobbes", nameKo: "홉스", nameEn: "Thomas Hobbes", years: "1588–1679",
    era: 3, school: { ko: "사회계약론", en: "Social Contract" }, side: "reason", visual: "cage",
    caption: { ko: "늑대들, 그리고 우리(檻) — 리바이어던", en: "Wolves, and the cage — Leviathan" },
    scene: {
      ko: "스페인 무적함대가 온다는 공포 속에 조산아로 태어났다 — \"어머니는 나와 공포, 쌍둥이를 낳았다\"는 자평. 내전을 피해 파리로 망명했고, 91세까지 살며 만인의 미움을 받았다. 왕당파는 왕권을 세속화해서, 교회는 무신론자라서, 공화파는 절대권력을 옹호해서 싫어했다. 전원 적중이다.",
      en: "Born premature amid panic over the Spanish Armada — \"my mother gave birth to twins: myself and fear,\" he quipped. He fled civil war to Paris and lived to 91, hated by everyone: royalists for secularizing kingship, the Church for atheism, republicans for defending absolute power. All three had a point.",
    },
    quote: {
      original: "solitary, poor, nasty, brutish, and short",
      originalLang: "en",
      en: "(the life of man in the state of nature is) solitary, poor, nasty, brutish, and short",
      ko: "(자연 상태에서 인간의 삶은) 고독하고, 가난하고, 험악하고, 잔인하고, 짧다.",
      source: { ko: "《리바이어던》 13장 (1651)", en: "Leviathan, ch. 13 (1651)" },
      sting: { ko: "인간 본성에 대한 모든 낭만에 찬물 — 국가가 없으면 남는 것은 목가가 아니라 만인의 만인에 대한 전쟁이다.", en: "Cold water on every romance about human nature: without the state, what remains is not pastoral but the war of all against all." },
    },
    weapon: {
      ko: "사회계약 — 공포 버전. 국가는 신이 준 것이 아니라 겁먹은 개인들의 거래다. 자유의 일부를 내고 안전을 산다 — 리바이어던이라는 인공 괴물의 설계도.",
      en: "The social contract, fear edition. The state is not God-given but a deal struck by frightened individuals: trade a slice of liberty for safety. The blueprint of an artificial monster called Leviathan.",
    },
    analogy: {
      ko: "신호등. 낭만은 없지만, 그것이 없는 교차로를 상상해 보라 — 홉스의 국가론은 결국 신호등 예찬이다.",
      en: "Traffic lights: zero romance, but picture the intersection without them. Hobbes's theory of the state is, at bottom, an ode to traffic lights.",
    },
    agon: [{ id: "rousseau", clash: {
      ko: "루소: \"자연 상태의 인간은 선했다. 그를 늑대로 만든 것은 사회다.\" — 홉스: \"그 순진함이 제일 위험하다. 계약서 없이 선의에 기대는 순간, 강한 자의 세상이 온다.\" 인간 본성을 둘러싼 근대 최대의 맞고소.",
      en: "Rousseau: \"Man in nature was good; society made him a wolf.\" — Hobbes: \"That innocence is the real danger. Lean on goodwill without a contract, and the strong inherit the earth.\" Modernity's biggest counter-suit over human nature.",
    } }],
    lineage: { from: [], to: ["locke", "rousseau"], note: {
      ko: "'계약으로서의 국가'라는 틀 자체가 그의 발명 — 로크와 루소는 조항을 고쳐 쓴 후계자들이다.",
      en: "The frame 'state as contract' is his invention — Locke and Rousseau are successors who rewrote the clauses.",
    } },
    myth: null,
    dilemma: { ko: "법과 CCTV가 하루 정지된다면, 당신의 도시에는 무슨 일이 일어날 것 같습니까? 당신은요?", en: "If law and cameras paused for one day, what would happen in your city? And what would you do?" },
    axes: { reasonVsWill: 75, selfVsCommunity: -50, absoluteVsRelative: 60, meaningVsAbsurd: 30 },
  },

  rousseau: {
    id: "rousseau", nameKo: "루소", nameEn: "Jean-Jacques Rousseau", years: "1712–1778",
    era: 3, school: { ko: "사회계약론", en: "Social Contract" }, side: "will", visual: "chain",
    caption: { ko: "끊어지려는 사슬 하나", en: "One link, straining to break" },
    scene: {
      ko: "제네바 시계공의 아들. 뱅센 감옥의 디드로를 면회 가던 길에 현상 공모 광고를 보고, 나무 아래서 계시처럼 눈물을 쏟았다는 것이 본인의 회고다 — 문명이 인간을 타락시켰다는 직관. 파리 살롱의 스타가 됐지만 거의 모두와 절교했고, 말년은 피해망상 속 고독한 산책자로 보냈다.",
      en: "Son of a Geneva watchmaker. Walking to visit Diderot in prison, he saw an essay-contest notice and — by his own account — wept under a tree as if struck by revelation: civilization has corrupted man. He became the star of Paris salons, broke with nearly everyone, and ended as a paranoid, solitary walker.",
    },
    quote: {
      original: "L'homme est né libre, et partout il est dans les fers.",
      originalLang: "fr",
      en: "Man is born free, and everywhere he is in chains.",
      ko: "인간은 자유롭게 태어났으나, 어디서나 사슬에 묶여 있다.",
      source: { ko: "《사회계약론》 1장 (1762)", en: "The Social Contract, ch. 1 (1762)" },
      sting: { ko: "출간 27년 뒤, 프랑스 혁명이 이 문장을 슬로건으로 채택한다 — 세계가 문자 그대로 뒤집혔다.", en: "Twenty-seven years after publication, the French Revolution adopted the line as a slogan — and the world literally turned over." },
    },
    weapon: {
      ko: "일반의지. 정당한 권력의 유일한 원천은 공동체 전체의 의지다. 그리고 《에밀》 — 사회가 망치기 전의 자연을 지키는 교육론. 감정의, 그리고 '아이'라는 존재의 발견자.",
      en: "The general will: the only legitimate source of power is the will of the whole community. And Émile — an education designed to protect nature before society ruins it. The discoverer of feeling, and of childhood itself.",
    },
    analogy: {
      ko: "'다 리셋하고 싶다'는 충동의 철학 버전. 다만 루소의 리셋은 원시로의 회귀가 아니라 계약의 재작성이다 — 이번에는 전원 서명으로.",
      en: "The philosophical version of 'I want to reset everything.' Except his reset is not a return to the wild but a rewriting of the contract — this time with everyone's signature.",
    },
    agon: [
      { id: "hobbes", clash: {
        ko: "홉스: \"자연 상태는 전쟁이다.\" — 루소: \"당신이 자연인이라 부른 그 늑대는, 이미 사회가 키운 늑대다. 거울을 보고 인류를 그리지 마시오.\"",
        en: "Hobbes: \"The state of nature is war.\" — Rousseau: \"That wolf you call natural man is a wolf society raised. Stop painting humanity from your own mirror.\"",
      } },
      { id: "voltaire", clash: {
        ko: "《인간 불평등 기원론》을 받아 든 볼테르의 답장 — \"인류를 다시 네 발로 걷게 만들고 싶어지는 책, 잘 읽었소.\" 루소는 이 조롱을 평생 잊지 않았다. 계몽주의의 두 얼굴은 서로를 견딜 수 없었다.",
        en: "Voltaire's reply upon receiving the Discourse on Inequality: \"One acquires the urge to walk on all fours — thank you for the read.\" Rousseau never forgot it. The two faces of the Enlightenment could not stand each other.",
      } },
    ],
    lineage: { from: ["hobbes"], to: ["kant"], note: {
      ko: "칸트는 산책을 거른 적이 없는 사람이었는데, 《에밀》을 읽다가 한 번 걸렀다는 일화가 전해진다. 도덕의 존엄이라는 칸트의 주제에 루소의 지문이 찍혀 있다.",
      en: "Kant, who never missed his daily walk, reportedly skipped it once — absorbed in Émile. Rousseau's fingerprints are on Kant's theme of moral dignity.",
    } },
    myth: null,
    dilemma: { ko: "당신을 묶고 있는 사슬 하나 — 그것은 누가 채웠습니까? 당신이 서명한 적이 있습니까?", en: "One chain binding you — who fastened it? Did you ever sign for it?" },
    axes: { reasonVsWill: -65, selfVsCommunity: -40, absoluteVsRelative: 30, meaningVsAbsurd: 60 },
  },

  locke: {
    id: "locke", nameKo: "로크", nameEn: "John Locke", years: "1632–1704",
    era: 3, school: { ko: "경험론", en: "Empiricism" }, side: "reason", visual: "blankpage",
    caption: { ko: "백지 — 경험이 쓴다", en: "The blank page — experience writes" },
    scene: {
      ko: "왕의 폭주를 견제하는 편에 섰다가 망명길에 오른 의사이자 철학자. 명예혁명과 함께 귀국해, 그 혁명의 사후 이론서가 될 책들을 쏟아냈다. 훗날 미국 독립선언문은 사실상 그의 문장 리믹스다 — 생명, 자유, 재산.",
      en: "A physician-philosopher who sided against royal overreach and paid with exile. He returned with the Glorious Revolution and published the books that became its retroactive theory. The American Declaration of Independence is essentially a remix of his sentences — life, liberty, property.",
    },
    quote: {
      original: "Let us then suppose the mind to be, as we say, white paper, void of all characters.",
      originalLang: "en",
      en: "Let us then suppose the mind to be, as we say, white paper, void of all characters.",
      ko: "마음을 아무 글자도 적히지 않은 백지라고 가정해 보자.",
      source: { ko: "《인간지성론》 2권 (1689)", en: "An Essay Concerning Human Understanding, Book II (1689)" },
      sting: { ko: "타고난 관념이라는 특권의 폐지 — 지식도, 왕의 권리도, 태생이 아니라 경험과 동의가 쓴다.", en: "The abolition of innate privilege: knowledge, like kingship, is written by experience and consent, not birth." },
    },
    weapon: {
      ko: "두 개의 백지. 지식은 전부 경험에서, 권력은 전부 동의에서. 정해진 것은 없고, 쓰는 것은 우리다 — 인식론과 정치학이 한 장의 종이 위에 있다.",
      en: "Two blank pages: all knowledge from experience, all power from consent. Nothing is pre-written; we do the writing — epistemology and politics on a single sheet.",
    },
    analogy: {
      ko: "새 계정. 팔로우도 기록도 0에서 시작해, 내가 쓰는 대로 내가 된다 — 로크의 마음 모델이자 그가 설계한 시민의 모델이다.",
      en: "A fresh account: zero follows, zero history, becoming whatever gets written. Locke's model of the mind — and of the citizen.",
    },
    agon: [{ id: "descartes", clash: {
      ko: "데카르트: \"신 관념은 타고난다.\" — 로크: \"갓난아기에게 물어보셨는가. 어떤 관념이든 족보를 대라 — 부모는 전부 경험이다.\"",
      en: "Descartes: \"The idea of God is innate.\" — Locke: \"Have you asked a newborn? Every idea must show its pedigree — and the parents are always experience.\"",
    } }],
    lineage: { from: ["ockham"], to: ["berkeley", "hume"], note: {
      ko: "그의 백지에서 경험론 삼대(로크-버클리-흄)가 시작된다 — 그리고 각 세대가 앞 세대보다 한 칸씩 더 밀어붙인다.",
      en: "From his blank page begins the empiricist dynasty — Locke, Berkeley, Hume — each generation pushing one square further than the last.",
    } },
    myth: null,
    dilemma: { ko: "지금의 당신을 만든 결정적 경험 세 개만 꼽는다면? 그 셋이 없었다면 당신은 누구였을까요?", en: "Name the three experiences that most made you. Without them, who would you be?" },
    axes: { reasonVsWill: 60, selfVsCommunity: 40, absoluteVsRelative: 20, meaningVsAbsurd: 55 },
  },

  berkeley: {
    id: "berkeley", nameKo: "버클리", nameEn: "George Berkeley", years: "1685–1753",
    era: 3, school: { ko: "관념론", en: "Idealism" }, side: "reason", visual: "eye",
    caption: { ko: "보이지 않으면, 존재하는가", en: "Unseen — does it exist?" },
    scene: {
      ko: "아일랜드의 주교. '물질은 존재하지 않는다'고 주장해 런던의 조롱거리가 됐다 — 존슨 박사는 돌을 걷어차며 \"이렇게 반박한다!\"고 외쳤다. 함정은, 그것이 반박이 안 된다는 것이다. 발끝에 느껴진 그 단단함 역시 결국 지각이니까.",
      en: "An Irish bishop who claimed matter does not exist — London's favorite joke. Dr. Johnson kicked a stone and cried, \"I refute it thus!\" The catch: it refutes nothing. The hardness at his toe was, once again, a perception.",
    },
    quote: {
      original: "Esse est percipi.",
      originalLang: "la",
      en: "To be is to be perceived.",
      ko: "존재하는 것은 지각되는 것이다.",
      source: { ko: "《인간 지식의 원리론》 (1710)", en: "A Treatise Concerning the Principles of Human Knowledge (1710)" },
      sting: { ko: "로크의 경험론을 한 칸만 더 밀었더니 물질이 증발했다 — 경험 밖의 '물질 자체'야말로 증명 불가능한 미신이라는 역공.", en: "Push Locke's empiricism one square and matter evaporates — the counterattack: 'matter itself,' outside all experience, is the real unprovable superstition." },
    },
    weapon: {
      ko: "관념론. 우리가 아는 것은 지각뿐인데 왜 지각 뒤에 '물질'을 이중으로 상정하는가. 세계는 신이 상영 중인 지각의 총체 — 아무도 안 볼 때 나무가 존재하는 이유는, 신이 보고 있어서다.",
      en: "Idealism. All we ever know are perceptions — why double-book 'matter' behind them? The world is the totality of perceptions God is screening. The tree exists when no one looks because God is looking.",
    },
    analogy: {
      ko: "게임 최적화 — 시야에 든 것만 렌더링한다. 버클리의 우주는 신이 돌리는 렌더링 서버라는 농담이 가능하다. 반박은 존슨 박사 생각보다 어렵다.",
      en: "Game optimization: render only what's in view. Berkeley's universe as God's rendering server — a joke that's harder to refute than Dr. Johnson thought.",
    },
    agon: [{ id: "locke", clash: {
      ko: "로크: \"지각 뒤에 물질이 있다.\" — 버클리: \"본 적 있으신가? 당신의 원칙 — 경험만이 근거 — 을 적용하면 제일 먼저 잘리는 것이 그 '물질'이오.\" 스승의 칼로 스승의 기둥을 벤 사건.",
      en: "Locke: \"Matter stands behind perception.\" — Berkeley: \"Ever seen it? Apply your own rule — experience as the only ground — and 'matter' is the first thing cut.\" He felled the master's pillar with the master's own blade.",
    } }],
    lineage: { from: ["locke"], to: ["hume"], note: {
      ko: "흄이 같은 칼을 이어받아 '자아'와 '인과'마저 벤다 — 경험론 삼대의 마지막 칼질.",
      en: "Hume inherits the same blade and cuts down 'self' and 'causation' too — the dynasty's final stroke.",
    } },
    myth: null,
    dilemma: { ko: "아무도, 영원히, 지각하지 못하는 것 — 그것이 '존재한다'는 말에는 어떤 의미가 남습니까?", en: "Something no one will ever perceive — what meaning remains in saying it 'exists'?" },
    axes: { reasonVsWill: 70, selfVsCommunity: 20, absoluteVsRelative: 60, meaningVsAbsurd: 75 },
  },

  voltaire: {
    id: "voltaire", nameKo: "볼테르", nameEn: "Voltaire", years: "1694–1778",
    era: 3, school: { ko: "계몽주의", en: "Enlightenment" }, side: "reason", visual: "garden",
    caption: { ko: "정원을 가꿔라", en: "Cultivate the garden" },
    scene: {
      ko: "바스티유 투옥 두 번, 망명 수차례, 유럽 전역의 베스트셀러 작가이자 왕들의 펜팔. 1755년 리스본 대지진으로 수만 명이 죽자 '최선의 세계' 낙관론에 전쟁을 선포했다. 무기는 대포가 아니라 풍자 소설 — 《캉디드》 한 권으로 철학 하나를 침몰시켰다.",
      en: "Twice in the Bastille, exiled repeatedly, bestselling author across Europe and pen pal of kings. When the 1755 Lisbon earthquake killed tens of thousands, he declared war on 'best of all worlds' optimism. His artillery was a satirical novel — Candide sank a philosophy in one volume.",
    },
    quote: {
      original: "Il faut cultiver notre jardin.",
      originalLang: "fr",
      en: "We must cultivate our garden.",
      ko: "우리의 정원을 가꿔야 한다.",
      source: { ko: "《캉디드》 마지막 문장 (1759)", en: "Candide, final sentence (1759)" },
      sting: { ko: "온갖 지옥을 순회한 주인공의 결론이 거대 담론이 아니라 삽질 — 형이상학 전체를 향한 우아한 하야 권고.", en: "After touring every hell, the hero's conclusion is not a grand theory but a shovel — an elegant resignation notice served on all metaphysics." },
    },
    weapon: {
      ko: "관용(톨레랑스)과 풍자. 광신은 논증이 아니라 웃음에 약하다. 칼라스 사건의 재심을 여론전으로 끌어낸 — 철학을 캠페인으로 만든 최초의 인플루언서.",
      en: "Tolerance and satire. Fanaticism yields not to argument but to laughter. He forced the retrial of the Calas affair through public opinion — the first influencer to run philosophy as a campaign.",
    },
    analogy: {
      ko: "거대 담론 싸움에 지쳐 '일단 내 화분부터'가 되는 순간 — 그것이 도피가 아니라 결론일 수 있다는 것이 볼테르의 위로다.",
      en: "That moment of grand-debate fatigue when you turn to your own flowerpot — Voltaire's consolation is that this can be a conclusion, not an escape.",
    },
    agon: [{ id: "leibniz", clash: {
      ko: "라이프니츠: \"부분의 악은 전체 최적화의 비용이다.\" — 볼테르: \"리스본의 아이들에게 그 수식을 읽어주시오. 설명되는 악과 위로되는 고통은 다른 문제요.\" 이론의 완결성과 고통의 실감 — 철학이 늘 다시 서는 갈림길이다.",
      en: "Leibniz: \"Local evil is the cost of global optimization.\" — Voltaire: \"Read that equation to the children of Lisbon. Evil explained and suffering consoled are different problems.\" Theoretical completeness vs. felt pain — the fork philosophy keeps returning to.",
    } }],
    lineage: { from: ["locke"], to: [], note: {
      ko: "영국 망명 중 로크와 뉴턴을 발견해 프랑스에 수입했다 — 계몽주의는 절반쯤 그의 번역 사업이다.",
      en: "In English exile he discovered Locke and Newton and imported them to France — the Enlightenment is half his translation business.",
    } },
    myth: { ko: "\"당신 말에 동의하지 않지만, 당신이 말할 권리를 위해 목숨 걸고 싸우겠다\" — 그의 문장이 아니다. 1906년 전기 작가 이블린 홀이 그의 태도를 요약한 문장이 인용부호를 얻어버린 사례.", en: "\"I disapprove of what you say, but I will defend to the death your right to say it\" — not his. Biographer Evelyn Beatrice Hall's 1906 summary of his attitude, which somehow acquired quotation marks." },
    dilemma: { ko: "세상을 향한 분노와 내 정원 사이 — 당신의 에너지는 지금 몇 대 몇으로 배분돼 있습니까? 만족스럽습니까?", en: "Between rage at the world and your own garden — what's your current energy split? Satisfied with it?" },
    axes: { reasonVsWill: 70, selfVsCommunity: 40, absoluteVsRelative: -20, meaningVsAbsurd: 40 },
  },

  kierkegaard: {
    id: "kierkegaard", nameKo: "키르케고르", nameEn: "Søren Kierkegaard", years: "1813–1855",
    era: 4, school: { ko: "실존의 아버지", en: "Father of Existentialism" }, side: "will", visual: "leap",
    caption: { ko: "계산이 끝나는 곳에서, 도약", en: "Where calculation ends — the leap" },
    scene: {
      ko: "코펜하겐. 약혼자 레기네를 진심으로 사랑하면서 파혼했다 — 자신의 우울과 소명이 그녀를 불행하게 만들 것이라며. 평생 그 결정을 곱씹으며 여러 가명 뒤에 숨어 책을 쏟아냈고, 길거리 신문의 조롱 캠페인에 시달리다 마흔둘에 길에서 쓰러졌다.",
      en: "Copenhagen. Deeply in love with his fiancée Regine, he broke the engagement — convinced his melancholy and calling would make her miserable. He spent his life chewing that decision, pouring out books under pseudonyms, hounded by a tabloid mockery campaign, and collapsed in the street at forty-two.",
    },
    quote: {
      original: "Livet må forstås baglæns, men leves forlæns.",
      originalLang: "da",
      en: "Life must be understood backwards — but it must be lived forwards.",
      ko: "삶은 뒤돌아볼 때 이해되지만, 앞을 향해 살아야 한다.",
      source: { ko: "일기 (1843)", en: "Journals (1843)" },
      sting: { ko: "헤겔식 '전체 조망'의 불가능성을 한 줄로 — 이해가 완성되는 자리에 서면, 삶은 이미 지나가 있다.", en: "The impossibility of Hegel's total view, in one line: by the time understanding completes, life has already passed." },
    },
    weapon: {
      ko: "단독자의 실존. 진리는 체계가 아니라 '나에게 참인 것'이다. 신 앞에 홀로 선 결단 — 계산이 끝나는 곳에서의 도약. '실존'이라는 말의 저작권자.",
      en: "The single individual. Truth is not a system but 'what is true for me.' The decision made alone before God — a leap where calculation ends. He holds the copyright on the word 'existence.'",
    },
    analogy: {
      ko: "아무리 후기를 읽어도 결혼도 이직도 결국 점프다. 데이터가 결정을 대신해 주는 지점은 오지 않는다 — 키르케고르는 그 공백에 이름을 붙였다.",
      en: "Read all the reviews you want — marriage and career changes are still jumps. The point where data decides for you never arrives. Kierkegaard named that gap.",
    },
    agon: [{ id: "hegel", clash: {
      ko: "헤겔: \"개인은 세계사적 과정의 한 계기다.\" — 키르케고르: \"'과정' 좋아하시네. 그 체계 안에 정작 사는 사람이 없다. 교수님, 당신은 당신의 체계 어디에 삽니까?\" 익명의 덴마크 청년이 유럽 최대의 철학 제국에 던진 돌.",
      en: "Hegel: \"The individual is a moment in the world-historical process.\" — Kierkegaard: \"'Process,' sure. There's no one actually living inside that system. Professor — where in your system do you live?\" A pseudonymous Dane throwing a stone at Europe's largest philosophical empire.",
    } }],
    lineage: { from: ["pascal"], to: ["sartre", "heidegger"], note: {
      ko: "생전엔 코펜하겐 밖에서 거의 안 읽혔다. 20세기가 그를 재발견하며 실존주의 전체가 그의 파혼 위에 세워진다.",
      en: "Barely read outside Copenhagen in his lifetime. The 20th century rediscovered him — and built all of existentialism on top of his broken engagement.",
    } },
    myth: null,
    dilemma: { ko: "지금 미루고 있는 결정 하나 — 정보가 더 모이면 정말 쉬워집니까, 아니면 점프를 미루는 중입니까?", en: "One decision you're postponing — will more information really make it easier, or are you postponing the jump?" },
    axes: { reasonVsWill: -70, selfVsCommunity: 85, absoluteVsRelative: 70, meaningVsAbsurd: 85 },
  },

  marx: {
    id: "marx", nameKo: "마르크스", nameEn: "Karl Marx", years: "1818–1883",
    era: 4, school: { ko: "역사유물론", en: "Historical Materialism" }, side: "reason", visual: "invert",
    caption: { ko: "피라미드를 뒤집어라 — 토대가 위를 결정한다", en: "Flip the pyramid — the base determines the top" },
    scene: {
      ko: "프로이센에서 추방, 파리에서 추방, 브뤼셀에서 추방 — 런던 빈민가에 정착했다. 가난 속에 아이 셋을 잃었고, 대영박물관 열람실에서 매일 자본주의를 해부했다. 생계는 친구 엥겔스 — 공장주의 아들 — 이 댔다. 역사상 가장 유명한 아이러니 중 하나.",
      en: "Expelled from Prussia, from Paris, from Brussels — he settled in a London slum. He lost three children to poverty while dissecting capitalism daily in the British Museum reading room. The bills were paid by his friend Engels — a factory owner's son. One of history's most famous ironies.",
    },
    quote: {
      original: "Die Philosophen haben die Welt nur verschieden interpretiert; es kömmt aber darauf an, sie zu verändern.",
      originalLang: "de",
      en: "The philosophers have only interpreted the world in various ways; the point, however, is to change it.",
      ko: "철학자들은 세계를 다양하게 해석해 왔을 뿐이다. 그러나 중요한 것은 세계를 바꾸는 것이다.",
      source: { ko: "〈포이어바흐 테제〉 11 (1845)", en: "Theses on Feuerbach, XI (1845)" },
      sting: { ko: "철학 2500년 전체를 '해석 놀음'으로 정리하고 업종 변경을 선언한 문장 — 런던의 그의 묘비에 새겨져 있다.", en: "It filed 2,500 years of philosophy under 'interpretation games' and announced a change of trade — the line is carved on his London tombstone." },
    },
    weapon: {
      ko: "유물론적 역사관. 시대의 생각 — 법, 도덕, 종교 — 은 하늘에서 오지 않는다. 누가 무엇을 어떻게 생산하느냐가 토대이고, 생각은 그 위층이다. 역사의 엔진은 이념이 아니라 계급의 충돌.",
      en: "The materialist view of history. An era's ideas — law, morality, religion — do not fall from the sky. Who produces what, and how, is the base; ideas are the upper floor. History's engine is not ideals but class collision.",
    },
    analogy: {
      ko: "'노오력' 담론이 미심쩍을 때 — 판 자체가 기울어져 있지 않은지 토대부터 보자는 것. 동의하든 안 하든, 이 질문법 자체가 마르크스의 유산이다.",
      en: "Whenever 'just work harder' rings hollow — the move of checking whether the board itself is tilted. Agree with him or not, that way of asking is his legacy.",
    },
    agon: [{ id: "hegel", clash: {
      ko: "헤겔: \"역사를 움직이는 것은 정신이다.\" — 마르크스: \"물구나무선 변증법을 바로 세웠다. 움직이는 것은 정신이 아니라 밥이다.\" 스승의 엔진을 떼어내 정반대의 차체에 얹은 개조.",
      en: "Hegel: \"Spirit moves history.\" — Marx: \"I set the dialectic back on its feet — it was standing on its head. What moves history is not Spirit but bread.\" He unbolted the master's engine and mounted it in the opposite chassis.",
    } }],
    lineage: { from: ["hegel"], to: [], note: {
      ko: "20세기 역사의 절반이 그의 이름 아래 벌어졌다. 본인이 봤다면 뭐라 했을지는 영원한 논쟁거리 — 생전에 이미 \"나는 마르크스주의자가 아니다\"라고 말했다는 일화가 전해진다.",
      en: "Half of the 20th century happened under his name. What he'd have said is an eternal debate — he reportedly quipped in his lifetime, \"I am not a Marxist.\"",
    } },
    myth: null,
    dilemma: { ko: "당신의 견해 하나를 골라, 그것이 당신의 '처지'에서 나온 것은 아닌지 따져보세요. 처지가 바뀌면 그 견해도 바뀔까요?", en: "Pick one of your views and test whether it grew from your position. If the position changed, would the view?" },
    axes: { reasonVsWill: 60, selfVsCommunity: -90, absoluteVsRelative: 40, meaningVsAbsurd: 75 },
  },

  bentham: {
    id: "bentham", nameKo: "벤담", nameEn: "Jeremy Bentham", years: "1748–1832",
    era: 4, school: { ko: "공리주의", en: "Utilitarianism" }, side: "reason", visual: "manyscale",
    caption: { ko: "쾌락은 수로 센다", en: "Pleasure is counted" },
    scene: {
      ko: "괴짜 천재. 감옥 설계도(파놉티콘)를 정부에 팔러 다녔고, 동물의 고통을 진지하게 논한 최초급 인물이며, 유언으로 자기 시신을 방부 처리해 학회에 참석시키라 했다 — 실제로 그의 '오토 아이콘'은 지금도 런던 UCL에 앉아 있다.",
      en: "An eccentric genius. He hawked a prison design (the Panopticon) to the government, was among the first to take animal suffering seriously, and willed that his body be preserved and wheeled into meetings — his 'auto-icon' still sits at UCL in London.",
    },
    quote: {
      original: "The question is not, Can they reason? nor, Can they talk? but, Can they suffer?",
      originalLang: "en",
      en: "The question is not, Can they reason? nor, Can they talk? but, Can they suffer?",
      ko: "물음은 '이성이 있는가'도 '말할 수 있는가'도 아니다 — '고통을 느끼는가'다.",
      source: { ko: "《도덕과 입법의 원리 서설》 17장 각주 (1789)", en: "Introduction to the Principles of Morals and Legislation, ch. 17 note (1789)" },
      sting: { ko: "도덕 클럽의 회원 자격을 이성에서 고통으로 바꾼 것 — 200년 뒤 동물권 운동이 이 각주에서 출발한다.", en: "It changed the morality club's membership criterion from reason to suffering — two centuries later, animal rights set out from this footnote." },
    },
    weapon: {
      ko: "공리의 원리. 옳음 = 최대 다수의 최대 행복. 도덕을 신비에서 꺼내 계산 문제로 — 쾌락의 강도, 지속, 확실성까지 채점표를 만들었다.",
      en: "The principle of utility. Right = the greatest happiness of the greatest number. Morality pulled out of mystery and into arithmetic — complete with a scoring sheet for intensity, duration, certainty.",
    },
    analogy: {
      ko: "정책 논쟁에서 '그래서 총합으로 누가 얼마나 좋아지는데?'라고 묻는 순간 — 당신은 이미 벤담의 언어를 쓰고 있다.",
      en: "The moment a policy debate turns to 'so who gains how much, in total?' — you are already speaking Bentham.",
    },
    agon: [{ id: "kant", clash: {
      ko: "칸트: \"결과로 옳음을 정하면 인간이 수단이 된다.\" — 벤담: \"그 신성한 '의무'로 몇 명이 행복해졌는지 세어는 봤는가. 자연권이란 죽마 위의 헛소리다.\" 의무 대 결과 — 윤리학 최장기 리그전의 개막.",
      en: "Kant: \"Define right by outcomes and people become means.\" — Bentham: \"Has anyone counted how many your sacred 'duty' made happy? Natural rights are nonsense upon stilts.\" Duty vs. consequence — ethics' longest-running league opens.",
    } }],
    lineage: { from: ["epicurus"], to: ["mill"], note: {
      ko: "제자 밀의 아버지가 그의 동지였다 — 밀은 사실상 벤담주의 영재 교육의 결과물이고, 그 결과물이 스승을 수정하게 된다.",
      en: "His comrade was Mill's father — Mill was effectively the product of a Benthamite prodigy program. The product would go on to amend the master.",
    } },
    myth: null,
    dilemma: { ko: "열 명을 살리기 위해 한 명에게 큰 손해를 입히는 결정 — 총합이 플러스면 옳습니까? 당신의 기준을 적어보세요.", en: "A decision that badly harms one to save ten — if the total is positive, is it right? Write your criterion." },
    axes: { reasonVsWill: 80, selfVsCommunity: -60, absoluteVsRelative: -30, meaningVsAbsurd: 50 },
  },

  mill: {
    id: "mill", nameKo: "밀", nameEn: "John Stuart Mill", years: "1806–1873",
    era: 4, school: { ko: "공리주의·자유론", en: "Utilitarianism · Liberty" }, side: "reason", visual: "openfield",
    caption: { ko: "타인을 해치지 않는 한, 경계선까지 전부 자유", en: "Free to the fence line — so long as no one is harmed" },
    scene: {
      ko: "벤담주의자 아버지의 영재 교육 실험으로 세 살에 그리스어를 배웠다. 스무 살에 정신적 붕괴 — 공리 계산 기계로 길러진 그를 구한 것은 워즈워스의 시였다. 이후 그의 공리주의에는 '질'이 추가된다. 하원의원으로서 영국 최초의 여성 참정권 개정안을 제출했다.",
      en: "His Benthamite father's prodigy experiment had him reading Greek at three. At twenty he broke down — and what saved the calculating machine he'd been raised to be was Wordsworth's poetry. 'Quality' entered his utilitarianism thereafter. As an MP he introduced Britain's first women's suffrage amendment.",
    },
    quote: {
      original: "It is better to be a human being dissatisfied than a pig satisfied; better to be Socrates dissatisfied than a fool satisfied.",
      originalLang: "en",
      en: "It is better to be a human being dissatisfied than a pig satisfied; better to be Socrates dissatisfied than a fool satisfied.",
      ko: "만족한 돼지보다 불만족한 인간이 낫고, 만족한 바보보다 불만족한 소크라테스가 낫다.",
      source: { ko: "《공리주의》 2장 (1863)", en: "Utilitarianism, ch. 2 (1863)" },
      sting: { ko: "스승 벤담의 '쾌락은 다 같은 쾌락' 원칙에 대한 내부자 반란 — 쾌락에도 급이 있다.", en: "An insider's revolt against Bentham's 'all pleasures are equal': pleasures have rank." },
    },
    weapon: {
      ko: "위해 원리. 타인에게 해를 끼치지 않는 한, 개인의 자유는 — 본인을 위한다는 명목으로도 — 침해될 수 없다. '너 좋으라고 하는 말'에 대한 철학적 방어벽.",
      en: "The harm principle. So long as no one else is harmed, individual liberty may not be overridden — not even 'for your own good.' The philosophical firewall against benevolent meddling.",
    },
    analogy: {
      ko: "어른의 선택 — 위험한 취미, 남다른 삶 — 에 '걱정돼서'라며 개입하려는 모든 손길에 대해, 밀은 말한다. 본인 인생의 주권자는 본인이다.",
      en: "To every hand that reaches, 'out of concern,' toward an adult's risky hobby or unusual life, Mill replies: over their own life, each person is sovereign.",
    },
    agon: [{ id: "bentham", clash: {
      ko: "벤담: \"쾌락의 '질'? 측정할 수 없는 것을 끌어들이면 계산 전체가 무너진다.\" — 밀: \"핀 꽂기 놀이와 시(詩)가 같은 값이라는 채점표는, 인간을 모른다는 자백이다.\" 후계자의 수정이 학파를 살렸는지 죽였는지는 아직도 논쟁 중이다.",
      en: "Bentham: \"'Quality' of pleasure? Import the unmeasurable and the whole calculus collapses.\" — Mill: \"A scoresheet pricing push-pin equal to poetry is a confession of not knowing humans.\" Whether the heir's amendment saved the school or killed it is still being argued.",
    } }],
    lineage: { from: ["bentham"], to: ["rawls"], note: {
      ko: "그의 자유주의가 한 세기 뒤 롤스에게서 '공정'이라는 이름으로 재건축된다.",
      en: "A century later his liberalism is rebuilt by Rawls under the name of fairness.",
    } },
    myth: null,
    dilemma: { ko: "누군가 당신을 '당신을 위해' 말리고 있는 일이 있습니까? 그 개입은 어디까지 정당합니까?", en: "Is someone stopping you from something 'for your own good'? How far is that intervention justified?" },
    axes: { reasonVsWill: 70, selfVsCommunity: 75, absoluteVsRelative: 10, meaningVsAbsurd: 60 },
  },

  freud: {
    id: "freud", nameKo: "프로이트", nameEn: "Sigmund Freud", years: "1856–1939",
    era: 4, school: { ko: "정신분석", en: "Psychoanalysis" }, side: "will", visual: "iceberg",
    caption: { ko: "빙산 — 수면 아래가 더 크다", en: "The iceberg — most of it is below" },
    scene: {
      ko: "빈의 신경과 의사. 히스테리 환자들의 말을 자르지 않고 끝까지 듣는 것 — 치료법은 거기서 시작됐다. 나치가 오스트리아를 합병하자 그의 책은 불탔고, 그는 런던으로 탈출하며 말했다고 전해진다 — \"진보다. 중세라면 나를 태웠을 텐데, 이제는 책으로 만족하는군.\"",
      en: "A Vienna neurologist whose method began with a radical act: letting hysteria patients talk without interruption. When the Nazis annexed Austria his books burned, and escaping to London he reportedly remarked: \"What progress. In the Middle Ages they would have burned me; now they are content with my books.\"",
    },
    quote: {
      original: "Wo Es war, soll Ich werden.",
      originalLang: "de",
      en: "Where id was, there ego shall be.",
      ko: "그것(이드)이 있던 곳에, 내(자아)가 있게 하라.",
      source: { ko: "《새로운 정신분석 강의》 (1933)", en: "New Introductory Lectures on Psychoanalysis (1933)" },
      sting: { ko: "인간은 자기 집의 주인이 아니라는 선고 — 코페르니쿠스가 지구를, 다윈이 인간을, 자신이 '자아'를 왕좌에서 끌어내렸다는 것이 그의 자평이었다.", en: "The verdict that man is not master in his own house — by his own account, Copernicus dethroned the earth, Darwin the species, and he the ego." },
    },
    weapon: {
      ko: "무의식. 말실수, 꿈, 증상은 소음이 아니라 암호다. 의식은 빙산의 일각 — 수면 아래의 욕망과 억압이 행동의 진짜 대주주다.",
      en: "The unconscious. Slips, dreams, symptoms are not noise but cipher. Consciousness is the iceberg's tip — the desires and repressions below the waterline are behavior's controlling shareholders.",
    },
    analogy: {
      ko: "'나 원래 안 그래'라고 말한 직후의 행동들. 프로이트의 도발 — 진짜 당신은 프로필 소개가 아니라 새벽의 검색 기록 쪽에 가깝다.",
      en: "Everything you do right after saying 'that's not like me.' Freud's provocation: the real you is closer to your 3 a.m. search history than to your bio.",
    },
    agon: [{ id: "sartre", clash: {
      ko: "사르트르: \"무의식은 책임 회피의 발명품이다. '이드가 시켰다'는 변명의 과학화 — 인간은 전적으로 자유롭고, 그래서 전적으로 책임진다.\" — 프로이트 진영의 응수: 그토록 자유를 확신하는 그 마음부터가 분석 대상이다.",
      en: "Sartre: \"The unconscious is an invention for dodging responsibility — 'the id made me do it,' scientized. Man is wholly free and therefore wholly accountable.\" — The Freudian reply: that very certainty about freedom is itself material for analysis.",
    } }],
    lineage: { from: ["schopenhauer", "nietzsche"], to: [], note: {
      ko: "쇼펜하우어의 맹목적 의지, 니체의 자기기만 분석 — 그의 무의식에는 두 사람의 지문이 찍혀 있다. 20세기 문화는 그를 반박할 때조차 그의 용어를 쓴다.",
      en: "Schopenhauer's blind will, Nietzsche's analysis of self-deception — both left fingerprints on his unconscious. The 20th century used his vocabulary even to refute him.",
    } },
    myth: null,
    dilemma: { ko: "최근에 한 '이해 안 되는 내 행동' 하나 — 진짜 이유가 따로 있다면 무엇일 것 같습니까? 불편해도 적어보세요.", en: "One recent act of yours you can't explain — if there's a real reason underneath, what might it be? Write it even if it's uncomfortable." },
    axes: { reasonVsWill: -60, selfVsCommunity: 30, absoluteVsRelative: -20, meaningVsAbsurd: 20 },
  },

  russell: {
    id: "russell", nameKo: "러셀", nameEn: "Bertrand Russell", years: "1872–1970",
    era: 5, school: { ko: "분석철학", en: "Analytic Philosophy" }, side: "reason", visual: "bricks",
    caption: { ko: "수학까지 논리 벽돌로 다시 쌓기", en: "Rebuilding even mathematics from logic bricks" },
    scene: {
      ko: "백작 가문 출신. 1차대전 반전 운동으로 투옥됐고, 89세에 핵무장 반대 연좌시위로 또 체포됐다. 《수학 원리》에서 1+1=2를 수백 페이지에 걸쳐 증명하던 중 — 자신이 세운 체계의 균열(러셀의 역설)을 자신이 발견했다. 노벨문학상은 철학자로서 받았다.",
      en: "Born to an earldom. Jailed for opposing WWI; arrested again at 89 at an anti-nuclear sit-in. While proving 1+1=2 across hundreds of pages of Principia Mathematica, he discovered the crack in his own edifice — Russell's paradox. His Nobel Prize in Literature came for philosophy.",
    },
    quote: {
      original: "The stupid are cocksure while the intelligent are full of doubt.",
      originalLang: "en",
      en: "The stupid are cocksure while the intelligent are full of doubt.",
      ko: "어리석은 자는 확신에 차 있고, 지성적인 사람은 의심으로 가득하다.",
      source: { ko: "에세이 〈어리석음의 승리〉 (1933)", en: "'The Triumph of Stupidity' (1933)" },
      sting: { ko: "파시즘이 부상하던 1933년에 쓰인 문장 — 확신의 데시벨과 진실은 무관하다는 경고.", en: "Written in 1933 as fascism rose — the warning that the decibel level of certainty has nothing to do with truth." },
    },
    weapon: {
      ko: "논리 분석. 철학적 문제의 상당수는 언어의 헐거움에서 온다 — 문장을 논리 형식으로 다시 쓰면 가짜 문제가 증발한다. 분석철학의 개국.",
      en: "Logical analysis. Many philosophical problems come from loose language — rewrite the sentence in logical form and pseudo-problems evaporate. The founding of analytic philosophy.",
    },
    analogy: {
      ko: "목소리 큰 쪽이 이기는 댓글창에서 그의 처방은 지금도 유효하다 — 확신의 크기는 증거의 양에 비례해야 한다.",
      en: "In comment sections where the loudest wins, his prescription still holds: let the size of your certainty track the size of your evidence.",
    },
    agon: [{ id: "wittgenstein", clash: {
      ko: "어느 날 제자가 찾아와 스승의 필생 작업이 근본적으로 헛수고라고 선언했다. 러셀은 그를 내치는 대신 천재로 인정했다 — \"내가 아는 천재의 가장 완벽한 사례.\" 그리고 그 제자의 두 번째 철학은 첫 번째 철학마저 부정한다. 러셀의 논평 — 나는 그의 후기 철학을 이해할 수 없다.",
      en: "One day his student announced that the master's life's work was fundamentally futile. Instead of expelling him, Russell certified him a genius — \"the most perfect example I have ever known.\" The student's second philosophy then repudiated his first. Russell's comment: I cannot understand his later work.",
    } }],
    lineage: { from: ["leibniz", "hume"], to: ["wittgenstein"], note: {
      ko: "라이프니츠의 논리 노트를 재발견했고, 흄의 회의를 20세기 언어로 번역했다.",
      en: "He rediscovered Leibniz's logic notebooks and translated Hume's skepticism into 20th-century language.",
    } },
    myth: null,
    dilemma: { ko: "당신이 가장 확신하는 의견의 확신도(%)와, 그 근거를 실제로 검토한 시간 — 비례합니까?", en: "Your most confident opinion: does its confidence level actually track the hours you've spent checking the evidence?" },
    axes: { reasonVsWill: 90, selfVsCommunity: 30, absoluteVsRelative: 30, meaningVsAbsurd: 40 },
  },

  wittgenstein: {
    id: "wittgenstein", nameKo: "비트겐슈타인", nameEn: "Ludwig Wittgenstein", years: "1889–1951",
    era: 5, school: { ko: "언어철학", en: "Philosophy of Language" }, side: "reason", visual: "silence",
    caption: { ko: "말이 닿지 않는 곳 — 침묵", en: "Where words do not reach — silence" },
    scene: {
      ko: "유럽 최고 부호의 아들로 태어나 유산 전액을 형제와 시인들에게 넘겼다. 1차대전 참호에서 《논리철학논고》를 썼고, 철학을 '끝냈다'며 시골 초등교사로 떠났다. 돌아와서는 자신의 첫 책을 스스로 반박했다. 1946년, 포퍼와의 논쟁에서 부지깽이를 들었다는 10분 — 목격자 전원의 증언이 서로 다르다.",
      en: "Born to one of Europe's richest families, he gave the entire inheritance to siblings and poets. He wrote the Tractatus in WWI trenches, declared philosophy finished, and left to teach village schoolchildren. Then he returned and refuted his own first book. In 1946 came the ten minutes with Popper and a fireplace poker — every witness account differs.",
    },
    quote: {
      original: "Wovon man nicht sprechen kann, darüber muss man schweigen.",
      originalLang: "de",
      en: "Whereof one cannot speak, thereof one must be silent.",
      ko: "말할 수 없는 것에 대해서는 침묵해야 한다.",
      source: { ko: "《논리철학논고》 명제 7 (1921)", en: "Tractatus Logico-Philosophicus, prop. 7 (1921)" },
      sting: { ko: "윤리, 신, 삶의 의미 — 철학의 간판 메뉴 전체를 '말할 수 없음' 칸으로 옮긴 폐업 공고. 그리고 후기에, 본인이 재개업한다.", en: "A closing notice that moved ethics, God, and life's meaning to the 'unsayable' column — until, in his later work, he reopened the shop himself." },
    },
    weapon: {
      ko: "언어 비판. 전기 — 언어는 세계의 그림이고, 그림 밖은 침묵이다. 후기 — 언어는 게임이고, 의미는 사용이다. 철학적 문제는 언어가 헛도는 병이며, 치료법은 오용을 보여주는 것.",
      en: "The critique of language. Early: language pictures the world; beyond the picture, silence. Late: language is a game and meaning is use. Philosophical problems are language idling — the cure is showing the misuse.",
    },
    analogy: {
      ko: "단톡방 싸움의 절반은 같은 단어를 다른 게임 규칙으로 쓰는 데서 온다 — '좋다', '나중에', '알겠어'. 비트겐슈타인은 그 지점만 평생 판 사람이다.",
      en: "Half of group-chat fights come from playing the same word under different rules — 'fine,' 'later,' 'okay.' Wittgenstein spent a lifetime digging at exactly that spot.",
    },
    agon: [{ id: "popper", clash: {
      ko: "1946년 케임브리지 도덕과학클럽. '철학적 문제는 실재하는가'를 놓고 10분 만에 파국 — 벽난로 부지깽이가 등장했고, 비트겐슈타인이 자리를 박차고 나갔다. 남은 것은 서로 어긋나는 목격담뿐. 언어가 사실을 배신한다는 것을, 사건 자체가 시연했다.",
      en: "Cambridge Moral Sciences Club, 1946. 'Are there real philosophical problems?' — collapse in ten minutes, a fireplace poker raised, Wittgenstein storming out. All that remains: mutually contradicting eyewitness accounts. The event itself demonstrated language betraying fact.",
    } }],
    lineage: { from: ["russell"], to: [], note: {
      ko: "전기 비트겐슈타인은 분석철학의 성서가 됐고, 후기 비트겐슈타인은 그 성서의 반박서가 됐다 — 한 사람이 두 학파의 시조다.",
      en: "The early Wittgenstein became analytic philosophy's bible; the late Wittgenstein, its rebuttal. One man founded both schools.",
    } },
    myth: null,
    dilemma: { ko: "최근의 언쟁 하나 — 의견이 달랐던 겁니까, 같은 단어를 다르게 쓰고 있었던 겁니까?", en: "Your most recent argument — did you disagree, or were you using the same word under different rules?" },
    axes: { reasonVsWill: 75, selfVsCommunity: 40, absoluteVsRelative: -40, meaningVsAbsurd: 30 },
  },

  popper: {
    id: "popper", nameKo: "포퍼", nameEn: "Karl Popper", years: "1902–1994",
    era: 5, school: { ko: "과학철학", en: "Philosophy of Science" }, side: "reason", visual: "blackswan",
    caption: { ko: "검은 백조 한 마리면 충분하다", en: "One black swan is enough" },
    scene: {
      ko: "빈 출신. 나치를 피해 뉴질랜드로 갔고, 전쟁 내내 《열린사회와 그 적들》을 썼다 — 플라톤부터 마르크스까지, 전체주의의 지적 족보를 고발한 책. 그리고 1946년 케임브리지, 그 부지깽이 사건의 반대편 당사자가 된다.",
      en: "Viennese. Fleeing the Nazis to New Zealand, he spent the war writing The Open Society and Its Enemies — an indictment tracing totalitarianism's intellectual pedigree from Plato to Marx. In 1946, at Cambridge, he became the other party in the poker incident.",
    },
    quote: {
      original: "The criterion of the scientific status of a theory is its falsifiability, or refutability, or testability.",
      originalLang: "en",
      en: "The criterion of the scientific status of a theory is its falsifiability, or refutability, or testability.",
      ko: "이론이 과학이냐를 가르는 기준은 반증 가능성 — 반박될 수 있고 시험될 수 있는가이다.",
      source: { ko: "《추측과 논박》 (1963)", en: "Conjectures and Refutations (1963)" },
      sting: { ko: "'모든 것을 설명하는 이론'이야말로 과학이 아니라는 역설 — 점성술과 몇몇 거대 이론이 같은 칸에 배정됐다.", en: "The paradox that a theory explaining everything is precisely not science — filing astrology and certain grand theories in the same drawer." },
    },
    weapon: {
      ko: "반증주의. 과학은 증명이 아니라 반박 시도로 전진한다. 흰 백조 만 마리도 '모든 백조는 희다'를 증명하지 못하지만, 검은 백조 한 마리는 그것을 죽인다. 좋은 이론 = 죽을 각오가 된 이론.",
      en: "Falsificationism. Science advances not by proof but by attempted refutation. Ten thousand white swans cannot prove 'all swans are white'; one black swan kills it. A good theory is one prepared to die.",
    },
    analogy: {
      ko: "'내 말이 틀리려면 무엇이 관측돼야 하는가'를 스스로 말할 수 있는 주장만 신뢰할 것 — 음모론 감별법으로 지금도 최강이다.",
      en: "Trust only claims that can state what observation would refute them — still the strongest conspiracy-theory detector available.",
    },
    agon: [{ id: "wittgenstein", clash: {
      ko: "비트겐슈타인: \"철학적 문제란 없다. 언어의 혼란만 있을 뿐.\" — 포퍼: \"지금 당신이 부지깽이를 휘두르며 하는 그것이 철학적 문제요.\" 전설에 따르면 '도덕 규칙의 예를 들라'는 요구에 포퍼가 답했다 — \"방문 강연자를 부지깽이로 위협하지 말 것.\"",
      en: "Wittgenstein: \"There are no philosophical problems, only linguistic confusions.\" — Popper: \"What you are doing right now, poker in hand, is one.\" Legend has it that, asked for an example of a moral rule, Popper replied: \"Not to threaten visiting lecturers with pokers.\"",
    } }],
    lineage: { from: ["hume", "kant"], to: [], note: {
      ko: "흄의 귀납 문제를 정면으로 받아, '증명 불가'를 과학의 결함이 아니라 작동 원리로 뒤집었다.",
      en: "Taking Hume's problem of induction head-on, he flipped 'unprovability' from science's defect into its operating principle.",
    } },
    myth: null,
    dilemma: { ko: "당신의 신념 하나 — 무엇이 관측되면 그것을 버리겠습니까? 답이 '없다'면, 그것은 무엇을 의미합니까?", en: "Pick one belief of yours — what observation would make you drop it? If the answer is 'nothing,' what does that mean?" },
    axes: { reasonVsWill: 85, selfVsCommunity: 45, absoluteVsRelative: 20, meaningVsAbsurd: 45 },
  },

  heidegger: {
    id: "heidegger", nameKo: "하이데거", nameEn: "Martin Heidegger", years: "1889–1976",
    era: 5, school: { ko: "존재론", en: "Ontology" }, side: "will", visual: "house",
    caption: { ko: "언어는 존재의 집", en: "Language is the house of Being" },
    scene: {
      ko: "검은 숲의 오두막에서 사유한 20세기 최대의 철학자이자 최대의 오점 — 1933년 나치에 입당했고 대학 총장이 되었으며, 전후에도 끝내 제대로 사과하지 않았다. 그의 가장 뛰어난 제자이자 연인이었던 유대인 한나 아렌트가 전후에 그를 변호했다는 사실까지, 그를 둘러싼 모든 것이 논쟁이다.",
      en: "The century's greatest philosopher and its greatest stain, thinking in a Black Forest hut — he joined the Nazi party in 1933, became a university rector, and never properly apologized. That Hannah Arendt, his most brilliant student and former lover, a Jewish refugee, defended him after the war — everything about him is a controversy.",
    },
    quote: {
      original: "Die Sprache ist das Haus des Seins.",
      originalLang: "de",
      en: "Language is the house of Being.",
      ko: "언어는 존재의 집이다.",
      source: { ko: "〈휴머니즘 서간〉 (1947)", en: "Letter on Humanism (1947)" },
      sting: { ko: "인간이 언어를 도구로 쓰는 것이 아니라, 언어가 지은 집에 인간이 세들어 산다는 전복.", en: "The reversal: humans do not wield language as a tool — they are tenants in the house language built." },
    },
    weapon: {
      ko: "존재 물음. 철학은 2천 년간 '존재자'만 다루고 '존재' 자체를 잊었다. 인간(현존재)은 죽음을 향한 존재 — 유한함을 직시할 때만 '남들 하는 대로'의 익명성에서 깨어나 본래적으로 산다.",
      en: "The question of Being. For two millennia philosophy handled beings and forgot Being itself. The human (Dasein) is a being-toward-death — only facing finitude wakes one from the anonymity of 'what one does' into authentic life.",
    },
    analogy: {
      ko: "장례식장에 다녀온 밤의 그 낯선 선명함 — 하이데거는 그 상태가 예외가 아니라 본래 상태라고 말한다. 문제는 우리가 곧 다시 잠든다는 것.",
      en: "That strange clarity on the night after a funeral — Heidegger says that state is not the exception but the original condition. The problem: we soon fall back asleep.",
    },
    agon: [{ id: "arendt", clash: {
      ko: "관계 자체가 아곤이다. 스승이자 연인 — 나치 입당자와 유대인 망명자. 아렌트는 전후 그를 다시 만났고 변호까지 했지만, 그녀의 '악의 평범성'은 생각하기를 멈춘 자에 대한 분석이다. 읽기에 따라, 그를 향한 가장 깊은 판결문이다.",
      en: "The relationship itself is the agon. Teacher and lover — Nazi party member and Jewish refugee. Arendt met him again after the war and even defended him; yet her 'banality of evil' is an analysis of the man who stops thinking. Read one way, it is the deepest verdict ever passed on him.",
    } }],
    lineage: { from: ["kierkegaard", "nietzsche"], to: ["sartre", "derrida"], note: {
      ko: "사르트르가 그를 실존주의로 번역하자, 그는 〈휴머니즘 서간〉으로 그 번역을 반박했다 — 제자 사절의 계보학.",
      en: "When Sartre translated him into existentialism, he rebutted the translation in the Letter on Humanism — a genealogy of refusing one's heirs.",
    } },
    myth: null,
    dilemma: { ko: "'남들 다 그렇게 사니까'로 굴러가는 당신 삶의 영역 하나 — 내일 죽는다면 그대로 두겠습니까?", en: "One area of your life running on 'that's what everyone does' — if you died tomorrow, would you leave it as is?" },
    axes: { reasonVsWill: -55, selfVsCommunity: 50, absoluteVsRelative: 40, meaningVsAbsurd: 60 },
  },

  arendt: {
    id: "arendt", nameKo: "아렌트", nameEn: "Hannah Arendt", years: "1906–1975",
    era: 5, school: { ko: "정치철학", en: "Political Philosophy" }, side: "reason", visual: "rows",
    caption: { ko: "생각을 멈춘 대열, 멈추지 않은 하나", en: "Ranks that stopped thinking — and one that didn't" },
    scene: {
      ko: "하이데거의 제자이자 연인이었던 유대인. 게슈타포에 체포됐다 풀려나 프랑스로, 수용소를 탈출해 미국으로. 1961년 예루살렘의 아이히만 재판을 참관하고 보고서를 썼다가 유대인 사회에서 절교당하다시피 했다 — 괴물을 기대한 자리에서 그녀가 본 것은, 끔찍하게 평범한 실무자였기 때문이다.",
      en: "Heidegger's student and lover, and a Jew. Arrested by the Gestapo, released, fled to France; escaped an internment camp to America. In 1961 she covered the Eichmann trial in Jerusalem — and was all but excommunicated by the Jewish community for her report. Where a monster was expected, what she saw was a terrifyingly ordinary functionary.",
    },
    quote: {
      original: "the fearsome, word-and-thought-defying banality of evil",
      originalLang: "en",
      en: "the fearsome, word-and-thought-defying banality of evil",
      ko: "말과 생각을 거부하는, 그 무서운 악의 평범성",
      source: { ko: "《예루살렘의 아이히만》 (1963)", en: "Eichmann in Jerusalem (1963)" },
      sting: { ko: "악의 얼굴이 악마가 아니라 성실한 공무원이었다는 보고 — 악마화가 주는 안도감을 빼앗았기에 그토록 미움받았다.", en: "The report that evil's face was not a demon but a diligent clerk — hated precisely because it confiscated the comfort of demonization." },
    },
    weapon: {
      ko: "사유의 부재. 아이히만의 죄는 증오가 아니라 생각하지 않음 — 타인의 자리에서 생각하는 능력의 정지였다. 그리고 '행위' — 복수(複數)의 인간들 사이에서 새로 시작하는 힘이야말로 정치의 핵심이라는 통찰.",
      en: "Thoughtlessness. Eichmann's crime was not hatred but the cessation of thinking — of thinking from another's place. And 'action': the power to begin anew among plural human beings is the heart of politics.",
    },
    analogy: {
      ko: "'위에서 시키니까', '프로세스가 그래서', '다들 그렇게 해서' — 이 세 문장이 겹겹이 쌓이는 곳이라면 어디든, 그녀의 경고등이 켜진다.",
      en: "'Orders from above,' 'that's the process,' 'everyone does it' — wherever those three sentences pile up, her warning light switches on.",
    },
    agon: [{ id: "heidegger", clash: {
      ko: "20세기 철학 최대의 아이러니 — 사유(思惟)를 가장 깊이 가르친 스승이 정치적으로 생각하기를 멈췄고, 그 실패를 평생 분석한 것은 그가 버린 제자였다.",
      en: "The century's greatest philosophical irony: the teacher who taught thinking most deeply stopped thinking politically — and the lifelong analysis of that failure was written by the student he abandoned.",
    } }],
    lineage: { from: ["heidegger"], to: [], note: {
      ko: "《전체주의의 기원》과 《인간의 조건》 — 전체주의 분석과 정치철학 재건의 양대 기둥이 그녀의 서명이다.",
      en: "The Origins of Totalitarianism and The Human Condition — the twin pillars of totalitarianism analysis and the rebuilding of political philosophy bear her signature.",
    } },
    myth: null,
    dilemma: { ko: "당신이 '시키는 대로' 수행 중인 일 하나 — 그 결과까지 당신의 것이라 해도 계속하겠습니까?", en: "One task you're doing 'as instructed' — if its outcome were fully yours to own, would you continue?" },
    axes: { reasonVsWill: 60, selfVsCommunity: -50, absoluteVsRelative: 30, meaningVsAbsurd: 65 },
  },

  sartre: {
    id: "sartre", nameKo: "사르트르", nameEn: "Jean-Paul Sartre", years: "1905–1980",
    era: 5, school: { ko: "실존주의", en: "Existentialism" }, side: "will", visual: "fork",
    caption: { ko: "이정표 없는 갈림길", en: "A fork with no signpost" },
    scene: {
      ko: "파리의 카페에서 철학을 썼고, 전후 유럽 지성계의 제왕이 됐다. 1964년 노벨문학상 수상자로 지명되자 거부했다 — 작가가 제도가 되어서는 안 된다며. 그리고 1952년, 가장 빛나던 우정을 서평 하나로 끝냈다. 카뮈와는 다시 만나지 않았다.",
      en: "He wrote philosophy in Paris cafés and became postwar Europe's intellectual sovereign. Named the 1964 Nobel laureate in literature, he declined — a writer must not become an institution. And in 1952 he ended his most luminous friendship over a book review. He and Camus never met again.",
    },
    quote: {
      original: "L'existence précède l'essence.",
      originalLang: "fr",
      en: "Existence precedes essence.",
      ko: "실존은 본질에 앞선다.",
      source: { ko: "《실존주의는 휴머니즘이다》 (1946)", en: "Existentialism Is a Humanism (1946)" },
      sting: { ko: "인간에게는 설계도가 없다는 선언 — 페이퍼나이프는 용도가 먼저지만, 인간은 먼저 존재하고 나중에 스스로를 정의한다.", en: "The declaration that humans ship without a blueprint — a paper knife's purpose precedes it; a human exists first and defines itself after." },
    },
    weapon: {
      ko: "자유의 형벌. 인간은 자유롭도록 선고받았다 — 선택하지 않음도 선택이다. '성격이 원래 그래서', '상황이 어쩔 수 없어서'는 자기기만(mauvaise foi). 변명의 퇴로를 전부 폭파한 철학.",
      en: "Condemned to be free. Not choosing is also a choice. 'That's just my personality,' 'the situation left no option' — bad faith (mauvaise foi). A philosophy that dynamited every escape route of excuse.",
    },
    analogy: {
      ko: "'어쩔 수 없었다'는 말이 목까지 올라올 때 — 사르트르는 묻는다. 정말인가? 대가가 무서웠던 것과 선택지가 없었던 것은 다른 문제다.",
      en: "When 'I had no choice' rises to your throat, Sartre asks: really? Fearing the price and having no option are different things.",
    },
    agon: [{ id: "camus", clash: {
      ko: "카뮈: \"목적이 살인을 정당화하는 순간 반항은 폭정이 된다. 나는 정의보다 먼저 사람 편에 서겠다.\" — 사르트르: \"역사 바깥의 순수한 손은 없다. 방관 역시 손에 피를 묻히는 하나의 방식이다.\" 이 간극이 우정 하나를 통째로 삼켰다.",
      en: "Camus: \"The moment ends justify murder, revolt becomes tyranny. Before justice, I side with human beings.\" — Sartre: \"There are no clean hands outside history. Standing by is also a way of bloodying them.\" That gap swallowed a friendship whole.",
    } }],
    lineage: { from: ["heidegger", "kierkegaard"], to: [], note: {
      ko: "하이데거를 실존주의로 번역했고, 원저자는 그 번역을 공개 반박했다. 평생의 동반자 보부아르와는 철학도 삶도 계약으로 공유했다.",
      en: "He translated Heidegger into existentialism; the original author publicly rejected the translation. With Beauvoir, his lifelong partner, he shared both philosophy and life — by contract.",
    } },
    myth: { ko: "\"지옥은 타인이다\"(《닫힌 방》)는 인간혐오 선언으로 오독된다. 본인의 해명 — 타인의 시선에 갇혀 자신을 그 판정으로만 보게 될 때, 그때 타인이 지옥이 된다는 뜻이다.", en: "\"Hell is other people\" (No Exit) is misread as misanthropy. His own gloss: when you are trapped in others' gaze and see yourself only through their verdict — then others become hell." },
    dilemma: { ko: "지금 '어쩔 수 없다'고 말하고 있는 일 하나 — 선택지가 정말 없습니까, 아니면 대가가 무서운 겁니까?", en: "One thing you currently call unavoidable — is there truly no option, or does the price scare you?" },
    axes: { reasonVsWill: -50, selfVsCommunity: 70, absoluteVsRelative: -50, meaningVsAbsurd: 55 },
  },

  beauvoir: {
    id: "beauvoir", nameKo: "보부아르", nameEn: "Simone de Beauvoir", years: "1908–1986",
    era: 5, school: { ko: "실존주의 페미니즘", en: "Existentialist Feminism" }, side: "will", visual: "becoming",
    caption: { ko: "태어나는 것이 아니라, 만들어진다", en: "Not born, but made" },
    scene: {
      ko: "철학 교원 자격시험에서 사르트르에 이어 2등 — 심사위원들은 진짜 철학자는 그녀 쪽이라고 수군댔다는 후문이 있다. 역대 최연소 합격이었다. 사르트르와 평생의 계약 관계를 맺되 결혼은 거부했고, 《제2의 성》으로 스캔들과 금서 지정과 혁명을 동시에 일으켰다.",
      en: "Second to Sartre in the philosophy agrégation — with examiners reportedly whispering that the real philosopher was her. She was the youngest ever to pass. She bound herself to Sartre by lifelong pact while refusing marriage, and with The Second Sex ignited scandal, censorship, and revolution at once.",
    },
    quote: {
      original: "On ne naît pas femme : on le devient.",
      originalLang: "fr",
      en: "One is not born, but rather becomes, a woman.",
      ko: "여자는 태어나는 것이 아니라 만들어지는 것이다.",
      source: { ko: "《제2의 성》 (1949)", en: "The Second Sex (1949)" },
      sting: { ko: "'여성스러움'이 자연이 아니라 제작물이라는 폭로 — 생물학이 운명이라는 수천 년의 알리바이를 해체했다.", en: "The exposure of 'femininity' as manufacture, not nature — dismantling millennia of the alibi that biology is destiny." },
    },
    weapon: {
      ko: "타자(他者) 분석. 여성은 역사 내내 주체가 아니라 남성의 거울 — '제2의 성'으로 정의돼 왔다. 실존주의의 자유를 절반의 인류에게 적용하되, 상황이 자유를 어떻게 조여오는지까지 계산에 넣었다.",
      en: "The analysis of the Other. Throughout history woman has been defined not as subject but as man's mirror — the second sex. She applied existentialist freedom to half of humanity, while keeping in the ledger how situation constricts freedom.",
    },
    analogy: {
      ko: "'여자애가 왜', '남자가 그것도' — 태어나서 지금까지 들어온 그 문장들의 총합이, 곧 그녀가 말한 '만들어짐'이다.",
      en: "'Girls shouldn't,' 'a man can't even—' : the running total of those sentences since birth is exactly what she meant by 'becoming.'",
    },
    agon: [{ id: "freud", clash: {
      ko: "프로이트 진영: \"해부학은 운명이다.\" — 보부아르: \"해부학은 사실이고, 운명은 해석이다. 물어야 할 것은 그 해석의 저자가 지금까지 누구였느냐다.\"",
      en: "The Freudian line: \"Anatomy is destiny.\" — Beauvoir: \"Anatomy is a fact; destiny is an interpretation. The question is who has been authoring that interpretation all along.\"",
    } }],
    lineage: { from: ["sartre", "hegel"], to: [], note: {
      ko: "헤겔의 주인-노예 변증법을 성(性)의 역사에 적용했다. 이후 페미니즘 이론 전체가 그녀의 책에 각주를 단다.",
      en: "She applied Hegel's master-slave dialectic to the history of sex. All feminist theory since footnotes her book.",
    } },
    myth: null,
    dilemma: { ko: "당신에게 '원래 그런 것'으로 주어진 역할 하나 — 정말 타고난 겁니까, 배운 겁니까? 구분해 보세요.", en: "One role handed to you as 'just how it is' — inborn, or taught? Try to separate the two." },
    axes: { reasonVsWill: -30, selfVsCommunity: 60, absoluteVsRelative: -60, meaningVsAbsurd: 55 },
  },

  benjamin: {
    id: "benjamin", nameKo: "벤야민", nameEn: "Walter Benjamin", years: "1892–1940",
    era: 5, school: { ko: "비판이론", en: "Critical Theory" }, side: "will", visual: "angel",
    caption: { ko: "잔해는 쌓이고, 천사는 밀려난다", en: "The wreckage piles up; the angel is blown backward" },
    scene: {
      ko: "베를린의 유대인 비평가. 나치를 피해 파리로, 파리 함락 후 피레네를 넘어 스페인 국경 마을 포르부에 닿았다 — 하필 그날 국경이 닫혔다. 다음 날 아침 그는 숨진 채 발견됐다(모르핀 과용). 하루만 빨랐어도, 하루만 늦었어도 통과했을 것이다. 들고 있던 가방 속 원고는 사라졌다.",
      en: "A Jewish critic from Berlin. Fleeing the Nazis to Paris, then over the Pyrenees after its fall, he reached the Spanish border town of Portbou — on the one day the border closed. Next morning he was found dead (morphine overdose). One day earlier, or one day later, he would have passed. The manuscript in his briefcase was never found.",
    },
    quote: {
      original: "Es ist niemals ein Dokument der Kultur, ohne zugleich ein solches der Barbarei zu sein.",
      originalLang: "de",
      en: "There is no document of civilization which is not at the same time a document of barbarism.",
      ko: "야만의 기록이 아닌 문명의 기록은 없다.",
      source: { ko: "〈역사의 개념에 대하여〉 테제 7 (1940)", en: "'On the Concept of History,' Thesis VII (1940)" },
      sting: { ko: "박물관의 모든 걸작 뒤에 그것을 나른 이름 없는 노역이 있다는 것 — 문화 감상에 영수증을 청구한 문장.", en: "Behind every museum masterpiece, the nameless labor that carried it — a sentence that bills culture for its receipts." },
    },
    weapon: {
      ko: "결을 거슬러 읽는 역사. 진보라는 폭풍에 떠밀리며 등 뒤에 쌓이는 잔해를 바라보는 '역사의 천사' — 승자의 연대기가 아니라 패자의 파편에서 역사를 다시 읽는 법.",
      en: "History read against the grain. The 'angel of history,' blown along by the storm called progress while wreckage piles behind — a way of rereading history from the losers' fragments, not the victors' chronicle.",
    },
    analogy: {
      ko: "스마트폰의 매끈함 뒤의 광산과 조립 라인 — '이 편리는 누구의 비용인가'라는 그의 질문은 결제할 때마다 갱신된다.",
      en: "The mine and assembly line behind the smartphone's sheen — his question, 'whose cost is this convenience,' refreshes with every checkout.",
    },
    agon: [{ id: "hegel", clash: {
      ko: "헤겔: \"역사는 이성의 전진이다.\" — 벤야민: \"천사의 눈에 그 전진은, 잔해가 잔해 위에 쌓이는 단 하나의 파국이다.\" 진보 서사에 대한 가장 아름다운 반대 심문.",
      en: "Hegel: \"History is reason's advance.\" — Benjamin: \"To the angel's eye that advance is one single catastrophe, piling wreckage upon wreckage.\" The most beautiful cross-examination the idea of progress has ever faced.",
    } }],
    lineage: { from: ["marx"], to: ["adorno"], note: {
      ko: "그의 유고를 아도르노가 사후 출간했다 — 프랑크푸르트학파의 성물함에 그의 원고가 들어 있다.",
      en: "Adorno published his papers posthumously — his manuscripts sit in the Frankfurt School's reliquary.",
    } },
    myth: null,
    dilemma: { ko: "당신이 누리는 좋은 것 하나 — 그 뒤의 비용을 아는 채로 누리는 것과 모르는 채로 누리는 것은 다릅니까?", en: "One good thing you enjoy — is enjoying it knowingly different from enjoying it unknowingly, given its hidden cost?" },
    axes: { reasonVsWill: -20, selfVsCommunity: -40, absoluteVsRelative: -30, meaningVsAbsurd: 45 },
  },

  adorno: {
    id: "adorno", nameKo: "아도르노", nameEn: "Theodor Adorno", years: "1903–1969",
    era: 5, school: { ko: "비판이론", en: "Critical Theory" }, side: "reason", visual: "askew",
    caption: { ko: "잘못된 전체 안에 올바른 칸은 없다", en: "No right cell inside a wrong grid" },
    scene: {
      ko: "프랑크푸르트학파의 수장. 미국 망명 중 할리우드 영화와 라디오 히트곡에 파묻혀 '문화산업' 개념을 벼렸다 — 대중문화는 위안이 아니라 표준화된 순응 훈련이라는 것. '아우슈비츠 이후 서정시를 쓰는 것은 야만'이라는 그의 문장은, 이후 평생 그 자신이 수정하며 씨름한 화두가 됐다.",
      en: "Head of the Frankfurt School. In American exile, buried in Hollywood films and radio hits, he forged the concept of the 'culture industry' — mass culture not as comfort but as standardized conformity training. His line that writing poetry after Auschwitz is barbaric became a koan he himself revised and wrestled with for the rest of his life.",
    },
    quote: {
      original: "Es gibt kein richtiges Leben im falschen.",
      originalLang: "de",
      en: "Wrong life cannot be lived rightly.",
      ko: "잘못된 삶 속에 올바른 삶은 없다.",
      source: { ko: "《미니마 모랄리아》 (1951)", en: "Minima Moralia (1951)" },
      sting: { ko: "개인의 '소소한 착한 삶'에 끼얹은 냉수 — 구조가 기울어져 있으면 그 위의 모든 방이 기운다.", en: "Cold water on the 'small good life': if the structure tilts, every room inside it tilts." },
    },
    weapon: {
      ko: "부정변증법 + 문화산업 비판. 화해와 종합을 서두르지 말 것 — 사유의 임무는 불일치를 견디는 것이다. 그리고 엔터테인먼트가 비판 능력을 어떻게 마사지해 잠재우는지에 대한 해부.",
      en: "Negative dialectics + the culture industry critique. Do not rush to reconciliation — thought's task is to endure non-identity. Plus an anatomy of how entertainment massages the critical faculty to sleep.",
    },
    analogy: {
      ko: "알고리즘이 취향까지 구워서 내주는 피드 — '내가 고른 것'과 '고르도록 배열된 것'의 경계가 흐려질 때, 아도르노가 옳았는지 다시 세게 된다.",
      en: "A feed that bakes your taste for you — when 'what I chose' and 'what I was arranged to choose' blur, you find yourself recounting Adorno's score.",
    },
    agon: [{ id: "benjamin", clash: {
      ko: "벤야민: \"복제 기술은 예술의 아우라를 깨고 대중을 해방할 수 있다.\" — 아도르노: \"해방? 그 기술의 소유주가 누구인지 보라. 라디오는 대중을 깨우지 않는다. 길들인다.\" 같은 학파 안의 희망과 비관 — 우정 어린, 그러나 끝내 합의되지 않은 논쟁.",
      en: "Benjamin: \"Mechanical reproduction can shatter art's aura and emancipate the masses.\" — Adorno: \"Emancipate? Look at who owns the machinery. Radio does not awaken the masses; it domesticates them.\" Hope and pessimism inside one school — an affectionate,永 unresolved quarrel.",
    } }],
    lineage: { from: ["marx", "benjamin"], to: [], note: {
      ko: "그의 문화산업 비판은 이후 모든 미디어 비평의 원판이 됐다 — 알고리즘 시대에 재출간되는 중이다.",
      en: "His culture-industry critique became the master plate for all media criticism since — currently being reissued for the algorithm age.",
    } },
    myth: null,
    dilemma: { ko: "최근 소비한 콘텐츠 중 '내 선택'이라 확신하는 것 하나 — 그것이 당신에게 도착한 경로를 역추적해 보세요.", en: "One piece of content you're sure you chose — trace backward the route by which it arrived at you." },
    axes: { reasonVsWill: 65, selfVsCommunity: -30, absoluteVsRelative: 20, meaningVsAbsurd: 35 },
  },

  foucault: {
    id: "foucault", nameKo: "푸코", nameEn: "Michel Foucault", years: "1926–1984",
    era: 5, school: { ko: "포스트구조주의", en: "Post-structuralism" }, side: "will", visual: "panopticon",
    caption: { ko: "중앙의 시선이 돈다 — 파놉티콘", en: "The central gaze rotates — the Panopticon" },
    scene: {
      ko: "콜레주 드 프랑스의 스타 교수이자 거리의 시위자. 감옥, 병원, 정신병원 — 아무도 철학의 장소로 여기지 않던 곳의 문서고를 뒤졌다. 감시탑 하나가 감방 전체를 통제하는 벤담의 파놉티콘 설계도에서, 그는 근대 권력 전체의 초상을 발견했다.",
      en: "Star professor at the Collège de France and street protester. He dug through the archives of places no one considered philosophical — prisons, hospitals, asylums. In Bentham's Panopticon blueprint, one watchtower controlling every cell, he found the portrait of modern power itself.",
    },
    quote: {
      original: "La visibilité est un piège.",
      originalLang: "fr",
      en: "Visibility is a trap.",
      ko: "가시성은 함정이다.",
      source: { ko: "《감시와 처벌》 (1975)", en: "Discipline and Punish (1975)" },
      sting: { ko: "'지켜보고 있다'는 가능성만으로 인간은 스스로를 검열한다 — 보이는 것 자체가 통제라는 통찰.", en: "The mere possibility of being watched makes people censor themselves — being visible is itself the control." },
    },
    weapon: {
      ko: "권력/지식. 권력은 왕의 칼이 아니라 모세혈관이다 — 학교, 병원, 통계, '정상'이라는 개념 속에서 작동한다. 지식은 권력의 반대말이 아니라 파트너다.",
      en: "Power/knowledge. Power is not the king's sword but capillaries — operating through schools, hospitals, statistics, the concept of 'normal.' Knowledge is not power's opposite but its partner.",
    },
    analogy: {
      ko: "좋아요 수, 조회수, 리뷰 별점, 상시 카메라 — 벤담의 감시탑은 철거되지 않았다. 분산됐고, 우리는 자발적으로 입주했다.",
      en: "Like counts, view counts, star ratings, always-on cameras — Bentham's watchtower was never demolished. It was distributed, and we moved in voluntarily.",
    },
    agon: [{ id: "bentham", clash: {
      ko: "벤담: \"파놉티콘은 최소 비용의 인도적 개혁이다.\" — 푸코: \"바로 그 '인도적'이 무섭다. 채찍을 시선으로 바꾼 것은 진보가 아니라 권력의 소프트웨어 업데이트다.\" 150년의 시차를 둔 설계자와 해부학자의 대면.",
      en: "Bentham: \"The Panopticon is humane reform at minimal cost.\" — Foucault: \"That 'humane' is exactly what frightens. Swapping the whip for the gaze is not progress but power's software update.\" Architect and anatomist, face to face across 150 years.",
    } }],
    lineage: { from: ["nietzsche"], to: [], note: {
      ko: "니체의 계보학 — '이 가치는 어디서 왔는가'를 묻는 법 — 을 감옥과 병원과 성(性)에 적용했다.",
      en: "He took Nietzsche's genealogy — the art of asking where a value comes from — and applied it to prisons, clinics, and sexuality.",
    } },
    myth: null,
    dilemma: { ko: "아무도 안 본다면 하지 않을 일과, 아무도 안 봐도 할 일 — 당신의 하루에서 각각 몇 %입니까?", en: "Things you'd skip if no one watched vs. things you'd do unwatched — what percent of your day is each?" },
    axes: { reasonVsWill: -40, selfVsCommunity: 50, absoluteVsRelative: -80, meaningVsAbsurd: 15 },
  },

  derrida: {
    id: "derrida", nameKo: "데리다", nameEn: "Jacques Derrida", years: "1930–2004",
    era: 5, school: { ko: "해체", en: "Deconstruction" }, side: "will", visual: "margin",
    caption: { ko: "본문이 숨긴 것은 여백에 있다", en: "What the text hides lives in the margin" },
    scene: {
      ko: "알제리 태생 유대인 — 비시 정권 시절 어느 날 등교하자 유대인 정원 초과라며 학교에서 쫓겨났다. '프랑스인'이라는 경계의 바깥으로. 평생의 주제가 그 교문에서 시작됐다는 해석이 많다. 훗날 케임브리지의 명예박사 수여는 교수들의 공개 반대 서한까지 부른 스캔들이 됐다.",
      en: "An Algerian-born Jew — one day under Vichy he arrived at school to be expelled for exceeding the Jewish quota. Cast outside the boundary called 'French.' Many read his life's theme as beginning at that school gate. Decades later, his Cambridge honorary doctorate triggered a public letter of protest from philosophers.",
    },
    quote: {
      original: "Il n'y a pas de hors-texte.",
      originalLang: "fr",
      en: "There is no outside-text.",
      ko: "텍스트-바깥은 없다.",
      source: { ko: "《그라마톨로지》 (1967)", en: "Of Grammatology (1967)" },
      sting: { ko: "의미의 최종 결재선을 폐지한 문장 — 모든 확정은 잠정이고, 모든 중심은 구성물이라는 선언으로 읽혔다.", en: "The sentence that abolished meaning's final sign-off — read as declaring every fixity provisional, every center a construction." },
    },
    weapon: {
      ko: "해체. 철학의 이분법 — 말/글, 정신/물질, 남/여 — 은 중립인 척하지만 항상 한쪽이 왕이다. 그 위계가 어떻게 세워졌는지를, 텍스트 자신의 균열에서 찾아 보여주는 독법.",
      en: "Deconstruction. Philosophy's binaries — speech/writing, mind/matter, man/woman — pose as neutral, but one side always wears the crown. A way of reading that finds, in the text's own cracks, how that hierarchy was built.",
    },
    analogy: {
      ko: "노래 가사, 법 조문, 단톡방 말투를 둘러싼 끝없는 해석 전쟁 — 데리다는 최종 해석이 도착하지 않는 것이 고장이 아니라 언어의 조건이라고 말한다.",
      en: "The endless interpretation wars over lyrics, statutes, and chat-message tone — Derrida says the final reading's failure to arrive is not a malfunction but the condition of language.",
    },
    agon: [{ id: "plato", clash: {
      ko: "플라톤은 《파이드로스》에서 글을 말보다 열등한 고아 취급했다. 데리다는 그 텍스트를 해체해 보여준다 — '말의 순수성'이라는 신화 자체가, 글로 쓰여 우리에게 전해졌다는 아이러니를.",
      en: "In the Phaedrus, Plato treated writing as speech's inferior orphan. Derrida deconstructs that very text to expose the irony: the myth of speech's purity reached us — in writing.",
    } }],
    lineage: { from: ["heidegger"], to: [], note: {
      ko: "하이데거의 'Destruktion'을 'déconstruction'으로 번역·변주한 것이 출발점이다.",
      en: "It began as his translation-with-variation of Heidegger's 'Destruktion' into 'déconstruction.'",
    } },
    myth: { ko: "\"세상에는 텍스트밖에 없다\"는 통용 번역은 오역에 가깝다. 본뜻은 — 맥락과 해석의 그물 바깥에 서 있는 순수한 접근점은 없다는 것.", en: "The common gloss 'there is nothing but text' verges on mistranslation. The point: there is no pure access point standing outside the web of context and interpretation." },
    dilemma: { ko: "당신이 확신하는 이분법 하나(일/삶, 진심/겉치레…) — 그 경계선은 누가 그었고, 누구에게 유리합니까?", en: "One binary you trust (work/life, sincere/performative…) — who drew that line, and whom does it favor?" },
    axes: { reasonVsWill: -45, selfVsCommunity: 45, absoluteVsRelative: -90, meaningVsAbsurd: 10 },
  },

  deleuze: {
    id: "deleuze", nameKo: "들뢰즈", nameEn: "Gilles Deleuze", years: "1925–1995",
    era: 5, school: { ko: "차이의 철학", en: "Philosophy of Difference" }, side: "will", visual: "rhizome",
    caption: { ko: "중심도 뿌리도 없이, 옆으로 번진다 — 리좀", en: "No center, no root — spreading sideways: the rhizome" },
    scene: {
      ko: "파리 8대학의 전설적 강의. 정신분석가 가타리와의 공저들은 철학책이라기보다 하나의 사건이었다. 평생 여행을 거의 하지 않았다 — '진짜 유목민은 움직이지 않는 자'라는 그다운 역설과 함께. 폐질환의 고통 속에 창문에서 몸을 던져 생을 마감했다.",
      en: "Legendary lectures at Paris 8. His co-authored books with the psychoanalyst Guattari were less philosophy than events. He barely traveled all his life — with the characteristic paradox that 'the true nomad is the one who does not move.' Suffering from lung disease, he ended his life by leaping from his window.",
    },
    quote: {
      original: "La philosophie est l'art de former, d'inventer, de fabriquer des concepts.",
      originalLang: "fr",
      en: "Philosophy is the art of forming, inventing, and fabricating concepts.",
      ko: "철학은 개념을 형성하고, 발명하고, 제작하는 기술이다.",
      source: { ko: "《철학이란 무엇인가》 (1991, 가타리 공저)", en: "What Is Philosophy? (1991, with Guattari)" },
      sting: { ko: "철학은 진리의 발견이 아니라 개념의 제조업이라는 업종 재정의 — 철학자를 사제에서 장인으로.", en: "A reclassification of the trade: philosophy is not truth-discovery but concept manufacture — the philosopher, from priest to artisan." },
    },
    weapon: {
      ko: "리좀. 나무(하나의 뿌리, 위계, 중심)가 아니라 리좀(어디서든 접속, 중심 없음, 옆으로 증식)으로 사고하기. 차이는 동일성의 결함이 아니라 존재의 원리다.",
      en: "The rhizome. Think not like a tree (one root, hierarchy, center) but like a rhizome (connection from anywhere, no center, lateral proliferation). Difference is not identity's defect but being's principle.",
    },
    analogy: {
      ko: "조직도(나무)와 실제로 일이 되는 경로(리좀)의 차이 — 하이퍼링크, 밈의 전파, 협업 문서. 21세기는 그가 개념화한 방식으로 이미 굴러가고 있다.",
      en: "The gap between the org chart (tree) and how work actually gets done (rhizome) — hyperlinks, meme propagation, shared docs. The 21st century already runs the way he conceptualized.",
    },
    agon: [{ id: "hegel", clash: {
      ko: "들뢰즈: \"변증법은 차이를 모순으로 축소해 결국 동일성으로 회수하는 기계다.\" 그는 헤겔을 '적'으로 공개 지목한 드문 철학자였다 — 그의 무기고(스피노자, 니체)는 전부 반(反)헤겔 동맹군이다.",
      en: "Deleuze: \"The dialectic is a machine that shrinks difference into contradiction and cashes it back into identity.\" He was that rare philosopher who publicly named Hegel the enemy — his armory (Spinoza, Nietzsche) is an anti-Hegel alliance.",
    } }],
    lineage: { from: ["spinoza", "nietzsche"], to: [], note: {
      ko: "그의 철학사 독법은 유명한 농담으로 요약된다 — 철학자의 등 뒤로 다가가, 그가 낳았다고 인정할 수밖에 없는 괴물 같은 아이를 만들어내는 것.",
      en: "His way of reading past philosophers is summed up in his famous joke: approaching a philosopher from behind and producing a monstrous child he cannot disown.",
    } },
    myth: null,
    dilemma: { ko: "당신의 계획 중 '위에서 아래로' 그려진 것 하나 — 옆으로, 우연한 접속으로 자라게 두면 어떻게 될까요?", en: "One plan of yours drawn top-down — what would happen if you let it grow sideways, by chance connections?" },
    axes: { reasonVsWill: -60, selfVsCommunity: 65, absoluteVsRelative: -85, meaningVsAbsurd: 25 },
  },

  rawls: {
    id: "rawls", nameKo: "롤스", nameEn: "John Rawls", years: "1921–2002",
    era: 5, school: { ko: "정치철학", en: "Political Philosophy" }, side: "reason", visual: "veil",
    caption: { ko: "무지의 베일 — 내가 누구일지 모른 채 규칙 정하기", en: "The veil of ignorance — rules chosen not knowing who you'll be" },
    scene: {
      ko: "2차대전 태평양 전선의 보병이었다. 전쟁의 경험 — 그리고 원폭 투하를 정당화하는 논리에 대한 반발 — 이 평생의 화두가 됐다고 전해진다. 하버드에서 수십 년간 한 문제만 팠다. 공정이란 무엇인가. 화려한 논객은 아니었지만, 《정의론》 한 권으로 죽어가던 정치철학을 되살렸다.",
      en: "An infantryman in the Pacific in WWII. The war — and his recoil from the logic used to justify the atomic bombings — reportedly became his lifelong question. At Harvard he spent decades on one problem: what is fairness? No dazzling debater, he revived a dying political philosophy with a single book, A Theory of Justice.",
    },
    quote: {
      original: "Justice is the first virtue of social institutions, as truth is of systems of thought.",
      originalLang: "en",
      en: "Justice is the first virtue of social institutions, as truth is of systems of thought.",
      ko: "진리가 사상 체계의 제1덕목이듯, 정의는 사회 제도의 제1덕목이다.",
      source: { ko: "《정의론》 첫 문단 (1971)", en: "A Theory of Justice, opening (1971)" },
      sting: { ko: "효율도, 성장도, 총합 행복도 정의를 대신할 수 없다는 선언 — 공리주의 백 년 천하에 대한 정면 도전장.", en: "The declaration that neither efficiency, growth, nor total happiness can substitute for justice — a direct challenge to a century of utilitarian rule." },
    },
    weapon: {
      ko: "무지의 베일. 당신이 어느 집, 어느 성별, 어느 재능으로 태어날지 모르는 상태에서 사회의 규칙을 정한다면? 그 조건에서 합의될 원칙이 공정한 원칙이다 — 최소 수혜자에게 가장 유리하도록.",
      en: "The veil of ignorance. Choose society's rules not knowing which family, sex, or talents you'll be born with. Principles agreed under that condition are the fair ones — arranged to most benefit the least advantaged.",
    },
    analogy: {
      ko: "케이크를 자르는 사람이 마지막 조각을 가져가게 하는 규칙 — 그 아이디어를 사회 전체 사이즈로 확장한 것이 롤스다.",
      en: "The rule that whoever cuts the cake takes the last slice — Rawls scaled that idea to the size of society.",
    },
    agon: [{ id: "mill", clash: {
      ko: "공리주의: \"총합이 크면 옳다.\" — 롤스: \"그 총합을 위해 누군가를 갈아 넣어도 되는가? 각 사람은 사회 전체의 이익으로도 침해할 수 없는 불가침성을 가진다.\" 다수의 산수에 맞선 개인의 방벽.",
      en: "Utilitarianism: \"Larger totals make it right.\" — Rawls: \"May someone be ground up for that total? Each person possesses an inviolability that even the welfare of society as a whole cannot override.\" The individual's rampart against the arithmetic of the many.",
    } }],
    lineage: { from: ["kant", "mill"], to: [], note: {
      ko: "칸트의 계약론을 20세기의 도구로 재건축했다. 이후의 정치철학은 찬반을 떠나 그의 좌표계 안에서 말한다.",
      en: "He rebuilt Kant's contractualism with 20th-century tools. Political philosophy since — pro or con — speaks inside his coordinate system.",
    } },
    myth: null,
    dilemma: { ko: "내일 아침 당신의 지위·재산·재능이 무작위로 재배정된다면 — 오늘 밤, 어떤 규칙부터 바꾸자고 하겠습니까?", en: "If tomorrow your status, wealth, and talents were randomly reassigned — which rule would you move to change tonight?" },
    axes: { reasonVsWill: 80, selfVsCommunity: -70, absoluteVsRelative: 55, meaningVsAbsurd: 70 },
  },

  singer: {
    id: "singer", nameKo: "싱어", nameEn: "Peter Singer", years: "1946–",
    era: 5, school: { ko: "실천윤리", en: "Practical Ethics" }, side: "reason", visual: "circles",
    caption: { ko: "도덕의 원은 넓어진다 — 가족, 이웃, 인류, 동물", en: "The moral circle widens — family, neighbors, humanity, animals" },
    scene: {
      ko: "홀로코스트로 조부모 셋을 잃은 가정에서 태어난 호주 철학자. 1972년, 벵골 기아 사태를 보며 짧은 논문 하나를 썼다 — 그것이 훗날 '효율적 이타주의' 운동의 씨앗이 된다. 《동물 해방》으로 공장식 축산을 윤리학의 법정에 세웠고, 소득의 상당액을 실제로 기부하며 산다.",
      en: "An Australian philosopher born to a family that lost three grandparents to the Holocaust. In 1972, watching the Bengal famine, he wrote one short paper — the seed of what became effective altruism. With Animal Liberation he put factory farming on ethics' docket, and he practices what he argues, giving away a substantial share of his income.",
    },
    quote: {
      original: "If it is in our power to prevent something bad from happening, without thereby sacrificing anything of comparable moral importance, we ought, morally, to do it.",
      originalLang: "en",
      en: "If it is in our power to prevent something bad from happening, without thereby sacrificing anything of comparable moral importance, we ought, morally, to do it.",
      ko: "비슷한 도덕적 중요성을 가진 것을 희생하지 않고 나쁜 일을 막을 수 있다면, 우리는 마땅히 그렇게 해야 한다.",
      source: { ko: "〈기근, 풍요, 도덕〉 (1972)", en: "'Famine, Affluence, and Morality' (1972)" },
      sting: { ko: "당연해 보이는 이 원칙을 진지하게 받아들이는 순간 — 당신의 커피값과 지구 반대편의 생명이 같은 장부에 오른다.", en: "Take this obvious-sounding principle seriously, and your coffee money lands on the same ledger as a life across the planet." },
    },
    weapon: {
      ko: "이익 평등 고려. 고통은 누구의 것이든 같은 무게다 — 국적도, 거리도, 종(種)도 할인 사유가 아니다. 물에 빠진 아이 앞에서 구두 버릴까 봐 지나치는 사람과, 기부하지 않는 우리는 얼마나 다른가라는 사고실험.",
      en: "Equal consideration of interests. Suffering weighs the same whoever bears it — nationality, distance, species: none is a discount code. The thought experiment: how different are we, walking past the drowning child to save our shoes, from ourselves not donating?",
    },
    analogy: {
      ko: "연말 기부 배너를 스킵하는 손가락 — 싱어는 그 3초를 철학 문제로 만든 사람이다. 불편함이 논증의 일부다.",
      en: "The finger that skips the year-end donation banner — Singer turned those three seconds into a philosophical problem. The discomfort is part of the argument.",
    },
    agon: [{ id: "kant", clash: {
      ko: "칸트 진영: \"도덕의 주체는 이성적 존재이고, 의무는 결과 계산이 아니다.\" — 싱어: \"이성을 회원 자격으로 삼는 순간 유아와 동물이 문밖으로 밀려난다. 벤담이 옳았다 — 물음은 '고통을 느끼는가'다.\"",
      en: "The Kantian line: \"Moral standing belongs to rational beings; duty is not outcome arithmetic.\" — Singer: \"Make reason the membership card and infants and animals are pushed out the door. Bentham was right — the question is, can they suffer?\"",
    } }],
    lineage: { from: ["bentham", "mill"], to: [], note: {
      ko: "벤담의 각주에서 출발한 동물권과, 한 편의 논문에서 자란 효율적 이타주의 — 살아 있는 철학이 세상을 바꾸는 현재진행형 사례다.",
      en: "Animal rights grown from Bentham's footnote, effective altruism from a single paper — a live, present-tense case of philosophy changing the world.",
    } },
    myth: null,
    dilemma: { ko: "한 달의 '없어도 되는 지출'을 계산해 보세요. 그 돈이 생명을 구할 수 있다면 — 보내지 않는 이유는 무엇입니까? (공격이 아니라, 싱어의 실제 질문입니다.)", en: "Total up a month of dispensable spending. If that money could save a life — what is the reason for not sending it? (Not an attack; Singer's actual question.)" },
    axes: { reasonVsWill: 75, selfVsCommunity: -75, absoluteVsRelative: 40, meaningVsAbsurd: 55 },
  },

  schopenhauer: {
    id: "schopenhauer", nameKo: "쇼펜하우어", nameEn: "Arthur Schopenhauer", years: "1788–1860",
    era: 4, school: { ko: "염세주의", en: "Pessimism" }, side: "will", visual: "pendulum",
    caption: { ko: "멈추지 않는 시계추", en: "The pendulum that never stops" },
    scene: {
      ko: "1820년 베를린. 그는 강의 시간표를 일부러 헤겔과 똑같이 맞췄다. 당대 최고 스타와의 정면 승부. 결과 — 헤겔 강의실 200명, 그의 강의실 5명. 학기를 접었다. 그리고 평생 헤겔을 '사기꾼'이라 불렀다. 인생은 고통이라는 그의 철학에는, 이렇게 실물 근거가 있다.",
      en: "Berlin, 1820. He deliberately scheduled his lectures at the exact same hour as Hegel's — a head-on duel with the biggest star of the age. Result: 200 students in Hegel's hall, 5 in his. He cancelled the course, and spent the rest of his life calling Hegel a charlatan. His philosophy that life is suffering came with receipts.",
    },
    quote: {
      original: "Das Leben schwingt, gleich einem Pendel, hin und her zwischen dem Schmerz und der Langeweile.",
      originalLang: "de",
      en: "Life swings, like a pendulum, back and forth between pain and boredom.",
      ko: "인생은 시계추처럼 고통과 권태 사이를 오간다.",
      source: { ko: "《의지와 표상으로서의 세계》 (1818)", en: "The World as Will and Representation (1818)" },
      sting: {
        ko: "행복을 논하던 시대에, 행복은 애초에 메뉴에 없다고 선언한 것.",
        en: "In an age busy theorizing happiness, he announced it was never on the menu.",
      },
    },
    weapon: {
      ko: "의지(Wille). 세계의 본질은 이성이 아니라 맹목적인 '의지' — 만족을 모르는 굶주림이다. 원하고, 얻고, 지루해지고, 다시 원한다. 이 사이클에 출구가 없어서 사는 게 고통이다.",
      en: "The Will. The essence of the world is not reason but blind striving — a hunger that cannot be satisfied. You want, you get, you get bored, you want again. There is no exit, and that is why life is suffering.",
    },
    analogy: {
      ko: "무한스크롤. 다음 게 궁금해서 스크롤하고, 다 보면 지루하고, 또 스크롤한다. 쇼펜하우어는 이 화면을 1818년에 이미 봤다.",
      en: "Infinite scroll. You scroll because you want the next thing, get bored the moment you have it, and scroll again. Schopenhauer saw this screen in 1818.",
    },
    agon: [{
      id: "hegel",
      clash: {
        ko: "헤겔: \"세계는 이성으로 전진한다. 역사는 자유를 향해 진보한다.\" — 쇼펜하우어: \"진보 같은 소리. 세계는 눈먼 의지의 몸부림이고, 저 남자는 말장난으로 대학을 접수한 사기꾼이다.\" 같은 도시, 같은 시간, 같은 건물에서 정반대의 우주가 강의되고 있었다.",
        en: "Hegel: \"The world advances through reason; history progresses toward freedom.\" — Schopenhauer: \"Progress, sure. The world is the writhing of a blind will, and that man is a charlatan who conquered the university with word games.\" Same city, same hour, same building — two opposite universes being taught.",
      },
    }],
    lineage: {
      from: ["kant"], to: ["nietzsche"],
      note: {
        ko: "칸트의 '우리는 세계 자체를 모른다'를 받아서 '그 세계 자체가 의지다'로 밀었다. 훗날 니체가 헌책방에서 그의 책을 발견하고 인생이 바뀐다 — 그리고 결론을 뒤집는다. \"맞아, 고통이다. 근데 그래서 좋다.\"",
        en: "He took Kant's 'we cannot know the world in itself' and pushed it: that world in itself is Will. Decades later a student named Nietzsche found his book in a secondhand shop — and flipped the conclusion: \"Yes, it's suffering. And I say yes to it.\"",
      },
    },
    myth: null,
    dilemma: {
      ko: "간절히 원하던 걸 손에 넣은 직후, 이상하게 허무했던 적 있습니까? 그때 무엇을 했는지 적어주세요.",
      en: "Right after getting something you badly wanted, have you felt strangely empty? What did you do then?",
    },
    axes: { reasonVsWill: -80, selfVsCommunity: 60, absoluteVsRelative: 10, meaningVsAbsurd: -70 },
  },

  hegel: {
    id: "hegel", nameKo: "헤겔", nameEn: "G. W. F. Hegel", years: "1770–1831",
    era: 4, school: { ko: "독일 관념론", en: "German Idealism" }, side: "reason", visual: "spiral",
    caption: { ko: "지그재그로 올라가는 계단", en: "A staircase that zigzags upward" },
    scene: {
      ko: "1806년 예나. 나폴레옹 군대가 도시로 진입하던 날 밤, 그는 《정신현상학》 원고를 품에 안고 피난 준비를 하고 있었다. 창밖으로 말을 탄 나폴레옹을 보고 편지에 쓴다 — '세계정신이 말을 타고 지나가는 것을 보았다.' 포성 속에서도 그는 확신했다. 이 혼란조차 역사가 앞으로 가는 방식이라고.",
      en: "Jena, 1806. The night Napoleon's army entered the city, he was clutching the manuscript of the Phenomenology of Spirit, preparing to flee. Seeing Napoleon ride past his window, he wrote: 'I saw the World-Spirit on horseback.' Even under cannon fire he was certain — this chaos, too, was how history moves forward.",
    },
    quote: {
      original: "Was vernünftig ist, das ist wirklich; und was wirklich ist, das ist vernünftig.",
      originalLang: "de",
      en: "What is rational is actual; and what is actual is rational.",
      ko: "이성적인 것은 현실적이고, 현실적인 것은 이성적이다.",
      source: { ko: "《법철학》 서문 (1820)", en: "Elements of the Philosophy of Right, Preface (1820)" },
      sting: {
        ko: "전쟁과 혁명으로 뒤집힌 세계를 보며 '이 모든 게 이성의 계획'이라 한 것. 절반은 위로, 절반은 도발.",
        en: "Looking at a world upended by war and revolution, he called it all reason's plan. Half consolation, half provocation.",
      },
    },
    weapon: {
      ko: "변증법(Dialektik). 주장(정)이 있으면 반드시 반박(반)이 나오고, 그 충돌에서 더 나은 답(합)이 태어난다. 갈등은 사고가 전진하는 유일한 방법이다. 역사도, 생각도, 싸우면서 올라간다.",
      en: "The dialectic. Every claim (thesis) provokes its refutation (antithesis), and from their collision a better answer (synthesis) is born. Conflict is the only way thought moves forward. History climbs by fighting.",
    },
    analogy: {
      ko: "격렬한 회의. A안과 B안이 싸우다가 아무도 처음엔 생각 못 한 C안이 나온다. 헤겔에겐 세계사 전체가 그 회의실이다.",
      en: "A heated meeting. Plan A and Plan B fight it out, and a Plan C nobody walked in with emerges. For Hegel, all of world history is that meeting room.",
    },
    agon: [{
      id: "schopenhauer",
      clash: {
        ko: "쇼펜하우어: \"세계가 이성적이라고? 창밖을 봐라. 눈먼 욕망의 아수라장이다.\" — 헤겔은 답할 필요조차 못 느꼈다. 강의실 200 대 5. 무시가 그의 반박이었다. 그게 쇼펜하우어를 더 미치게 했다.",
        en: "Schopenhauer: \"The world, rational? Look out the window. It's a riot of blind desire.\" — Hegel never felt the need to reply. 200 students to 5. Ignoring him was the rebuttal. Which drove Schopenhauer even madder.",
      },
    }],
    lineage: {
      from: ["kant"], to: ["marx"],
      note: {
        ko: "칸트가 그은 '알 수 있는 것의 한계선'을 지우고 이성을 역사 전체로 확장했다. 훗날 마르크스가 그의 변증법을 통째로 가져가 뒤집는다 — 정신이 아니라 밥그릇이 역사를 움직인다고.",
        en: "He erased Kant's boundary line on knowledge and stretched reason across all of history. Later Marx took his dialectic wholesale and flipped it — it's not Spirit that moves history, it's bread.",
      },
    },
    myth: null,
    dilemma: {
      ko: "지금 겪고 있는 갈등이나 실패 하나를 떠올려 보세요. 그게 나중에 더 나은 무언가의 재료가 될 거라 믿습니까?",
      en: "Think of a conflict or failure you're in right now. Do you believe it will become raw material for something better?",
    },
    axes: { reasonVsWill: 85, selfVsCommunity: -60, absoluteVsRelative: 70, meaningVsAbsurd: 80 },
  },

  nietzsche: {
    id: "nietzsche", nameKo: "니체", nameEn: "Friedrich Nietzsche", years: "1844–1900",
    era: 4, school: { ko: "실존의 폭파범", en: "Dynamite of Existence" }, side: "will", visual: "ring",
    caption: { ko: "되감기는 원형 트랙 — 영원회귀", en: "The looping track — eternal recurrence" },
    scene: {
      ko: "1865년 라이프치히의 헌책방. 스물한 살 문헌학도가 우연히 집어든 책 — 쇼펜하우어의 《의지와 표상으로서의 세계》. 그는 훗날 회고한다. 마치 그 책이 자기만을 위해 쓰인 것 같았다고. 집으로 달려가 14일간 새벽까지 읽었다. 스승은 그렇게 생겼다. 그리고 니체의 평생 작업은, 그 스승의 결론을 부수는 일이 된다.",
      en: "A secondhand bookshop, Leipzig, 1865. A 21-year-old philology student picks up a book by chance — Schopenhauer's World as Will and Representation. He later recalled it felt written for him alone. He ran home and read until dawn for two weeks. That is how he found his master. And his life's work became demolishing the master's conclusion.",
    },
    quote: {
      original: "Was mich nicht umbringt, macht mich stärker.",
      originalLang: "de",
      en: "What does not kill me makes me stronger.",
      ko: "나를 죽이지 못하는 것은 나를 더 강하게 만든다.",
      source: { ko: "《우상의 황혼》 잠언 8 (1888)", en: "Twilight of the Idols, Maxim 8 (1888)" },
      sting: {
        ko: "고통을 피하라던 스승 쇼펜하우어에게 정면으로 — 고통은 피할 게 아니라 쓸 것이다.",
        en: "Aimed straight at his master Schopenhauer, who taught escape from suffering: suffering is not to be fled but used.",
      },
    },
    weapon: {
      ko: "영원회귀. 지금 이 삶을, 이 순간까지 전부, 무한히 똑같이 반복해야 한다면? 이 질문은 이론이 아니라 검사기다 — 통과하면 당신은 삶을 긍정한 것이고, 못 견디겠으면 지금 삶을 바꿔야 한다.",
      en: "Eternal recurrence. What if you had to live this exact life, down to this moment, infinitely again? Not a theory — a diagnostic. Pass it, and you have affirmed your life. Flinch, and you know what must change.",
    },
    analogy: {
      ko: "인생을 '다시 보기' 버튼이 눌린 영상이라 치자. 스킵도 편집도 없다. 그래도 재생을 누르겠는가? 누를 수 있는 삶을 만드는 것 — 그게 니체의 숙제다.",
      en: "Imagine your life as a video stuck on replay — no skip, no edit. Would you still press play? Building a life where you would: that is Nietzsche's assignment.",
    },
    agon: [{
      id: "schopenhauer",
      clash: {
        ko: "쇼펜하우어: \"삶은 고통이다. 의지를 꺼라. 체념하라.\" — 니체: \"진단은 맞고 처방은 겁쟁이의 것. 고통까지 포함해서 삶에 '그래, 다시!'라고 말하는 것이 강함이다.\" 스승의 책에 밑줄을 긋던 청년이, 그 책을 뒤집어 놓았다.",
        en: "Schopenhauer: \"Life is suffering. Extinguish the will. Resign.\" — Nietzsche: \"Right diagnosis, coward's prescription. Strength is saying 'yes — again!' to life, suffering included.\" The young man who underlined the master's book ended up overturning it.",
      },
    }],
    lineage: {
      from: ["schopenhauer"], to: [],
      note: {
        ko: "쇼펜하우어에게서 '세계는 의지'를 받았고, 결론만 정반대로 틀었다. 이후의 실존주의 전체 — 사르트르도 카뮈도 — 그의 그림자 안에서 시작한다.",
        en: "From Schopenhauer he took 'the world is Will' — and reversed only the verdict. All of existentialism after him, Sartre and Camus included, begins in his shadow.",
      },
    },
    myth: {
      ko: "\"신은 죽었다\"는 니체의 승리 선언이 아니다. 《즐거운 학문》에서 이 말을 외치는 건 대낮에 등불을 든 광인이고, 어조는 축하가 아니라 부고다 — 유럽이 기둥 하나를 잃었는데 아무도 그 무게를 모른다는 경고.",
      en: "\"God is dead\" was never Nietzsche's victory cry. In The Gay Science the line belongs to a madman carrying a lantern at noon, and the tone is not celebration but obituary — Europe has lost a load-bearing pillar and nobody has done the math.",
    },
    dilemma: {
      ko: "지금까지의 당신 삶을, 한 순간도 바꾸지 못한 채 무한히 반복해야 한다면 — 받아들이겠습니까? 솔직하게, 왜인지도.",
      en: "If you had to repeat your life exactly as it has been, infinitely, changing nothing — would you accept? Be honest about why.",
    },
    axes: { reasonVsWill: -85, selfVsCommunity: 85, absoluteVsRelative: -60, meaningVsAbsurd: -20 },
  },

  hume: {
    id: "hume", nameKo: "흄", nameEn: "David Hume", years: "1711–1776",
    era: 3, school: { ko: "경험론", en: "Empiricism" }, side: "will", visual: "billiard",
    caption: { ko: "부딪히는 당구공 — 그런데 인과의 선이 안 그려진다", en: "Billiard balls collide — but the causal line never draws" },
    scene: {
      ko: "1739년 런던. 스물여덟의 스코틀랜드 청년이 3년을 갈아 넣은 《인간 본성론》을 출간했다. 반응 — 없음. 그는 훗날 자조한다. '인쇄기에서 사산(死産)되어 나왔다'고. 영어로 쓰인 가장 위대한 철학책 중 하나가, 아무도 안 읽은 채 서점에서 먼지를 먹었다. 정작 이 책이 수십 년 뒤 쾨니히스베르크의 한 노교수를 잠에서 깨우게 된다.",
      en: "London, 1739. A 28-year-old Scot publishes A Treatise of Human Nature, three years of his life. Reception: none. It 'fell dead-born from the press,' he later joked. One of the greatest philosophy books in English gathered dust unread — until, decades later, it woke an old professor in Königsberg from his sleep.",
    },
    quote: {
      original: "Reason is, and ought only to be the slave of the passions.",
      originalLang: "en",
      en: "Reason is, and ought only to be the slave of the passions.",
      ko: "이성은 정념의 노예이고, 오직 노예여야만 한다.",
      source: { ko: "《인간 본성론》 2권 (1739)", en: "A Treatise of Human Nature, Book II (1739)" },
      sting: {
        ko: "이성을 왕좌에 앉힌 데카르트 이후 100년 — 그 왕을 하인으로 강등시킨 문장.",
        en: "A century after Descartes crowned reason king — this sentence demoted the king to a servant.",
      },
    },
    weapon: {
      ko: "인과의 해체. 당구공 A가 B를 치면 B가 움직인다. 우리는 '원인'을 봤다고 믿지만, 실제로 본 건 그저 '연달아 일어남'뿐이다. 필연의 끈은 세계가 아니라 우리 습관 속에 있다.",
      en: "Dissolving causation. Ball A strikes ball B; B moves. We believe we saw a 'cause' — but all we ever saw was one thing following another. The thread of necessity lives in our habit, not in the world.",
    },
    analogy: {
      ko: "'이 영양제 먹고 피로가 풀렸다'는 후기. 정말 영양제 때문인가, 그냥 그 다음에 컨디션이 좋았던 건가. 흄은 세계 전체가 그 후기와 같다고 말한다 — 우리는 순서를 보고 원인이라 부른다.",
      en: "A review: 'I took this supplement and my fatigue vanished.' Was it the pill — or did you just happen to feel better afterward? Hume says the entire world is that review: we see sequence and call it cause.",
    },
    agon: [{
      id: "kant",
      clash: {
        ko: "흄: \"인과도, 자아도, 확실한 지식도 — 다 습관이다. 미안하지만 증명 불가.\" — 칸트: \"거기서 멈추면 과학이 무너진다. 인과가 세계에 없다면, 우리 인식의 틀에 있다.\" 흄이 부순 자리에서 칸트가 새 건물을 올렸다. 그 공사의 이름이 근대 철학이다.",
        en: "Hume: \"Causation, the self, certain knowledge — all habit. Sorry, none of it provable.\" — Kant: \"Stop there and science collapses. If causation isn't in the world, it's in the frame of our mind.\" On the ground Hume demolished, Kant built anew. That construction site is called modern philosophy.",
      },
    }],
    lineage: {
      from: ["locke"], to: ["kant"],
      note: {
        ko: "로크의 '모든 지식은 경험에서'를 끝까지 밀었더니 확실성이 전부 무너졌다. 그 폐허가 칸트를 깨웠다 — \"흄이 나의 독단의 잠을 깨뜨렸다.\"",
        en: "He pushed Locke's 'all knowledge from experience' to the limit — and certainty itself collapsed. The rubble woke Kant: \"Hume interrupted my dogmatic slumber.\"",
      },
    },
    myth: null,
    dilemma: {
      ko: "머리로는 아닌 걸 알면서 마음이 시키는 대로 한 최근 결정 하나를 적어주세요. 지금, 후회합니까?",
      en: "Describe one recent decision where your head said no and your heart did it anyway. Do you regret it now?",
    },
    axes: { reasonVsWill: -45, selfVsCommunity: 30, absoluteVsRelative: -75, meaningVsAbsurd: -10 },
  },

  kant: {
    id: "kant", nameKo: "칸트", nameEn: "Immanuel Kant", years: "1724–1804",
    era: 3, school: { ko: "비판철학", en: "Critical Philosophy" }, side: "reason", visual: "lens",
    caption: { ko: "벗을 수 없는 색안경", en: "Glasses you can never take off" },
    scene: {
      ko: "쾨니히스베르크. 평생 고향을 떠나지 않았고, 산책이 너무 정확해서 이웃들이 그를 보고 시계를 맞췄다는 사람. 그 정돈된 삶에 스코틀랜드에서 온 책 한 권이 떨어졌다. 흄. 그는 훗날 고백한다 — 그 책이 수십 년의 확신을 깨뜨렸다고. 그리고 57세에, 세계 철학을 두 동강 내는 책을 쓰기 시작한다.",
      en: "Königsberg. A man who never left his hometown, whose walks were so punctual neighbors set their clocks by him. Into that ordered life fell a book from Scotland — Hume. It shattered decades of certainty, he later confessed. And at 57, he began writing the book that would split philosophy in two.",
    },
    quote: {
      original: "Die Erinnerung des David Hume war eben dasjenige, was mir vor vielen Jahren zuerst den dogmatischen Schlummer unterbrach.",
      originalLang: "de",
      en: "It was the remembrance of David Hume which, many years ago, first interrupted my dogmatic slumber.",
      ko: "데이비드 흄에 대한 기억이야말로, 여러 해 전 처음으로 나의 독단의 잠을 깨뜨린 것이었다.",
      source: { ko: "《프롤레고메나》 서문 (1783)", en: "Prolegomena, Preface (1783)" },
      sting: {
        ko: "당대 최고 권위자가 공개적으로 '한 회의론자에게 완패했었다'고 인정한 것. 그리고 그 패배를 출발점으로 삼은 것.",
        en: "The era's highest authority publicly admitting a skeptic had once defeated him — and making that defeat his starting line.",
      },
    },
    weapon: {
      ko: "코페르니쿠스적 전환. 우리는 세계를 있는 그대로 보는 게 아니라, 시간·공간·인과라는 벗을 수 없는 안경을 통해 본다. 인식이 세계를 따르는 게 아니라, 세계(현상)가 우리 인식의 틀을 따른다.",
      en: "The Copernican turn. We never see the world as it is — only through un-removable glasses called time, space, and causality. Knowledge doesn't conform to the world; the world (as it appears) conforms to the frame of our knowing.",
    },
    analogy: {
      ko: "카메라 앱의 기본 필터. 끌 수 없고, 모든 사진에 이미 적용돼 있다. '필터 없는 원본'은 누구도 본 적이 없다. 칸트의 질문 — 그렇다면 원본이 아니라 필터를 연구하자.",
      en: "A camera app's default filter: impossible to turn off, already applied to every photo. No one has ever seen the unfiltered original. Kant's move — then let's study the filter, not the original.",
    },
    agon: [{
      id: "hume",
      clash: {
        ko: "흄: \"확실한 지식? 습관일 뿐.\" — 칸트: \"습관이 아니라 구조다. 인과는 세계에서 발견되는 게 아니라 우리가 세계를 보는 형식이다. 그래서 과학은 가능하다.\" 합리론과 경험론, 150년 싸움을 한 사람이 합쳐버렸다.",
        en: "Hume: \"Certain knowledge? Mere habit.\" — Kant: \"Not habit — structure. Causality isn't found in the world; it's the form through which we see it. That is why science is possible.\" One man merged rationalism and empiricism, ending a 150-year war.",
      },
    }],
    lineage: {
      from: ["hume"], to: ["hegel", "schopenhauer"],
      note: {
        ko: "흄이 깨운 잠에서 일어나 '알 수 있는 것의 지도'를 다시 그렸다. 그가 남긴 '알 수 없는 세계 자체'라는 빈칸을 놓고 헤겔과 쇼펜하우어가 정반대 답을 쓴다.",
        en: "Woken by Hume, he redrew the map of the knowable. The blank he left — the unknowable 'thing in itself' — was filled with opposite answers by Hegel and Schopenhauer.",
      },
    },
    myth: null,
    dilemma: {
      ko: "아무도 절대 모를 거짓말 하나로 모두가 행복해진다면, 하겠습니까? 답과 이유를 적어주세요.",
      en: "If one lie that no one could ever discover would make everyone happy — would you tell it? Answer, and say why.",
    },
    axes: { reasonVsWill: 90, selfVsCommunity: -20, absoluteVsRelative: 85, meaningVsAbsurd: 70 },
  },

  camus: {
    id: "camus", nameKo: "카뮈", nameEn: "Albert Camus", years: "1913–1960",
    era: 5, school: { ko: "부조리", en: "The Absurd" }, side: "will", visual: "boulder",
    caption: { ko: "다시 굴러떨어지는 바위", en: "The boulder that rolls back down" },
    scene: {
      ko: "1952년 파리. 사르트르의 잡지가 카뮈의 신간을 조롱에 가깝게 혹평했다. 카뮈는 공개 반박문을 썼고, 사르트르는 더 차가운 공개 답장으로 끝냈다 — \"우리의 우정은 쉽지 않았지만, 나는 그것을 그리워할 것이다.\" 전후 프랑스에서 가장 빛나던 우정이 서평 하나로 끝났다. 두 사람은 다시 만나지 않았다. 8년 뒤 카뮈는 교통사고로 죽는다. 부조리는 그의 이론이 아니라 이력서였다.",
      en: "Paris, 1952. Sartre's journal savaged Camus's new book. Camus wrote a public rebuttal; Sartre closed it with a colder public reply — their friendship, he wrote, had not been easy, but he would miss it. The most luminous friendship of postwar France ended over a book review. They never met again. Eight years later Camus died in a car crash. The absurd was not his theory. It was his résumé.",
    },
    quote: {
      original: "Il faut imaginer Sisyphe heureux.",
      originalLang: "fr",
      en: "One must imagine Sisyphus happy.",
      ko: "시시포스가 행복하다고 상상해야 한다.",
      source: { ko: "《시시포스 신화》 (1942)", en: "The Myth of Sisyphus (1942)" },
      sting: {
        ko: "영원히 바위를 밀어 올리는 형벌을 받은 자가 행복하다고? 의미 없음 앞에서 절망하라는 시대의 요구에 대한 정면 거부.",
        en: "The man condemned to push a boulder forever — happy? A point-blank refusal of the era's demand to despair before meaninglessness.",
      },
    },
    weapon: {
      ko: "부조리(l'absurde). 인간은 의미를 요구하고, 우주는 침묵한다. 이 어긋남이 부조리다. 출구는 셋 — 자살, 종교라는 도약, 아니면 반항. 카뮈의 답은 반항이다. 의미가 없다는 걸 직시한 채로, 그래도 계속 사는 것.",
      en: "The absurd. Humans demand meaning; the universe stays silent. That mismatch is the absurd. Three exits — suicide, the leap into faith, or revolt. Camus chooses revolt: to keep living, eyes open, without the consolation.",
    },
    analogy: {
      ko: "월요일 아침의 출근길. 이 반복에 거창한 의미가 없다는 걸 안다. 그런데 오늘 아침 커피는 맛있었고, 동료의 농담엔 웃었다. 카뮈는 말한다 — 의미는 없어도 되는 순간이 있다고. 바위를 미는 그 걸음에.",
      en: "Monday morning commute. You know the loop has no grand meaning. But this morning's coffee was good, and a colleague's joke made you laugh. Camus says some moments don't need meaning — the ones spent walking beside your boulder.",
    },
    agon: [{
      id: "sartre",
      clash: {
        ko: "사르트르: \"부조리하다면 역사를 바꾸는 행동에 뛰어들어라. 필요하다면 폭력도 역사의 도구다.\" — 카뮈: \"목적이 살인을 정당화하는 순간 반항은 폭정이 된다. 나는 정의보다 먼저 사람 편에 서겠다.\" 이 간극이 우정 하나를 삼켰다.",
        en: "Sartre: \"If it's absurd, throw yourself into action that changes history — violence included, if history requires it.\" — Camus: \"The moment ends justify murder, revolt becomes tyranny. Before justice, I side with human beings.\" That gap swallowed a friendship whole.",
      },
    }],
    lineage: {
      from: ["nietzsche"], to: [],
      note: {
        ko: "니체의 '신 없는 세계에서의 긍정'을 받아, 초인 대신 보통 사람의 버전으로 번역했다. 바위를 미는 모든 사람의 철학.",
        en: "He inherited Nietzsche's affirmation in a godless world — and translated it from the Übermensch down to the ordinary person. A philosophy for everyone pushing a boulder.",
      },
    },
    myth: null,
    dilemma: {
      ko: "의미가 없다는 걸 알면서도 계속하고 있는 일이 있습니까? 무엇이고, 왜 계속합니까?",
      en: "Is there something you keep doing while knowing it has no meaning? What is it — and why do you continue?",
    },
    axes: { reasonVsWill: -30, selfVsCommunity: 20, absoluteVsRelative: -50, meaningVsAbsurd: -90 },
  },
};

/* ================= 표시 순서 ================= */
const ORDER = {
  1: ["heraclitus", "parmenides", "pythagoras", "socrates", "plato", "aristotle", "diogenes", "epicurus", "seneca", "epictetus", "aurelius"],
  east: ["confucius", "laozi", "zhuangzi", "buddha"],
  2: ["augustine", "aquinas", "ockham"],
  3: ["descartes", "spinoza", "leibniz", "pascal", "hobbes", "rousseau", "locke", "berkeley", "hume", "voltaire", "kant"],
  4: ["hegel", "schopenhauer", "nietzsche", "kierkegaard", "marx", "bentham", "mill", "freud"],
  5: ["russell", "wittgenstein", "popper", "heidegger", "arendt", "sartre", "camus", "beauvoir", "benjamin", "adorno", "foucault", "derrida", "deleuze", "rawls", "singer"],
};
const ALL_IDS = [...ORDER[1], ...ORDER.east, ...ORDER[2], ...ORDER[3], ...ORDER[4], ...ORDER[5]];
const TOTAL = ALL_IDS.length;

/* ================= 오늘의 재판 — 3종 ================= */
const TRIALS = [
  {
    key: "lie",
    q: { ko: "거짓말은 항상 나쁜가?", en: "Is lying always wrong?" },
    args: [
      { id: "kant", stance: { ko: "항상 나쁘다", en: "Always wrong" }, arg: {
        ko: "거짓말이 허용되는 순간, '모두가 거짓말해도 되는 세계'를 승인한 것이다. 그 세계에선 약속도 언어도 무너진다. 예외는 없다.",
        en: "Permit one lie and you endorse a world where everyone may lie. In that world, promises and language collapse. No exceptions.",
      } },
      { id: "hume", stance: { ko: "관습이 정한다", en: "Convention decides" }, arg: {
        ko: "'나쁘다'는 이성의 증명이 아니라 감정과 사회적 신뢰의 문제다. 거짓말이 나쁜 이유는 신뢰라는 관습을 부수기 때문 — 신뢰를 지키는 거짓말이라면 계산이 달라진다.",
        en: "'Wrong' is not proven by reason; it's a matter of sentiment and trust. Lying is bad because it breaks the convention of trust — a lie that protects trust changes the math.",
      } },
      { id: "nietzsche", stance: { ko: "질문이 틀렸다", en: "Wrong question" }, arg: {
        ko: "'항상 나쁜가'라고 묻는 순간 이미 노예의 도덕이다. 물어야 할 것은 — 이 거짓말은 삶을 키우는가, 움츠러들게 하는가. 강자의 거짓과 겁쟁이의 거짓은 다른 동물이다.",
        en: "To ask 'always wrong?' is already slave morality. Ask instead: does this lie make life larger or smaller? The lie of the strong and the lie of the coward are different animals.",
      } },
    ],
  },
  {
    key: "sacrifice",
    q: { ko: "다수를 위해 소수를 희생해도 되는가?", en: "May the few be sacrificed for the many?" },
    args: [
      { id: "bentham", stance: { ko: "산수는 끝났다", en: "The math is done" }, arg: {
        ko: "감정을 빼고 계산하라. 다섯을 살리는 하나의 손실이라면 총합은 명백하다. 망설임은 숭고해 보이지만, 그 사이 넷이 더 죽는다.",
        en: "Remove sentiment and count. One loss that saves five — the total is clear. Hesitation looks noble, but four more die inside it.",
      } },
      { id: "kant", stance: { ko: "절대 불가", en: "Never" }, arg: {
        ko: "인간을 수단으로만 대하는 순간 도덕이 끝난다. 다섯을 위해 하나를 밀어 넣는 사회는, 다음 계산에서 당신을 밀어 넣는다.",
        en: "The moment a person is used merely as a means, morality ends. A society that pushes one in for five will push you in at the next calculation.",
      } },
      { id: "rawls", stance: { ko: "질문을 바꿔라", en: "Change the question" }, arg: {
        ko: "당신이 그 '소수'가 될지 모르는 상태에서도 같은 규칙에 서명하겠는가 — 그것이 기준이다. 각 사람에게는 사회 전체의 이익으로도 침해할 수 없는 것이 있다.",
        en: "Would you sign the same rule not knowing whether you'd be the 'few'? That is the test. Each person holds something even society's total gain cannot override.",
      } },
    ],
  },
  {
    key: "work",
    q: { ko: "일은 삶의 의미가 될 수 있는가?", en: "Can work be the meaning of life?" },
    args: [
      { id: "aristotle", stance: { ko: "될 수 있다", en: "Yes, it can" }, arg: {
        ko: "일이 당신의 탁월함을 발휘하는 활동이라면 — 그것이 곧 행복이다. 에우다이모니아는 기분이 아니라 좋은 활동의 다른 이름이다.",
        en: "If your work is the exercise of your excellence, then it simply is happiness. Eudaimonia is not a mood but another name for good activity.",
      } },
      { id: "marx", stance: { ko: "구조부터 물어라", en: "Ask the structure first" }, arg: {
        ko: "지금의 임금노동에서 일은 대개 소외다 — 당신 것이 아닌 목적을 위해 당신을 소모하는 것. '의미'를 묻기 전에, 그 노동의 결과가 누구 것인지부터 물어라.",
        en: "Under wage labor, work is mostly alienation — consuming you for ends that are not yours. Before asking about meaning, ask who owns the product of the labor.",
      } },
      { id: "camus", stance: { ko: "의미는 네가 만든다", en: "You make the meaning" }, arg: {
        ko: "시시포스의 바위도 노동이었다. 의미는 일이 지급해 주는 것이 아니라, 바위 곁으로 돌아가는 걸음에서 당신이 만들어내는 것이다.",
        en: "Sisyphus's boulder was labor too. Meaning is not paid out by the job — it is made by you, in the walk back down to the boulder.",
      } },
    ],
  },
];

/* ================= AI 프롬프트 ================= */
function judgePrompt(ph, answer) {
  return `너는 철학 학습 앱 AGON의 판정 AI다. 사실 데이터(명언·주장)는 앱에 하드코딩되어 있으며, 너의 역할은 생성이 아니라 해설이다. 철학자의 말이나 주장을 새로 지어내지 마라.

딜레마 (출제: ${ph.nameKo} / ${ph.nameEn}): ${ph.dilemma.ko}
사용자의 답: ${answer}

사용자의 답을 읽고 성향을 판정해라. closest 후보 id: ${ALL_IDS.join(", ")}.

다른 텍스트 없이 JSON 객체 하나만 출력해라. 마크다운 코드블록 금지:
{"axes":{"reasonVsWill":정수(-100 의지 ~ +100 이성),"selfVsCommunity":정수(-100 공동체 ~ +100 개인),"absoluteVsRelative":정수(-100 상대 ~ +100 절대),"meaningVsAbsurd":정수(-100 부조리 ~ +100 의미)},"closest":"철학자id","verdictKo":"2문장 이내. 존댓말. 위트 있게. '당신 지금 ~쪽이네요' 톤.","verdictEn":"영어로 같은 내용"}`;
}

function trialPrompt(trial, pick, answer) {
  const chosen = trial.args.find((a) => a.id === pick);
  const summary = trial.args.map((a) => `${a.id}(${a.stance.ko}: ${a.arg.ko.slice(0, 40)}...)`).join(" / ");
  return `너는 철학 학습 앱 AGON의 판정 AI다. 철학자의 말을 새로 지어내지 마라. 아래 변론 요약의 범위 안에서만 해설해라.

오늘의 재판: ${trial.q.ko}
변론 요약 — ${summary}
사용자의 판결: ${chosen ? chosen.id : pick}의 손을 들어줌.
사용자의 이유: ${answer || "(이유 미작성)"}

다른 텍스트 없이 JSON 객체 하나만 출력해라. 마크다운 코드블록 금지:
{"verdictKo":"판결에 대한 코멘트 2~3문장. 존댓말. 위트. 반대편이 뭐라고 받아칠지 한 줄 포함.","verdictEn":"영어로 같은 내용"}`;
}

/* ================= UI 조각 ================= */
function Eyebrow({ children, color }) {
  return (
    <div className="text-[10px] tracking-[0.25em] uppercase mb-2 font-sans" style={{ color: color || INK, opacity: color ? 1 : 0.45 }}>
      {children}
    </div>
  );
}

function Radar({ user, refAxes, refColor }) {
  const axesKeys = ["reasonVsWill", "selfVsCommunity", "absoluteVsRelative", "meaningVsAbsurd"];
  const cx = 110, cy = 100, R = 72;
  const pt = (i, v) => {
    const ang = (Math.PI / 2) * i - Math.PI / 2;
    const r = ((v + 100) / 200) * R;
    return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
  };
  const poly = (ax) => axesKeys.map((k, i) => pt(i, ax[k] ?? 0).join(",")).join(" ");
  const labels = [
    { t: "이성", x: cx, y: cy - R - 10, a: "middle" },
    { t: "개인", x: cx + R + 8, y: cy + 4, a: "start" },
    { t: "절대", x: cx, y: cy + R + 16, a: "middle" },
    { t: "의미", x: cx - R - 8, y: cy + 4, a: "end" },
  ];
  return (
    <svg viewBox="0 0 220 210" className="w-full">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={axesKeys.map((k, i) => pt(i, -100 + 200 * f).join(",")).join(" ")} fill="none" stroke={INK} strokeWidth="0.6" opacity="0.15" />
      ))}
      {axesKeys.map((k, i) => {
        const [x, y] = pt(i, 100);
        return <line key={k} x1={cx} y1={cy} x2={x} y2={y} stroke={INK} strokeWidth="0.6" opacity="0.15" />;
      })}
      {refAxes && <polygon points={poly(refAxes)} fill={refColor} opacity="0.12" stroke={refColor} strokeWidth="1" />}
      <polygon points={poly(user)} fill="none" stroke={INK} strokeWidth="1.8" />
      {axesKeys.map((k, i) => {
        const [x, y] = pt(i, user[k] ?? 0);
        return <circle key={k} cx={x} cy={y} r="3.5" fill={(user[k] ?? 0) >= 0 ? REASON : WILL} />;
      })}
      {labels.map((l) => (
        <text key={l.t} x={l.x} y={l.y} fontSize="10" textAnchor={l.a} fill={INK} opacity="0.55" letterSpacing="2">{l.t}</text>
      ))}
    </svg>
  );
}

/* ================= 철학자 카드 ================= */
function Card({ ph, lang, onBack, onOpen, onJudged, judged }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(judged || null);
  const [errMsg, setErrMsg] = useState(null);
  const T = ERA_TYPE[ph.era];
  const tint = sideColor(ph.side);
  const Vis = Visuals[ph.visual];
  const L = (obj) => (obj ? obj[lang] || obj.ko : "");

  const submit = async () => {
    if (!answer.trim() || loading) return;
    setLoading(true); setErrMsg(null);
    try {
      const r = await callJudge(judgePrompt(ph, answer));
      setResult(r);
      onJudged(ph.id, r);
    } catch (e) {
      setErrMsg(e && e.message ? String(e.message) : "unknown");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-28">
      <style>{`@keyframes agonL{from{transform:translateX(-30px);opacity:0}to{transform:none;opacity:1}}@keyframes agonR{from{transform:translateX(30px);opacity:0}to{transform:none;opacity:1}}@media(prefers-reduced-motion:reduce){.agon-in{animation:none!important}}`}</style>
      <button onClick={onBack} className="text-xs tracking-widest opacity-50 mb-6 font-sans">← {lang === "ko" ? "연표" : "TIMELINE"}</button>

      <div className="mb-8">
        <div className="text-[10px] tracking-[0.3em] opacity-45 font-sans mb-1">
          {ERA_NAME[ph.era][lang]} · {L(ph.school)}
        </div>
        <h1 style={T} className="text-4xl">{ph.nameKo}</h1>
        <div className="text-sm opacity-55 mt-1 font-sans">{ph.nameEn} · {ph.years}</div>
      </div>

      {Vis && <div className="mb-2"><Vis tint={tint} /></div>}
      <div className="mb-10 text-[11px] opacity-45 text-center font-sans">{L(ph.caption)}</div>

      <section className="mb-10">
        <Eyebrow>{lang === "ko" ? "씬 · Scene" : "Scene"}</Eyebrow>
        <p className="leading-relaxed text-[15px]">{L(ph.scene)}</p>
      </section>

      <section className="mb-10">
        <Eyebrow>{lang === "ko" ? "한 방 · The Line" : "The Line"}</Eyebrow>
        <button onClick={() => setOpen(!open)} className="text-left w-full">
          <blockquote style={{ ...T, fontStyle: "italic" }} className="text-2xl leading-snug">
            “{ph.quote.original}”
          </blockquote>
          {!open && <div className="text-[11px] opacity-40 mt-3 font-sans">{lang === "ko" ? "탭해서 번역 보기" : "Tap for translation"}</div>}
        </button>
        {open && (
          <div className="mt-4 space-y-2 text-sm border-l pl-4" style={{ borderColor: INK + "33" }}>
            {ph.quote.originalLang !== "en" && <p className="italic opacity-80">{ph.quote.en}</p>}
            <p className="font-medium">{ph.quote.ko}</p>
            <p className="text-xs opacity-50 font-sans">— {L(ph.quote.source)}</p>
            <p className="text-[13px] mt-3 opacity-75">{L(ph.quote.sting)}</p>
          </div>
        )}
      </section>

      <section className="mb-10">
        <Eyebrow>{lang === "ko" ? "무기 · Weapon" : "Weapon"}</Eyebrow>
        <p className="leading-relaxed text-[15px]">{L(ph.weapon)}</p>
      </section>

      <section className="mb-10">
        <Eyebrow>{lang === "ko" ? "지금 여기 · Now" : "Now"}</Eyebrow>
        <p className="leading-relaxed text-[15px]">{L(ph.analogy)}</p>
      </section>

      <section className="mb-10">
        <Eyebrow color={tint}>AGON</Eyebrow>
        <div className="space-y-6">
          {ph.agon.map((a, i) => {
            const rival = P[a.id];
            const rivalTint = rival ? sideColor(rival.side) : (ph.side === "will" ? REASON : WILL);
            const rivalName = rival ? rival.nameKo : (a.name || a.id);
            const rivalNameEn = rival ? rival.nameEn : (a.nameEnOv || a.name || a.id);
            return (
              <div key={i} className="border-l-2 pl-4" style={{ borderColor: tint }}>
                <div className="flex items-baseline gap-2 mb-3 font-sans text-sm">
                  <span style={{ color: tint, animation: "agonL .5s ease" }} className="font-semibold agon-in">{lang === "ko" ? ph.nameKo : ph.nameEn}</span>
                  <span className="opacity-40 text-xs">↔</span>
                  <span style={{ color: rivalTint, animation: "agonR .5s ease" }} className="font-semibold agon-in">
                    {lang === "ko" ? rivalName : rivalNameEn}
                    {rival && (
                      <button onClick={() => onOpen(rival.id)} className="ml-2 text-[10px] underline opacity-60 font-normal">
                        {lang === "ko" ? "카드" : "card"}
                      </button>
                    )}
                  </span>
                </div>
                <p className="leading-relaxed text-[15px]">{L(a.clash)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-10">
        <Eyebrow>{lang === "ko" ? "계보 · Lineage" : "Lineage"}</Eyebrow>
        <p className="leading-relaxed text-[14px] opacity-85">{L(ph.lineage.note)}</p>
      </section>

      {ph.myth && (
        <section className="mb-10">
          <Eyebrow>{lang === "ko" ? "오해 주의 · Myth" : "Myth"}</Eyebrow>
          <p className="leading-relaxed text-[14px] opacity-85">{L(ph.myth)}</p>
        </section>
      )}

      <section className="mb-10">
        <Eyebrow>{lang === "ko" ? "네 차례 · Your Turn" : "Your Turn"}</Eyebrow>
        <p className="text-[15px] mb-4 font-medium leading-relaxed">{L(ph.dilemma)}</p>
        {!result ? (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder={lang === "ko" ? "솔직하게 적을수록 판정이 재밌어집니다" : "The more honest, the better the verdict"}
              className="w-full p-3 text-sm bg-transparent border rounded-none focus:outline-none"
              style={{ borderColor: INK + "44", color: INK }}
            />
            <button
              onClick={submit}
              disabled={loading || !answer.trim()}
              className="mt-3 px-5 py-2.5 text-sm font-sans tracking-widest disabled:opacity-30"
              style={{ background: INK, color: PAPER }}
            >
              {loading ? (lang === "ko" ? "판정 중…" : "Judging…") : (lang === "ko" ? "판정 받기" : "Get verdict")}
            </button>
            {errMsg && (
              <p className="text-xs mt-2 opacity-60">
                {lang === "ko" ? "판정에 실패했습니다. 잠시 후 다시 시도해 주세요." : "Verdict failed. Try again shortly."} ({errMsg.slice(0, 80)})
              </p>
            )}
          </>
        ) : (
          <div className="border-l-2 pl-4" style={{ borderColor: INK }}>
            <p className="text-[15px] leading-relaxed">{lang === "ko" ? result.verdictKo : result.verdictEn}</p>
            {result.closest && P[result.closest] && (
              <button onClick={() => onOpen(result.closest)} className="text-xs mt-2 opacity-55 font-sans underline">
                {lang === "ko" ? "가장 가까운 편: " : "Closest side: "}{P[result.closest].nameKo} ({P[result.closest].nameEn})
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/* ================= 연표(홈) ================= */
function Timeline({ lang, onOpen, readSet }) {
  const readCount = readSet.size;
  const renderRow = (id, era) => {
    const ph = P[id];
    const read = readSet.has(id);
    const rivalEntry = ph.agon && ph.agon[0];
    const rival = rivalEntry ? P[rivalEntry.id] : null;
    const rivalLabel = rival ? (lang === "ko" ? rival.nameKo : rival.nameEn) : rivalEntry ? (lang === "ko" ? rivalEntry.name : rivalEntry.nameEnOv || rivalEntry.name) : null;
    return (
      <button key={id} onClick={() => onOpen(id)} className="w-full text-left py-2.5 flex items-baseline justify-between" style={{ opacity: read ? 1 : 0.75 }}>
        <span style={{ ...ERA_TYPE[era], fontWeight: read ? 800 : ERA_TYPE[era].fontWeight }} className="text-lg">
          {ph.nameKo}
          <span className="text-xs opacity-45 ml-2 font-sans font-normal tracking-normal">{ph.nameEn}</span>
          {rivalLabel && <span className="text-[10px] ml-2 font-sans font-normal tracking-normal" style={{ color: sideColor(ph.side), opacity: 0.7 }}>↔ {rivalLabel}</span>}
        </span>
        <span className="text-[10px] font-sans" style={{ color: sideColor(ph.side) }}>{read ? "●" : "○"}</span>
      </button>
    );
  };

  const eraBlock = (era, ids, titleOv) => {
    const readInEra = ids.filter((id) => readSet.has(id)).length;
    return (
      <section key={titleOv || era} className="mb-12">
        <div className="flex items-baseline justify-between border-b pb-2 mb-1" style={{ borderColor: INK + "33" }}>
          <h2 style={ERA_TYPE[era]} className="text-xl">{titleOv || ERA_NAME[era][lang]}</h2>
          <span className="text-[10px] opacity-40 font-sans">{titleOv ? (lang === "ko" ? "같은 시대, 다른 대륙" : "Same era, another continent") : ERA_Q[era][lang]}</span>
        </div>
        <div className="h-[2px] mb-3" style={{ background: INK + "14" }}>
          <div className="h-full" style={{ width: `${(readInEra / ids.length) * 100}%`, background: INK }} />
        </div>
        <div className="space-y-1">{ids.map((id) => renderRow(id, era))}</div>
      </section>
    );
  };

  return (
    <div className="pb-28">
      <div className="mb-8 mt-2">
        <h1 className="text-5xl" style={{ fontFamily: "Georgia, serif", letterSpacing: "0.02em" }}>AGON</h1>
        <p className="text-xs opacity-50 mt-2 font-sans leading-relaxed">
          {lang === "ko"
            ? "ἀγών — 겨룸. 철학은 아곤에서 태어났다. 모든 개념은 누군가가 누군가에게 화가 나서 나왔다."
            : "ἀγών — the contest. Philosophy was born in the agon. Every concept exists because someone got angry at someone."}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-[11px] font-sans opacity-55">{lang === "ko" ? `읽음 ${readCount}/${TOTAL}` : `Read ${readCount}/${TOTAL}`}</span>
          <div className="flex-1 h-[3px]" style={{ background: INK + "14" }}>
            <div className="h-full" style={{ width: `${(readCount / TOTAL) * 100}%`, background: INK }} />
          </div>
          <button
            onClick={() => onOpen(ALL_IDS[Math.floor(Math.random() * ALL_IDS.length)])}
            className="text-[10px] font-sans tracking-widest border px-2 py-1"
            style={{ borderColor: INK + "44" }}
          >
            {lang === "ko" ? "무작위" : "RANDOM"}
          </button>
        </div>
      </div>

      {eraBlock(1, ORDER[1])}
      {eraBlock(1, ORDER.east, lang === "ko" ? "동양 와일드카드" : "Eastern Wildcard")}
      {eraBlock(2, ORDER[2])}
      {eraBlock(3, ORDER[3])}
      {eraBlock(4, ORDER[4])}
      {eraBlock(5, ORDER[5])}
    </div>
  );
}

/* ================= 아레나 — 이 한 방, 누구? ================= */
function makeQuiz() {
  const answerId = ALL_IDS[Math.floor(Math.random() * ALL_IDS.length)];
  const ph = P[answerId];
  const sameEra = ALL_IDS.filter((id) => id !== answerId && P[id].era === ph.era);
  const others = ALL_IDS.filter((id) => id !== answerId && P[id].era !== ph.era);
  const shuffled = [...sameEra].sort(() => Math.random() - 0.5);
  const wrong = shuffled.slice(0, 2);
  while (wrong.length < 2) wrong.push(others[Math.floor(Math.random() * others.length)]);
  const choices = [answerId, ...wrong].sort(() => Math.random() - 0.5);
  return { answerId, choices };
}

function Arena({ lang, onOpen }) {
  const [quiz, setQuiz] = useState(() => makeQuiz());
  const [picked, setPicked] = useState(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [count, setCount] = useState(0);
  const ph = P[quiz.answerId];
  const correct = picked === quiz.answerId;

  const pick = (id) => {
    if (picked) return;
    setPicked(id);
    setCount((c) => c + 1);
    if (id === quiz.answerId) {
      setStreak((s) => { const n = s + 1; setBest((b) => Math.max(b, n)); return n; });
    } else {
      setStreak(0);
    }
  };
  const next = () => { setQuiz(makeQuiz()); setPicked(null); };

  return (
    <div className="pb-28">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <Eyebrow>{lang === "ko" ? "아레나 · Arena" : "Arena"}</Eyebrow>
          <h1 className="text-3xl" style={{ fontFamily: "Georgia, serif" }}>{lang === "ko" ? "이 한 방, 누구?" : "Whose line is it?"}</h1>
        </div>
        <div className="text-right text-[11px] font-sans opacity-60 leading-relaxed">
          {lang === "ko" ? "연승" : "Streak"} <span className="font-bold text-sm">{streak}</span><br />
          {lang === "ko" ? "최고" : "Best"} {best} · {count}{lang === "ko" ? "문" : " q"}
        </div>
      </div>

      <blockquote className="text-xl leading-snug mb-2" style={{ fontFamily: "Georgia, 'Noto Serif KR', serif", fontStyle: "italic" }}>
        “{ph.quote.ko}”
      </blockquote>
      <p className="text-[11px] opacity-45 mb-8 font-sans truncate">{ph.quote.original}</p>

      <div className="space-y-2 mb-6">
        {quiz.choices.map((id) => {
          const c = P[id];
          const isAnswer = id === quiz.answerId;
          const isPicked = picked === id;
          let border = INK + "33";
          if (picked) {
            if (isAnswer) border = REASON;
            else if (isPicked) border = WILL;
          }
          return (
            <button
              key={id}
              onClick={() => pick(id)}
              className="w-full text-left border px-4 py-3 flex items-baseline justify-between"
              style={{ borderColor: border, opacity: picked && !isAnswer && !isPicked ? 0.4 : 1 }}
            >
              <span className="text-[15px]">{c.nameKo} <span className="text-xs opacity-50 font-sans">{c.nameEn}</span></span>
              {picked && isAnswer && <span className="text-[10px] font-sans" style={{ color: REASON }}>{lang === "ko" ? "정답" : "Correct"}</span>}
              {picked && isPicked && !isAnswer && <span className="text-[10px] font-sans" style={{ color: WILL }}>{lang === "ko" ? "오답" : "Wrong"}</span>}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="border-l-2 pl-4 mb-6" style={{ borderColor: correct ? REASON : WILL }}>
          <p className="text-[13px] opacity-75 leading-relaxed mb-1">{ph.quote.sting[lang] || ph.quote.sting.ko}</p>
          <p className="text-[11px] opacity-50 font-sans">— {ph.quote.source[lang] || ph.quote.source.ko}</p>
          <div className="flex gap-4 mt-3">
            <button onClick={() => onOpen(ph.id)} className="text-xs font-sans underline opacity-70">{lang === "ko" ? "카드 열기" : "Open card"}</button>
            <button onClick={next} className="text-xs font-sans tracking-widest px-4 py-1.5" style={{ background: INK, color: PAPER }}>
              {lang === "ko" ? "다음" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= 오늘의 재판 ================= */
function Trial({ lang, saved, onJudged }) {
  const [ti, setTi] = useState(saved ? saved.ti : 0);
  const trial = TRIALS[ti];
  const savedForThis = saved && saved.ti === ti ? saved : null;
  const [pick, setPick] = useState(savedForThis ? savedForThis.pick : null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(savedForThis ? savedForThis.result : null);
  const [err, setErr] = useState(false);

  const switchTrial = (i) => {
    setTi(i);
    const s = saved && saved.ti === i ? saved : null;
    setPick(s ? s.pick : null);
    setResult(s ? s.result : null);
    setReason("");
    setErr(false);
  };

  const submit = async () => {
    if (!pick || loading) return;
    setLoading(true); setErr(false);
    try {
      const r = await callJudge(trialPrompt(trial, pick, reason));
      setResult(r);
      onJudged({ ti, pick, result: r });
    } catch (e) { setErr(true); } finally { setLoading(false); }
  };

  return (
    <div className="pb-28">
      <Eyebrow>{lang === "ko" ? "오늘의 재판 · The Trial" : "The Trial"}</Eyebrow>
      <div className="flex gap-2 mb-5">
        {TRIALS.map((t, i) => (
          <button key={t.key} onClick={() => switchTrial(i)} className="text-[10px] font-sans tracking-widest border px-2.5 py-1"
            style={{ borderColor: i === ti ? INK : INK + "33", opacity: i === ti ? 1 : 0.5 }}>
            {i + 1}
          </button>
        ))}
      </div>
      <h1 className="text-3xl mb-8" style={{ fontFamily: "Georgia, serif" }}>{trial.q[lang]}</h1>

      <div className="space-y-4 mb-8">
        {trial.args.map((a) => {
          const ph = P[a.id];
          const tint = sideColor(ph.side);
          const active = pick === a.id;
          return (
            <button
              key={a.id}
              onClick={() => !result && setPick(a.id)}
              className="w-full text-left border-l-2 pl-4 py-1 transition-opacity"
              style={{ borderColor: active ? tint : INK + "26", opacity: pick && !active ? 0.45 : 1 }}
            >
              <div className="flex items-baseline gap-2 font-sans text-sm mb-1">
                <span className="font-semibold" style={{ color: active ? tint : INK }}>{lang === "ko" ? ph.nameKo : ph.nameEn}</span>
                <span className="text-xs opacity-50">{a.stance[lang]}</span>
              </div>
              <p className="text-[14px] leading-relaxed opacity-85">{a.arg[lang]}</p>
            </button>
          );
        })}
      </div>

      {!result ? (
        <>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder={lang === "ko" ? "판결 이유 (선택)" : "Your reasoning (optional)"}
            className="w-full p-3 text-sm bg-transparent border focus:outline-none"
            style={{ borderColor: INK + "44" }}
          />
          <button
            onClick={submit}
            disabled={!pick || loading}
            className="mt-3 px-5 py-2.5 text-sm font-sans tracking-widest disabled:opacity-30"
            style={{ background: INK, color: PAPER }}
          >
            {loading ? (lang === "ko" ? "심리 중…" : "Deliberating…") : (lang === "ko" ? "판결 선고" : "Deliver verdict")}
          </button>
          {err && <p className="text-xs mt-2 opacity-60">{lang === "ko" ? "심리에 실패했습니다. 다시 시도해 주세요." : "Deliberation failed. Try again."}</p>}
        </>
      ) : (
        <div className="border-l-2 pl-4" style={{ borderColor: INK }}>
          <Eyebrow>{lang === "ko" ? "법정 코멘트" : "Court comment"}</Eyebrow>
          <p className="text-[15px] leading-relaxed">{lang === "ko" ? result.verdictKo : result.verdictEn}</p>
        </div>
      )}
    </div>
  );
}

/* ================= 스탠딩 ================= */
function Standings({ lang, userAxes, count, onOpen }) {
  const ranked = useMemo(() => {
    if (!count) return [];
    const keys = ["reasonVsWill", "selfVsCommunity", "absoluteVsRelative", "meaningVsAbsurd"];
    return ALL_IDS.map((id) => {
      const ph = P[id];
      const d = keys.reduce((s, k) => s + Math.abs((userAxes[k] ?? 0) - ph.axes[k]), 0) / keys.length;
      return { ph, pct: Math.max(0, Math.round(100 - d / 2)) };
    }).sort((a, b) => b.pct - a.pct);
  }, [userAxes, count]);

  const top = ranked[0];
  const shown = ranked.slice(0, 10);

  return (
    <div className="pb-28">
      <Eyebrow>{lang === "ko" ? "스탠딩 · Where You Stand" : "Where You Stand"}</Eyebrow>
      <h1 className="text-3xl mb-6" style={{ fontFamily: "Georgia, serif" }}>
        {lang === "ko" ? "나는 어느 편인가" : "Whose side am I on?"}
      </h1>

      {count === 0 ? (
        <p className="text-sm opacity-60 leading-relaxed">
          {lang === "ko"
            ? "아직 판정 기록이 없습니다. 철학자 카드의 '네 차례'에 답하면 여기에 당신의 좌표가 그려집니다."
            : "No verdicts yet. Answer a philosopher's 'Your Turn' and your coordinates will be drawn here."}
        </p>
      ) : (
        <>
          <Radar user={userAxes} refAxes={top ? top.ph.axes : null} refColor={top ? sideColor(top.ph.side) : INK} />
          <div className="mt-2 text-[10px] opacity-45 text-center font-sans mb-8">
            {lang === "ko" ? "잉크 선 = 나 · 옅은 면 = 가장 가까운 철학자" : "Ink line = you · faint area = closest thinker"}
          </div>
          <div className="space-y-2">
            {shown.map(({ ph, pct }) => (
              <button key={ph.id} onClick={() => onOpen(ph.id)} className="w-full flex items-center gap-3">
                <span className="w-24 text-sm text-left">{ph.nameKo}</span>
                <div className="flex-1 h-[3px]" style={{ background: INK + "1a" }}>
                  <div className="h-full" style={{ width: pct + "%", background: sideColor(ph.side) }} />
                </div>
                <span className="text-xs font-sans w-9 text-right opacity-70">{pct}%</span>
              </button>
            ))}
          </div>
          <p className="text-xs opacity-45 mt-6 font-sans leading-relaxed">
            {lang === "ko" ? `상위 10명 표시 · 판정 ${count}회 누적 평균. 답할수록 정확해집니다.` : `Top 10 shown · running average over ${count} verdict${count > 1 ? "s" : ""}.`}
          </p>
        </>
      )}
    </div>
  );
}

/* ================= 앱 ================= */
export default function App() {
  const [view, setView] = useState("home");
  const [current, setCurrent] = useState(null);
  const [lang, setLang] = useState("ko");
  const [readSet, setReadSet] = useState(new Set());
  const [judgments, setJudgments] = useState({});
  const [trialSaved, setTrialSaved] = useState(null);

  const count = Object.keys(judgments).length;
  const userAxes = useMemo(() => {
    const keys = ["reasonVsWill", "selfVsCommunity", "absoluteVsRelative", "meaningVsAbsurd"];
    const acc = { reasonVsWill: 0, selfVsCommunity: 0, absoluteVsRelative: 0, meaningVsAbsurd: 0 };
    const list = Object.values(judgments);
    if (!list.length) return acc;
    list.forEach((r) => keys.forEach((k) => (acc[k] += Number(r.axes && r.axes[k]) || 0)));
    keys.forEach((k) => (acc[k] = Math.round(acc[k] / list.length)));
    return acc;
  }, [judgments]);

  const openCard = (id) => {
    if (!P[id]) return;
    setCurrent(id);
    setReadSet((s) => new Set(s).add(id));
    setView("card");
  };

  const NavBtn = ({ v, ko, en }) => (
    <button
      onClick={() => setView(v)}
      className="flex-1 py-3.5 text-[11px] tracking-[0.2em] font-sans"
      style={{ opacity: view === v || (v === "home" && view === "card") ? 1 : 0.4, fontWeight: view === v ? 700 : 400 }}
    >
      {lang === "ko" ? ko : en}
    </button>
  );

  return (
    <div style={{ background: PAPER, color: INK, minHeight: "100vh" }}>
      <div className="max-w-md mx-auto px-5 pt-5">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            className="text-[10px] tracking-[0.25em] font-sans border px-2.5 py-1"
            style={{ borderColor: INK + "44" }}
          >
            {lang === "ko" ? "EN" : "KO"}
          </button>
        </div>

        {view === "home" && <Timeline lang={lang} onOpen={openCard} readSet={readSet} />}
        {view === "card" && current && P[current] && (
          <Card
            key={current}
            ph={P[current]}
            lang={lang}
            onBack={() => setView("home")}
            onOpen={openCard}
            judged={judgments[current]}
            onJudged={(id, r) => setJudgments((j) => ({ ...j, [id]: r }))}
          />
        )}
        {view === "arena" && <Arena lang={lang} onOpen={openCard} />}
        {view === "trial" && <Trial lang={lang} saved={trialSaved} onJudged={setTrialSaved} />}
        {view === "standings" && <Standings lang={lang} userAxes={userAxes} count={count} onOpen={openCard} />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0" style={{ background: PAPER, borderTop: `1px solid ${INK}22` }}>
        <div className="max-w-md mx-auto flex">
          <NavBtn v="home" ko="연표" en="TIMELINE" />
          <NavBtn v="arena" ko="아레나" en="ARENA" />
          <NavBtn v="trial" ko="재판" en="TRIAL" />
          <NavBtn v="standings" ko="스탠딩" en="STANDING" />
        </div>
      </nav>
    </div>
  );
}
