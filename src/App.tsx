import { Hero } from "@/components/Hero";
import { SpaceWordsMarquee } from "@/components/SpaceWordsMarquee";
import { CareerGuidance } from "@/components/career/CareerGuidance";
import { CommunitySquads } from "@/components/community/CommunitySquads";
import { LiveDispatches } from "@/components/live/LiveDispatches";
import { UpcomingEvents } from "@/components/events/UpcomingEvents";
import { CosmoxAiPlanner } from "@/components/ai/CosmoxAiPlanner";
import { FounderNote } from "@/components/founder/FounderNote";
import { FinalCta } from "@/components/cta/FinalCta";
import { EditorialFooter } from "@/components/footer/EditorialFooter";
import { DemoWorkspace } from "@/components/demo/DemoWorkspace";
import { AuthPage } from "@/components/auth/AuthPage";
import { AppShell } from "@/components/app/AppShell";
import { getAppTab, getEventDetailId, useHash } from "@/utils/appRoute";
import { getAuthMode } from "@/utils/authNavigation";
import { EventDetailPage } from "@/components/events/EventDetailPage";

export default function App() {
  const hash = useHash();

  // Full-screen event detail: #/event/<id>
  const eventId = getEventDetailId(hash);
  if (eventId) return <EventDetailPage eventId={eventId} />;

  // Signed-in area: #/app, #/app/opportunities, #/app/news, #/app/roadmaps, #/app/ai-guide, #/app/profile
  const appTab = getAppTab(hash);
  if (appTab) return <AppShell tab={appTab} profileHash={appTab === "profile" ? hash : ""} />;

  const authMode = getAuthMode();
  if (authMode) {
    return (
      <>
        <AuthPage initialMode={authMode} />
        <DemoWorkspace />
      </>
    );
  }

  return (
    <div id="top" className="cosmox-site relative min-h-screen bg-canvas text-ink">
      <div className="grain-layer" aria-hidden="true" />

      <main>
        <Hero />
        <SpaceWordsMarquee />
        <CareerGuidance />
        <CommunitySquads />
        <LiveDispatches />
        <UpcomingEvents />
        <CosmoxAiPlanner />
        <FounderNote />
        <FinalCta />
      </main>

      <EditorialFooter />
      <DemoWorkspace />
    </div>
  );
}
