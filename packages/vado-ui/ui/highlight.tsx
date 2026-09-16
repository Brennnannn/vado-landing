import { twMerge } from "tailwind-merge";

type HighlightProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * Marker-style emphasis in the secondary brand color - a low band behind the text rather
 * than a full fill, so it reads as a highlighter stroke. Dims itself in dark mode so light
 * text stays legible over it.
 *
 * @example
 * ```tsx
 * <p>It's a <Highlight>change problem</Highlight>.</p>
 * ```
 */
export function Highlight({ children, className }: HighlightProps) {
    return (
        <span
            className={twMerge(
                "box-decoration-clone px-1 -mx-1 bg-[linear-gradient(transparent_55%,var(--color-secondary)_55%)] dark:bg-[linear-gradient(transparent_55%,color-mix(in_oklab,var(--color-secondary)_35%,transparent)_55%)]",
                className,
            )}
        >
            {children}
        </span>
    );
}
