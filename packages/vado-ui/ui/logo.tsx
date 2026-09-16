import { twMerge } from "tailwind-merge";

/** The three stacked swoosh paths that make up the VADO mark, in the `77 111 800 817` viewBox. */
export const LOGO_PATHS = [
  "M673.80 483.58 C665.32 463.20 630.83 437.20 612.07 425.13 C512.40 360.97 376.67 370.66 266.07 329.59 C198.39 304.45 142.73 251.41 109.57 187.90 C97.16 164.15 92.08 137.46 81.84 115.80 C88.67 125.49 105.19 135.65 115.45 142.96 C165.12 178.36 226.80 195.34 285.98 206.29 C354.71 219.00 424.44 225.57 490.23 250.75 C564.84 279.30 622.94 332.93 655.17 405.89 C659.22 415.06 677.20 474.39 673.80 483.58 Z",
  "M238.06 382.50 C248.16 395.67 265.82 403.81 279.96 411.91 C334.85 443.33 398.37 453.47 460.00 462.80 C562.00 478.25 671.25 498.47 733.43 590.04 C749.52 613.72 761.00 639.68 767.52 667.56 C770.25 679.16 770.12 691.41 772.85 702.83 C760.75 680.74 736.34 664.64 715.35 651.77 C630.42 599.73 526.67 603.95 432.87 580.74 C358.62 562.38 299.65 515.91 263.44 448.44 C252.32 427.72 246.05 404.00 238.06 382.50 Z",
  "M394.35 649.20 C400.40 658.42 420.11 666.53 430.27 671.75 C478.16 696.38 532.37 704.18 585.05 711.32 C673.76 723.32 778.31 737.69 834.58 816.47 C850.21 838.36 861.31 862.27 867.47 888.46 C870.07 899.52 869.17 912.44 872.18 922.69 C862.14 903.54 819.56 877.30 799.04 868.39 C751.18 847.61 699.77 838.99 648.28 832.54 C604.90 827.10 560.92 824.44 520.10 807.30 C473.31 787.65 438.48 748.57 415.02 704.51 C408.62 692.50 397.99 659.07 392.23 651.84 C395.30 653.56 393.76 653.45 394.35 649.20 Z",
] as const;

export const LOGO_VIEWBOX = { x: 77, y: 111, width: 800, height: 817 } as const;

/**
 * Renders the VADO swoosh mark as an inline SVG. Color is driven by `currentColor`,
 * so set it via Tailwind `text-*` classes.
 *
 * @param {string} [className] - Tailwind classes for color and sizing (e.g. `"h-10 w-auto text-primary"`)
 *
 * @example
 * ```tsx
 * <LogoIcon className="h-10 w-auto text-primary" />
 * ```
 */
export function LogoIcon({ className, ...props }: React.SVGAttributes<SVGSVGElement>) {
  const { x, y, width, height } = LOGO_VIEWBOX;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${x} ${y} ${width} ${height}`}
      className={twMerge("h-[1.05em] w-auto", className)}
      aria-hidden
      {...props}
    >
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

type LogoProps = {
  className?: string;
  iconClassName?: string;
};

/**
 * The full VADO lockup - swoosh mark plus DM Sans wordmark. Sized by font-size, so
 * scale it with `text-*` size utilities (the mark tracks `1em`).
 *
 * @param {string} [className] - Classes on the wrapper (font size, text color)
 * @param {string} [iconClassName] - Classes on the mark only (e.g. a brand color)
 *
 * @example
 * ```tsx
 * <Logo className="text-3xl text-text" iconClassName="text-primary" />
 * ```
 */
export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <div className={twMerge("flex items-center text-6xl", className)}>
      <LogoIcon className={twMerge("p-[0.15em] pb-[0.2em] -mr-[0.25em]", iconClassName)} />
      <span className="font-dm-sans tracking-tight">Vado</span>
    </div>
  );
}
