import React from "react";
import { twMerge } from "tailwind-merge";

type PowerButtonProps = {
    Button: React.ReactNode;
    hop?: boolean;
    className?: string;
}

export function PowerButton({ Button, hop = false, className }: PowerButtonProps) {
    const sequentialButton = withInjectedClass(Button, textStrippedClass);

    return (
        <div className={twMerge("relative inline-block", className)}>
            <div className="relative z-10">
                <div className={hop ? "animate-hop-0" : ""}>
                    {Button}
                </div>
            </div>
            <div className="absolute inset-0 z-5 translate-x-1 translate-y-1.5 sm:translate-x-2 sm:translate-y-2 brightness-[1.25] opacity-70">
                <div className={twMerge("h-full", hop ? "animate-hop-1" : "")}>
                    {sequentialButton}
                </div>
            </div>
            <div className="absolute inset-0 z-0 translate-x-2 translate-y-3 sm:translate-x-4 sm:translate-y-4 opacity-90">
                <div className={twMerge("h-full", hop ? "animate-hop-2" : "")}>
                    {withInjectedClass(sequentialButton, "!bg-secondary")}
                </div>
            </div>
        </div>
    )
}

const textStrippedClass = "!text-transparent [-webkit-text-fill-color:transparent] [text-shadow:none] !shadow-none h-full";

function withInjectedClass(node: React.ReactNode, className: string): React.ReactNode { //Probably move to util library
    if (!React.isValidElement(node)) {
        return node;
    }

    const element = node as React.ReactElement<{ className?: string }>;
    const props = element.props as { className?: string };
    const mergedClassName = [props.className, className].filter(Boolean).join(" ");

    return React.cloneElement(element, {
        className: mergedClassName,
    });
}
