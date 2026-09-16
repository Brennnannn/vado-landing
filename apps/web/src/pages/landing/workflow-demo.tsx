import { useEffect, useRef, useState } from "react";
import { Check, Sparkles, UserRound } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Card } from "@vado/ui";
import { prefersReducedMotion } from "@/util/use-in-view";

type Step = {
    label: string;
    before: number;
    after: number;
    /** Judgment work that stays with the team */
    kept?: boolean;
};

type Workflow = {
    team: string;
    process: string;
    steps: Step[];
};

// Illustrative numbers (hours per week), not client results
const workflows: Workflow[] = [
    {
        team: "Finance",
        process: "Month-end reconciliation",
        steps: [
            { label: "Pull bank & ledger exports", before: 3, after: 0.2 },
            { label: "Match transactions", before: 6.5, after: 0.5 },
            { label: "Chase missing receipts", before: 2.5, after: 0.5 },
            { label: "Review exceptions", before: 2, after: 2, kept: true },
            { label: "Sign off", before: 1, after: 1, kept: true },
        ],
    },
    {
        team: "Operations",
        process: "Weekly shift scheduling",
        steps: [
            { label: "Collect availability", before: 2.5, after: 0.3 },
            { label: "Build draft schedule", before: 4, after: 0.5 },
            { label: "Resolve conflicts", before: 2, after: 1, kept: true },
            { label: "Notify staff", before: 1.5, after: 0.1 },
            { label: "Approve & publish", before: 1, after: 1, kept: true },
        ],
    },
    {
        team: "Customer support",
        process: "Inbound ticket triage",
        steps: [
            { label: "Read & tag tickets", before: 5, after: 0.5 },
            { label: "Route to the right owner", before: 2, after: 0.2 },
            { label: "Draft first replies", before: 6, after: 1.5 },
            { label: "Handle escalations", before: 3, after: 3, kept: true },
        ],
    },
];

type Phase = "before" | "scanning" | "after";

const BEFORE_MS = 2200;
const SCAN_MS = 1800;
const AFTER_MS = 4200;

const total = (steps: Step[], key: "before" | "after") => steps.reduce((sum, s) => sum + s[key], 0);

/**
 * @description WorkflowDemo is the hero graphic: a team's process shown as steps with the hours
 * each one costs per week. A scan passes over the board, the repetitive steps shrink, the
 * judgment steps stay with the team, and the total counts down to the hours won back - then it
 * moves to the next department. Runs on its own timer (no scroll dependency), pauses on hover,
 * and the dots let visitors pick a department. Reduced motion shows the finished state.
 *
 * @example
 * <WorkflowDemo className="max-w-xl" />
 */
