import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AVATARS, BADGES, degreeLabel,
  type MilestoneBadge, type NoteEntry, type PortfolioTab, type ProjectEntry, type StudentPortfolio,
} from "@/data/profile";
import type { PortfolioStore } from "@/hooks/useStudentPortfolio";
import { navigateApp } from "@/utils/appRoute";
import { cn } from "@/utils/cn";
import { copyText, readSharedPortfolio, shareProfileUrl } from "@/utils/profileStorage";
import { BadgeArt, ExplorerAvatar, SunsetBanner } from "./ProfileArt";
import { ProfileIcon } from "./ProfileIcon";
import { AddEntryDialog, EditProfileDialog } from "./ProfileEditors";
import { BadgeDialog, NoteDialog, ResourceDialog, ShareFallbackDialog } from "./ProfileDetails";
import { PortfolioSection } from "./PortfolioSection";
import "./profile.css";

type ProfilePanel =
  | { kind: "edit"; field: "name" | "github" | "linkedin" }
  | { kind: "add"; tab: PortfolioTab }
  | { kind: "badge"; badge: MilestoneBadge }
  | { kind: "note"; note: NoteEntry }
  | { kind: "project"; project: ProjectEntry }
  | { kind: "share"; url: string };

function ProfileHeader({ profile, readOnly, onEdit, onAvatar, onShare }: {
  profile: StudentPortfolio; readOnly: boolean;
  onEdit: (field: "name" | "github" | "linkedin") => void; onAvatar: () => void; onShare: () => void;
}) {
  const { info } = profile;
  const pill = "liquid-secondary inline-flex min-h-9 items-center justify-center gap-2 px-3.5 py-1.5 text-[12.5px] font-medium";
  return (
    <header className="profile-intro squircle reveal overflow-hidden border border-hairline bg-chalk">
      <SunsetBanner />
      <div className="profile-hero-body">
        <div className="profile-avatar-wrap relative z-[1] h-24 w-24">
          <div className="profile-avatar-frame h-full w-full overflow-hidden rounded-[26px] border-4 border-white bg-canvas">
            <ExplorerAvatar key={profile.avatar} style={profile.avatar} className="profile-avatar-art h-full w-full" />
          </div>
          {!readOnly && <button
            type="button" onClick={onAvatar} aria-label="Change avatar style" title={`Current avatar: ${AVATARS[profile.avatar]}. Try the next style.`}
            className="profile-avatar-button liquid-secondary group absolute -right-1 -bottom-0.5 grid h-8 w-8 place-items-center"
          ><ProfileIcon name="palette" className="h-[17px] w-[17px] transition-transform duration-300 group-hover:rotate-12" /></button>}
        </div>
        <div className="profile-identity flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          <h1 className="min-w-0 font-display text-[36px] leading-[1.05] text-ink [overflow-wrap:anywhere] sm:text-[38px]">{info.name}</h1>
          <span className="profile-founding mono inline-flex items-center gap-1.5 rounded-full border border-cobalt/20 bg-cobalt/[0.06] px-2.5 py-1.5 text-[8px] leading-none text-cobalt sm:text-[9px]">
            <ProfileIcon name="seal" className="h-3.5 w-3.5" />Founding member
          </span>
        </div>
        <div className="profile-edit-action">
          {readOnly
            ? <button type="button" onClick={() => navigateApp("profile")} className={pill}>My Profile <ProfileIcon name="arrow" className="h-3.5 w-3.5 text-cobalt" /></button>
            : <button type="button" onClick={() => onEdit("name")} aria-haspopup="dialog" className={pill}><ProfileIcon name="edit" className="h-3.5 w-3.5 text-booster" />Edit Profile</button>}
        </div>
        <div className="profile-about min-w-0">
          <p className="text-[13px] leading-[1.65] text-graphite [overflow-wrap:anywhere] sm:text-[14px]">
            {degreeLabel(info.branch)} <span className="px-0.5 text-graphite/65">&bull;</span> {info.year} <span className="px-0.5 text-graphite/65">&bull;</span> {info.university}
          </p>
          <p className="mt-2 text-[13.5px] leading-[1.65] text-ink [overflow-wrap:anywhere] sm:text-[14px]">{info.bio}</p>
        </div>
        <div className="profile-socials flex min-w-0 flex-wrap items-center gap-2">
          {(["github", "linkedin"] as const).map((social) => {
            const label = social === "github" ? "GitHub" : "LinkedIn";
            const content = <><ProfileIcon name={social} className="h-3.5 w-3.5" />{label}<ProfileIcon name="external" className="h-2.5 w-2.5 text-graphite" /></>;
            return info[social]
              ? <a key={social} aria-label={`Visit ${info.name}'s ${label} profile`} href={info[social]} className={pill} target="_blank" rel="noopener noreferrer">{content}</a>
              : !readOnly && <button key={social} type="button" onClick={() => onEdit(social)} aria-haspopup="dialog" title={`Add your ${label} profile link`} className={pill}>{content}</button>;
          })}
          <button type="button" onClick={onShare} className={pill}><ProfileIcon name="share" className="h-3.5 w-3.5" />Share Profile</button>
        </div>
      </div>
    </header>
  );
}

