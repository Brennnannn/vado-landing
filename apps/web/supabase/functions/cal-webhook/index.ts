/**
 * Cal.com webhook → diagnostic_requests.
 *
 * Verifies the `x-cal-signature-256` HMAC (SHA-256 of the raw body, keyed by CAL_WEBHOOK_SECRET),
 * then matches the booking to the most recent lead with the attendee's email:
 *   BOOKING_CREATED / BOOKING_RESCHEDULED → status 'booked', booking uid + start time
 *   BOOKING_CANCELLED                     → status 'cancelled'
 * A booking with no matching lead (someone used the Cal link directly) creates one from the
 * booking's own responses, so nothing falls through.
 *
 * Deploy with JWT verification off - Cal.com can't send a Supabase JWT; the HMAC is the auth.
 */
import { createClient } from "npm:@supabase/supabase-js@2";

type CalAttendee = { email: string; name?: string };

type CalPayload = {
    uid: string;
    startTime?: string;
    attendees?: CalAttendee[];
    responses?: Record<string, { value?: unknown } | undefined>;
};

type CalEvent = {
    triggerEvent: string;
    payload: CalPayload;
};

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
});

Deno.serve(async (req) => {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const secret = Deno.env.get("CAL_WEBHOOK_SECRET");
    if (!secret) {
        console.error("CAL_WEBHOOK_SECRET is not set");
        return new Response("Not configured", { status: 500 });
    }

    const body = await req.text();
    if (!(await verifySignature(body, req.headers.get("x-cal-signature-256"), secret))) {
        return new Response("Invalid signature", { status: 401 });
    }

    let event: CalEvent;
    try {
        event = JSON.parse(body);
    } catch {
        return new Response("Invalid JSON", { status: 400 });
    }

    const { triggerEvent, payload } = event;
    const attendee = payload?.attendees?.[0];
    if (!payload?.uid || !attendee?.email) return new Response("Ignored: no booking/attendee", { status: 202 });

    try {
        switch (triggerEvent) {
            case "BOOKING_CREATED":
            case "BOOKING_RESCHEDULED":
                await recordBooking(payload, attendee);
                break;
            case "BOOKING_CANCELLED":
                await supabase.from("diagnostic_requests").update({ status: "cancelled" }).eq("booking_uid", payload.uid).throwOnError();
                break;
            default:
                return new Response(`Ignored: ${triggerEvent}`, { status: 202 });
        }
    } catch (error) {
        console.error(`Error handling ${triggerEvent}: `, error);
        return new Response("Database error", { status: 500 });
    }

    return new Response("ok");
});

async function recordBooking(payload: CalPayload, attendee: CalAttendee) {
    const booking = { status: "booked", booking_uid: payload.uid, booking_start: payload.startTime ?? null };

    const { data: lead } = await supabase
        .from("diagnostic_requests")
        .select("id")
        .ilike("email", attendee.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .throwOnError();

    if (lead) {
        await supabase.from("diagnostic_requests").update(booking).eq("id", lead.id).throwOnError();
        return;
    }

    // Booked straight from the Cal link without the site form
    await supabase
        .from("diagnostic_requests")
        .insert({
            name: attendee.name || responseText(payload, "name") || attendee.email,
            email: attendee.email,
            company: responseText(payload, "company") || "(not provided)",
            process: responseText(payload, "process") || "(booked directly via Cal.com)",
            ...booking,
        })
        .throwOnError();
}

function responseText(payload: CalPayload, key: string) {
    const value = payload.responses?.[key]?.value;
    return typeof value === "string" ? value.trim() : "";
}

async function verifySignature(body: string, signature: string | null, secret: string) {
    if (!signature) return false;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body)));
    const expected = Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join("");
    return timingSafeEqual(expected, signature.trim().toLowerCase());
}

function timingSafeEqual(a: string, b: string) {
    if (a.length !== b.length) return false;
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return mismatch === 0;
}
