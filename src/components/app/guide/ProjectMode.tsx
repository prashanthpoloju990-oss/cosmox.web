import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "@/components/Icons";
import type { GuideBranch } from "@/data/careerGuide";
import { PROJECT_EXAMPLES, reviewProject } from "@/data/guideAnswers";
import { GuideIcon } from "./GuideIcon";
import { useGuideTask } from "./useGuideTask";

export function ProjectMode({ branch }: { branch: GuideBranch }) {
  const [customIdea, setIdea] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState("");
  const [error, setError] = useState("");
  const { pending, start } = useGuideTask(450);
  const input = useRef<HTMLTextAreaElement>(null);
  const result = useRef<HTMLHeadingElement>(null);
  const idea = customIdea ?? (PROJECT_EXAMPLES.find((item) => item.branch === branch) ?? PROJECT_EXAMPLES[0]).idea;
  const feedback = reviewed ? reviewProject(reviewed, branch) : null;

  useEffect(() => {
    if (reviewed && result.current?.getClientRects().length) {
      result.current.focus({ preventScroll: true });
      if (result.current.getBoundingClientRect().bottom > window.innerHeight - 100) {
        result.current.scrollIntoView({ block: "start" });
      }
    }
  }, [reviewed]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = idea.trim();
    if (value.length < 16) {
      setError("Write a short sentence about what you'd like to build.");
      input.current?.focus();
      return;
    }
    setError("");
    start(() => setReviewed(value));
  }

  return (
    <section className="squircle mx-auto max-w-[780px] border border-hairline bg-chalk p-5 sm:p-7" aria-labelledby="project-heading">
      <div className="flex items-start gap-3.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-booster/20 bg-booster/[0.07] text-booster">
          <GuideIcon name="idea" className="h-5 w-5" />
        </span>
        <div>
          <h2 id="project-heading" className="font-display text-[32px] leading-[1.08] text-ink sm:text-[36px]">Is this a good first project?</h2>
          <p className="mt-1.5 text-[13.5px] leading-[1.6] text-graphite">Tell us what you want to build. A sentence or two is enough.</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6">
        <label htmlFor="guide-idea" className="text-sm font-semibold text-ink">Your project idea</label>
        <textarea
          ref={input}
          id="guide-idea"
          value={idea}
          onChange={(event) => { setIdea(event.target.value); setError(""); }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "guide-idea-error" : undefined}
          maxLength={800}
          rows={4}
          readOnly={pending}
          className="mt-2 block min-h-28 w-full resize-y rounded-2xl border border-hairline bg-stone px-4 py-3 text-[15px] leading-[1.65] text-ink focus:border-cobalt aria-invalid:border-booster"
        />
        {error && <p id="guide-idea-error" className="mt-2 text-[13px] text-booster-deep" role="alert">{error}</p>}

        <div role="group" aria-label="Sample project ideas" className="mt-3 flex flex-wrap items-center gap-2">
          <span className="mono pr-0.5 text-[9px] text-graphite">Try an example</span>
          {PROJECT_EXAMPLES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              aria-pressed={idea === preset.idea}
              disabled={pending}
              onClick={() => { setIdea(preset.idea); setError(""); }}
              className={idea === preset.idea
                ? "min-h-8 rounded-full border border-cobalt/30 bg-cobalt/[0.07] px-3 text-xs font-medium text-cobalt"
                : "liquid-secondary min-h-8 px-3 text-xs font-medium"}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button type="submit" disabled={pending} className="liquid-primary mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 px-5 py-2 text-sm font-semibold sm:w-auto">
          {pending ? "Reviewing your idea..." : "Review My Idea"}
          <ArrowRight className="h-4 w-4 shrink-0" />
        </button>
      </form>

      <div aria-busy={pending}>
        {pending && (
          <div className="mt-6 rounded-2xl border border-hairline bg-canvas p-5" role="status">
            <p className="text-sm font-semibold text-ink">Looking for ways to make your idea stronger...</p>
            <div className="guide-shimmer mt-3 h-3 w-4/5 rounded-full" />
          </div>
        )}
        {!pending && feedback && (
          <div key={reviewed} className="guide-panel mt-6 border-t border-hairline pt-5">
            <h3 ref={result} tabIndex={-1} className="scroll-mt-12 font-display text-[28px] leading-[1.1] text-ink">Feedback on your idea</h3>
            {reviewed !== idea.trim() && <p className="mt-2 text-[13px] text-graphite">Review again to update these notes.</p>}
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <section className="rounded-2xl border border-cobalt/20 bg-cobalt/[0.06] p-4 sm:p-5">
                <span className="mb-2 grid h-7 w-7 place-items-center rounded-full border border-cobalt/15 bg-chalk text-cobalt"><GuideIcon name="check" className="h-4 w-4" /></span>
                <h4 className="font-display text-[23px] leading-tight text-cobalt">Why Recruiters Will Like It</h4>
                <p className="mt-2 text-[13px] leading-[1.65] text-ink">{feedback.strength}</p>
              </section>
              <section className="rounded-2xl border border-hairline bg-canvas p-4 sm:p-5">
                <h4 className="font-display text-[23px] leading-tight text-ink">What to Add to Make It Stronger</h4>
                <ol className="mt-2.5 grid gap-2.5">
                  {feedback.upgrades.map((upgrade, index) => (
                    <li key={upgrade} className="flex items-start gap-2.5 text-[13px] leading-[1.6] text-graphite">
                      <span className="mono mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-booster/25 bg-chalk text-[9px] text-booster-deep">{index + 1}</span>
                      {upgrade}
                    </li>
                  ))}
                </ol>
              </section>
              <section className="rounded-2xl border border-hairline bg-stone p-4 md:col-span-2 sm:p-5">
                <h4 className="font-display text-[23px] leading-tight text-ink">Best Roles This Fits</h4>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {feedback.roles.map((role) => <li key={role} className="rounded-full border border-cobalt/20 bg-chalk px-3 py-1.5 text-xs font-medium text-cobalt">{role}</li>)}
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}