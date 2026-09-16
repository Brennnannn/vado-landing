import { twMerge } from "tailwind-merge";
import { FadeInUp } from "../text/fade-in-up";

type ContentBoxProps = {
    children?: React.ReactNode;
    className?: string;
}

/**
 * ContentBox
 *
 * Adds width padding for items that should take up the standard middle section,
 * capped at `max-w-7xl` so wide screens don't stretch line lengths.
 */
export function ContentBox({ children, className }: ContentBoxProps) {
    return (
        <div className={twMerge('w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16', className)}>
            {children}
        </div>
    )
}

type SectionHeadingProps = {
    eyebrow: string;
    title: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    align?: "left" | "center";
}

/**
 * SectionHeading
 *
 * The standard section intro - a small uppercase eyebrow with a secondary-colored tick,
 * a large headline, and optional lead copy. Fades up on scroll.
 */
export function SectionHeading({ eyebrow, title, children, className, align = "left" }: SectionHeadingProps) {
    return (
        <FadeInUp className={twMerge("flex flex-col gap-3 sm:gap-4 max-w-3xl", align === "center" && "mx-auto items-center text-center", className)}>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-ink">
                <span className="h-1.5 w-6 rounded-full bg-secondary" />
                {eyebrow}
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-text text-balance leading-[1.1]">
                {title}
            </h2>
            {children && (
                <div className="text-base sm:text-lg text-text-muted leading-relaxed text-pretty">
                    {children}
                </div>
            )}
        </FadeInUp>
    )
}
