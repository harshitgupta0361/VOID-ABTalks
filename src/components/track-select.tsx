import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { TRACKS } from "@/lib/abtalks/data";

export function TrackSelect({
  value,
  onChange,
  label = "Track",
}: {
  value: string;
  onChange: (id: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = TRACKS.find((t) => t.id === value) ?? TRACKS[0]!;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="block" ref={rootRef}>
      <span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </span>

      <div className={`track-select${open ? " is-open" : ""}`}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="track-select-trigger"
        >
          <span className="track-select-value">{selected.label}</span>
          <ChevronDown className="track-select-chevron size-4" />
        </button>

        <div className="track-select-panel" role="listbox" aria-label={label}>
          <ul>
            {TRACKS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={t.id === value}
                  onClick={() => {
                    onChange(t.id);
                    setOpen(false);
                  }}
                  className={`track-option${t.id === value ? " is-selected" : ""}`}
                >
                  <span>
                    <span className="track-option-label">{t.label}</span>
                    <span className="track-option-blurb">{t.blurb}</span>
                  </span>
                  {t.id === value && <Check className="size-4 shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="track-help">
        Your track decides all 60 daily tasks — briefs, resources and difficulty are tailored to it.
        You can change it later from your profile.
      </p>
    </div>
  );
}