export function WorkflowDemo({ className }: { className?: string }) {
    const reducedMotion = useRef(prefersReducedMotion()).current;
    const [index, setIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>(reducedMotion ? "after" : "before");
    const [paused, setPaused] = useState(false);

    const workflow = workflows[index]!;
    const max = Math.max(...workflow.steps.map((s) => s.before));
    const beforeTotal = total(workflow.steps, "before");
    const afterTotal = total(workflow.steps, "after");
    const shown = useTween(phase === "after" ? afterTotal : beforeTotal, phase === "after" ? 900 : 0);

    // before → scanning → after → next workflow
    useEffect(() => {
        if (reducedMotion || paused) return;
        const next: Record<Phase, [Phase, number]> = {
            before: ["scanning", BEFORE_MS],
            scanning: ["after", SCAN_MS],
            after: ["before", AFTER_MS],
        };
        const [nextPhase, delay] = next[phase];
        const timeout = setTimeout(() => {
            if (phase === "after") setIndex((i) => (i + 1) % workflows.length);
            setPhase(nextPhase);
        }, delay);
        return () => clearTimeout(timeout);
    }, [phase, paused, reducedMotion]);

    const select = (i: number) => {
        setIndex(i);
        setPhase(reducedMotion ? "after" : "before");
    };

    const resolved = phase !== "before";

    return (
        <div
            className={twMerge("relative w-full", className)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="relative">
                {/* Stacked cards behind hint at "more departments" */}
                <div className="absolute inset-x-4 sm:inset-x-6 -bottom-2 sm:-bottom-3 top-3 rounded-2xl border border-trim bg-surface/60" aria-hidden />
                <div className="absolute inset-x-2 sm:inset-x-3 -bottom-1 sm:-bottom-1.5 top-1.5 rounded-2xl border border-trim bg-surface/80" aria-hidden />

                <Card className="relative overflow-hidden rounded-2xl border border-trim bg-background shadow-xl sm:shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 border-b border-trim px-4 py-3.5 sm:px-6 sm:py-4">
                        <div key={index} className="min-w-0 animate-[fade-in_400ms_ease-out]">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{workflow.team}</div>
                            <div className="text-base sm:text-lg font-semibold leading-snug text-text text-balance">{workflow.process}</div>
                        </div>
                        <div
                            className={twMerge(
                                "shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-500",
                                resolved ? "bg-primary text-ink" : "bg-surface text-text-muted",
                            )}
                        >
                            {resolved ? "With VADO" : "Today"}
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="relative px-4 py-2 sm:px-6 sm:py-3">
                        {phase === "scanning" && (
                            <div
                                className="pointer-events-none absolute inset-x-0 top-0 h-16 -translate-y-full bg-gradient-to-b from-transparent via-primary/25 to-primary/60 animate-[scan_var(--scan)_ease-in-out_forwards]"
                                style={{ "--scan": `${SCAN_MS}ms` } as React.CSSProperties}
                                aria-hidden
                            />
                        )}
                        <div className="mb-2 flex justify-end text-[11px] uppercase tracking-[0.16em] text-text-muted">hrs / week</div>
                        <ul key={index} className="flex flex-col">
                            {workflow.steps.map((step, i) => (
                                <StepRow
                                    key={step.label}
                                    step={step}
                                    max={max}
                                    resolved={resolved}
                                    // Rows resolve as the scan passes over them
                                    delay={phase === "scanning" ? (SCAN_MS / workflow.steps.length) * (i + 0.5) : 0}
                                    enterDelay={i * 70}
                                />
                            ))}
                        </ul>
                    </div>

                    {/* Totals */}
                    <div className="flex items-center justify-between gap-3 border-t border-trim bg-surface/60 px-4 py-3.5 sm:px-6 sm:py-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs sm:text-sm text-text-muted">Team time</span>
                            <span className="text-2xl font-semibold tabular-nums text-text">{shown.toFixed(1)}</span>
                            <span className="text-sm text-text-muted">hrs</span>
                        </div>
                        <div
                            className={twMerge(
                                "shrink-0 rounded-full bg-secondary px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-ink tabular-nums transition-all duration-500",
                                phase === "after" ? "opacity-100 scale-100" : "opacity-0 scale-90",
                            )}
                        >
                            {(beforeTotal - afterTotal).toFixed(1)} hrs<span className="hidden min-[400px]:inline">/week</span> back
                        </div>
                    </div>
                </Card>
            </div>

            {/* Department picker + disclaimer */}
            <div className="relative mt-6 flex items-center justify-between gap-4">
                <div className="flex gap-3" role="tablist" aria-label="Example departments">
                    {workflows.map((w, i) => (
                        <button
                            key={w.team}
                            type="button"
                            role="tab"
                            aria-selected={i === index}
                            aria-label={w.team}
                            onClick={() => select(i)}
                            className={twMerge(
                                // after: pseudo-element extends the 8px dot to a ~44px touch target
                                "relative h-2 rounded-full transition-all duration-300 cursor-pointer after:absolute after:-inset-x-1.5 after:-inset-y-[1.125rem] after:content-['']",
                                i === index ? "w-8 bg-primary" : "w-2 bg-trim hover:bg-text-muted",
                            )}
                        />
                    ))}
                </div>
                <span className="text-xs text-text-muted">Illustrative example</span>
            </div>
        </div>
    );
}

type StepRowProps = {
    step: Step;
    max: number;
    resolved: boolean;
    delay: number;
    enterDelay: number;
};

function StepRow({ step, max, resolved, delay, enterDelay }: StepRowProps) {
    const hours = resolved ? step.after : step.before;
    const automated = resolved && !step.kept;
    const kept = resolved && step.kept;
    const transition = { transitionDelay: `${delay}ms` };

    return (
        <li
            className="grid grid-cols-[1.25rem_1fr_auto] items-center gap-x-3 gap-y-1.5 border-b border-trim/70 py-2.5 last:border-b-0 animate-[fade-in_500ms_ease-out_both]"
            style={{ animationDelay: `${enterDelay}ms` }}
        >
            <span className="relative flex h-5 w-5 items-center justify-center">
                <span
                    className={twMerge("absolute inset-0 rounded-full border border-trim transition-opacity duration-300", resolved && "opacity-0")}
                    style={transition}
                />
                <Sparkles
                    className={twMerge("absolute h-4 w-4 text-primary-ink transition-all duration-300", automated ? "opacity-100 scale-100" : "opacity-0 scale-50")}
                    style={transition}
                />
                <UserRound
                    className={twMerge("absolute h-4 w-4 text-primary-deep dark:text-secondary transition-all duration-300", kept ? "opacity-100 scale-100" : "opacity-0 scale-50")}
                    style={transition}
                />
            </span>

            <span className="flex min-w-0 items-center gap-2">
                <span className={twMerge("truncate text-sm sm:text-[15px] transition-colors duration-300", automated ? "text-text-muted" : "text-text")} style={transition}>
                    {step.label}
                </span>
                {kept && (
                    <span className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink animate-[fade-in_300ms_ease-out_both]" style={{ animationDelay: `${delay}ms` }}>
                        <Check className="h-3 w-3" /> Your team
                    </span>
                )}
            </span>

            <span className="w-10 text-right text-sm font-medium tabular-nums text-text">{hours.toFixed(1)}</span>

            {/* bar spans under label + value */}
            <span className="col-start-2 col-span-2 h-1.5 overflow-hidden rounded-full bg-surface">
                <span
                    className={twMerge(
                        "block h-full rounded-full transition-all duration-700 ease-out",
                        automated ? "bg-primary" : kept ? "bg-secondary" : "bg-text-muted/35",
                    )}
                    style={{ width: `${Math.max(3, (hours / max) * 100)}%`, ...transition }}
                />
            </span>
        </li>
    );
}

/** Tweens a displayed number toward `target` over `duration` ms (0 = jump) */
function useTween(target: number, duration: number) {
    const [value, setValue] = useState(target);
    const fromRef = useRef(target);

    useEffect(() => {
        const from = fromRef.current;
        if (duration === 0 || from === target) {
            fromRef.current = target;
            setValue(target);
            return;
        }
        const start = performance.now();
        let frame = 0;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const next = from + (target - from) * eased;
            fromRef.current = next;
            setValue(next);
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, duration]);

    return value;
}
