import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { Crosshair } from "@/components/Icons";

/* ────────────────────────────────────────────────────────────────
   Career engine · 3-stage visual pipeline
   Inputs → Connected career graph → Student tools
   ──────────────────────────────────────────────────────────────── */

type SourceTone = "orange" | "cobalt" | "teal" | "amber";

const SOURCE_TONE: Record<SourceTone, string> = {
  orange: "text-booster",
  cobalt: "text-cobalt",
  teal: "text-[#2F7D6D]",
  amber: "text-[#A8701B]",
};

const SOURCES: { label: string; icon: string; tone: SourceTone }[] = [
  { label: "ISRO Notices", icon: "notice", tone: "orange" },
  { label: "Your B.Tech Branch", icon: "branch", tone: "cobalt" },
  { label: "GitHub Code", icon: "code", tone: "teal" },
  { label: "Free Satellite Data", icon: "satellite", tone: "cobalt" },
  { label: "Startup Jobs", icon: "briefcase", tone: "amber" },
  { label: "Hackathons", icon: "trophy", tone: "orange" },
  { label: "College Syllabus", icon: "book", tone: "cobalt" },
  { label: "Launch Alerts", icon: "rocket", tone: "amber" },
];

function SourceGlyph({ name, className }: { name: string; className?: string }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
  switch (name) {
    case "notice":
      return (
        <svg {...shared}>
          <path d="M6 3.5h9l3.5 3.5V20.5H6Z" />
          <path d="M15 3.5V7h3.5M8.8 11h6.4M8.8 14.4h4.4M8.8 17.6h2.6" />
        </svg>
      );
    case "branch":
      return (
        <svg {...shared}>
          <rect x="3.5" y="4" width="7" height="6" rx="1.6" />
          <rect x="13.5" y="14" width="7" height="6" rx="1.6" />
          <path d="M7 10v4.5c0 2 1.5 2.5 3 2.5h3.5M17 14V9.5" />
          <circle cx="17" cy="7" r="2.4" />
        </svg>
      );
    case "code":
      return (
        <svg {...shared}>
          <path d="M8.5 8 5 12l3.5 4m7-8L19 12l-3.5 4" />
          <path d="m13.4 6-2.8 12" />
        </svg>
      );
    case "satellite":
      return (
        <svg {...shared}>
          <path d="M4 6.5C9 5 15 5 20 6.5M4 17.5c5 1.5 11 1.5 16 0M6 9.5c4-.8 8-.8 12 0M6 14.5c4 .8 8 .8 12 0" />
          <path d="M9 11v2m3-2.5v3m3-2.5v2" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...shared}>
          <rect x="3" y="7.5" width="18" height="12" rx="2.5" />
          <path d="M9 7.5V5.2h6v2.3M3.5 12.2c4.6 2 12.4 2 17 0M12 12.2v2.2" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...shared}>
          <path d="M8 4h8v6.5a4 4 0 0 1-8 0Z" />
          <path d="M8 5.5H4.8V8a3.4 3.4 0 0 0 3.4 3.4M16 5.5h3.2V8a3.4 3.4 0 0 1-3.4 3.4M12 14.5V18m-3.5 2.5h7" />
        </svg>
      );
    case "book":
      return (
        <svg {...shared}>
          <path d="M5 4.5h9a3 3 0 0 1 3 3v12H8a3 3 0 0 0-3 3Z" />
          <path d="M5 4.5v15M7.5 20.5c1.4-1 3-1.4 4.5-.8" />
          <path d="M17 7.5h2.5v12H17" />
        </svg>
      );
    default:
      return (
        <svg {...shared}>
          <path d="M13.5 4.5c3 1 5 3.7 5 7.2 0 5-4.5 7.8-6.7 8.4l-1.6-3.4-3.6-1.5c1-2.5 3.4-7.6 6.9-10.7Z" />
          <circle cx="13.6" cy="10.4" r="1.6" />
          <path d="m10.1 15.3-2.6 1-1.4 3 3.2-1.1M6.2 5.8 8 7.5M4.5 10.2l2.3.6M6.8 14.4l1.8-1.1" />
        </svg>
      );
  }
}

/* ── Stage 1 · converging data sources ─────────────────────────── */

