import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import type { CareerRole } from "@/data/careerRoadmaps";
import {
  getRoleCurriculumNodes,
  type CurriculumNode,
} from "@/data/curriculumNodes";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CheckIcon,
  PlusIcon,
  RoleIconBadge,
} from "./RoadmapIcons";

interface RoleRoadmapViewProps {
  role: CareerRole;
  saved: boolean;
  projectAdded: boolean;
  onBack: () => void;
  onToggleSaved: (role: CareerRole) => void;
  onAddProject: (role: CareerRole) => void;
  onViewProfile: () => void;
}

const STORAGE_PREFIX = "cosmox:curriculum-checks:";

export function RoleRoadmapView({
  role,
  saved,
  projectAdded,
  onBack,
  onToggleSaved,
  onAddProject,
  onViewProfile,
}: RoleRoadmapViewProps) {
  const nodes = useMemo(() => getRoleCurriculumNodes(role), [role]);

  // Load / store completed nodes per role in localStorage
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${role.id}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    // Default seed first 2 nodes as completed for realistic discovery
    return [nodes[0]?.id ?? "", nodes[1]?.id ?? ""].filter(Boolean);
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string>(() => nodes[0]?.id ?? "");

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId],
  );

  // Step checklist state for the Starter Proof-of-Work Project (Image 1)
  const [checkedProjectStepIndices, setCheckedProjectStepIndices] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(`cosmox:project-steps:${role.id}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(`cosmox:project-steps:${role.id}`, JSON.stringify(checkedProjectStepIndices));
    } catch {
      // Ignore
    }
  }, [role.id, checkedProjectStepIndices]);

  const toggleProjectStep = (idx: number) => {
    setCheckedProjectStepIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const projectStepsTotal = role.project.steps.length;
  const projectStepsDone = checkedProjectStepIndices.filter((i) => i < projectStepsTotal).length;
  const projectStepsPercent =
    projectStepsTotal > 0 ? Math.round((projectStepsDone / projectStepsTotal) * 100) : 0;

  // Sync completed nodes to storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${role.id}`, JSON.stringify(completedNodeIds));
    } catch {
      // Ignore
    }
  }, [role.id, completedNodeIds]);

  const toggleNodeComplete = (id: string) => {
    setCompletedNodeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isCompleted = (id: string) => completedNodeIds.includes(id);

  const completedCount = completedNodeIds.filter((id) =>
    nodes.some((n) => n.id === id),
  ).length;
  const percent = Math.round((completedCount / nodes.length) * 100);

  // Group nodes by phase
  const phase1Nodes = nodes.filter((n) => n.phase === 1);
  const phase2Nodes = nodes.filter((n) => n.phase === 2);
  const phase3Nodes = nodes.filter((n) => n.phase === 3);
  const phase4Nodes = nodes.filter((n) => n.phase === 4);

  const isPhase1Done = phase1Nodes.every((n) => isCompleted(n.id));
  const isPhase2Done = phase2Nodes.every((n) => isCompleted(n.id));
  const isPhase3Done = phase3Nodes.every((n) => isCompleted(n.id));

  return (
    <div className="swap-in space-y-6 pb-12">
      {/* ═════════════════════════════════════════════════════════
          1. TOP NAVIGATION STRIP
         ═════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Roadmap navigation"
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        {/* Left: Back button */}
        <button
          type="button"
          onClick={onBack}
          className="liquid-secondary group inline-flex h-11 items-center gap-2 px-4 text-[13.5px] font-semibold text-ink"
        >
          <ArrowLeftIcon className="h-4 w-4 text-booster transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to All 20 Roles
        </button>

        {/* Center: Interactive Progress Counter in JetBrains Mono */}
        <div className="liquid-chip flex items-center gap-2.5 px-4 py-2">
          <span className="mono tnum text-[11px] font-semibold text-ink">
            {completedCount} OF {nodes.length} NODES COMPLETED
          </span>
          <span className="mono tnum text-[11px] font-bold text-booster">
            • {percent}%
          </span>
        </div>

        {/* Right: Pin to My Home Checklist CTA */}
        <button
          type="button"
          onClick={() => onToggleSaved(role)}
          aria-pressed={saved}
          className={cn(
            "group inline-flex h-11 items-center gap-2 px-5 text-[13.5px] font-semibold transition-all duration-300",
            saved ? "liquid-cobalt text-white" : "liquid-primary text-white",
          )}
        >
          {saved ? <CheckIcon className="h-4 w-4" /> : <BookmarkIcon className="h-4 w-4" />}
          <span>{saved ? "Pinned to My Home Checklist ✓" : "Pin to My Home Checklist ✓"}</span>
        </button>
      </nav>

      {/* ═════════════════════════════════════════════════════════
          2. ROLE HEADER BANNER (#141518 Carbon Slate)
         ═════════════════════════════════════════════════════════ */}
      <header className="squircle overflow-hidden border border-hairline bg-ink text-white shadow-[0_24px_56px_-32px_rgba(20,21,24,0.5)]">
        <div className="grid lg:grid-cols-12">
          {/* Left Column: Details */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 lg:p-10">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="mono rounded-full bg-cobalt px-3.5 py-1 text-[9.5px] font-medium tracking-wide text-white">
                  {role.branchFit}
                </span>
                <span className="liquid-chip-dark mono px-3 py-1 text-[9px]">
                  {role.difficulty}
                </span>
                <span className="liquid-chip-dark mono hidden px-3 py-1 text-[9px] text-white/70 sm:inline-block">
                  CURRICULUM TREE // 4 PHASES
                </span>
              </div>

              {/* Title in Instrument Serif */}
              <h1 className="mt-5 font-display text-[38px] leading-[1.04] tracking-[-0.025em] text-white sm:text-[46px]">
                {role.title}
              </h1>

              {/* What you do day-to-day */}
              <div className="mt-5">
                <p className="mono text-[9px] tracking-wider text-white/50">
                  WHAT YOU DO DAY-TO-DAY
                </p>
                <p className="mt-1.5 max-w-[54ch] text-[15px] leading-[1.65] text-[#D1D5DB]">
                  {role.dayToDay}
                </p>
              </div>
            </div>

            {/* Typical Indian Hiring Targets */}
            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="mono text-[9px] tracking-wider text-white/50">
                TYPICAL INDIAN HIRING TARGETS &amp; CENTERS
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {role.employers.map((employer) => (
                  <span
                    key={employer}
                    className="liquid-chip-dark px-3 py-1 text-[11.5px] font-medium text-white"
                  >
                    {employer}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Engineering Cover Photo Frame */}
          <div className="relative min-h-[260px] p-4 sm:p-5 lg:col-span-5">
            <div className="squircle-media relative h-full min-h-[260px] overflow-hidden border border-white/10 bg-canvas">
              <img
                src={role.image}
                alt={role.imageAlt}
                className="absolute inset-0 h-full w-full object-cover saturate-[0.85] filter"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
                aria-hidden="true"
              />
              {/* Technical schematic pill */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <span className="liquid-chip-dark inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-white">
                  <RoleIconBadge
                    kind={role.icon}
                    accent={role.accent}
                    className="h-6 w-6 rounded-full [&_svg]:h-3.5 [&_svg]:w-3.5"
                  />
                  Visual Curriculum Tree
                </span>
                <span className="mono rounded-full bg-white/10 px-2.5 py-1 text-[8.5px] text-white backdrop-blur-xs">
                  {role.tools.join(" • ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════
          3. INTERACTIVE VISUAL NODE-TREE CURRICULUM (12-COL SPLIT)
         ═════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* ── LEFT COLUMN (lg:col-span-7): Connected Visual Tree ── */}
        <section
          aria-label="Curriculum node tree"
          className="lg:col-span-7"
        >
          <div className="flex items-center justify-between gap-3 px-1">
            <div>
              <p className="mono text-[10px] text-booster">
                STRUCTURED SKILL CURRICULUM
              </p>
              <h2 className="mt-1 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[30px]">
                Interactive Node Tree
              </h2>
            </div>
            <span className="mono text-[9px] text-graphite">
              Click any node to view guide
            </span>
          </div>

          <div className="relative mt-6 space-y-2">
            {/* ── PHASE 1: Core Foundations ───────────────────── */}
            <div className="relative">
              <div className="mb-2.5 flex items-center justify-between px-1">
                <span className="mono text-[9.5px] font-semibold text-graphite">
                  PHASE 1: CORE FOUNDATIONS
                </span>
                <span className="mono text-[8.5px] text-graphite/70">
                  {phase1Nodes.filter((n) => isCompleted(n.id)).length} / {phase1Nodes.length} DONE
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {phase1Nodes.map((node) => {
                  const selected = node.id === selectedNode.id;
                  const done = isCompleted(node.id);
                  return (
                    <NodeCard
                      key={node.id}
                      node={node}
                      isSelected={selected}
                      isCompleted={done}
                      onSelect={() => setSelectedNodeId(node.id)}
                      onToggle={() => toggleNodeComplete(node.id)}
                    />
                  );
                })}
              </div>
            </div>

            {/* ── SVG Connector 1 (Phase 1 → Phase 2) ─────────── */}
            <div className="relative flex h-10 items-center justify-center" aria-hidden="true">
              <svg
                viewBox="0 0 400 40"
                className="h-10 w-full max-w-md overflow-visible"
                preserveAspectRatio="none"
              >
                <path
                  d="M100 0 L100 18 Q100 24 150 24 L200 24 L250 24 Q300 24 300 18 L300 0"
                  fill="none"
                  stroke={isPhase1Done ? "#D94E1F" : "#DCD8CE"}
                  strokeWidth="2"
                  strokeDasharray={isPhase1Done ? undefined : "4 4"}
                />
                <path
                  d="M200 24 L200 40"
                  fill="none"
                  stroke={isPhase1Done ? "#D94E1F" : "#DCD8CE"}
                  strokeWidth="2.5"
                />
                <circle
                  cx="200"
                  cy="24"
                  r="3.5"
                  fill={isPhase1Done ? "#D94E1F" : "#DCD8CE"}
                />
              </svg>
            </div>

            {/* ── PHASE 2: Space & Domain Tools ───────────────── */}
            <div className="relative">
              <div className="mb-2.5 flex items-center justify-between px-1">
                <span className="mono text-[9.5px] font-semibold text-graphite">
                  PHASE 2: SPACE &amp; DOMAIN TOOLS
                </span>
                <span className="mono text-[8.5px] text-graphite/70">
                  {phase2Nodes.filter((n) => isCompleted(n.id)).length} / {phase2Nodes.length} DONE
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {phase2Nodes.map((node) => {
                  const selected = node.id === selectedNode.id;
                  const done = isCompleted(node.id);
                  return (
                    <NodeCard
                      key={node.id}
                      node={node}
                      isSelected={selected}
                      isCompleted={done}
                      onSelect={() => setSelectedNodeId(node.id)}
                      onToggle={() => toggleNodeComplete(node.id)}
                    />
                  );
                })}
              </div>
            </div>

            {/* ── SVG Connector 2 (Phase 2 → Phase 3 Milestone) ── */}
            <div className="relative flex h-10 items-center justify-center" aria-hidden="true">
              <svg
                viewBox="0 0 400 40"
                className="h-10 w-full max-w-md overflow-visible"
                preserveAspectRatio="none"
              >
                <path
                  d="M100 0 L100 14 Q100 22 170 22 L200 22 L230 22 Q300 22 300 14 L300 0"
                  fill="none"
                  stroke={isPhase2Done ? "#D94E1F" : "#DCD8CE"}
                  strokeWidth="2"
                  strokeDasharray={isPhase2Done ? undefined : "4 4"}
                />
                <path
                  d="M200 22 L200 40"
                  fill="none"
                  stroke={isPhase2Done ? "#1E4D8C" : "#DCD8CE"}
                  strokeWidth="2.5"
                />
                <circle
                  cx="200"
                  cy="22"
                  r="4"
                  fill={isPhase2Done ? "#1E4D8C" : "#DCD8CE"}
                />
              </svg>
            </div>

            {/* ── PHASE 3: Hands-On Starter Build (Central Milestone) */}
            <div className="relative">
              <div className="mb-2.5 flex items-center justify-between px-1">
                <span className="mono text-[9.5px] font-semibold text-cobalt">
                  PHASE 3: HANDS-ON STARTER BUILD
                </span>
                <span className="mono rounded-full bg-cobalt px-2.5 py-0.5 text-[8px] font-bold text-white">
                  CENTRAL MILESTONE
                </span>
              </div>

              {phase3Nodes.map((node) => {
                const selected = node.id === selectedNode.id;
                const done = isCompleted(node.id);
                return (
                  <div key={node.id} className="mx-auto max-w-xl">
                    <NodeCard
                      node={node}
                      isSelected={selected}
                      isCompleted={done}
                      onSelect={() => setSelectedNodeId(node.id)}
                      onToggle={() => toggleNodeComplete(node.id)}
                      isCentralMilestone
                    />
                  </div>
                );
              })}
            </div>

            {/* ── SVG Connector 3 (Phase 3 → Phase 4) ─────────── */}
            <div className="relative flex h-10 items-center justify-center" aria-hidden="true">
              <svg
                viewBox="0 0 400 40"
                className="h-10 w-full max-w-md overflow-visible"
                preserveAspectRatio="none"
              >
                <path
                  d="M200 0 L200 16"
                  fill="none"
                  stroke={isPhase3Done ? "#D94E1F" : "#DCD8CE"}
                  strokeWidth="2.5"
                />
                <path
                  d="M200 16 L100 16 L100 40"
                  fill="none"
                  stroke={isPhase3Done ? "#D94E1F" : "#DCD8CE"}
                  strokeWidth="2"
                  strokeDasharray={isPhase3Done ? undefined : "4 4"}
                />
                <path
                  d="M200 16 L300 16 L300 40"
                  fill="none"
                  stroke={isPhase3Done ? "#D94E1F" : "#DCD8CE"}
                  strokeWidth="2"
                  strokeDasharray={isPhase3Done ? undefined : "4 4"}
                />
                <circle
                  cx="200"
                  cy="16"
                  r="3.5"
                  fill={isPhase3Done ? "#D94E1F" : "#DCD8CE"}
                />
              </svg>
            </div>

            {/* ── PHASE 4: Internship & Interview Prep ─────────── */}
            <div className="relative">
              <div className="mb-2.5 flex items-center justify-between px-1">
                <span className="mono text-[9.5px] font-semibold text-graphite">
                  PHASE 4: INTERNSHIP &amp; INTERVIEW PREP
                </span>
                <span className="mono text-[8.5px] text-graphite/70">
                  {phase4Nodes.filter((n) => isCompleted(n.id)).length} / {phase4Nodes.length} DONE
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {phase4Nodes.map((node) => {
                  const selected = node.id === selectedNode.id;
                  const done = isCompleted(node.id);
                  return (
                    <NodeCard
                      key={node.id}
                      node={node}
                      isSelected={selected}
                      isCompleted={done}
                      onSelect={() => setSelectedNodeId(node.id)}
                      onToggle={() => toggleNodeComplete(node.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── RIGHT COLUMN (lg:col-span-5 lg:sticky lg:top-6): Node Inspector ── */}
        <aside
          aria-labelledby="node-inspector-heading"
          className="squircle lg:sticky lg:top-6 lg:col-span-5 border border-hairline bg-chalk p-6 shadow-[0_20px_48px_-28px_rgba(20,21,24,0.18)] sm:p-7"
        >
          {/* Header pill & duration */}
          <div className="flex items-center justify-between gap-2 border-b border-hairline pb-4">
            <span className="mono text-[9.5px] font-bold tracking-wider text-booster">
              {selectedNode.phaseBadge}
            </span>
            <span className="liquid-chip mono px-2.5 py-1 text-[9px] text-graphite">
              EST. {selectedNode.duration}
            </span>
          </div>

          {/* Node Title */}
          <h3
            id="node-inspector-heading"
            className="mt-4 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[30px]"
          >
            {selectedNode.title}
          </h3>

          {/* Why This Matters */}
          <div className="mt-5">
            <p className="mono text-[9px] tracking-wider text-graphite">
              WHY THIS MATTERS
            </p>
            <p className="mt-1.5 text-[14px] leading-[1.65] text-ink">
              {selectedNode.whyMatters}
            </p>
          </div>

          {/* What to Learn (3 Concrete Topics) */}
          <div className="mt-6">
            <p className="mono text-[9px] tracking-wider text-graphite">
              WHAT TO LEARN (3 CONCRETE TOPICS)
            </p>
            <ul className="mt-2.5 space-y-2.5">
              {selectedNode.topics.map((topic, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[13px] leading-snug text-ink"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-stone text-[9px] font-bold text-cobalt">
                    {i + 1}
                  </span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Free Tools & Practice Resources */}
          <div className="mt-6 rounded-2xl border border-hairline bg-stone p-4">
            <p className="mono text-[9px] tracking-wider text-graphite">
              FREE TOOLS &amp; PRACTICE RESOURCES
            </p>
            <div className="mt-3 space-y-2">
              {selectedNode.toolsAndLinks.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-2 rounded-xl bg-chalk p-3 shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-ink">{item.name}</p>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-graphite">
                      {item.note}
                    </p>
                  </div>
                  <span className="mono shrink-0 rounded-full bg-stone px-2 py-0.5 text-[8.5px] font-medium text-cobalt">
                    FREE
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Task if available */}
          {selectedNode.practiceTask && (
            <div className="mt-5 border-t border-hairline pt-4">
              <p className="mono text-[9px] tracking-wider text-graphite">
                STARTER PRACTICE TASK
              </p>
              <p className="mt-1 text-[13px] leading-[1.6] text-ink">
                {selectedNode.practiceTask}
              </p>
            </div>
          )}

          {/* Interactive Mark Node Complete Toggle */}
          <div className="mt-6 pt-2">
            <button
              type="button"
              onClick={() => toggleNodeComplete(selectedNode.id)}
              className={cn(
                "group flex h-11 w-full items-center justify-center gap-2 rounded-full text-[13.5px] font-semibold transition-all duration-300",
                isCompleted(selectedNode.id)
                  ? "liquid-cobalt text-white"
                  : "liquid-primary text-white",
              )}
            >
              <CheckIcon className="h-4 w-4" />
              <span>
                {isCompleted(selectedNode.id)
                  ? "Node Completed ✓ (Click to Undo)"
                  : "Mark Node Complete ✓"}
              </span>
            </button>
          </div>

          {/* Central Milestone Action: Add to Profile */}
          {selectedNode.isMilestone && (
            <div className="mt-4 border-t border-hairline pt-4">
              <button
                type="button"
                onClick={() => (projectAdded ? onViewProfile() : onAddProject(role))}
                className={cn(
                  "flex h-10 w-full items-center justify-center gap-2 rounded-full text-[12.5px] font-semibold transition-all duration-200",
                  projectAdded
                    ? "liquid-secondary text-cobalt"
                    : "liquid-secondary text-ink hover:text-booster",
                )}
              >
                {projectAdded ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                <span>
                  {projectAdded ? "Added to Profile — View in Profile" : "Add Starter Build to Profile +"}
                </span>
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* ═════════════════════════════════════════════════════════
          4. CORE SKILLS & STARTER PROOF-OF-WORK PROJECT (DE-BOXED)
         ═════════════════════════════════════════════════════════ */}
      <section aria-label="Core skills and starter build" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Card: Skills & Tech Stack Breakdown */}
        <div className="squircle flex flex-col justify-between border border-hairline bg-chalk p-6 shadow-xs sm:p-8">
          <div>
            <p className="mono text-[10px] font-bold uppercase tracking-wider text-booster">
              SKILLS &amp; TECH STACK BREAKDOWN
            </p>
            <h3 className="mt-1 font-display text-[32px] leading-tight text-ink sm:text-[38px]">
              Must-Have Core Skills
            </h3>

            {/* Open 2-Column Typographic Matrix (Zero Nested Inner Boxes) */}
            <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {role.skills.map((skill, idx) => (
                <div key={skill.name} className="flex flex-col">
                  <span className="mono text-[11px] font-bold tracking-wider text-booster">
                    {String(idx + 1).padStart(2, "0")} //
                  </span>
                  <h4 className="mt-1.5 text-[15.5px] font-bold leading-snug text-ink">
                    {skill.name}
                  </h4>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-graphite">
                    {skill.why}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Tools in this Role */}
          <div className="mt-8 border-t border-hairline pt-6">
            <p className="mono text-[9.5px] uppercase tracking-wider text-graphite">
              KEY TOOLS IN THIS ROLE
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2" aria-label={`Key tools for ${role.title}`}>
              {role.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-stone px-4 py-1.5 text-[12.5px] font-medium text-ink transition-colors hover:bg-stone/80"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Starter Proof-of-Work Project */}
        <div className="squircle flex flex-col justify-between border border-hairline bg-chalk p-6 shadow-xs sm:p-8">
          <div>
            {/* Eyebrow & 2-Week Build Badge */}
            <div className="flex items-center justify-between gap-3">
              <p className="mono text-[10px] font-bold uppercase tracking-wider text-booster">
                STARTER PROOF-OF-WORK PROJECT
              </p>
              <span className="mono rounded-full bg-booster px-3 py-1 text-[9.5px] font-bold uppercase tracking-wider text-white">
                2-WEEK BUILD
              </span>
            </div>

            {/* Title in Instrument Serif */}
            <h3 className="mt-2 font-display text-[32px] leading-tight text-ink sm:text-[38px]">
              {role.project.title}
            </h3>

            {/* Description */}
            <p className="mt-2.5 text-[14px] leading-relaxed text-graphite">
              {role.project.description}
            </p>

            {/* Interactive Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-[11px]">
                <span className="mono font-semibold text-graphite">
                  {projectStepsDone} of {projectStepsTotal} steps planned
                </span>
                <span className="mono font-bold text-booster">
                  {projectStepsPercent}%
                </span>
              </div>
              <div
                className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={projectStepsPercent}
                aria-label="Starter project steps planned"
              >
                <div
                  className="h-full rounded-full bg-booster transition-all duration-300"
                  style={{ width: `${projectStepsPercent}%` }}
                />
              </div>
            </div>

            {/* Hairline-Divided Interactive Checklist (Zero Nested Pill Boxes) */}
            <div className="mt-5 divide-y divide-hairline">
              {role.project.steps.map((step, idx) => {
                const isChecked = checkedProjectStepIndices.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleProjectStep(idx)}
                    className="group/step flex w-full items-center gap-3.5 py-3 text-left transition-colors duration-200 hover:opacity-85"
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                        isChecked
                          ? "border-booster bg-booster text-white shadow-xs"
                          : "border-graphite/40 bg-white group-hover/step:border-ink",
                      )}
                    >
                      {isChecked && <CheckIcon className="h-3 w-3" />}
                    </span>
                    <span
                      className={cn(
                        "text-[13.5px] leading-snug transition-colors",
                        isChecked
                          ? "text-graphite line-through decoration-hairline"
                          : "font-medium text-ink",
                      )}
                    >
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action CTA: Add Project to Profile */}
          <div className="mt-6 pt-2">
            <button
              type="button"
              onClick={() => (projectAdded ? onViewProfile() : onAddProject(role))}
              className={cn(
                "group flex h-12 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold shadow-md transition-all duration-300",
                projectAdded
                  ? "liquid-cobalt text-white"
                  : "liquid-primary text-white hover:bg-booster/90",
              )}
            >
              {projectAdded ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
              <span>
                {projectAdded ? "Added to Profile — View in Profile ✓" : "+ Add Project to Profile +"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          5. HOW TO LAND THE ROLE: ELIGIBILITY & INTERVIEW (DE-BOXED)
         ═════════════════════════════════════════════════════════ */}
      <section aria-label="Eligibility and interview tips" className="mt-4 space-y-4">
        {/* Editorial Section Header */}
        <div className="px-1">
          <p className="mono text-[10px] font-bold uppercase tracking-wider text-booster">
            HOW TO LAND THE ROLE
          </p>
          <h3 className="mt-1 font-display text-[32px] leading-tight text-ink sm:text-[40px]">
            Eligibility &amp; Interview Tips
          </h3>
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-graphite">
            {role.eligibility.intro}
          </p>
        </div>

        {/* 2 Equal-Level Elevated Cards (No Outer Box-in-a-Box Enclosure) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Before you apply */}
          <div className="squircle flex flex-col justify-between border border-hairline bg-chalk p-6 shadow-xs sm:p-8 lg:col-span-6">
            <div>
              <h4 className="text-[18px] font-bold leading-snug text-ink">
                Before you apply
              </h4>
              <ul className="mt-5 space-y-4">
                {role.eligibility.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cobalt/10 text-cobalt">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <span className="text-[13.5px] leading-relaxed text-graphite">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-hairline pt-4">
              <p className="text-[11.5px] leading-relaxed text-graphite/80">
                Rules and hiring needs can change. Always check the official ISRO notice or the company page before applying.
              </p>
            </div>
          </div>

          {/* Right Column: 3 common interview questions */}
          <div className="squircle flex flex-col justify-between border border-hairline bg-chalk p-6 shadow-xs sm:p-8 lg:col-span-6">
            <div>
              <h4 className="text-[18px] font-bold leading-snug text-ink">
                3 common interview questions
              </h4>
              <div className="mt-5 divide-y divide-hairline">
                {role.eligibility.questions.map((question, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 py-4 first:pt-1 last:pb-1"
                  >
                    <span className="mono tnum mt-0.5 shrink-0 text-[13px] font-bold text-booster">
                      {String(i + 1).padStart(2, "0")} //
                    </span>
                    <p className="text-[14px] font-medium leading-relaxed text-ink">
                      &ldquo;{question}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-hairline pt-4">
              <p className="text-[11.5px] leading-relaxed text-graphite/80">
                Tip: Prepare 1 concrete example from your hands-on build for each question.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Individual Curriculum Node Pill Component ──────────────── */

interface NodeCardProps {
  node: CurriculumNode;
  isSelected: boolean;
  isCompleted: boolean;
  onSelect: () => void;
  onToggle: () => void;
  isCentralMilestone?: boolean;
}

function NodeCard({
  node,
  isSelected,
  isCompleted,
  onSelect,
  onToggle,
  isCentralMilestone,
}: NodeCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-pressed={isSelected}
      className={cn(
        "group/node relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 shadow-xs transition-all duration-300",
        isSelected
          ? "border-booster bg-white ring-2 ring-booster shadow-[0_12px_28px_-12px_rgba(217,78,31,0.28)]"
          : isCentralMilestone
            ? "border-2 border-cobalt/40 bg-white hover:border-cobalt hover:shadow-md"
            : isCompleted
              ? "border-booster/35 bg-white hover:border-booster/60"
              : "border-hairline bg-white hover:border-graphite/40 hover:shadow-xs",
      )}
    >
      {/* Checkbox button */}
      <button
        type="button"
        role="checkbox"
        aria-checked={isCompleted}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
          isCompleted
            ? "border-booster bg-booster text-white shadow-xs"
            : "border-graphite/40 bg-canvas hover:border-ink hover:bg-stone",
        )}
        title={isCompleted ? "Mark node as incomplete" : "Mark node as complete"}
      >
        {isCompleted && <CheckIcon className="h-3 w-3" />}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1.5">
          <span className="mono text-[9px] text-graphite">{node.duration}</span>
          {isCentralMilestone && (
            <span className="mono rounded-full bg-cobalt px-2 py-0.5 text-[7.5px] font-bold text-white">
              ★ CENTRAL BUILD
            </span>
          )}
        </div>
        <h4
          className={cn(
            "mt-1 text-[14px] font-semibold leading-snug transition-colors",
            isSelected
              ? "text-booster"
              : isCompleted
                ? "text-graphite line-through decoration-hairline"
                : "text-ink",
          )}
        >
          {node.title}
        </h4>
      </div>

      {/* Selected indicator arrow cue */}
      {isSelected && (
        <span aria-hidden="true" className="shrink-0 text-booster">
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}
