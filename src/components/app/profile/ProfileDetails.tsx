import { useRef, useState, type FormEvent } from "react";
import routeSource from "@/utils/appRoute.ts?raw";
import { MAP_SOURCE, type MilestoneBadge, type NoteEntry, type ProjectEntry } from "@/data/profile";
import { copyText, publicLink } from "@/utils/profileStorage";
import { BadgeArt } from "./ProfileArt";
import { TextField } from "./ProfileEditors";
import { ProfileDialog } from "./ProfileDialog";
import { ProfileIcon } from "./ProfileIcon";

export function BadgeDialog({ badge, onClose }: { badge: MilestoneBadge; onClose: () => void }) {
  return (
    <ProfileDialog title={badge.title} compact onClose={onClose} footer={<button type="button" className="liquid-secondary min-h-10 px-5 text-[13px] font-semibold" onClick={onClose}>Got it</button>}>
      <div className={`profile-badge-stage badge-${badge.id} ${badge.unlocked ? "is-earned" : "is-locked"} flex flex-col items-center justify-center rounded-[20px] border border-hairline py-4`}>
        <BadgeArt kind={badge.id} className="h-[88px] w-[88px]" />
        <span className="liquid-chip mono mt-2 inline-flex items-center gap-1.5 px-3 py-1 text-[9px] text-ink"><ProfileIcon name={badge.unlocked ? "check" : "lock"} className="h-3.5 w-3.5" />{badge.status}</span>
      </div>
      <h3 className="mt-5 text-[15px] font-semibold">{badge.unlocked ? "How you earned it" : "Your progress"}</h3>
      <p className="mt-1.5 text-[14px] leading-[1.7] text-graphite">{badge.description}</p>
      {!badge.unlocked && <div role="progressbar" aria-label="Badge progress" aria-valuenow={badge.progress} aria-valuemin={0} aria-valuemax={100} className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone"><div className="h-full rounded-full bg-booster" style={{ width: `${badge.progress}%` }} /></div>}
      <div className="mt-4 rounded-2xl bg-canvas px-4 py-3.5 text-[13.5px] leading-[1.65] text-ink">
        <h3 className="mb-1 font-semibold">{badge.unlocked ? "Keep it going" : "How to earn it"}</h3>
        <p>{badge.nextStep}</p>
      </div>
    </ProfileDialog>
  );
}

export function NoteDialog({ note, author, onClose }: { note: NoteEntry; author: string; onClose: () => void }) {
  return (
    <ProfileDialog title={note.title} onClose={onClose} footer={<button type="button" onClick={onClose} className="liquid-secondary min-h-10 px-5 text-[13px] font-semibold">Close note</button>}>
      <div className="mb-4 flex flex-wrap items-center gap-2.5 text-[13px] text-graphite"><span className="font-medium text-ink">By {author}</span><span className="liquid-chip mono px-2.5 py-1 text-[9px]">{note.minutes} min read</span></div>
      <div className="space-y-4 text-[15px] leading-[1.75] text-ink [overflow-wrap:anywhere]">{note.paragraphs.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}</div>
    </ProfileDialog>
  );
}

export function ResourceDialog({ project, readOnly, onSave, onClose }: {
  project: ProjectEntry; readOnly: boolean; onSave: (url: string) => void; onClose: () => void;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const code = project.cover === "hub" ? routeSource : project.cover === "map" ? MAP_SOURCE : null;

  function saveLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = publicLink(url, "repository");
    if (!value) { setError("Paste a repository link like https://github.com/name/project."); return; }
    onSave(value);
  }

  async function copyCode() {
    if (!code) return;
    const ok = await copyText(code);
    setCopied(ok);
    setCopyFailed(!ok);
    if (!ok && codeRef.current) {
      const range = document.createRange();
      range.selectNodeContents(codeRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  return (
    <ProfileDialog title={code ? "Project code" : "Project details"} description={project.title} onClose={onClose} footer={<button type="button" onClick={onClose} className="liquid-secondary min-h-10 px-5 text-[13px] font-semibold">Close</button>}>
      <p className="mono text-[10px] text-cobalt">{project.category}</p>
      <p className="mt-2 text-sm leading-[1.7] text-graphite [overflow-wrap:anywhere]">{project.summary}</p>
      {code && <>
        <p className="mt-4 text-[13px] leading-[1.6] text-ink">{project.cover === "hub" ? "No repository is linked yet. Here's the page navigation file from the live demo." : "This starter script reads two matching satellite image bands and creates a water map. It needs Python, NumPy and Rasterio."}</p>
        <div className="mt-3 overflow-hidden rounded-2xl border border-hairline">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-stone px-3.5 py-2"><span className="font-mono text-[11px] text-ink">{project.cover === "hub" ? "appRoute.ts" : "water_index.py"}</span><button type="button" onClick={copyCode} className="liquid-secondary inline-flex min-h-8 items-center gap-1.5 px-3 text-xs font-medium"><ProfileIcon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />{copied ? "Copied" : "Copy code"}</button></div>
          <pre tabIndex={0} className="max-h-[32dvh] min-h-28 overflow-auto bg-ink p-4 text-[11.5px] leading-relaxed text-canvas"><code ref={codeRef}>{code}</code></pre>
        </div>
        {copyFailed && <p role="status" className="mt-2 text-xs text-graphite">The code is selected. Use your device's Copy command.</p>}
      </>}
      {!readOnly && <form onSubmit={saveLink} noValidate className="mt-5 space-y-2.5 border-t border-hairline pt-4">
        <TextField name="codeUrl" label="Link a GitHub repository" value={url} change={(v) => { setUrl(v); setError(""); }} max={500} placeholder="https://github.com/name/project" error={error} />
        <button type="submit" className="liquid-secondary inline-flex min-h-9 items-center gap-2 px-3.5 text-[12px] font-semibold"><ProfileIcon name="link" className="h-3.5 w-3.5" />Save link</button>
      </form>}
    </ProfileDialog>
  );
}

export function ShareFallbackDialog({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <ProfileDialog title="Share profile" description="Your browser couldn't copy the link. Select it below and use your device's Copy command." focusField="shareUrl" onClose={onClose} footer={<button type="button" onClick={onClose} className="liquid-secondary min-h-10 px-5 text-[13px] font-semibold">Done</button>}>
      <label className="block text-[13px] font-semibold">Read-only portfolio link<input name="shareUrl" readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="glass-input mt-2 block h-11 w-full px-3.5 text-[13px] font-normal" /></label>
      <p className="mt-3 text-xs leading-relaxed text-graphite">The link includes a copy of your current portfolio. Share a new link after making changes.</p>
    </ProfileDialog>
  );
}