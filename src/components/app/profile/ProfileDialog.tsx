import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ProfileIcon } from "./ProfileIcon";

interface DialogProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  focusField?: string;
  compact?: boolean;
  onClose: () => void;
}

export function ProfileDialog({ title, description, children, footer, focusField, compact, onClose }: DialogProps) {
  const id = useId();
  const panel = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    if (focusField) element.querySelector<HTMLElement>(`[name="${focusField}"]`)?.focus();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [focusField]);

  return createPortal(
    <dialog
      ref={panel}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      className={`profile-dialog liquid-modal${compact ? " profile-dialog-compact" : ""}`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
    >
      <div className="profile-dialog-inner">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-hairline px-5 py-5 sm:px-7">
          <div className="min-w-0">
            <h2 id={`${id}-title`} className="font-display text-[30px] leading-[1.1] text-ink [overflow-wrap:anywhere] sm:text-[34px]">{title}</h2>
            {description && <p id={`${id}-description`} className="mt-2 text-[13px] leading-[1.6] text-graphite">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="liquid-secondary grid h-10 w-10 shrink-0 place-items-center" aria-label="Close dialog"><ProfileIcon name="close" /></button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">{children}</div>
        {footer && <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2.5 border-t border-hairline bg-canvas/65 px-5 py-3.5 sm:px-7">{footer}</footer>}
      </div>
    </dialog>,
    document.body,
  );
}