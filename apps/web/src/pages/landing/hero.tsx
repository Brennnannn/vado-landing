import { ArrowDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Button } from "@vado/ui";
import { ContentBox } from "../../components/ui/layout/box";
import { PowerButton } from "../../components/ui/misc/power-button";
import { WorkflowDemo } from "./workflow-demo";

/**
 * Above-the-fold entrance: pure CSS via `@starting-style` (Tailwind's `starting:` variant), so
 * the hero paints on first frame instead of waiting on an IntersectionObserver like `FadeInUp`.
 */
const enter = "transition duration-700 ease-out starting:opacity-0 starting:translate-y-3 motion-reduce:transition-none";

/**
 * @description Hero renders the opening section: headline, subhead, the primary "Book a Process
 * Diagnostic" CTA with a "See how it works" link, and the `WorkflowDemo` board. Stacks
 * text → CTA → board on mobile (CTA full width, thumb-reachable); side-by-side from `lg` up,
 * where it also fills the first screen.
 *
 * @example
 * // Used as the first section inside Landing
 * <Hero />
 */
export function Hero() {
    return (
        <div className="relative isolate w-full lg:min-h-dvh flex items-center pt-24 md:pt-28 pb-10 lg:pb-0 overflow-hidden">
            <HeroGlow />
            <ContentBox className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
                <Grab />
                <div className={twMerge(enter, "delay-300 w-full max-w-xl mx-auto lg:mx-0 lg:justify-self-end")}>
                    <WorkflowDemo />
                </div>
            </ContentBox>
        </div>
    );
}

function Grab() {
    return (
        <div className="flex flex-col items-start text-left">
            <div className={twMerge(enter, "mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-trim bg-surface/70 px-3 py-1 text-xs font-medium tracking-wide text-text-muted")}>
                <span className="size-2 rounded-full bg-secondary ring-2 ring-secondary/40" />
                AI integration, measured in hours saved
            </div>
            <h1 className={twMerge(enter, "delay-75 text-text text-[2.5rem] sm:text-6xl xl:text-7xl font-semibold tracking-tight leading-[1.02] text-balance")}>
                AI that changes how your team{" "}
                <span className="relative whitespace-nowrap">
                    <span className="relative z-10">actually works.</span>
                    <span className="absolute inset-x-0 bottom-[0.08em] h-[0.3em] rounded-sm bg-secondary/90 dark:bg-secondary/30" />
                </span>
            </h1>
            <p className={twMerge(enter, "delay-150 mt-3 sm:mt-4 text-xl sm:text-3xl font-medium tracking-tight text-text-muted")}>
                Not another workshop.
            </p>
            <p className={twMerge(enter, "delay-200 mt-5 sm:mt-6 max-w-xl text-base sm:text-xl leading-relaxed text-text-muted text-pretty")}>
                We diagnose the process, train the department that runs it, and get paid based on the hours it actually saves you.
            </p>
            <div className={twMerge(enter, "delay-300 mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full")}>
                <a href="#book" className="block w-full sm:w-auto">
                    <PowerButton
                        className="w-full sm:w-auto"
                        Button={
                            <Button scheme="primary" className="w-full sm:w-auto px-7 py-4 text-base sm:text-lg shadow-xl">
                                Book a Process Diagnostic
                            </Button>
                        }
                    />
                </a>
                <a
                    href="#process"
                    className="group inline-flex items-center justify-center gap-2 py-2 font-medium text-text hover:text-primary-ink transition-colors"
                >
                    See how it works
                    <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
                </a>
            </div>
        </div>
    );
}

/** Soft brand-colored light behind the workflow board */
function HeroGlow() {
    return (
        <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]" aria-hidden>
            <div className="absolute right-[-10%] top-[10%] size-[26rem] sm:size-[42rem] rounded-full bg-primary/20 blur-3xl dark:bg-primary/15" />
            <div className="absolute right-[25%] bottom-[15%] size-[18rem] sm:size-[26rem] rounded-full bg-secondary/40 blur-3xl dark:bg-secondary/10" />
        </div>
    );
}
