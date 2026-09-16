import { supabase } from "./supabase";

export type DiagnosticRequest = {
    name: string;
    email: string;
    company: string;
    process: string;
};

/**
 * Saves a diagnostic request as a lead in `diagnostic_requests`. Insert-only by RLS, so no
 * `.select()` - anon can't read the row back. The Cal.com webhook later attaches the booking
 * to this lead by email.
 *
 * Without Supabase env vars: dev logs and resolves so the flow can be exercised; a production
 * build throws rather than pretending a lead was captured.
 */
export async function submitDiagnosticRequest(request: DiagnosticRequest) {
    if (!supabase) {
        if (import.meta.env.DEV) {
            console.warn("[submitDiagnosticRequest] Supabase env vars not set - request not saved", request);
            return;
        }
        throw new Error("Supabase is not configured");
    }

    const { error } = await supabase.from("diagnostic_requests").insert({
        name: request.name.trim(),
        email: request.email.trim(),
        company: request.company.trim(),
        process: request.process.trim(),
    });

    if (error) throw error;
}
