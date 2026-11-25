import { cn } from "@/utils/cn";
import { ArrowRight } from "@/components/Icons";
import {
  CATEGORY_LABEL,
  closingLabel,
  isClosingSoon,
  type Opportunity,
} from "@/data/opportunities";
import { BookmarkIcon, CheckIcon, ClockIcon, PinIcon } from "./OpportunityIcons";
import { CATEGORY_THEME } from "./theme";

interface Props {
  item: Opportunity;
  saved: boolean;
  applied: boolean;
  registered: boolean;
  prepDone: number;
  goodFit: boolean;
  index: number;
  onToggleSave: (id: string) => void;
  onOpen: (id: string) => void;
}

export function OpportunityCard({
  item,
  saved,
  applied,
  registered,
  prepDone,
  goodFit,
  index,
  onToggleSave,
  onOpen,
}: Props) {
  const theme = CATEGORY_THEME[item.category];
  const urgent = isClosingSoon(item.closesInDays);
  const status = applied ? "Applied" : registered ? "Seat booked" : null;

  return (
    <article
      onClick={() => onOpen(item.id)}
      className="squircle reveal group relative flex cursor-pointer flex-col overflow-hidden border border-hairline bg-chalk p-5 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_26px_50px_-34px_rgba(20,21,24,0.45)] sm:p-6"
      style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
    >
      <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-[3px]", theme.rule)} />

      {/* faint orbit watermark */}
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-14 h-52 w-52 text-ink opacity-[0.045] transition-transform duration-700 group-hover:rotate-[14deg]"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="100" cy="100" r="92" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="58" strokeWidth="1.5" />
        <ellipse cx="100" cy="100" rx="92" ry="34" strokeWidth="1.5" transform="rotate(-28 100 100)" />
      </svg>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={cn(
              "mono inline-flex items-center rounded-full border px-2.5 py-1 text-[9px]",
              theme.badge,
            )}
          >
            {CATEGORY_LABEL[item.category]}
          </span>
          <p className="mt-2.5 truncate text-[13.5px] font-semibold text-ink">{item.org}</p>
          <p className="mono mt-0.5 text-[8.5px] text-graphite">{item.orgKind}</p>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleSave(item.id);
          }}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
          title={saved ? "Remove from saved" : "Save for later"}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300",
            saved ? "liquid-ink text-white" : "liquid-secondary text-graphite hover:text-ink",
          )}
        >
          <BookmarkIcon className="h-[17px] w-[17px]" filled={saved} />
        </button>
      </div>

      <h3 className="relative mt-4">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(item.id);
          }}
          className="text-left font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-booster sm:text-[28px]"
        >
          {item.title}
        </button>
      </h3>
      <p className="relative mt-2 text-[14px] leading-[1.6] text-graphite">{item.summary}</p>

      <div className="relative mt-5 rounded-2xl bg-stone px-3.5 py-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          {item.applyTags.map((tag) => (
            <li key={tag} className="mono text-[9px] leading-relaxed text-ink">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-1.5">
        <span className="mono text-[8.5px] text-graphite">Skills helpful:</span>
        {item.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-hairline bg-canvas px-2.5 py-1 text-[11.5px] font-medium text-ink"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-1.5">
        {goodFit && (
          <span className="mono rounded-full border border-cobalt/35 bg-cobalt/[0.07] px-2.5 py-1 text-[8.5px] text-cobalt">
            Good fit for you
          </span>
        )}
        {status && (
          <span className="mono inline-flex items-center gap-1 rounded-full border border-cobalt/35 bg-chalk px-2.5 py-1 text-[8.5px] text-cobalt">
            <CheckIcon className="h-3 w-3" />
            {status}
          </span>
        )}
        {prepDone > 0 && (
          <span className="mono rounded-full border border-hairline bg-canvas px-2.5 py-1 text-[8.5px] text-graphite">
            Prep {prepDone}/{item.prep.length}
          </span>
        )}
        <span className="mono inline-flex items-center gap-1 rounded-full px-1 py-1 text-[8.5px] text-graphite/70">
          <PinIcon className="h-3 w-3" />
          {item.location}
        </span>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
        <p
          className={cn(
            "inline-flex items-center gap-1.5 text-[13px] font-semibold",
            urgent ? "text-booster" : "text-graphite",
          )}
        >
          <ClockIcon className={cn("h-4 w-4", urgent ? "text-booster" : "text-graphite")} />
          {closingLabel(item.closesInDays)}
        </p>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(item.id);
          }}
          className="liquid-secondary group/cta inline-flex h-10 items-center gap-2 px-4 text-[13px] font-semibold"
        >
          View Details &amp; Prep
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-[3px]" />
        </button>
      </div>

      <p className="mono relative mt-3 text-[8px] text-graphite/60">Sample listing</p>
    </article>
  );
}
