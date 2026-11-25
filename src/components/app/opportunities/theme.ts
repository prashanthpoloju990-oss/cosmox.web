import type { OpportunityCategory } from "@/data/opportunities";

interface CategoryTheme {
  /** Small badge on cards and in the drawer. */
  badge: string;
  /** Thin rule along the top of the card. */
  rule: string;
  /** Solid dot used in legends and the drawer header. */
  dot: string;
}

export const CATEGORY_THEME: Record<OpportunityCategory, CategoryTheme> = {
  internship: {
    badge: "border-cobalt/35 bg-cobalt/[0.08] text-cobalt",
    rule: "bg-cobalt/70",
    dot: "bg-cobalt",
  },
  hackathon: {
    badge: "border-booster/35 bg-booster/[0.08] text-booster",
    rule: "bg-booster/80",
    dot: "bg-booster",
  },
  workshop: {
    badge: "border-ink/25 bg-ink/[0.06] text-ink",
    rule: "bg-ink/60",
    dot: "bg-ink",
  },
};