function DataSourcesStage() {
  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-2 grid-rows-4 grid-flow-col gap-2 sm:gap-2.5">
        {SOURCES.map((source, index) => (
          <div
            key={source.label}
            className="group flex items-center gap-2.5 py-0.5"
            style={{ transitionDelay: `${index * 18}ms` }}
          >
            <span className="ai-source grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-hairline bg-chalk shadow-[0_6px_14px_-11px_rgba(20,21,24,0.32)]">
              <SourceGlyph name={source.icon} className={cn("h-[19px] w-[19px]", SOURCE_TONE[source.tone])} />
            </span>
            <span className="min-w-0 text-[11.5px] leading-[1.35] font-medium text-graphite transition-colors duration-200 group-hover:text-ink">
              {source.label}
            </span>
          </div>
        ))}
      </div>

      {/* Curved convergence from both source columns into the glass AI Processing pill */}
      <div className="relative -mt-1">
        <svg viewBox="0 0 240 96" preserveAspectRatio="none" className="block h-[92px] w-full" fill="none" aria-hidden="true">
          {[
            { x: 52, accent: false },
            { x: 96, accent: true },
            { x: 144, accent: true },
            { x: 188, accent: false },
          ].map(({ x, accent }, index) => {
            const path = `M ${x} 4 C ${x} 46, 120 44, 120 82`;
            return (
              <g key={x}>
                <path
                  d={path}
                  stroke={accent ? "#D94E1F" : "#DCD8CE"}
                  strokeOpacity={accent ? 0.55 : 1}
                  strokeWidth="1.15"
                  strokeDasharray={accent ? "3 4" : undefined}
                  className={accent ? "ai-flow-line" : undefined}
                />
                <circle cx={x} cy="5" r="2.4" fill="#FFFFFF" stroke="#DCD8CE" strokeWidth="1" />
                {index < 2 && (
                  <circle r="2.4" fill="#D94E1F">
                    <animateMotion dur={index === 0 ? "2.2s" : "2.6s"} repeatCount="indefinite" path={path} />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div className="ai-processing-pill flex items-center gap-2.5 rounded-2xl border border-hairline bg-white/[0.88] px-3.5 py-2.5 backdrop-blur-[16px]">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-booster/[0.1] text-booster">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="m12 3.5 1.7 4.6 4.6 1.7-4.6 1.8L12 16.2l-1.7-4.6L5.7 9.8l4.6-1.7Z" />
                <path d="M18.5 15.5v4m-2-2h4" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-[13px] font-semibold text-ink">AI Processing</span>
              <span className="mono mt-0.5 block text-[8px] tracking-[0.08em] text-graphite">Checks every detail</span>
            </span>
            <span className="live-dot ml-1 h-[6px] w-[6px] rounded-full bg-booster" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Stage 2 · connected career graph with measured orthogonal lines ── */

type GraphId = "branch" | "eligibility" | "track" | "skill" | "build" | "target";

const GRAPH_EDGES: { from: GraphId; to: GraphId; emphasized?: boolean }[] = [
  { from: "branch", to: "track", emphasized: true },
  { from: "eligibility", to: "track", emphasized: true },
  { from: "track", to: "skill" },
  { from: "track", to: "build" },
  { from: "skill", to: "target" },
  { from: "build", to: "target" },
];

interface GraphNodeView {
  id: GraphId;
  label: string;
  value: string;
  note?: string;
  icon: string;
  className?: string;
  span?: boolean;
}

const GRAPH_NODES: GraphNodeView[] = [
  { id: "branch", label: "Your branch", value: "CSE / Data Science", icon: "branch" },
  { id: "eligibility", label: "Eligibility", value: "≥ 6.32 CGPA", icon: "shield" },
  { id: "track", label: "Matched career track", value: "Flight & Satellite Software", note: "Best fit for your branch", icon: "orbit", span: true, className: "border-booster" },
  { id: "skill", label: "Skill to build", value: "Python + Satellite Maps", icon: "code" },
  { id: "build", label: "Starter build", value: "Flood Tracker Repo", icon: "layers" },
  { id: "target", label: "Target", value: "ISRO & Skyroot Internships", icon: "flag", span: true },
];

function GraphGlyph({ name, className }: { name: string; className?: string }) {
  const base = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.55,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
  switch (name) {
    case "branch":
      return <svg {...base}><path d="M7 4v9a3 3 0 0 0 3 3h7" /><circle cx="7" cy="3.5" r="1.8" /><circle cx="18" cy="16" r="1.8" /></svg>;
    case "shield":
      return <svg {...base}><path d="M12 3.5c3 2 6 2.6 7.5 3v5c0 5-4 7.7-7.5 9-3.5-1.3-7.5-4-7.5-9v-5c1.5-.4 4.5-1 7.5-3Z" /><path d="m8.7 11.8 2.2 2.3 4.2-4.4" /></svg>;
    case "orbit":
      return <svg {...base}><circle cx="12" cy="12" r="3" /><ellipse cx="12" cy="12" rx="8.5" ry="3.6" transform="rotate(-26 12 12)" /><circle cx="18.7" cy="7.7" r="1.3" fill="currentColor" stroke="none" /></svg>;
    case "code":
      return <svg {...base}><path d="M8.5 8.5 5 12l3.5 3.5m7-7L19 12l-3.5 3.5m-2.4-8-2.8 9" /></svg>;
    case "layers":
      return <svg {...base}><path d="m12 3.5 8 4-8 4-8-4Z" /><path d="m4 12 8 4 8-4M4 16.5l8 4 8-4" /></svg>;
    default:
      return <svg {...base}><path d="M6 21V4m0 1.5h11l-2.2 3.2L17 12H6" /></svg>;
  }
}

function CareerGraphStage() {
  const graphRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Partial<Record<GraphId, HTMLDivElement | null>>>({});
  const [paths, setPaths] = useState<Partial<Record<string, string>>>({});
  const [hovered, setHovered] = useState<GraphId | null>(null);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const bounds = graph.getBoundingClientRect();
      const centers: Partial<Record<GraphId, { x: number; y: number }>> = {};
      for (const node of GRAPH_NODES) {
        const el = nodeRefs.current[node.id];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        centers[node.id] = { x: r.left - bounds.left + r.width / 2, y: r.top - bounds.top + r.height / 2 };
      }
      const next: Partial<Record<string, string>> = {};
      for (const edge of GRAPH_EDGES) {
        const a = centers[edge.from];
        const b = centers[edge.to];
        if (!a || !b) continue;
        const midY = (a.y + b.y) / 2;
        next[`${edge.from}-${edge.to}`] = `M ${a.x} ${a.y} V ${midY} H ${b.x} V ${b.y}`;
      }
      setPaths(next);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(graph);
    Object.values(nodeRefs.current).forEach((el) => { if (el) observer?.observe(el); });
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule).catch(() => undefined);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative">
      {/* Soft ambient radial glow behind the connected graph */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[clamp(200px,42vw,340px)] w-[clamp(200px,42vw,340px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-booster/[0.13] blur-[90px]" />
        <div className="absolute left-[32%] top-[16%] h-[clamp(140px,30vw,220px)] w-[clamp(140px,30vw,220px)] rounded-full bg-cobalt/[0.11] blur-[80px]" />
      </div>

      <div ref={graphRef} className="relative z-10 mx-auto grid w-full max-w-[452px] grid-cols-2 gap-x-6 gap-y-8 px-0.5 py-2">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          fill="none"
          aria-hidden="true"
        >
          {GRAPH_EDGES.map((edge) => {
            const key = `${edge.from}-${edge.to}`;
            const path = paths[key];
            if (!path) return null;
            const hot = hovered ? edge.from === hovered || edge.to === hovered : edge.emphasized;
            const dim = hovered !== null && !hot;
            return (
              <g key={key}>
                <path
                  d={path}
                  stroke="#FFFFFF"
                  strokeWidth="6"
                  strokeOpacity="1"
                  strokeLinejoin="round"
                />
                <path
                  d={path}
                  stroke={hot || edge.emphasized ? "#D94E1F" : "#C6BFB1"}
                  strokeWidth={hot ? 1.8 : 1.2}
                  strokeOpacity={dim ? 0.4 : hot ? 1 : edge.emphasized ? 0.6 : 0.9}
                  strokeLinejoin="round"
                  strokeDasharray={!hot && edge.emphasized ? "5 4" : undefined}
                  className={cn("ai-graph-edge", hot && "ai-graph-edge-hot")}
                />

              </g>
            );
          })}
        </svg>

        {GRAPH_NODES.map((node) => {
          const connected = hovered
            ? GRAPH_EDGES.some(
                (edge) =>
                  (edge.from === hovered && edge.to === node.id) ||
                  (edge.to === hovered && edge.from === node.id),
              )
            : true;
          return (
            <div
              key={node.id}
              ref={(el) => { nodeRefs.current[node.id] = el; }}
              tabIndex={0}
              role="group"
              aria-label={`${node.label}: ${node.value}`}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered(null)}
              className={cn(
                "ai-graph-node group relative z-10 cursor-default rounded-2xl border border-hairline bg-chalk px-3 py-2.5 shadow-[0_8px_20px_-16px_rgba(20,21,24,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_-16px_rgba(20,21,24,0.42)] focus-visible:outline-2",
                node.span && "col-span-2 mx-auto w-full",
                node.id === "track" && "ai-graph-matched border-booster bg-[#FFFBF8]",
                node.className,
                hovered && hovered !== node.id && !connected && "opacity-55",
              )}
            >
              <div className="flex items-start gap-2">
                <span className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                  node.id === "track" ? "bg-booster/[0.1] text-booster" : "bg-stone text-cobalt",
                )}>
                  <GraphGlyph name={node.icon} className="h-[15px] w-[15px]" />
                </span>
                <span className="min-w-0">
                  <span className="mono block text-[8px] leading-[1.5] text-graphite">{node.label}</span>
                  <span className={cn(
                    "mt-0.5 block text-[12.5px] leading-[1.3] font-semibold text-ink",
                    node.id === "track" && "font-display text-[16px] leading-[1.15] tracking-[-0.012em]",
                  )}>
                    {node.value}
                  </span>
                  {node.note && <span className="mono mt-1 block text-[8px] text-booster">{node.note}</span>}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Stage 3 · task-specific student tools ─────────────────────── */

const TOOLS: { label: string; icon: string; accent: "orange" | "cobalt" }[] = [
  { label: "90-Day Branch Roadmap", icon: "map", accent: "orange" },
  { label: "ISRO & Startup Eligibility Check", icon: "check", accent: "cobalt" },
  { label: "Starter Project Builder", icon: "tools", accent: "orange" },
  { label: "Resume & GitHub Gap Review", icon: "resume", accent: "cobalt" },
  { label: "Hackathon Squad Matcher", icon: "team", accent: "orange" },
  { label: "Ask Career Guide", icon: "spark", accent: "cobalt" },
];

function ToolGlyph({ name, className }: { name: string; className?: string }) {
  const base = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
  switch (name) {
    case "map":
      return <svg {...base}><path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2Z" /><path d="M9 4v14m6-12v14" /></svg>;
    case "check":
      return <svg {...base}><path d="M4 5.5h9l3 3V20H4Z" /><path d="M7 12.5 9.5 15l4.5-5" /><path d="M16 7h4v12h-4" /></svg>;
    case "tools":
      return <svg {...base}><path d="m13 6 5 5-8 8-5-5Z" /><path d="M14.5 4.5a4 4 0 0 0 5 5M4.5 19.5l3-3" /></svg>;
    case "resume":
      return <svg {...base}><rect x="6" y="3.5" width="12" height="17" rx="2" /><circle cx="12" cy="9" r="2" /><path d="M9 14h6M9 17h4" /></svg>;
    case "team":
      return <svg {...base}><circle cx="9" cy="8" r="2.6" /><path d="M4.5 19c.4-3.2 2.2-4.8 4.5-4.8s4.1 1.6 4.5 4.8" /><path d="M15.5 6.2a2.4 2.4 0 0 1 0 4.6M16 14c2.1.4 3.3 1.9 3.6 4.5" /></svg>;
    default:
      return <svg {...base}><path d="m12 3.5 1.7 4.6 4.6 1.7-4.6 1.8L12 16.2l-1.7-4.6L5.7 9.8l4.6-1.7Z" /><path d="M18.5 15.5v4m-2-2h4" /></svg>;
  }
}

function StudentToolsStage() {
  const openDemo = () => window.dispatchEvent(new Event("cosmox:demo"));
  return (
    <div className="flex h-full flex-col gap-2">
      {TOOLS.map((tool) => (
        <button
          key={tool.label}
          type="button"
          onClick={openDemo}
          title={`Open the demo workspace to try ${tool.label}`}
          className="ai-tool group flex min-h-[54px] w-full items-center gap-3 rounded-2xl border border-hairline bg-chalk px-4 py-3 text-left shadow-[0_6px_18px_-15px_rgba(20,21,24,0.38)] transition-all duration-300 hover:translate-x-1 hover:border-booster/35 hover:bg-gradient-to-r hover:from-chalk hover:to-booster/[0.045] hover:shadow-[0_14px_28px_-20px_rgba(20,21,24,0.42)] focus-visible:outline-2"
        >
          <span className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
            tool.accent === "orange" ? "bg-booster/[0.085] text-booster" : "bg-cobalt/[0.08] text-cobalt",
          )}>
            <ToolGlyph name={tool.icon} className="h-[17px] w-[17px]" />
          </span>
          <span className="min-w-0 flex-1 text-[12.5px] leading-[1.35] font-semibold text-ink">{tool.label}</span>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-graphite transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-booster" fill="none" aria-hidden="true">
            <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ))}
    </div>
  );
}

/* ── Flow arrows between stages ────────────────────────────────── */

function FlowArrow({ rotate }: { rotate: "right" | "down" }) {
  return (
    <div className="flex items-center justify-center py-1 xl:py-0" aria-hidden="true">
      <svg
        viewBox="0 0 52 28"
        fill="none"
        className={cn("h-7 w-12 text-booster", rotate === "down" && "rotate-90")}
      >
        <path d="M2 14h42" stroke="#DCD8CE" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M2 14h42" stroke="#D94E1F" strokeWidth="1.5" strokeLinecap="round" className="ai-flow-line" />
        <path d="m38 8 6 6-6 6" stroke="#D94E1F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle r="2.2" fill="#D94E1F">
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M 2 14 H 44" />
        </circle>
      </svg>
    </div>
  );
}

/* ── Bottom editorial captions ─────────────────────────────────── */

function StageCaption({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7 border-t border-hairline/70 px-0.5 pt-4 xl:mt-auto xl:pt-5">
      <div className="flex items-baseline gap-2">
        <span className="mono text-[9px] text-booster">{index}</span>
        <h3 className="text-[18px] leading-tight font-semibold text-ink">{title}</h3>
      </div>
      <p className="mt-2 max-w-[46ch] text-[14px] leading-[1.6] text-graphite">{children}</p>
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────────── */

export function CosmoxAiPlanner() {
  return (
    <section
      id="ai"
      aria-labelledby="ai-heading"
      className="relative border-b border-hairline bg-canvas py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="reveal flex flex-col gap-5 border-b border-hairline pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mono flex items-center gap-2.5 text-[10px] text-graphite">
              <Crosshair className="h-2.5 w-2.5 text-booster" />
              05 // The Career Engine
            </p>
            <h2
              id="ai-heading"
              className="mt-4 font-display text-[clamp(2.5rem,4.4vw,3.5rem)] leading-[1.04] tracking-[-0.025em] text-ink"
            >
              Not a generic <em className="italic text-booster">chatbot</em>. A clear career engine.
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.6] text-graphite">
              See how Cosmox turns official space programs, your B.Tech branch, and real job skills into step-by-step action.
            </p>
          </div>
          <p className="mono hidden shrink-0 pb-1 text-[9px] leading-[1.7] text-graphite md:block md:text-right">
            Official sources
            <br />
            Your branch + skills
            <br />
            <span className="text-cobalt">One clear next step</span>
          </p>
        </header>

        {/* 3-stage pipeline canvas */}
        <div className="ai-pipeline relative mt-14">
          <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_46px_minmax(0,1.16fr)_46px_minmax(0,1fr)] xl:gap-x-1 xl:gap-y-0">
            {/* Stage 1 */}
            <div className="flex h-full min-w-0 flex-col">
              <p className="mono mb-3 flex items-center gap-2 text-[9px] text-graphite">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-hairline bg-chalk text-[8px] text-ink">01</span>
                Verified sources
              </p>
              <DataSourcesStage />
              <StageCaption index="01" title="Verified space & student data">
                Continuously organizes official ISRO updates, startup hiring needs, and branch syllabi into one clean stream.
              </StageCaption>
            </div>

            <FlowArrow rotate="right" />

            {/* Stage 2 */}
            <div className="flex h-full min-w-0 flex-col">
              <p className="mono mb-3 flex items-center gap-2 text-[9px] text-graphite">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-booster/40 bg-booster/[0.08] text-[8px] text-booster">02</span>
                Connected career graph
              </p>
              <CareerGraphStage />
              <StageCaption index="02" title="Live Career & Skill Graph">
                Maps the exact connection between your B.Tech subjects, beginner projects, and real space-tech job roles.
              </StageCaption>
            </div>

            <FlowArrow rotate="right" />

            {/* Stage 3 */}
            <div className="flex h-full min-w-0 flex-col">
              <p className="mono mb-3 flex items-center gap-2 text-[9px] text-graphite">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-hairline bg-chalk text-[8px] text-ink">03</span>
                Your tools
              </p>
              <StudentToolsStage />
              <StageCaption index="03" title="Focused tools, zero guesswork">
                Every recommendation links back to real eligibility rules and actionable steps—so you always stay in control.
              </StageCaption>
            </div>
          </div>
        </div>

        <p className="mono mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5 text-[9px] text-graphite">
          <span>Rules are checked against official notices. Always confirm before applying.</span>
          <span className="text-cobalt">Cosmox career engine · always updating</span>
        </p>
      </div>
    </section>
  );
}
