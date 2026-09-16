import { twMerge } from "tailwind-merge";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Renders a surface-colored card with a drop shadow and rounded corners.
 * Accepts all standard `div` HTML attributes.
 *
 * @param {string} [className] - Additional Tailwind classes merged onto the card
 * @param {React.ReactNode} [children] - Content rendered inside the card
 *
 * @example
 * ```tsx
 * <Card className="p-4 flex flex-col gap-2">
 *   <h2>Title</h2>
 *   <p>Body content</p>
 * </Card>
 * ```
 */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={twMerge('bg-surface shadow rounded-md', className)}
      {...props}
    />
  );
};
