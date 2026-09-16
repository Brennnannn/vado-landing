import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CalendarCheck2, ExternalLink } from "lucide-react";
import type { DiagnosticRequest } from "@/util/submit-diagnostic";

/** Cal.com event the diagnostic books into (cal.com/<this>) */
export const CAL_LINK = "brennanz/process-diagnostic";
const NAMESPACE = "process-diagnostic";

type BookingSchedulerProps = {
    lead: DiagnosticRequest;
};

/**
 * @description BookingScheduler is step two of the booking flow: the Cal.com scheduler, inline,
 * with the lead from the site form pre-filled - name and email, plus the `company` and `process`
 * booking questions by their Cal identifiers (set to "disable if prefilled" in Cal, so they show
 * locked). The lead is already saved by the time this renders, so a visitor who never picks a
 * time is still captured. Swaps to a confirmation once Cal reports the booking.
 *
 * @example
 * <BookingScheduler lead={{ name, email, company, process }} />
 */
export function BookingScheduler({ lead }: BookingSchedulerProps) {
    const [booked, setBooked] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const cal = await getCalApi({ namespace: NAMESPACE });
            if (cancelled) return;
            cal("ui", {
                hideEventTypeDetails: true,
                layout: "month_view",
                cssVarsPerTheme: {
                    light: { "cal-brand": "#4A7A80" },
                    dark: { "cal-brand": "#73A6AD" },
                },
            });
            cal("on", { action: "bookingSuccessful", callback: () => setBooked(true) });
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (booked) {
        return (
            <div className="flex flex-col items-start gap-4 rounded-xl sm:rounded-2xl bg-background p-6 sm:p-10 text-text shadow-lg" role="status">
                <CalendarCheck2 className="size-10 text-primary-ink" />
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">You're booked.</h3>
                <p className="text-text-muted text-pretty">
                    A calendar invite with the meeting link is on its way to {lead.email}. Talk soon, {lead.name.split(" ")[0]}.
                </p>
            </div>
        );
    }

    const bookingUrl = `https://cal.com/${CAL_LINK}?${new URLSearchParams({ ...lead }).toString()}`;

    return (
        <div className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-background shadow-lg">
                <Cal
                    namespace={NAMESPACE}
                    calLink={CAL_LINK}
                    className="min-h-[34rem] w-full"
                    style={{ width: "100%", height: "100%", overflow: "auto" }}
                    config={{
                        layout: "month_view",
                        theme: "auto",
                        name: lead.name,
                        email: lead.email,
                        company: lead.company,
                        process: lead.process,
                    }}
                />
            </div>
            <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 self-center text-sm text-ink/70 hover:text-ink transition-colors"
            >
                Scheduler not loading? Open it in a new tab
                <ExternalLink className="size-3.5" />
            </a>
        </div>
    );
}
