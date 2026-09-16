import { Menu, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { ForegroundFocus } from "../ui/foreground-focus";

type MenuToggleProps = {
    isOpen: boolean;
    onClick: () => void;
    className?: string;
};

/**
 * Controlled hamburger trigger - renders the Menu/X icon button plus a dismiss backdrop
 * when open. Owns no state of its own; the caller drives `isOpen`. Sized to a 44px touch target.
 *
 * @param {boolean} isOpen - Whether the thing this button controls is currently open
 * @param {() => void} onClick - Called on click; caller is responsible for flipping `isOpen`
 * @param {string} [className] - Additional classes merged onto the button
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * <MenuToggle isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
 * ```
 */
export function MenuToggle({ isOpen, onClick, className }: MenuToggleProps) {
    return (
        <>
            {isOpen && <ForegroundFocus onClick={onClick} />}
            <button
                type="button"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className={twMerge(
                    "relative z-50 size-11 -mr-1.5 flex items-center justify-center rounded-lg text-text cursor-pointer hover:bg-hover-2 active:bg-hover-2 transition-colors",
                    className,
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
        </>
    );
}
