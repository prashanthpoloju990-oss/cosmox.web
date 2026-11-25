import { useState } from "react";
import { cn } from "@/utils/cn";
import { ArrowRight, CheckSeal } from "@/components/Icons";

/* ── Stage 01 · Branch → Track → Employer matrix ───────────────── */

const MATRIX = [
  {
    branch: "CSE / DS",
    track: "Flight SW + Satellite EO-AI",
    employers: "Pixxel · NRSC",
  },
  {
    branch: "ECE / EEE",
    track: "Avionics & RF",
    employers: "Dhruva Space · Skyroot",
  },
  {
    branch: "MECH / AERO",
    track: "Propulsion & Structures",
    employers: "Agnikul · ISRO VSSC",
  },
];

const MATRIX_COLS =
  "grid-cols-[1fr_14px_1.2fr_14px_1fr] sm:grid-cols-[1fr_18px_1.2fr_18px_1fr]";

function MappingMatrix() {
  return (
    <div className="squircle-inner border border-hairline bg-canvas">
      <div
        className={cn(
          "grid items-center gap-3 border-b border-hairline bg-stone px-4 py-2.5",
          MATRIX_COLS,
        )}
      >
        <span className="mono text-[8.5px] text-graphite">B.Tech Branch</span>
        <span />
        <span className="mono text-[8.5px] text-graphite">Cosmox Space Track</span>
        <span />
        <span className="mono text-[8.5px] text-graphite">Target Indian Employers</span>
      </div>

      <ul>
        {MATRIX.map((row) => (
          <li
            key={row.branch}
            className={cn(
              "grid items-center gap-3 border-b border-hairline px-4 py-4 transition-colors duration-300 last:border-b-0 hover:bg-chalk",
              MATRIX_COLS,
            )}
          >
            <span className="mono w-fit rounded-full border border-ink bg-chalk px-2 py-1.5 text-[9px] text-ink sm:text-[9.5px]">
              {row.branch}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-booster" />
            <span className="mono w-fit rounded-full border border-cobalt/40 bg-chalk px-2 py-1.5 text-[9px] leading-snug text-cobalt sm:text-[9.5px]">
              {row.track}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-booster" />
            <span className="text-[13px] font-medium leading-snug text-ink">
              {row.employers}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5">
        <span className="mono text-[8.5px] text-graphite">
          3 branches · 3 tracks · no major switch
        </span>
        <span className="mono text-[8.5px] text-graphite">Map v1.0</span>
      </div>
    </div>
  );
}

/* ── Stage 02 · Domain skill grid ──────────────────────────────── */

const DOMAINS = [
  {
    name: "ROS2 & C++ Flight Loops",
    level: 3,
    weeks: "04",
    tools: ["ROS2 Humble", "C++17 RT", "Gazebo SIL"],
  },
  {
    name: "Sentinel-2 / Rasterio EO-ML",
    level: 3,
    weeks: "03",
    tools: ["Rasterio", "GeoPandas", "PyTorch U-Net"],
  },
  {
    name: "STM32, FreeRTOS & LoRa RF",
    level: 2,
    weeks: "03",
    tools: ["STM32 HAL", "FreeRTOS", "LoRa SX127x"],
  },
  {
    name: "OpenRocket & ANSYS FEA",
    level: 2,
    weeks: "05",
    tools: ["OpenRocket", "ANSYS Mech.", "MATLAB"],
  },
];

const LEVEL_LABEL: Record<number, string> = {
  3: "Advanced",
  2: "Intermediate",
};

function SkillGrid() {
  return (
    <div className="squircle-inner border border-hairline bg-canvas">
      <div className="flex items-center justify-between border-b border-hairline bg-stone px-4 py-2.5">
        <span className="mono text-[9px] text-ink">Stack Map // Startup Interview Set</span>
        <span className="mono text-[8.5px] text-graphite">Diff · Time-to-learn</span>
      </div>

      <div className="grid gap-px bg-hairline sm:grid-cols-2">
        {DOMAINS.map((d) => (
          <div key={d.name} className="bg-canvas p-4">
            <p className="text-[13.5px] font-semibold leading-snug text-ink">{d.name}</p>

            <div className="mt-2.5 flex items-center gap-3">
              <div className="flex items-center gap-[3px]" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn("h-[6px] w-[10px] rounded-full", i < d.level ? "bg-ink" : "bg-sand")}
                  />
                ))}
              </div>
              <span className="mono text-[8.5px] leading-none text-cobalt">
                {LEVEL_LABEL[d.level]} · {d.weeks} WK
              </span>
            </div>

            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {d.tools.map((t) => (
                <span
                  key={t}
                  className="liquid-chip mono px-2 py-1.5 text-[8.5px] text-ink transition-colors duration-200 hover:border-ink sm:text-[9px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Stage 03 · Mission Build Spec ─────────────────────────────── */

const DELIVERABLES = [
  "Parser for 3 CCSDS beacon frame types",
  "80%+ unit test coverage",
  "Anomaly report with signed commits",
  "Replay on a public dashboard",
];

function BuildSpec() {
  const [done, setDone] = useState<boolean[]>([true, true, false, false]);
  const count = done.filter(Boolean).length;
  const pct = Math.round((count / DELIVERABLES.length) * 100);

  return (
    <div className="squircle-inner border border-hairline bg-canvas">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-stone px-4 py-2.5">
        <span className="mono text-[9px] text-ink">
          Project Spec // CubeSat Telemetry Parser
        </span>
        <span className="liquid-cobalt mono inline-flex items-center gap-1.5 px-2 py-1.5 text-[8.5px] text-white">
          <CheckSeal className="h-3 w-3" />
          Verified Portfolio Artifact
        </span>
      </div>

      <div className="grid gap-px bg-hairline sm:grid-cols-3">
        {[
          { k: "Objective", v: "Decode beacon frames into an anomaly log" },
          { k: "Stack", v: "Python · struct · pytest" },
          { k: "Repo", v: "Public · MIT licensed" },
        ].map((f) => (
          <div key={f.k} className="bg-canvas px-4 py-3">
            <p className="mono text-[8.5px] text-graphite">{f.k}</p>
            <p className="mt-1.5 text-[12.5px] font-medium leading-snug text-ink">{f.v}</p>
          </div>
        ))}
      </div>

      <div className="px-4 py-4">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="mono text-[8.5px] text-graphite">Deliverables</span>
          <span className="mono tnum text-[8.5px] text-ink">
            {count}/{DELIVERABLES.length} shipped
          </span>
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-hairline" aria-hidden="true">
          <div
            className="h-full bg-booster transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <ul className="mt-4 space-y-2">
          {DELIVERABLES.map((d, i) => {
            const on = done[i];
            return (
              <li key={d}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    setDone((prev) => prev.map((v, j) => (j === i ? !v : v)))
                  }
                  className="liquid-secondary group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200 hover:border-ink"
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                      on ? "border-ink bg-ink text-white" : "border-graphite bg-chalk",
                    )}
                    aria-hidden="true"
                  >
                    {on && (
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                        <path d="M2 6.2 4.8 9 10 3" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[13px] leading-snug transition-colors duration-200",
                      on ? "text-graphite line-through decoration-hairline" : "text-ink",
                    )}
                  >
                    {d}
                  </span>
                  <span className="mono ml-auto text-[8.5px] text-graphite">D{i + 1}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ── Stage 04 · Eligibility flight checklist ───────────────────── */

const RULES = [
  {
    name: "ISRO 45-Day Internship Scheme",
    tags: ["Min. 60% or 6.32 CGPA", "UG/PG Science & Tech"],
  },
  {
    name: "ISRO Student Project Trainee",
    tags: ["Post-6th Sem (B.Tech)", "45–90+ Days", "HoD NOC + Proposal"],
  },
  {
    name: "Space-Tech Startup Internships",
    tags: ["Portfolio Repo + Technical Screen"],
  },
];

function FlightChecklist() {
  const [go, setGo] = useState<boolean[]>([true, true, false]);
  const count = go.filter(Boolean).length;

  return (
    <div className="squircle-inner border border-hairline bg-canvas">
      <div className="flex items-center justify-between border-b border-hairline bg-stone px-4 py-2.5">
        <span className="mono text-[9px] text-ink">Flight Checklist // Eligibility Rulebook</span>
        <span className="mono tnum text-[8.5px] text-cobalt">
          GO {count}/{RULES.length}
        </span>
      </div>

      <ul>
        {RULES.map((r, i) => {
          const on = go[i];
          return (
            <li
              key={r.name}
              className="grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-hairline px-4 py-4 last:border-b-0"
            >
              <span className="mono pt-[3px] text-[8.5px] text-graphite">
                CHK-0{i + 1}
              </span>

              <div className="min-w-0">
                <p className="text-[14px] font-semibold leading-snug text-ink">{r.name}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {r.tags.map((t) => (
                    <span
                      key={t}
                      className="mono rounded-full border border-cobalt/40 bg-chalk px-2 py-1.5 text-[8.5px] text-cobalt sm:text-[9px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                aria-pressed={on}
                onClick={() => setGo((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                className={cn(
                  "mono h-[30px] min-w-[72px] text-[9px] transition-colors duration-200",
                  on
                    ? "liquid-cobalt text-white"
                    : "liquid-secondary text-graphite hover:text-ink",
                )}
              >
                {on ? "GO ✓" : "HOLD"}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5">
        <span className="mono text-[8.5px] text-graphite">Tap a row to set GO / HOLD</span>
        <span className="mono text-[8.5px] text-graphite">Synced 12 FEB 2026</span>
      </div>
    </div>
  );
}

export function StageArtifact({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <MappingMatrix />;
    case 1:
      return <SkillGrid />;
    case 2:
      return <BuildSpec />;
    default:
      return <FlightChecklist />;
  }
}
