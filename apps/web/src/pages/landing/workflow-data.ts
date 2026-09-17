export type Step = {
    label: string;
    /** Hours per week today. Use at most one decimal place. */
    before: number;
    /** Hours per week after the change. Use at most one decimal place. */
    after: number;
    /** Judgment work that stays with the team (after === before) */
    kept?: boolean;
};

export type Workflow = {
    team: string;
    process: string;
    steps: Step[];
};

// Illustrative numbers (hours per week), not client results.
// `pnpm --filter @vado/web check:demo` verifies every total adds up; it also runs on build.
export const workflows: Workflow[] = [
    {
        team: "Finance",
        process: "Month-end reconciliation",
        steps: [
            { label: "Pull bank & ledger exports", before: 3, after: 0.2 },
            { label: "Match transactions", before: 6.5, after: 0.5 },
            { label: "Chase missing receipts", before: 2.5, after: 0.5 },
            { label: "Review exceptions", before: 2, after: 2, kept: true },
            { label: "Sign off", before: 1, after: 1, kept: true },
        ],
    },
    {
        team: "Operations",
        process: "Weekly shift scheduling",
        steps: [
            { label: "Collect availability", before: 2.5, after: 0.3 },
            { label: "Build draft schedule", before: 4, after: 0.5 },
            { label: "Resolve conflicts", before: 2, after: 2, kept: true },
            { label: "Notify staff", before: 1.5, after: 0.1 },
            { label: "Approve & publish", before: 1, after: 1, kept: true },
        ],
    },
    {
        team: "Customer support",
        process: "Inbound ticket triage",
        steps: [
            { label: "Read & tag tickets", before: 5, after: 0.5 },
            { label: "Route to the right owner", before: 2, after: 0.2 },
            { label: "Draft first replies", before: 6, after: 1.5 },
            { label: "Handle escalations", before: 3, after: 3, kept: true },
        ],
    },
];

/**
 * Sums hours in integer tenths so the result is exact (0.1 + 0.2 style float drift never
 * reaches the screen) and always equals the sum of the row values as displayed.
 */
export function sumHours(values: number[]) {
    return values.reduce((tenths, v) => tenths + Math.round(v * 10), 0) / 10;
}

/** The hours a step shows on the board, given whether the scan has reached it */
export function stepHours(step: Step, resolved: boolean) {
    return resolved ? step.after : step.before;
}

/** Team time for the board when the first `resolvedCount` rows have been resolved */
export function teamTime(steps: Step[], resolvedCount: number) {
    return sumHours(steps.map((step, i) => stepHours(step, i < resolvedCount)));
}

/** Hours won back: today's team time minus the new team time, in exact tenths */
export function hoursBack(steps: Step[]) {
    return sumHours([teamTime(steps, 0), -teamTime(steps, steps.length)]);
}
