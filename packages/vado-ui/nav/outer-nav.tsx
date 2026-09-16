import { useState, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Card } from "../ui/card";
import { Logo } from "../ui/logo";
import { MenuToggle } from "./menu-toggle";
import { OuterNavItem } from "./outer-nav-item";
import type { NavItemData } from "./nav-item";

type OuterNavProps = {
    navItems: NavItemData[][];
    /** Right-hand slot (e.g. the primary CTA). Also rendered at the foot of the mobile drawer. */
    action?: ReactNode;
    children?: ReactNode;
    className?: string;
    logoHref?: string;
};

/**
 * The site's top-level nav shell - one markup tree, switched with Tailwind breakpoints. From `md`
 * up it's a top bar: logo, segmented items (a divider between each group), `children`, and the
 * `action` slot on the right. Below `md` it collapses to logo + hamburger, which opens a drawer
 * listing the same items with `children` and `action` beneath them.
 *
 * @param {NavItemData[][]} navItems - Segments of nav items; a divider renders between groups
 * @param {React.ReactNode} [action] - Right-side slot, e.g. a CTA button
 * @param {React.ReactNode} [children] - Extra content next to the items / inside the drawer
 * @param {string} [className] - Additional classes merged onto the header element
 * @param {string} [logoHref="#top"] - Where the logo links to
 *
 * @example
 * ```tsx
 * <OuterNav navItems={[sectionLinks]} action={<Button scheme="primary">Book</Button>} />
 * ```
 */
export function OuterNav({ navItems, action, children, className, logoHref = "#top" }: OuterNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const close = () => setIsOpen(false);

    return (
        <header className={twMerge("sticky top-0 w-full h-16 md:h-20 z-20 bg-background", className)}>
            <div className="relative flex items-center h-full w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 gap-4">
                {/* z-50 keeps the logo crisp above the drawer's backdrop */}
                <a href={logoHref} className="relative z-50 shrink-0 flex items-center" aria-label="VADO home" onClick={close}>
                    <Logo className="text-2xl md:text-3xl text-text" iconClassName="text-primary" />
                </a>

                {/* Desktop */}
                <div className="hidden md:flex flex-1 h-full items-center justify-end gap-6">
                    <nav className="flex items-stretch divide-x divide-trim">
                        {navItems.map((segment, idx) => (
                            <div key={idx} className="flex flex-row px-2">
                                {segment.map((item) => (
                                    <OuterNavItem key={item.type === "link" ? item.link : item.label} item={item} variant="top" />
                                ))}
                            </div>
                        ))}
                    </nav>
                    {children && <div className="flex items-center">{children}</div>}
                    {action && <div className="flex items-center">{action}</div>}
                </div>

                {/* Mobile */}
                <div className="md:hidden ml-auto">
                    <MenuToggle isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
                </div>
                {isOpen && (
                    <div className="md:hidden absolute z-50 top-full inset-x-4 mt-2 origin-top-right transition duration-200 starting:opacity-0 starting:scale-95">
                        <Card className="flex flex-col overflow-hidden bg-background border border-trim shadow-xl">
                            <nav>
                                {navItems.flat().map((item) => (
                                    <OuterNavItem
                                        key={item.type === "link" ? item.link : item.label}
                                        item={item}
                                        variant="drawer"
                                        onNavigate={close}
                                    />
                                ))}
                            </nav>
                            {children}
                            {action && (
                                <div className="p-4" onClick={close}>
                                    {action}
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </header>
    );
}
