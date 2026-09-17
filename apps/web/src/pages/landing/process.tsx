import { RefreshCw, ScanSearch, UsersRound } from "lucide-react";
import { Card } from "@vado/ui";
import { ContentBox, SectionHeading } from "../../components/ui/layout/box";
import { FadeInUp } from "../../components/ui/text/fade-in-up";

type PhaseData = {
    number: string;
    name: string;
    tagline: string;
    body: React.ReactNode;
    icon: React.ReactNode;
    caption?: string;
    detail: string[];
};

const phases: PhaseData[] = [
    {
        number: "01",
        name: "Diagnose",
        tagline: "Listening before speaking.",
        icon: <ScanSearch />,
        body: (
            <>
                We will sit down with the person who actually runs the process to understand how the work
                really happens: the team's skill level, the tools they're equipped with, and what will and won't survive
                contact with how your culture operates.
            </>
        ),
        detail: ["team-lead meeting(s)", "Skill level & tool constraints", "Culture fit"],
    },
    {
        number: "02",
        name: "Train",
        tagline: "Putting your mission in motion.",
        icon: <UsersRound />,
        body: (
            <>
                We train those directly involved in the process. We teach the tool together with the <em>why</em>: what's changing, what it means for them,
                and how it connects to what they already care about. We build towards your mission, not towards novelty.
            </>
        ),
        caption: "Built on how organizational change actually sticks.",
        detail: ["The tool", "The why", "What changes for them"],
    },
    {
        number: "03",
        name: "Sustain",
        tagline: "Keep it oiled.",
        icon: <RefreshCw />,
        body: (
            <>
                We will follow up with the manager after go-live, so we catch what's not sticking while it's still
                fixable - not six months later when the habit's already reverted.
            </>
        ),
        detail: ["Remote check-ins", "Manager-led", "After go-live"],
    },
];

/**
 * @description Process is the core differentiator - Diagnose / Train / Sustain as a three-card
 * feature grid with a connecting rail on desktop. Given the most scroll depth on the page on
 * purpose: the specificity of the process is the credibility signal.
 */
export function Process() {
    return (
        <ContentBox>
            <SectionHeading eyebrow="The Solution" title="We don't train on a tool. We integrate one.">
                Three phases, each built around the people who will actually see the change.
            </SectionHeading>

            <div className="relative mt-10 sm:mt-20">
                {/* Connecting rail behind the cards (desktop) */}
                <div className="hidden lg:block absolute left-[8%] right-[8%] top-[3.25rem] h-px bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0" aria-hidden />

                <ol className="relative grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {phases.map((phase, i) => (
                        <li key={phase.name}>
                            <FadeInUp delay={i * 180} className="h-full">
                                <PhaseCard phase={phase} />
                            </FadeInUp>
                        </li>
                    ))}
                </ol>
            </div>
        </ContentBox>
    );
}

function PhaseCard({ phase }: { phase: PhaseData }) {
    return (
        <Card className="group relative flex h-full flex-col gap-4 sm:gap-5 p-5 sm:p-8 border border-trim shadow-none md:hover:shadow-xl md:hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div className="flex size-11 sm:size-14 items-center justify-center rounded-xl sm:rounded-2xl bg-background border border-trim text-primary-ink [&>svg]:size-6 sm:[&>svg]:size-7 [&>svg]:stroke-[1.5] group-hover:bg-primary group-hover:text-ink group-hover:border-primary transition-colors">
                    {phase.icon}
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-widest text-ink">
                    PHASE {phase.number}
                </span>
            </div>

            <div>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text">{phase.name}</h3>
                <p className="mt-1 font-medium text-primary-ink">{phase.tagline}</p>
            </div>

            <p className="text-[15px] sm:text-base text-text-muted leading-relaxed text-pretty">{phase.body}</p>

            <ul className="mt-auto flex flex-wrap gap-1.5 sm:gap-2 sm:pt-2">
                {phase.detail.map((d) => (
                    <li key={d} className="rounded-md border border-trim px-2.5 py-1 text-xs text-text-muted">
                        {d}
                    </li>
                ))}
            </ul>

            {phase.caption && (
                <p className="border-t border-trim pt-3 sm:pt-4 text-sm italic text-text-muted">{phase.caption}</p>
            )}
        </Card>
    );
}
