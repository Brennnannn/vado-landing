// Verifies the hero workflow board's numbers add up, exactly as they're displayed (one decimal).
// Runs standalone (`pnpm check:demo`) and as the first step of `pnpm build`.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const source = readFileSync(fileURLToPath(new URL("../src/pages/landing/workflow-data.ts", import.meta.url)), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { workflows, teamTime, hoursBack } = await import(`data:text/javascript,${encodeURIComponent(outputText)}`);

const fmt = (n) => n.toFixed(1);
const failures = [];
const fail = (workflow, message) => failures.push(`${workflow.team} / ${workflow.process}: ${message}`);

for (const workflow of workflows) {
    const { steps } = workflow;
    const n = steps.length;

    for (const step of steps) {
        for (const key of ["before", "after"]) {
            const value = step[key];
            if (!Number.isFinite(value) || value < 0) fail(workflow, `"${step.label}" ${key} must be a non-negative number (got ${value})`);
            if (Math.abs(value * 10 - Math.round(value * 10)) > 1e-9) fail(workflow, `"${step.label}" ${key} has more than one decimal place (${value}) - the board would round it`);
        }
        if (step.after > step.before) fail(workflow, `"${step.label}" goes up (${step.before} -> ${step.after})`);
        if (step.kept && step.after !== step.before) fail(workflow, `"${step.label}" is marked kept but changes (${step.before} -> ${step.after})`);
        if (!step.kept && step.after === step.before) fail(workflow, `"${step.label}" doesn't change but isn't marked kept`);
    }

    // What a visitor would add up by hand: the displayed row values (1 decimal) vs the displayed total
    const handSum = (resolved) =>
        steps.reduce((sum, step, i) => sum + Number(fmt(i < resolved ? step.after : step.before)), 0);

    // Every frame of the scan, not just start and end: team time must equal the column
    for (let resolved = 0; resolved <= n; resolved++) {
        const shown = fmt(teamTime(steps, resolved));
        const byHand = fmt(handSum(resolved));
        if (shown !== byHand) fail(workflow, `with ${resolved} row(s) resolved, team time shows ${shown} but the column adds to ${byHand}`);
    }

    const before = teamTime(steps, 0);
    const after = teamTime(steps, n);
    // The badge renders hoursBack(); it must equal the two displayed totals subtracted by hand
    const backByHand = (Math.round(Number(fmt(before)) * 10) - Math.round(Number(fmt(after)) * 10)) / 10;
    if (fmt(hoursBack(steps)) !== fmt(backByHand)) fail(workflow, `badge shows ${fmt(hoursBack(steps))} hrs back but ${fmt(before)} - ${fmt(after)} = ${fmt(backByHand)}`);
    if (!(after < before)) fail(workflow, "saves no time");

    console.log(`${workflow.team.padEnd(18)} ${fmt(before).padStart(5)} hrs -> ${fmt(after).padStart(5)} hrs   ${fmt(hoursBack(steps)).padStart(5)} hrs/week back`);
}

if (failures.length) {
    console.error(`\nWorkflow board math check failed:\n  - ${failures.join("\n  - ")}`);
    process.exit(1);
}
console.log("\nWorkflow board math checks out.");
