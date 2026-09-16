import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

export type AccordionEntry = {
    title: string;
    content: React.ReactNode;
};

type AccordionProps = {
    items: AccordionEntry[];
    className?: string;
    /** Allow more than one panel open at a time */
    multiple?: boolean;
};

/**
 * Expandable list of title/content pairs, separated by trim dividers. Panels animate open
 * with a grid-rows transition so content height never needs measuring.
 *
 * @param {AccordionEntry[]} items - Rows to render
 * @param {boolean} [multiple=false] - When true, opening a row doesn't close the others
 *
 * @example
 * ```tsx
 * <Accordion items={[{ title: "How long?", content: "About six weeks." }]} />
 * ```
 */
export function Accordion({ items, className, multiple = false }: AccordionProps) {
    const [open, setOpen] = useState<Set<number>>(new Set());

    const toggle = (index: number) => {
        setOpen((prev) => {
            const next = new Set(multiple ? prev : []);
            if (prev.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    return (
        <div className={twMerge("divide-y divide-trim border-y border-trim", className)}>
            {items.map((item, index) => (
                <AccordionRow
                    key={item.title}
                    item={item}
                    isOpen={open.has(index)}
                    onToggle={() => toggle(index)}
                />
            ))}
        </div>
    );
}

type AccordionRowProps = {
    item: AccordionEntry;
    isOpen: boolean;
    onToggle: () => void;
};

function AccordionRow({ item, isOpen, onToggle }: AccordionRowProps) {
    const id = useId();

    return (
        <div>
            <h3>
                <button
                    type="button"
                    id={`${id}-trigger`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-panel`}
                    onClick={onToggle}
                    className="group flex w-full items-center justify-between gap-4 py-4 sm:py-5 text-left text-base sm:text-lg font-medium text-text cursor-pointer text-pretty"
                >
                    <span className="group-hover:text-primary-ink transition-colors">{item.title}</span>
                    <ChevronDown
                        className={twMerge(
                            "h-5 w-5 shrink-0 text-text-muted transition-transform duration-300",
                            isOpen && "rotate-180 text-primary-ink",
                        )}
                    />
                </button>
            </h3>
            <div
                id={`${id}-panel`}
                role="region"
                aria-labelledby={`${id}-trigger`}
                className={twMerge(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
            >
                <div className="overflow-hidden">
                    <div className="pb-4 sm:pb-5 pr-2 sm:pr-9 text-[15px] sm:text-base text-text-muted leading-relaxed text-pretty">{item.content}</div>
                </div>
            </div>
        </div>
    );
}
