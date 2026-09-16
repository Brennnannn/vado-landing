import { ArrowRight, Check, X } from "lucide-react";
import { Card, Highlight } from "@vado/ui";
import { ContentBox, SectionHeading } from "../../components/ui/layout/box";
import { FadeInUp } from "../../components/ui/text/fade-in-up";

const usually = [
    "A consultant demos a tool",
    "Leaves a slide deck",
    "Disappears",
    "Three months later, nobody's using it",
];

const instead = [
    "Start with the people who run the process",
    "Train the department that has to change",
    "Monitor the effectiveness of the new process",
];

/**
 * @description Problem names the failure mode (workshop fatigue) in a few short beats, then a
 * two-column "what usually happens / what we do instead" contrast. Deliberately short - its
 * job is to earn attention for the process section that follows.
 */
export function Problem() {
    return (
        <ContentBox>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start">
                <SectionHeading eyebrow="The problem" title="Most AI consulting ends the day the workshop does.">
                    <p>
                        A consultant shows up, demos a tool, leaves a slide deck, and disappears. Three months later nobody's
                        using it - The tool wasn't the problem. We bring change management alongside our expertise.
                    </p>
                    <p className="mt-5 sm:mt-6 text-2xl sm:text-3xl font-semibold tracking-tight text-text leading-snug">
                        Adoption isn't a training problem. It's a <Highlight className="whitespace-nowrap">change problem.</Highlight>
                    </p>
                </SectionHeading>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FadeInUp delay={150}>
                        <Card className="h-full p-5 sm:p-6 bg-transparent shadow-none border border-trim">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted mb-4 sm:mb-5">
                                AI Consulting
                            </div>
                            <ol className="flex flex-col gap-3 sm:gap-4 text-pretty">
                                {usually.map((step, i) => (
                                    <li key={step} className="flex items-start gap-3 text-text-muted">
                                        {i === usually.length - 1 ? (
                                            <X className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                                        ) : (
                                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-text-muted/60" />
                                        )}
                                        <span className={i === usually.length - 1 ? "text-text" : ""}>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </Card>
                    </FadeInUp>
                    <FadeInUp delay={300}>
                        <Card className="h-full p-5 sm:p-6 bg-secondary text-ink shadow-lg">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60 mb-4 sm:mb-5">
                                The Vado Difference
                            </div>
                            <ol className="flex flex-col gap-3 sm:gap-4 text-pretty">
                                {instead.map((step) => (
                                    <li key={step} className="flex items-start gap-3 font-medium">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep" />
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </Card>
                    </FadeInUp>
                </div>
            </div>
        </ContentBox>
    );
}
