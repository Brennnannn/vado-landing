import { cloneElement, isValidElement, ReactElement, useState } from "react";
import { Card } from "../ui/card";
import { ForegroundFocus } from "../ui/foreground-focus";
import type { NavItemData } from "./nav-item";

type OuterNavItemProps = {
    item: NavItemData;
    variant: "top" | "drawer";
    /** Fired after a link/action is chosen - lets a drawer close itself */
    onNavigate?: () => void;
};

const variantClassNames: Record<OuterNavItemProps["variant"], string> = {
    top: "flex flex-row items-center px-3 my-2 rounded-md text-sm justify-center font-medium text-text hover:bg-hover-1 transition-colors",
    drawer: "flex flex-row items-center w-full px-6 py-4 border-b border-trim text-text hover:bg-hover-2 transition-colors",
};

/**
 * Renders a single nav entry for `OuterNav`. `link` items render as plain anchors (the site is
 * a single scrolling page, so links are mostly `#section` hashes - `react-router`'s `Link`
 * wouldn't scroll to them); `action` items fire a callback; `node` items open a dropdown
 * of their `children`.
 *
 * @param {NavItemData} item - The nav item to render
 * @param {'top' | 'drawer'} variant - Desktop bar or mobile drawer row styling
 *
 * @example
 * ```tsx
 * <OuterNavItem item={navLink({ link: "#pricing", label: "Pricing" })} variant="top" />
 * ```
 */
export function OuterNavItem({ item, variant, onNavigate }: OuterNavItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const className = variantClassNames[variant];

    const content = (
        <>
            {item.icon && (
                <div className="h-4 w-4 mr-2">
                    {isValidElement(item.icon)
                        ? cloneElement(item.icon as ReactElement<{ className?: string }>, { className: "h-4 w-4" })
                        : item.icon}
                </div>
            )}
            <div>{item.label}</div>
        </>
    );

    if (item.type === "link")
        return (
            <a href={item.link} className={className} onClick={onNavigate}>
                {content}
            </a>
        );

    if (item.type === "action")
        return (
            <button
                type="button"
                onClick={() => {
                    item.onClick();
                    onNavigate?.();
                }}
                className={className}
                title={item.label}
            >
                {content}
            </button>
        );

    return (
        <div className="relative">
            {isOpen && <ForegroundFocus onClick={() => setIsOpen(false)} />}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={className}
                title={item.label}
            >
                {content}
            </button>
            {isOpen && (
                <Card className="absolute z-50 w-56 divide-y divide-trim left-0 top-full mt-2">
                    {item.children.map((child) => (
                        <OuterNavItem
                            key={child.type === "link" ? child.link : child.label}
                            item={child}
                            variant="drawer"
                            onNavigate={() => {
                                setIsOpen(false);
                                onNavigate?.();
                            }}
                        />
                    ))}
                </Card>
            )}
        </div>
    );
}
