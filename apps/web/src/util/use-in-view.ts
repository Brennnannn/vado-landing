import { useEffect, useRef, useState } from "react";

type InViewOptions = {
    threshold?: number;
    rootMargin?: string;
    /** Stop observing after the first intersection (default true) */
    once?: boolean;
};

/**
 * Tracks whether an element is intersecting the viewport. With `once` (the default) it
 * latches true on first sight, which is what reveal-on-scroll animations want.
 */
export function useInView<T extends Element>({ threshold = 0.1, rootMargin, once = true }: InViewOptions = {}) {
    const ref = useRef<T | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return;
                if (entry.isIntersecting) {
                    setInView(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setInView(false);
                }
            },
            { threshold, rootMargin },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return { ref, inView };
}

export function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}
