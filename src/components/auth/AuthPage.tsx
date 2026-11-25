import { useEffect, useRef, useState, type FormEvent } from "react";
import { BrandMark, CheckSeal } from "@/components/Icons";
import { navigateHome, type AuthMode } from "@/utils/authNavigation";
import { navigateApp } from "@/utils/appRoute";
import { startSession } from "@/utils/session";
import { cn } from "@/utils/cn";

type Field = "name" | "branch" | "year" | "email" | "password";
type Errors = Partial<Record<Field, string>>;

const BRANCHES = ["CSE / Data Science", "ECE / Embedded", "Mechanical / Aero", "Other STEM"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-[19px] w-[19px] shrink-0" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.75 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.28 5.48-4.82 7.18l7.72 6C44.36 38.02 46.98 31.78 46.98 24.55Z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.88.93 7.54 2.56 10.78l7.97-6.19Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.72-6c-2.14 1.44-4.86 2.3-8.17 2.3-6.25 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48Z" />
    </svg>
  );
}

function Eye({ visible }: { visible: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path d="M2.3 12s3.5-5.8 9.7-5.8 9.7 5.8 9.7 5.8-3.5 5.8-9.7 5.8S2.3 12 2.3 12Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      {!visible && <path d="M4.1 20 19.9 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
    </svg>
  );
}

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("h-4 w-4", back && "rotate-180")} fill="none" aria-hidden="true">
      <path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SelectChevron() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="pointer-events-none absolute bottom-[19px] right-4 h-4 w-4 text-graphite" aria-hidden="true">
      <path d="m3.5 6 4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VisualPanel() {
  return (
    <aside className="sticky top-0 hidden h-svh p-4 lg:block lg:p-6" aria-label="Space mission visual">
      <div className="relative h-full overflow-hidden rounded-[28px] border border-hairline bg-ink">
        <img
          src="/images/auth-astronaut.jpg"
          alt="Astronaut portrait with warm amber light reflected in the helmet visor"
          className="auth-photo absolute inset-0 h-full w-full object-cover object-[45%_38%] saturate-[0.82]"
        />
        <div className="pointer-events-none absolute inset-0 bg-booster/10 mix-blend-color" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(20,21,24,0.55) 0%, rgba(20,21,24,0.06) 31%, rgba(20,21,24,0.14) 50%, rgba(20,21,24,0.96) 100%)" }}
          aria-hidden="true"
        />

        {/* Thin mission reticle, deliberately quieter than the portrait. */}
        <svg viewBox="0 0 640 900" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <path d="M28 32h24M28 32v24M612 32h-24M612 32v24M28 868h24M28 868v-24M612 868h-24M612 868v-24" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2" />
          <path d="M-84 356c140-212 469-219 650-33" stroke="rgba(255,255,255,0.16)" strokeWidth="1" strokeDasharray="7 9" />
          <path d="M595 348c-63-147-254-237-428-184" stroke="rgba(255,255,255,0.11)" strokeWidth="1" />
          <circle cx="544" cy="295" r="3" fill="#D94E1F" />
          <path d="M538 295h12m-6-6v12" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" />
          <path d="M28 105h120M28 110h40M494 772h118" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
        </svg>

        <div className="liquid-chip-dark absolute left-7 top-7 inline-flex items-center gap-2.5 px-4 py-2.5 xl:left-9 xl:top-9">
          <span className="live-dot h-[7px] w-[7px] rounded-full bg-booster" />
          <span className="mono text-[10px] text-white xl:text-[11px]">COSMOX // FLIGHT DECK ACCESS</span>
        </div>

        <div className="liquid-card-dark absolute bottom-7 left-7 right-7 p-6 text-white xl:bottom-9 xl:left-9 xl:right-9 xl:p-8">
          <p className="mono text-[10px] text-booster">BRANCH-TO-ORBIT SYSTEM</p>
          <h2 className="mt-3 max-w-[21ch] font-display text-[26px] leading-[1.13] text-white xl:text-[28px]">
            From B.Tech coursework to real aerospace builds.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {["04 Career Tracks", "ISRO & Startup Radar", "Hackathon Squads"].map((item) => (
              <span key={item} className="liquid-chip-dark mono inline-flex items-center px-3 py-1.5 text-[8px] text-white/95 xl:text-[9px]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AuthPage({ initialMode }: { initialMode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleNotice, setGoogleNotice] = useState("");
  const [recovering, setRecovering] = useState(false);
  const [recoveryNotice, setRecoveryNotice] = useState("");
  const pendingTimer = useRef<number | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setErrors({});
    setConfirmed(false);
    setRecovering(false);
  }, [initialMode]);

  useEffect(() => {
    const previous = document.title;
    document.title = "COSMOX // Flight Deck Access";
    return () => {
      document.title = previous;
      if (pendingTimer.current !== null) window.clearTimeout(pendingTimer.current);
    };
  }, []);

  function changeMode(next: AuthMode) {
    if (mode === next) return;
    if (pendingTimer.current !== null) window.clearTimeout(pendingTimer.current);
    setMode(next);
    setErrors({});
    setGoogleNotice("");
    setRecoveryNotice("");
    setRecovering(false);
    setConfirmed(false);
    setLoading(false);
    setGoogleBusy(false);
    window.history.replaceState(null, "", next === "signin" ? "#/auth" : "#/auth/create-account");
    window.dispatchEvent(new Event("cosmox:route"));
  }

  function validate(): Errors {
    const found: Errors = {};
    if (mode === "signup") {
      if (name.trim().length < 2) found.name = "Enter your full name.";
      if (!branch) found.branch = "Choose your branch.";
      if (!year) found.year = "Choose your year.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      found.email = "Enter a valid email address.";
    }
    if (password.length < 8) found.password = "Use at least 8 characters.";
    return found;
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      document.getElementById(`auth-${first}`)?.focus();
      return;
    }
    if (googleBusy || loading) return;
    setLoading(true);
    pendingTimer.current = window.setTimeout(() => {
      setLoading(false);
      startSession(mode === "signup" ? { name: name.trim(), branch, year } : {});
      navigateApp("home");
    }, 1050);
  }

  function continueWithGoogle() {
    if (googleBusy) return;
    setGoogleNotice("");
    setGoogleBusy(true);
    pendingTimer.current = window.setTimeout(() => {
      setGoogleBusy(false);
      setGoogleNotice("Google access is a preview. Use email to explore this flow; no account is connected.");
    }, 850);
  }

  function recoverAccess(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setErrors((prev) => ({ ...prev, email: "Enter your email address first." }));
      document.getElementById("auth-email")?.focus();
      return;
    }
    setRecoveryNotice(`Recovery preview ready for ${email.trim()}. No email was sent from this prototype.`);
  }

  return (
    <div className="auth-page grid min-h-svh bg-canvas text-ink lg:grid-cols-2">
      <section className="flex min-h-svh flex-col px-5 pb-6 pt-5 sm:px-10 sm:pt-8 xl:px-16">
        <div className="flex items-center justify-between gap-3">
          <a href="#top" onClick={(e) => { e.preventDefault(); navigateHome(); }} className="group flex shrink-0 items-center gap-2.5" aria-label="COSMOX home">
            <BrandMark className="h-9 w-9 shrink-0 transition-transform duration-500 group-hover:rotate-[8deg]" />
            <span className="flex flex-col leading-none">
              <span className="text-[17px] font-semibold tracking-[-0.04em]">COSMOX</span>
              <span className="mono mt-1 text-[8px] text-graphite">v1.0 // COHORT</span>
            </span>
          </a>
          <button type="button" onClick={navigateHome} className="liquid-secondary inline-flex h-10 items-center gap-2 px-4 text-[12px] font-medium sm:text-[13px]">
            <Arrow back />
            Back to Home
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[448px] flex-1 flex-col justify-center py-12 sm:py-14">
          <div className="auth-mode-switch liquid-chip relative grid h-[52px] grid-cols-2 items-center p-1" role="group" aria-label="Authentication mode">
            <span
              className="pointer-events-none absolute bottom-1 left-1 top-1 rounded-full border border-white/95 bg-white/90 shadow-[inset_0_1px_0_#fff,0_6px_16px_-8px_rgba(20,21,24,0.28)] transition-transform duration-500"
              style={{ width: "calc((100% - 8px) / 2)", transform: `translateX(${mode === "signup" ? "100%" : "0"})` }}
              aria-hidden="true"
            />
            {(["signin", "signup"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={mode === option}
                onClick={() => changeMode(option)}
                className={cn("relative z-10 h-11 text-[13px] font-semibold transition-colors duration-300 sm:text-[14px]", mode === option ? "text-ink" : "text-graphite hover:text-ink")}
              >
                {option === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div key={mode} className="auth-swap mt-10">
            <p className="mono flex items-center gap-2 text-[9px] text-graphite">
              <span className="h-[6px] w-[6px] rounded-full bg-booster" />
              {mode === "signin" ? "Flight Deck // Return Access" : "Flight Deck // New Cadet"}
            </p>
            <h1 className="mt-3 font-display text-[clamp(3.1rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.025em]">
              {mode === "signin" ? <>
                Welcome back to <em className="italic text-booster">orbit</em>.
              </> : <>
                Start your <em className="italic text-booster">mission</em> roadmap.
              </>}
            </h1>
            <p className="mt-3 text-[14px] leading-[1.65] text-graphite sm:text-[15px]">
              {mode === "signin" ? "Your next build window is ready." : "Your space-tech path begins with your branch."}
            </p>
          </div>

          {confirmed ? (
            <div className="auth-swap liquid-panel mt-9 p-6" role="status">
              <span className="liquid-chip inline-flex h-12 w-12 items-center justify-center text-cobalt"><CheckSeal className="h-6 w-6" /></span>
              <p className="mono mt-5 text-[9px] text-cobalt">Flight Clearance // Preview Complete</p>
              <h2 className="mt-2 font-display text-[34px] leading-[1.1] text-ink">
                {mode === "signin" ? "Welcome back to orbit." : "Your mission starts here."}
              </h2>
              <p className="mt-3 text-[13.5px] leading-[1.6] text-graphite">
                This authentication flow is a preview. No account was created and no credentials were sent.
              </p>
              <button type="button" onClick={navigateHome} className="liquid-primary mt-6 inline-flex h-12 items-center gap-2 px-6 text-[13px] font-semibold">
                Return to Home <Arrow />
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={continueWithGoogle}
                disabled={googleBusy || loading}
                className="auth-google liquid-secondary mt-8 inline-flex h-[54px] w-full items-center justify-center gap-3 text-[14px] font-semibold sm:text-[15px]"
              >
                {googleBusy ? <Spinner /> : <GoogleMark />}
                {googleBusy ? "CONNECTING TO GOOGLE..." : "Continue with Google"}
              </button>
              {googleNotice && <p className="mt-2.5 text-[12px] leading-[1.5] text-cobalt" role="status">{googleNotice}</p>}

              <div className="my-7 flex items-center gap-4">
                <span className="h-px flex-1 bg-hairline" />
                <span className="mono shrink-0 text-[11px] text-graphite">Or With Email</span>
                <span className="h-px flex-1 bg-hairline" />
              </div>

              <form onSubmit={recovering ? recoverAccess : submit} noValidate>
                {mode === "signup" && (
                  <>
                    <div>
                      <label htmlFor="auth-name" className="mb-2 block text-[12px] font-semibold text-ink">Full Name</label>
                      <input
                        id="auth-name"
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
                        autoComplete="name"
                        placeholder="Prashanth"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "auth-name-error" : undefined}
                        className="glass-input h-[52px] w-full px-4 text-[14px] text-ink outline-none placeholder:text-graphite/50"
                      />
                      {errors.name && <p id="auth-name-error" className="mt-1 text-[11px] text-booster">{errors.name}</p>}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="min-w-0">
                        <label htmlFor="auth-branch" className="mb-2 block text-[12px] font-semibold text-ink">Engineering Branch</label>
                        <div className="relative">
                          <select
                            id="auth-branch"
                            value={branch}
                            onChange={(e) => { setBranch(e.target.value); setErrors((prev) => ({ ...prev, branch: undefined })); }}
                            aria-invalid={!!errors.branch}
                            aria-describedby={errors.branch ? "auth-branch-error" : undefined}
                            className="glass-input h-[52px] w-full appearance-none px-3 pr-8 text-[11px] text-ink outline-none sm:px-4 sm:text-[12px]"
                          >
                            <option value="">Select branch</option>
                            {BRANCHES.map((item) => <option key={item} value={item}>{item}</option>)}
                          </select>
                          <SelectChevron />
                        </div>
                        {errors.branch && <p id="auth-branch-error" className="mt-1 text-[11px] text-booster">{errors.branch}</p>}
                      </div>
                      <div className="min-w-0">
                        <label htmlFor="auth-year" className="mb-2 block text-[12px] font-semibold text-ink">Current Year</label>
                        <div className="relative">
                          <select
                            id="auth-year"
                            value={year}
                            onChange={(e) => { setYear(e.target.value); setErrors((prev) => ({ ...prev, year: undefined })); }}
                            aria-invalid={!!errors.year}
                            aria-describedby={errors.year ? "auth-year-error" : undefined}
                            className="glass-input h-[52px] w-full appearance-none px-3 pr-8 text-[11px] text-ink outline-none sm:px-4 sm:text-[12px]"
                          >
                            <option value="">Select year</option>
                            {YEARS.map((item) => <option key={item} value={item}>{item}</option>)}
                          </select>
                          <SelectChevron />
                        </div>
                        {errors.year && <p id="auth-year-error" className="mt-1 text-[11px] text-booster">{errors.year}</p>}
                      </div>
                    </div>
                  </>
                )}

                <div className={mode === "signup" ? "mt-4" : undefined}>
                  <label htmlFor="auth-email" className="mb-2 block text-[12px] font-semibold text-ink">Email Address</label>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); setRecoveryNotice(""); }}
                    autoComplete="email"
                    inputMode="email"
                    placeholder="student@university.edu.in"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "auth-email-error" : undefined}
                    className="glass-input h-[52px] w-full px-4 text-[14px] text-ink outline-none placeholder:text-graphite/50"
                  />
                  {errors.email && <p id="auth-email-error" className="mt-1 text-[11px] text-booster">{errors.email}</p>}
                </div>

                {recovering ? (
                  <div className="auth-swap mt-4">
                    <p className="text-[12.5px] leading-[1.6] text-graphite">Enter your email above to preview a password reset request.</p>
                    <button type="submit" className="liquid-primary mt-4 inline-flex h-[50px] w-full items-center justify-center gap-2 text-[14px] font-semibold">Preview Reset Link <Arrow /></button>
                    {recoveryNotice && <p className="mt-3 text-[12px] leading-[1.5] text-cobalt" role="status">{recoveryNotice}</p>}
                    <button type="button" onClick={() => { setRecovering(false); setRecoveryNotice(""); }} className="mt-4 text-[12px] font-medium text-graphite underline underline-offset-4 hover:text-ink">Back to sign in</button>
                  </div>
                ) : (
                  <>
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label htmlFor="auth-password" className="text-[12px] font-semibold text-ink">Password</label>
                        {mode === "signin" && <button type="button" onClick={() => { setRecovering(true); setErrors({}); }} className="text-[12px] font-medium text-cobalt transition-colors hover:text-ink hover:underline hover:underline-offset-4">Forgot password?</button>}
                      </div>
                      <div className="relative">
                        <input
                          id="auth-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
                          autoComplete={mode === "signin" ? "current-password" : "new-password"}
                          placeholder="••••••••"
                          aria-invalid={!!errors.password}
                          aria-describedby={errors.password ? "auth-password-error" : undefined}
                          className="glass-input h-[52px] w-full px-4 pr-14 text-[14px] text-ink outline-none placeholder:text-graphite/40"
                        />
                        <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-2 top-[6px] flex h-10 w-10 items-center justify-center text-graphite transition-colors hover:bg-stone hover:text-ink">
                          <Eye visible={showPassword} />
                        </button>
                      </div>
                      {errors.password && <p id="auth-password-error" className="mt-1 text-[11px] text-booster">{errors.password}</p>}
                    </div>

                    <button type="submit" disabled={loading || googleBusy} className="liquid-primary mt-7 inline-flex h-[54px] w-full items-center justify-center gap-3 px-6 text-[14px] font-semibold sm:text-[15px]" aria-busy={loading}>
                      {loading ? <><Spinner /> AUTHENTICATING...</> : <>{mode === "signin" ? "Sign In to Cockpit" : "Launch Founding Profile"}<Arrow /></>}
                    </button>
                  </>
                )}
              </form>
            </>
          )}
          <p className="mono mt-7 text-center text-[8.5px] leading-[1.8] text-graphite/70">
            FLIGHT DECK ACCESS // PREVIEW MODE · NO CREDENTIALS TRANSMITTED
          </p>
        </div>

        <div className="mono flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-4 text-[8px] text-graphite">
          <span>COSMOX / STUDENT ACCESS SYSTEM</span>
          <span>HYDERABAD, INDIA · V1.0</span>
        </div>
      </section>
      <VisualPanel />
    </div>
  );
}