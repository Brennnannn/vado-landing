import type { ReactNode } from "react";

export type TransitionProps = {
    children?: ReactNode;
    className?: string;
    percentToComplete?: number;
    atTop?: boolean;
}

export function Transition({ children, className = '', percentToComplete = 100, atTop = true }: TransitionProps) {

    const clamped = Math.max(0, Math.min(100, percentToComplete));
    const percent = Math.round(clamped / 5) * 5;

    const direction = atTop ? 'to bottom' : 'to top';

    const gradient = `linear-gradient(${direction}, transparent 0%, var(--color-background) ${percent}%)`

    return (
        <div className={className}>
            <div
                className="h-full w-full"
                style={{ background: gradient }}
            >
                {children}
            </div>
        </div>

    )
}