function BadgeShelf({ onOpen }: { onOpen: (badge: MilestoneBadge) => void }) {
  const unlocked = BADGES.filter((badge) => badge.unlocked).length;
  return (
    <section aria-labelledby="profile-badges-title" className="profile-shelf squircle reveal border border-hairline bg-chalk p-4 sm:p-5" style={{ animationDelay: "60ms" }}>
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-x-2.5 gap-y-2">
        <h2 id="profile-badges-title" className="font-display text-[25px] leading-[1.12] text-ink sm:text-[28px]">Earned Badges &amp; Milestones</h2>
        <span className="liquid-chip mono inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[8.5px] leading-none text-graphite"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-booster" />{unlocked} of {BADGES.length} unlocked</span>
      </div>
      <div className="profile-badge-grid">
        {BADGES.map((badge) => (
          <button
            type="button" key={badge.id} onClick={() => onOpen(badge)} aria-label={`${badge.title}: ${badge.status}. View badge details`} aria-haspopup="dialog"
            className={cn("profile-badge-tile group relative isolate flex min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border px-2 pt-2 pb-3 text-center", `badge-${badge.id}`, badge.unlocked ? "is-earned" : "is-locked")}
          >
            {!badge.unlocked && <ProfileIcon name="lock" className="absolute top-2.5 right-2.5 h-3 w-3 text-graphite/65" />}
            <BadgeArt kind={badge.id} className="profile-badge-art h-[52px] w-[52px] shrink-0" />
            <span className="mt-1 flex min-h-[31px] max-w-[16ch] items-center justify-center text-[12.5px] leading-[1.28] font-semibold text-ink">{badge.title}</span>
            <span className={cn("profile-badge-status mono mt-1.5 inline-flex items-center justify-center gap-1 rounded-full px-2 py-[3px] text-[9px] leading-[1.3]", badge.unlocked ? "bg-chalk/70" : "border border-hairline bg-chalk/65 text-graphite")}>
              {badge.unlocked && <ProfileIcon name="check" className="h-2.5 w-2.5" />}{badge.status}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function MyProfileScreen({ store, hash }: { store: PortfolioStore; hash: string }) {
  const shared = useMemo(() => readSharedPortfolio(hash), [hash]);
  const [tab, setTab] = useState<PortfolioTab>("projects");
  const [panel, setPanel] = useState<ProfilePanel | null>(null);
  const [toast, setToast] = useState("");
  const timer = useRef<number | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function notify(message: string) {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setToast(message);
    timer.current = window.setTimeout(() => setToast(""), 3400);
  }

  if (shared === "invalid") return (
    <section className="squircle border border-hairline bg-chalk p-6 sm:p-9">
      <h1 className="font-display text-[34px] leading-tight">This profile link isn't readable.</h1>
      <p className="mt-2 text-sm text-graphite">Ask the student for a fresh link, or open your own profile.</p>
      <button type="button" onClick={() => navigateApp("profile")} className="liquid-secondary mt-5 min-h-10 px-4 text-[13px] font-semibold">Go to My Profile</button>
    </section>
  );

  const profile = shared ?? store.profile;
  const readOnly = !!shared;
  const close = () => setPanel(null);
  const saved = (message: string) => { close(); notify(message); };
  const share = async () => {
    const url = shareProfileUrl(profile);
    const copied = await copyText(url);
    if (!mounted.current) return;
    if (copied) notify("Profile link copied. Anyone with it can view this copy.");
    else setPanel({ kind: "share", url });
  };

  return (
    <div className="profile-page">
      <ProfileHeader
        profile={profile} readOnly={readOnly}
        onEdit={(field) => setPanel({ kind: "edit", field })}
        onAvatar={() => { store.cycleAvatar(); notify(`Avatar changed to ${AVATARS[(profile.avatar + 1) % AVATARS.length].toLowerCase()}.`); }}
        onShare={share}
      />
      {readOnly && <p className="text-[12px] text-graphite">You're viewing a shared copy of {profile.info.name}'s portfolio.</p>}
      <BadgeShelf onOpen={(badge) => setPanel({ kind: "badge", badge })} />
      <PortfolioSection profile={profile} readOnly={readOnly} tab={tab} onTab={setTab} onAdd={() => setPanel({ kind: "add", tab })} onNote={(note) => setPanel({ kind: "note", note })} onProject={(project) => setPanel({ kind: "project", project })} />
      {!readOnly && !store.storageAvailable && <p role="status" className="text-xs text-graphite">Browser storage is unavailable. Your changes will last for this visit only.</p>}

      {!readOnly && panel?.kind === "edit" && <EditProfileDialog info={profile.info} focusField={panel.field} onClose={close} onSave={(info) => { store.saveInfo(info); saved("Your profile has been updated."); }} />}
      {!readOnly && panel?.kind === "add" && <AddEntryDialog tab={panel.tab} store={store} onClose={close} onAdded={saved} />}
      {panel?.kind === "badge" && <BadgeDialog badge={panel.badge} onClose={close} />}
      {panel?.kind === "note" && <NoteDialog note={panel.note} author={profile.info.name} onClose={close} />}
      {panel?.kind === "project" && <ResourceDialog project={panel.project} readOnly={readOnly} onClose={close} onSave={(url) => {
        if (!readOnly) { store.saveRepository(panel.project.id, url); saved("GitHub repository linked."); }
      }} />}
      {panel?.kind === "share" && <ShareFallbackDialog url={panel.url} onClose={close} />}
      {createPortal(<div aria-live="polite" aria-atomic="true">
        {toast && <div key={toast} className="profile-toast liquid-float toast-in fixed bottom-24 left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] items-center gap-2 px-3.5 py-2.5 text-[13px] leading-[1.5] font-medium text-ink lg:bottom-6"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cobalt/[0.08] text-cobalt"><ProfileIcon name="check" className="h-3.5 w-3.5" /></span>{toast}</div>}
      </div>, document.body)}
    </div>
  );
}