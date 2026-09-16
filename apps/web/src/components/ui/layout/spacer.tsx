import { twMerge } from "tailwind-merge";

export function Spacer({ className }: { className?: string }) {
    return <div className={twMerge("w-full h-12 sm:h-24", className)} />
}
