import { useState } from "react";
import { Sparkles } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Logo } from "@vado/ui";

export function Footer() {
    return (
        <footer className="w-full bg-background border-t border-trim">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
                <Logo className="text-2xl text-text" iconClassName="text-primary" />
                <div className="flex flex-col sm:items-end gap-1 text-xs sm:text-sm text-text-muted">
                    <span>© {new Date().getFullYear()} VADO. All rights reserved.</span>
                    <BuiltByAi />
                </div>
            </div>
        </footer>
    );
}

/**
 * The "this site was built by AI" easter egg - a quiet line in the legal footer that opens a
 * one-sentence pitch on hover/focus/tap.
 */
function BuiltByAi() {
    const [open, setOpen] = useState(false);

    return (
        <span className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                onBlur={() => setOpen(false)}
                aria-expanded={open}
                className="group inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text cursor-pointer transition-colors"
            >
                <Sparkles className="h-3 w-3 text-primary-ink transition-transform group-hover:rotate-12" />
                This site was designed in under 8 hours by understanding the process, and the tool.
            </button>
            <span
                role="tooltip"
                className={twMerge(
                    "absolute bottom-full left-0 sm:left-auto sm:right-0 mb-3 w-72 rounded-lg border border-trim bg-surface p-3 text-xs leading-relaxed text-text shadow-lg transition-all duration-200",
                    open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-1",
                )}
            >
                The right tool, the right process, and the right people.
                No agency, no dev team, a fraction of the usual timeline. 
                What will you do?
            </span>
        </span>
    );
}
