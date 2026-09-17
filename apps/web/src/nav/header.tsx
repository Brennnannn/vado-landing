import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Button, NavItemData, OuterNav, navLink } from "@vado/ui";

/** Section anchors on the landing page - kept short on purpose, since this is a single-funnel page */
const sectionItems: NavItemData[] = [
    navLink({ link: "#process", label: "How it works" }),
    navLink({ link: "#pricing", label: "Pricing" }),
    navLink({ link: "#faq", label: "FAQ" }),
];

/**
 * @description Header is the sticky top navigation bar, built on the shared `OuterNav` shell
 * (hamburger drawer below `md`). Transparent over the hero, then picks up a solid background and
 * trim border once the page scrolls. The primary CTA sits in `OuterNav`'s `action` slot on desktop;
 * on mobile a thumb-reachable bottom bar carries it once the hero's own CTA has scrolled away,
 * and steps aside when the booking form itself is on screen.
 *
 * @example
 * // Used as a layout wrapper - child routes render via Outlet
 * <Route element={<Header />}>
 *   <Route path="/" element={<Landing />} />
 * </Route>
 */
export function Header() {
    const { scrolled, showMobileCta } = useScrollState();

    return (
        <div className="flex flex-col min-h-dvh w-full">
            <OuterNav
                navItems={[sectionItems]}
                action={
                    <a href="#book" className="block w-full">
                        <Button scheme="primary" className="w-full text-red-100">
                            Book a Diagnostic
                        </Button>
                    </a>
                }
                className={twMerge(
                    "fixed border-b transition-colors",
                    scrolled ? "bg-background/85 backdrop-blur-md border-trim" : "bg-transparent border-transparent",
                )}
            />
            <main id="top" className="flex-1">
                <Outlet />
            </main>

            {/* Mobile sticky CTA */}
            <div
                className={twMerge(
                    "md:hidden fixed inset-x-0 bottom-0 z-30 border-t border-trim bg-background/90 backdrop-blur-md px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out",
                    showMobileCta ? "translate-y-0" : "translate-y-full",
                )}
                aria-hidden={!showMobileCta}
            >
                <a href="#book" tabIndex={showMobileCta ? 0 : -1} className="block">
                    <Button scheme="primary" tabIndex={-1} className="text-red-100 w-full py-3.5 text-base shadow-lg">
                        Book a Process Diagnostic
                    </Button>
                </a>
            </div>
        </div>
    );
}

function useScrollState() {
    const [state, setState] = useState({ scrolled: false, showMobileCta: false });

    useEffect(() => {
        const onScroll = () => {
            const book = document.getElementById("book");
            const bookInView = book ? book.getBoundingClientRect().top < window.innerHeight : false;
            const next = {
                scrolled: window.scrollY > 24,
                // Past most of the first screen (where the hero CTA lives), until the form arrives
                showMobileCta: window.scrollY > window.innerHeight * 0.9 && !bookInView,
            };
            setState((prev) => (prev.scrolled === next.scrolled && prev.showMobileCta === next.showMobileCta ? prev : next));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return state;
}
