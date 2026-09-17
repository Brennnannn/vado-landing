import { useState } from "react";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Button, Card } from "@vado/ui";
import { ContentBox } from "../../components/ui/layout/box";
import { FadeInUp } from "../../components/ui/text/fade-in-up";
import { PowerButton } from "../../components/ui/misc/power-button";
import { submitDiagnosticRequest, type DiagnosticRequest } from "@/util/submit-diagnostic";
import { BookingScheduler } from "./booking-scheduler";

type Status = "idle" | "sending" | "error";

/**
 * @description NextStep is the final, low-friction close - repeats the hero CTA verbatim and
 * keeps the form to four fields (name, email, company, one line on the process). Sits on a
 * secondary-colored panel so it reads as the destination the page has been pointing at.
 * Two steps: the form saves the lead, then the Cal.com scheduler takes over the full panel
 * width with everything pre-filled, so the visitor only has to pick a time.
 */
export function NextStep() {
    const [lead, setLead] = useState<DiagnosticRequest | null>(null);

    return (
        <ContentBox>
            <FadeInUp>
                <Card className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-secondary text-ink shadow-xl sm:shadow-2xl p-4 pt-7 sm:p-12 lg:p-16">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/60 blur-3xl" aria-hidden />
                    <div className={twMerge("relative grid grid-cols-1 gap-7 sm:gap-10 items-start", !lead && "lg:grid-cols-[1fr_1.1fr] lg:gap-16")}>
                        <div className="flex flex-col gap-3 sm:gap-5 px-1 sm:px-0">
                            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-deep">
                                <span className="h-1.5 w-6 rounded-full bg-primary-deep" />
                                Next step
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05] text-balance">
                                {lead ? "Now pick a time that works." : "Let's look at one process worth fixing."}
                            </h2>
                            <p className="text-base sm:text-lg text-ink/70 leading-relaxed text-pretty">
                                {lead
                                    ? "We've got your details. Choose a slot for the diagnostic conversation and a calendar invite will follow."
                                    : "A diagnostic conversation costs you nothing and tells us both if this is a fit."}
                            </p>
                        </div>
                        {lead ? <BookingScheduler lead={lead} /> : <DiagnosticForm onSubmitted={setLead} />}
                    </div>
                </Card>
            </FadeInUp>
        </ContentBox>
    );
}

const emptyForm: DiagnosticRequest = { name: "", email: "", company: "", process: "" };

function DiagnosticForm({ onSubmitted }: { onSubmitted: (lead: DiagnosticRequest) => void }) {
    const [form, setForm] = useState<DiagnosticRequest>(emptyForm);
    const [status, setStatus] = useState<Status>("idle");

    const update = (key: keyof DiagnosticRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("sending");
        try {
            // Honeypot: real visitors never see or fill "website"; bots that do get a silent success
            const honeypot = new FormData(e.currentTarget).get("website");
            if (!honeypot) await submitDiagnosticRequest(form);
            onSubmitted(form);
        } catch (error) {
            console.error("Error submitting diagnostic request: ", error);
            setStatus("error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-3.5 sm:gap-4 rounded-xl sm:rounded-2xl bg-background p-4 sm:p-8 text-text shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <Field label="Name" name="name" autoComplete="name" value={form.name} onChange={update("name")} />
                <Field label="Work email" name="email" type="email" autoComplete="email" value={form.email} onChange={update("email")} />
            </div>
            <Field label="Company" name="company" autoComplete="organization" value={form.company} onChange={update("company")} />
            <Field
                label="What process are you looking to improve?"
                name="process"
                placeholder="e.g. Invoice reconciliation"
                value={form.process}
                onChange={update("process")}
            />

            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />

            {status === "error" && (
                <p className="text-sm text-error" role="alert">
                    Something went wrong sending that. Please try again.
                </p>
            )}

            <div id="book-submit" className="pt-2">
                <PowerButton
                    className="w-full"
                    Button={
                        <Button scheme="primary" type="submit" disabled={status === "sending"} className="w-full py-4 text-base sm:text-lg whitespace-nowrap shadow-xl text-red-100">
                            {status === "sending" && <Loader2 className="h-5 w-5 animate-spin" />}
                            Book a Process Diagnostic
                        </Button>
                    }
                />
            </div>
        </form>
    );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
};

function Field({ label, name, type = "text", ...props }: FieldProps) {
    return (
        <label className="flex flex-col gap-1.5" htmlFor={name}>
            <span className="text-sm font-medium text-text">{label}</span>
            <input
                id={name}
                name={name}
                type={type}
                required
                className="rounded-lg border border-trim bg-surface px-3.5 py-3 text-base text-text placeholder:text-text-muted/70 outline-none focus:border-primary focus:ring-4 focus:ring-primary/25 transition"
                {...props}
            />
        </label>
    );
}
