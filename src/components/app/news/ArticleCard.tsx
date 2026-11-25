import { ArrowRight } from "@/components/Icons";
import { TAG_LABEL, publishedLabel, type Article } from "@/data/news";
import { BookmarkIcon } from "@/components/app/opportunities/OpportunityIcons";
import { BulbIcon } from "./NewsIcons";

interface Props {
  article: Article;
  saved: boolean;
  index: number;
  onOpen: (id: string) => void;
}

export function ArticleCard({ article, saved, index, onOpen }: Props) {
  return (
    <article
      onClick={() => onOpen(article.id)}
      className="squircle reveal group relative flex cursor-pointer flex-col border border-hairline bg-chalk p-4 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_26px_50px_-34px_rgba(20,21,24,0.45)] sm:p-5"
      style={{ animationDelay: `${Math.min(index, 4) * 70}ms` }}
    >
      <div className="squircle-media relative aspect-video bg-stone">
        <img
          src={article.image}
          alt={article.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-transparent" />
        <span className="liquid-chip mono absolute left-3 top-3 px-3 py-1.5 text-[9px] text-ink">
          {TAG_LABEL[article.category]}
        </span>
        <span className="liquid-chip-dark mono absolute right-3 top-3 px-3 py-1.5 text-[9px]">
          {article.readMins} min read
        </span>
        {saved && (
          <span className="liquid-chip-dark mono absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-[8.5px]">
            <BookmarkIcon className="h-3 w-3" filled />
            Saved
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <h3>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen(article.id);
            }}
            className="text-left font-display text-[25px] leading-[1.1] tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-booster sm:text-[27px]"
          >
            {article.title}
          </button>
        </h3>
        <p className="mt-2.5 line-clamp-2 text-[14px] leading-[1.6] text-graphite">{article.summary}</p>

        <div className="mt-5 flex gap-3 rounded-2xl bg-stone px-4 py-3.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt/10 text-cobalt">
            <BulbIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="mono text-[8.5px] text-cobalt">Why this matters for students</p>
            <p className="mt-1 text-[13px] leading-[1.55] text-ink">
              <span className="font-semibold">{article.why.audience}:</span> {article.why.text}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
            <div>
              <p className="mono text-[9.5px] text-ink">{publishedLabel(article.publishedDaysAgo)}</p>
              <p className="mono mt-0.5 text-[8px] text-graphite/60">Sample feed preview</p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpen(article.id);
              }}
              className="liquid-secondary group/cta inline-flex h-10 items-center gap-2 px-4 text-[13px] font-semibold"
            >
              Read Full Summary
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-[3px]" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
