import { Card } from "@vado/ui";
import { publicAssetUrl } from "@/util/supabase";
import { ContentBox, SectionHeading } from "../../components/ui/layout/box";
import { FadeInUp } from "../../components/ui/text/fade-in-up";

type Founder = {
    initials: string;
    name: string;
    role: string;
    bio: string;
    /** Path in the `public-assets` bucket, e.g. `founders/brennan.jpg`. Falls back to initials. */
    photo?: string;
};

// TODO(content): real founder specifics. Operational, not consulting, credentials -
// e.g. "ran logistics ops for a 200-person warehouse through an ERP migration".
const founders: Founder[] = [
    {
        initials: "BZ",
        name: "Brennan Zaleski",
        role: "CEO & Co-founder",
        bio: "Behavioral healthcare software solo founder, builder, and operator. Former education IT implementation consultant.",
    },
    {
        initials: "OM",
        name: "Oak Martin",
        role: "CFO & Co-founder",
        bio: "Instructor at John Brown University for social entreprenuership. Epic Impact Trips tourism product manager. ",
    },
];

/**
 * @description Team stands in for the case-study section VADO doesn't have yet - founder
 * headshots and short first-person bios. Content is placeholder until real specifics land
 * placeholder cards are visibly marked so they can't ship by accident unnoticed.
 */
export function Team() {
    return (
        <ContentBox>
            <SectionHeading eyebrow="Why this team" title="Built by people who've run the floor, not just consulted on it.">
                Industry background. Future focused.
            </SectionHeading>

            <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {founders.map((founder, i) => (
                    <FadeInUp key={i} delay={i * 150} className="h-full">
                        <Card className="grid h-full grid-cols-[auto_1fr] gap-x-4 gap-y-3 sm:gap-x-6 p-5 sm:p-7 border border-dashed border-trim shadow-none">
                            <FounderAvatar founder={founder} />
                            <div className="self-center sm:self-end">
                                <h3 className="text-lg sm:text-xl font-semibold text-text">{founder.name}</h3>
                                <p className="text-sm font-medium text-primary-ink">{founder.role}</p>
                            </div>
                            <p className="col-span-2 sm:col-span-1 text-[15px] sm:text-base text-text-muted leading-relaxed">{founder.bio}</p>
                        </Card>
                    </FadeInUp>
                ))}
            </div>
        </ContentBox>
    );
}

function FounderAvatar({ founder }: { founder: Founder }) {
    const src = founder.photo ? publicAssetUrl(founder.photo) : null;

    return (
        <div className="flex size-14 sm:size-24 sm:row-span-2 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-secondary text-lg sm:text-2xl font-semibold text-ink">
            {src ? (
                <img src={src} alt={founder.name} loading="lazy" decoding="async" className="size-full object-cover" />
            ) : (
                founder.initials
            )}
        </div>
    );
}
