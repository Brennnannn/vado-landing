import { twMerge } from "tailwind-merge";
import { prefersReducedMotion, useInView } from "@/util/use-in-view";

type FadeInUpProps = {
    children?: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    yOffset?: number;
    threshold?: number;
}

export function FadeInUp({
    children,
    className,
    delay = 0,
    duration = 1.0,
    yOffset = 20,
    threshold = 0.1,
}: FadeInUpProps) {
    const { ref, inView } = useInView<HTMLDivElement>({ threshold });
    const isVisible = inView || prefersReducedMotion();

    return (
        <div
            ref={ref}
            className={twMerge(className)}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : `translateY(${yOffset}px)`,
                transitionProperty: "opacity, transform",
                transitionTimingFunction: "ease-out",
                transitionDuration: `${duration}s`,
                transitionDelay: `${delay}ms`,
                willChange: "opacity, transform",
            }}
        >
            {children}
        </div>
    );
}
