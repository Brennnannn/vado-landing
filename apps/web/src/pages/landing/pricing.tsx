import { Lock, TrendingUp } from "lucide-react";
import { Card, Highlight } from "@vado/ui";
import { ContentBox, SectionHeading } from "../../components/ui/layout/box";
import { FadeInUp } from "../../components/ui/text/fade-in-up";
import { useInView } from "@/util/use-in-view";

/**
 * @description Pricing explains the outcome-based model as two parts - a fixed base fee and a
 * shared-upside performance curve - rather than a fake tier table. Copy makes the implication
 * explicit: we're confident enough in the process to be paid on it.
 */
export function Pricing() {
    return (
        <ContentBox>
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 sm:gap-12 lg:gap-16 items-center">
                <SectionHeading eyebrow="The pricing model" title="We get paid when you actually save something.">
                    <p>
                        A base engagement fee covers the diagnostic and training. Beyond that, we're paid on a curve tied to
                        measured efficiency gains - man-hours saved, priced at what those hours actually cost you.
                    </p>
                    <p className="mt-4">
                        <Highlight className="text-text font-medium">If it doesn't move the number, we don't get the upside. </Highlight>
                    </p>
                </SectionHeading>

                <div className="grid grid-cols-1 sm:grid-cols-[0.8fr_1.2fr] gap-3 sm:gap-4">
                    <FadeInUp delay={100} className="h-full">
                        <Card className="flex h-full flex-col gap-3 sm:gap-4 p-5 sm:p-7 bg-secondary text-ink shadow-lg">
                            <div className="flex items-center sm:items-start sm:flex-col gap-3 sm:gap-4">
                                <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-ink/5 border border-ink/10">
                                    <Lock className="size-5 sm:size-6 stroke-[1.5] text-primary-deep" />
                                </div>
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Part one</div>
                            </div>
                            <h3 className="text-2xl font-semibold tracking-tight">Base fee</h3>
                            <p className="text-ink/75 leading-relaxed">
                                Fixed and small. Covers the diagnostic and the training class.
                            </p>
                            <div className="mt-auto pt-3 sm:pt-4 border-t border-ink/10 text-sm text-ink/70">Your downside, capped.</div>
                        </Card>
                    </FadeInUp>
                    <FadeInUp delay={250} className="h-full">
                        <Card className="flex h-full flex-col gap-3 sm:gap-4 p-5 sm:p-7 border border-trim shadow-none">
                            <div className="flex items-center sm:items-start sm:flex-col gap-3 sm:gap-4">
                                <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-background border border-trim">
                                    <TrendingUp className="size-5 sm:size-6 stroke-[1.5] text-primary-ink" />
                                </div>
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Part two</div>
                            </div>
                            <h3 className="text-2xl font-semibold tracking-tight text-text">Performance curve</h3>
                            <PerformanceCurve />
                            <p className="text-sm text-text-muted leading-relaxed">
                                Not 1-to-1 - calibrated to be fair to both sides.
                            </p>
                        </Card>
                    </FadeInUp>
                </div>
            </div>
        </ContentBox>
    );
}

/** Unlabeled axes, a flat base band, and a rising curve - conveys "shared upside" without the math */
function PerformanceCurve() {
    const { ref, inView } = useInView<SVGSVGElement>({ threshold: 0.5 });
    const curve = "M 24 150 C 90 148, 120 120, 160 88 S 240 30, 296 22";

    return (
        <svg ref={ref} viewBox="0 0 320 180" className="w-full h-auto max-h-48 sm:max-h-none" role="img" aria-label="A fixed base fee with an upward curve of shared savings on top">
            <defs>
                <linearGradient id="upside-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* axes */}
            <path d="M 24 12 V 168 H 308" fill="none" stroke="var(--color-trim)" strokeWidth="2" strokeLinecap="round" />

            {/* base fee band */}
            <rect x="26" y="150" width="280" height="16" rx="3" fill="var(--color-secondary)" />

            {/* shared upside */}
            <path
                d={`${curve} L 296 150 L 24 150 Z`}
                fill="url(#upside-fill)"
                style={{ opacity: inView ? 1 : 0, transition: "opacity 1.2s ease-out 0.6s" }}
            />
            <path
                d={curve}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="4"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="1"
                className={inView ? "animate-draw" : ""}
            />
            <circle
                cx="296"
                cy="22"
                r="6"
                fill="var(--color-primary)"
                style={{ opacity: inView ? 1 : 0, transition: "opacity 0.4s ease-out 1.6s" }}
            />
        </svg>
    );
}
