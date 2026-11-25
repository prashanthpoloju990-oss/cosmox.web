import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { APP_TABS, navigateApp, type AppTab } from "@/utils/appRoute";
import { branchCode, endSession, yearShort } from "@/utils/session";
import { navigateHome } from "@/utils/authNavigation";
import { BrandMark } from "@/components/Icons";
import { ReplayIcon, SignOutIcon, TabIcon } from "@/components/app/AppIcons";
import { IntroSequence } from "@/components/app/IntroSequence";
import { HomeDashboard } from "@/components/app/HomeDashboard";
import { OpportunitiesScreen } from "@/components/app/opportunities/OpportunitiesScreen";
import { NewsScreen } from "@/components/app/news/NewsScreen";
import { CareerGuideScreen } from "@/components/app/guide/CareerGuideScreen";
import { CareerRoadmapsScreen } from "@/components/app/roadmaps/CareerRoadmapsScreen";
import { MyProfileScreen } from "@/components/app/profile/MyProfileScreen";
import { ExplorerAvatar } from "@/components/app/profile/ProfileArt";
import { useStudentPortfolio } from "@/hooks/useStudentPortfolio";
import { useGuideProgress } from "@/hooks/useGuideProgress";
import type { GuideBranch } from "@/data/careerGuide";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Desktop navigation. The orange active pill slides between items. */
function SidebarNav({ tab }: { tab: AppTab }) {
  const buttons = useRef<Partial<Record<AppTab, HTMLButtonElement | null>>>({});
  const [pill, setPill] = useState({ top: 0, height: 0, ready: false });

  useLayoutEffect(() => {
    const measure = () => {
      const el = buttons.current[tab];
      if (el) setPill({ top: el.offsetTop, height: el.offsetHeight, ready: true });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [tab]);

  return (
    <nav aria-label="Main" className="relative flex flex-1 flex-col gap-1.5">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 rounded-full bg-booster shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_22px_-12px_rgba(217,78,31,0.6)] transition-[transform,height,opacity] duration-500"
        style={{
          transform: `translate3d(0, ${pill.top}px, 0)`,
          height: pill.height,
          opacity: pill.ready ? 1 : 0,
          transitionTimingFunction: EASE,
        }}
      />
      {APP_TABS.map((item) => {
        const on = item.id === tab;
        return (
          <button
            key={item.id}
            ref={(el) => {
              buttons.current[item.id] = el;
            }}
            type="button"
            onClick={() => navigateApp(item.id)}
            aria-current={on ? "page" : undefined}
            className={cn(
              "relative z-10 flex w-full items-center gap-3 rounded-full px-4 py-3 text-left text-[14.5px] font-medium transition-colors duration-300",
              on ? "text-white" : "text-graphite hover:bg-stone hover:text-ink",
            )}
          >
            <TabIcon id={item.id} className="h-[18px] w-[18px] shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function AppShell({ tab, profileHash }: { tab: AppTab; profileHash: string }) {
  const isSharedProfile = tab === "profile" && profileHash.includes("?view=");
  const [introOn, setIntroOn] = useState(!isSharedProfile);
  const [introRun, setIntroRun] = useState(0);
  const [suggestedBranch, setSuggestedBranch] = useState<GuideBranch>();
  const guideProgress = useGuideProgress();
  const portfolio = useStudentPortfolio();
  const session = portfolio.profile.info;
  const current = APP_TABS.find((item) => item.id === tab) ?? APP_TABS[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (tab === "opportunities") setSuggestedBranch(undefined);
  }, [tab]);

  const replayIntro = () => {
    setIntroRun((count) => count + 1);
    setIntroOn(true);
  };

  const signOut = () => {
    endSession();
    navigateHome();
  };

  function viewMatchingInternships(branch: GuideBranch) {
    setSuggestedBranch(branch);
    navigateApp("opportunities");
  }

  return (
    <div className="relative min-h-svh bg-canvas text-ink">
      {introOn && <IntroSequence key={introRun} onDone={() => setIntroOn(false)} />}

      {/* Desktop sidebar */}
      <aside
        aria-label="Sidebar"
        className="app-rail fixed bottom-4 left-4 top-4 z-40 hidden w-64 flex-col rounded-[28px] p-4 lg:flex"
      >
        <button
          type="button"
          onClick={() => navigateApp("home")}
          aria-label="COSMOX home"
          className="flex items-center gap-3 px-2 pb-6 pt-2 text-left"
        >
          <BrandMark className="h-9 w-9 shrink-0" />
          <span className="text-[18px] font-bold tracking-[-0.02em] text-ink">COSMOX</span>
        </button>

        <SidebarNav tab={tab} />

        <div className="mt-auto rounded-2xl bg-stone p-3.5">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-cobalt shadow-sm">
              <ExplorerAvatar style={portfolio.profile.avatar} decorative className="h-full w-full" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-ink">{session.name}</p>
              <p className="mono truncate text-[9px] text-graphite">
                {branchCode(session.branch)} • {yearShort(session.year)}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={replayIntro}
              aria-label="Replay Intro"
              className="liquid-secondary flex h-10 flex-1 items-center justify-center gap-2 text-[12.5px] font-medium"
            >
              <ReplayIcon className="h-4 w-4" />
              Replay
            </button>
            <button
              type="button"
              onClick={signOut}
              aria-label="Sign out"
              className="liquid-secondary flex h-10 flex-1 items-center justify-center gap-2 text-[12.5px] font-medium"
            >
              <SignOutIcon className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="min-w-0 flex-1 lg:pl-[17.5rem]">
        <div className="w-full px-4 pb-32 pt-3 sm:px-6 lg:px-8 lg:pb-16 lg:pt-6">
          <header className="liquid-chip sticky top-3 z-30 mb-8 flex items-center justify-between gap-3 rounded-full py-2 pl-3 pr-2 sm:pl-4">
            <div className="flex min-w-0 items-center gap-3">
              <BrandMark className="h-7 w-7 shrink-0 lg:hidden" />
              <p className="mono truncate text-[10px] text-graphite">COSMOX / {isSharedProfile ? "Shared profile" : current.label}</p>
            </div>
            <button
              type="button"
              onClick={replayIntro}
              className="liquid-secondary inline-flex h-9 shrink-0 items-center gap-2 px-3.5 text-[12.5px] font-medium"
            >
              <ReplayIcon className="h-3.5 w-3.5" />
              Replay Intro
            </button>
          </header>

          <main id="app-main">
            {tab === "home" && <HomeDashboard guideProgress={guideProgress} />}
            {tab === "opportunities" && <OpportunitiesScreen initialInternshipBranch={suggestedBranch} />}
            {tab === "news" && <NewsScreen />}
            {tab === "roadmaps" && (
              <CareerRoadmapsScreen
                addedProjectIds={portfolio.profile.addedProjects.map((project) => project.id)}
                onAddProject={portfolio.addProject}
                onViewProfile={() => navigateApp("profile")}
              />
            )}
            {tab === "ai-guide" && <CareerGuideScreen session={session} progress={guideProgress} onViewInternships={viewMatchingInternships} />}
            {tab === "profile" && <MyProfileScreen key={profileHash} store={portfolio} hash={profileHash} />}
          </main>
        </div>
      </div>

      {/* Mobile and tablet dock */}
      <nav
        aria-label="Main"
        className="app-dock fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-full p-1.5 lg:hidden"
      >
        {APP_TABS.map((item) => {
          const on = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateApp(item.id)}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-full py-2 text-[10px] font-medium transition-all duration-500",
                on
                  ? "bg-booster text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_18px_-8px_rgba(217,78,31,0.6)]"
                  : "text-graphite",
              )}
              style={{ transitionTimingFunction: EASE }}
            >
              <TabIcon id={item.id} className="h-[18px] w-[18px]" />
              <span className="truncate">{item.short}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
