import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "@/components/Icons";
import { ISRO_RULES_URL, type GuideBranch, type GuideGoal } from "@/data/careerGuide";
import { answerCareerQuestion, QUICK_QUESTIONS } from "@/data/guideAnswers";
import { cn } from "@/utils/cn";
import { GuideIcon } from "./GuideIcon";
import { useGuideTask } from "./useGuideTask";

interface QuestionsModeProps {
  branch: GuideBranch;
  year: number;
  onStartRoadmap: (branch: GuideBranch, goal?: GuideGoal) => void;
  onViewInternships: (branch: GuideBranch) => void;
}

export function QuestionsMode({ branch, year, onStartRoadmap, onViewInternships }: QuestionsModeProps) {
  const [draft, setDraft] = useState("");
  const [asked, setAsked] = useState("");
  const [error, setError] = useState("");
  const { pending, start } = useGuideTask(380);
  const input = useRef<HTMLInputElement>(null);
  const result = useRef<HTMLHeadingElement>(null);
  const reply = asked ? answerCareerQuestion(asked, branch, year) : null;

  useEffect(() => {
    if (asked && result.current?.getClientRects().length) {
      result.current.focus({ preventScroll: true });
      const bounds = result.current.getBoundingClientRect();
      if (bounds.top < 84 || bounds.bottom > window.innerHeight - 100) {
        result.current.scrollIntoView({ block: "start" });
      }
    }
  }, [asked]);

  function ask(question: string, clearInput = false) {
    const value = question.trim();
    if (value.length < 3) {
      setError("Type a question or choose one above.");
      input.current?.focus();
      return;
    }
    setError("");
    start(() => {
      setAsked(value);
      if (clearInput) setDraft("");
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(draft, true);
  }

  return (
    <section className="squircle mx-auto max-w-[780px] border border-hairline bg-chalk p-5 sm:p-7" aria-labelledby="questions-heading">
      <div className="flex items-start gap-3.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-cobalt/20 bg-cobalt/[0.07] text-cobalt">
          <GuideIcon name="question" className="h-5 w-5" />
        </span>
        <div>
          <h2 id="questions-heading" className="font-display text-[32px] leading-[1.08] text-ink sm:text-[36px]">What's on your mind?</h2>
          <p className="mt-1.5 text-[13.5px] leading-[1.6] text-graphite">Pick a question below, or ask one of your own.</p>
        </div>
      </div>

      <div role="group" aria-label="Quick questions" className="mt-5 grid gap-2 sm:grid-cols-2">
        {QUICK_QUESTIONS.map((question) => (
          <button
            type="button"
            key={question}
            onClick={() => ask(question)}
            aria-pressed={asked === question}
            disabled={pending}
            className={cn(
              "group flex min-h-11 items-center justify-between gap-2 px-4 py-2 text-left text-[13px] leading-[1.45] font-medium",
              asked === question ? "liquid-cobalt" : "liquid-secondary",
            )}
          >
            <span>{question}</span>
            <ArrowRight className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5", asked !== question && "text-booster")} />
          </button>
        ))}
      </div>

      <div aria-busy={pending}>
        {pending && (
          <div className="mt-5 rounded-2xl border border-hairline bg-canvas p-5" role="status">
            <p className="text-sm font-semibold text-ink">Finding a good starting point...</p>
            <div className="guide-shimmer mt-3 h-3 w-4/5 rounded-full" />
          </div>
        )}
        {!pending && reply && (
          <article key={asked} className="guide-panel mt-5 rounded-2xl border border-hairline bg-canvas p-4 sm:p-5">
            <p className="mono text-[9px] text-cobalt">Your question</p>
            <p className="mt-1 text-[13px] text-graphite [overflow-wrap:anywhere]">{asked}</p>
            <h3 ref={result} tabIndex={-1} className="mt-3.5 scroll-mt-12 font-display text-[28px] leading-[1.1] text-ink">{reply.title}</h3>
            <p className="mt-2 text-sm leading-[1.65] text-graphite">{reply.summary}</p>
            <ul className="mt-4 grid gap-2.5">
              {reply.steps.map((step) => (
                <li key={step} className="flex items-start gap-2.5 text-[13.5px] leading-[1.6] text-ink">
                  <span aria-hidden="true" className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-booster" />
                  {step}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <button
                type="button"
                onClick={() => reply.action.kind === "internships" ? onViewInternships(reply.branch) : onStartRoadmap(reply.branch, reply.action.goal)}
                className="liquid-secondary inline-flex min-h-10 items-center gap-2 px-4 py-2 text-[13px] font-semibold"
              >
                {reply.action.kind === "internships" ? "View Matching Internships" : "Start Roadmap"}
                <ArrowRight className="h-4 w-4 shrink-0 text-booster" />
              </button>
              {reply.showIsroRules && <a className="text-[13px] font-medium text-cobalt underline underline-offset-3" href={ISRO_RULES_URL} target="_blank" rel="noreferrer">Check ISRO's rules</a>}
            </div>
          </article>
        )}
      </div>

      <form onSubmit={submit} className="mt-5 border-t border-hairline pt-5">
        <label htmlFor="guide-question" className="sr-only">Ask your own question</label>
        <div className="guide-question-input flex items-center gap-2 rounded-full border border-hairline bg-stone p-1 sm:gap-3">
          <input
            ref={input}
            id="guide-question"
            value={draft}
            onChange={(event) => { setDraft(event.target.value); setError(""); }}
            placeholder="Ask your own question..."
            maxLength={300}
            readOnly={pending}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "guide-question-error" : undefined}
            className="min-h-10 min-w-0 flex-1 rounded-full bg-transparent pr-1 pl-3 text-[15px] text-ink placeholder:text-graphite/80 focus:outline-none sm:pl-4"
          />
          <button type="submit" disabled={pending} className="liquid-primary flex min-h-10 shrink-0 items-center gap-2 px-4 py-1 text-sm font-semibold sm:px-5">
            Ask <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {error && <p id="guide-question-error" role="alert" className="mt-2 text-[13px] text-booster-deep">{error}</p>}
      </form>
    </section>
  );
}