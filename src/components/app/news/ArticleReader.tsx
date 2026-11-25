import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { ARTICLES, TAG_LABEL, publishedLabel, type Article } from "@/data/news";
import { useDialog } from "@/hooks/useDialog";
import {
  BookmarkIcon,
  CheckIcon,
  CloseIcon,
  ExternalIcon,
} from "@/components/app/opportunities/OpportunityIcons";
import { ArrowRight } from "@/components/Icons";
import { BulbIcon } from "./NewsIcons";

interface Props {
  article: Article;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onNavigate: (id: string) => void;
  onClose: () => void;
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function ArticleReader({ article, saved, onToggleSave, onNavigate, onClose }: Props) {
  const [shown, setShown] = useState(false);
  const [progress, setProgress] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const closeTimer = useRef(0);

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setShown(false);
    closeTimer.current = window.setTimeout(onClose, 260);
  }, [onClose]);

  useDialog(panelRef, requestClose, closeRef);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setShown(true));
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  /* Moving to another article keeps the reader open and starts it at the top. */
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
    setProgress(0);
  }, [article.id]);

  const onScroll = () => {
    const el = bodyRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 1);
  };

  const index = ARTICLES.findIndex((item) => item.id === article.id);
  const next = ARTICLES[(index + 1) % ARTICLES.length];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-6" role="presentation">
      <div
        aria-hidden="true"
        onClick={requestClose}
        className={cn(
          "absolute inset-0 bg-ink/55 backdrop-blur-[14px] transition-opacity duration-300",
          shown ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-reader-title"
        className={cn(
          "liquid-modal relative flex max-h-full w-full max-w-[740px] flex-col overflow-hidden transition-[transform,opacity] duration-300",
          shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.985] opacity-0",
        )}
        style={{ transitionTimingFunction: EASE }}
      >
        {/* reading progress */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[3px] bg-transparent">
          <div
            className="h-full bg-booster transition-[width] duration-150"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={requestClose}
          aria-label="Close article"
          className="liquid-secondary absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div ref={bodyRef} onScroll={onScroll} className="flex-1 overflow-y-auto px-4 pb-8 pt-4 sm:px-8 sm:pt-6">
          <div key={article.id} className="swap-in">
            <div className="squircle-media relative aspect-[16/8] bg-stone">
              <img src={article.image} alt={article.imageAlt} className="h-full w-full object-cover" />
              <span className="liquid-chip mono absolute left-3 top-3 px-3 py-1.5 text-[9px] text-ink">
                {TAG_LABEL[article.category]}
              </span>
            </div>

            <div className="mx-auto max-w-[600px]">
              <p className="mono mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] text-graphite">
                <span className="text-ink">{publishedLabel(article.publishedDaysAgo)}</span>
                <span aria-hidden="true">•</span>
                <span>{article.readMins} min read</span>
                <span aria-hidden="true">•</span>
                <span className="text-graphite/70">Sample feed preview</span>
              </p>

              <h2
                id="article-reader-title"
                className="mt-3 font-display text-[32px] leading-[1.06] tracking-[-0.025em] text-ink sm:text-[40px]"
              >
                {article.title}
              </h2>
              <p className="mt-4 text-[16.5px] font-medium leading-[1.6] text-ink">{article.summary}</p>

              <div className="mt-6 space-y-4">
                {article.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-[15.5px] leading-[1.75] text-graphite">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-7 flex gap-3 rounded-2xl bg-stone px-4 py-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cobalt/10 text-cobalt">
                  <BulbIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="mono text-[9px] text-cobalt">Why this matters for students</p>
                  <p className="mt-1 text-[14px] leading-[1.6] text-ink">
                    <span className="font-semibold">{article.why.audience}:</span> {article.why.text}
                  </p>
                </div>
              </div>

              <section className="mt-7">
                <h3 className="text-[16px] font-semibold text-ink">Key takeaways for students</h3>
                <ul className="mt-3 space-y-2.5">
                  {article.takeaways.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-booster text-white">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span className="text-[14.5px] leading-[1.6] text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {article.links && (
                <section className="mt-7">
                  <h3 className="text-[16px] font-semibold text-ink">Free portals to try</h3>
                  <ul className="mt-3 divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline">
                    {article.links.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 bg-canvas px-4 py-3 transition-colors duration-300 hover:bg-chalk"
                        >
                          <span className="min-w-0">
                            <span className="block text-[14px] font-semibold text-ink">{link.label}</span>
                            <span className="block text-[12.5px] text-graphite">{link.note}</span>
                          </span>
                          <ExternalIcon className="h-4 w-4 shrink-0 text-cobalt" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {next && next.id !== article.id && (
                <button
                  type="button"
                  onClick={() => onNavigate(next.id)}
                  className="group mt-8 flex w-full items-center gap-4 rounded-2xl border border-hairline bg-canvas p-3 text-left transition-colors duration-300 hover:border-ink/25"
                >
                  <span className="squircle-inner h-16 w-24 shrink-0">
                    <img src={next.image} alt="" className="h-full w-full object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mono block text-[8.5px] text-graphite">Up next</span>
                    <span className="mt-1 block text-[14px] font-semibold leading-snug text-ink">{next.title}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-graphite transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-hairline bg-stone/80 px-4 py-3.5 sm:px-8">
          <button
            type="button"
            aria-pressed={saved}
            onClick={() => onToggleSave(article.id)}
            className={cn(
              "inline-flex h-11 items-center gap-2 px-4 text-[13.5px] font-semibold",
              saved ? "liquid-ink text-white" : "liquid-secondary text-ink",
            )}
          >
            <BookmarkIcon className="h-4 w-4" filled={saved} />
            {saved ? "Saved" : "Save Article"}
          </button>
          <button
            type="button"
            onClick={requestClose}
            className="liquid-secondary inline-flex h-11 items-center px-5 text-[13.5px] font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
