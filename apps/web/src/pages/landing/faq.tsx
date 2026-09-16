import { Accordion, type AccordionEntry } from "@vado/ui";
import { ContentBox, SectionHeading } from "../../components/ui/layout/box";
import { FadeInUp } from "../../components/ui/text/fade-in-up";

const questions: AccordionEntry[] = [
    {
        title: "How is this different from other AI consultancies?",
        content:
            "Most engagements end at the workshop. Ours starts before it - repeated sit-downs with the person who runs the process - and continues after it with manager check-ins. And most of what we earn is tied to hours actually saved, not hours billed.",
    },
    {
        title: "What if it doesn't work?",
        content:
            "Then your cost is the base fee. The rest of our compensation depends on measured savings, so if the number doesn't move, neither does our upside.",
    },
    {
        title: "How long does an engagement take?",
        // TODO(content): rough timeline for diagnostic → training → check-in cycle
        content: "Diagnostic to training can be as quick as 3 weeks, and the check-in cycle is typically 1-2 months after go-live.",
    },
    {
        title: "What if our team resists the change?",
        content:
            "That's exactly what the training phase is built for. We teach the department the why alongside the tool - what's changing, what it means for them, and how it connects to what they already care about.",
    },
];

/**
 * @description FAQ handles the objections warm leads are most likely to raise, as an accordion
 * so motivated readers can dig in without lengthening the scroll for everyone else.
 */
export function Faq() {
    return (
        <ContentBox>
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6 sm:gap-10 lg:gap-20">
                <SectionHeading eyebrow="Questions" title="The things people ask first." className="lg:sticky lg:top-28 self-start" />
                <FadeInUp delay={150}>
                    <Accordion items={questions} />
                </FadeInUp>
            </div>
        </ContentBox>
    );
}
