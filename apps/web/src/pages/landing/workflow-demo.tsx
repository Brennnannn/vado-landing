import { useEffect, useRef, useState } from "react";
import { Check, Sparkles, UserRound } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Card } from "@vado/ui";
import { prefersReducedMotion } from "@/util/use-in-view";

import { hoursBack, stepHours, teamTime, workflows, type Step } from "./workflow-data";

type Phase = "before" | "scanning" | "after";

const BEFORE_MS = 2200;
const SCAN_MS = 1800;
const AFTER_MS = 4200;

/**
 * @description WorkflowDemo is the hero graphic: a team's process shown as steps with the hours
 * each one costs per week. A scan passes over the board, the repetitive steps shrink, the
 * judgment steps stay with the team, and the total steps down to the hours won back - then it
 * moves to the next department. Rows and totals both derive from `resolvedCount` (how many rows
 * the scan has passed), so team time always equals the column on screen; the numbers themselves
 * are checked by `scripts/check-workflow-math.mjs`. Runs on its own timer (no scroll dependency), pauses on hover,
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
    const rowCount = workflow.steps.length;
    const [resolvedCount, setResolvedCount] = useState(reducedMotion ? rowCount : 0);
    // True only while the scan resolves one row at a time. Resets and department switches clear it,
    // so rows and Team time jump to the new values together instead of animating out of step.
    const [counting, setCounting] = useState(false);
    const max = Math.max(...workflow.steps.map((s) => s.before));
    // Count each change down in the gap before the scan reaches the next row; otherwise jump (0)
    const countMs = counting && !reducedMotion ? Math.round((SCAN_MS / rowCount) * 0.85) : 0;
    const shownTeamTime = useCountTo(teamTime(workflow.steps, resolvedCount), countMs);

    // before -> scanning -> after -> next workflow. Hover pauses the holds, not a scan in progress.
    useEffect(() => {
        if (reducedMotion) return;

        if (phase === "scanning") {
            // Each row resolves as the beam passes its midpoint; totals follow from resolvedCount
            const step = SCAN_MS / rowCount;
            const timers = workflow.steps.map((_, i) => setTimeout(() => {
                setCounting(true);
                setResolvedCount(i + 1);
            }, step * (i + 0.5)));
            timers.push(setTimeout(() => setPhase("after"), SCAN_MS));
            return () => timers.forEach(clearTimeout);
        }

        if (paused) return;
        const timeout = setTimeout(() => {
            if (phase === "before") {
                setPhase("scanning");
            } else {
                setIndex((i) => (i + 1) % workflows.length);
                setCounting(false);
                setResolvedCount(0);
                setPhase("before");
            }
        }, phase === "before" ? BEFORE_MS : AFTER_MS);
        return () => clearTimeout(timeout);
    }, [phase, paused, reducedMotion, rowCount, workflow]);

    const select = (i: number) => {
        setIndex(i);
        setCounting(false);
        setResolvedCount(reducedMotion ? workflows[i]!.steps.length : 0);
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
                            {resolved ? "With Vado" : "Today"}
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
                                    resolved={i < resolvedCount}
                                    countMs={countMs}
                                    enterDelay={i * 70}
                                />
                            ))}
                        </ul>
                    </div>

                    {/* Totals */}
                    <div className="flex items-center justify-between gap-3 border-t border-trim bg-surface/60 px-4 py-3.5 sm:px-6 sm:py-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs sm:text-sm text-text-muted">Team time</span>
                            <span className="text-2xl font-semibold tabular-nums text-text">{shownTeamTime.toFixed(1)}</span>
                            <span className="text-sm text-text-muted">hrs</span>
                        </div>
                        <div
                            className={twMerge(
                                "shrink-0 rounded-full bg-secondary px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-ink tabular-nums transition-all duration-500",
                                phase === "after" ? "opacity-100 scale-100" : "opacity-0 scale-90",
                            )}
                        >
                            {hoursBack(workflow.steps).toFixed(1)} hrs<span className="hidden min-[400px]:inline">/week</span> back
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
            </div>
        </div>
    );
}

type StepRowProps = {
    step: Step;
    max: number;
    resolved: boolean;
    countMs: number;
    enterDelay: number;
};

function StepRow({ step, max, resolved, countMs, enterDelay }: StepRowProps) {
    const hours = stepHours(step, resolved);
    const shownHours = useCountTo(hours, countMs);
    const automated = resolved && !step.kept;
    const kept = resolved && step.kept;

    return (
        <li
            className="grid grid-cols-[1.25rem_1fr_auto] items-center gap-x-3 gap-y-1.5 border-b border-trim/70 py-2.5 last:border-b-0 animate-[fade-in_500ms_ease-out_both]"
            style={{ animationDelay: `${enterDelay}ms` }}
        >
            <span className="relative flex h-5 w-5 items-center justify-center">
                <span
                    className={twMerge("absolute inset-0 rounded-full border border-trim transition-opacity duration-300", resolved && "opacity-0")}
                />
                <Sparkles
                    className={twMerge("absolute h-4 w-4 text-primary-ink transition-all duration-300", automated ? "opacity-100 scale-100" : "opacity-0 scale-50")}
                />
                <UserRound
                    className={twMerge("absolute h-4 w-4 text-primary-deep dark:text-secondary transition-all duration-300", kept ? "opacity-100 scale-100" : "opacity-0 scale-50")}
                />
            </span>

            <span className="flex min-w-0 items-center gap-2">
                <span className={twMerge("truncate text-sm sm:text-[15px] transition-colors duration-300", automated ? "text-text-muted" : "text-text")}>
                    {step.label}
                </span>
                {kept && (
                    <span className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink animate-[fade-in_300ms_ease-out_both]">
                        <Check className="h-3 w-3" /> Your team
                    </span>
                )}
            </span>

            <span className="w-10 text-right text-sm font-medium tabular-nums text-text">{shownHours.toFixed(1)}</span>

            {/* bar spans under label + value */}
            <span className="col-start-2 col-span-2 h-1.5 overflow-hidden rounded-full bg-surface">
                <span
                    className={twMerge(
                        "block h-full rounded-full transition-all duration-700 ease-out",
                        automated ? "bg-primary" : kept ? "bg-secondary" : "bg-text-muted/35",
                    )}
                    style={{ width: `${Math.max(3, (hours / max) * 100)}%` }}
                />
            </span>
        </li>
    );
}

/**
 * Counts a displayed hours value to `target` over `duration` ms (0 = jump), in whole tenths.
 * The row that's resolving and Team time both count through this with the same duration, and
 * each starts on the first animation frame's timestamp - so on any frame both have moved by
 * exactly round(change x progress) tenths, and Team time still equals the column on screen.
 */
function useCountTo(target: number, duration: number) {
    const [tenths, setTenths] = useState(() => Math.round(target * 10));
    const currentRef = useRef(tenths);

    useEffect(() => {
        const from = currentRef.current;
        const to = Math.round(target * 10);
        if (duration === 0 || from === to) {
            currentRef.current = to;
            setTenths(to);
            return;
        }
        let start: number | null = null;
        let frame = 0;
        const tick = (now: number) => {
            start ??= now;
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const next = from + Math.round((to - from) * eased);
            currentRef.current = next;
            setTenths(next);
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, duration]);

    // Jumps show the target in the same render. Waiting for the effect would leave one frame where
    // this number is stale while the other already moved (e.g. new department rows, old Team time).
    return duration === 0 ? Math.round(target * 10) / 10 : tenths / 10;
}
