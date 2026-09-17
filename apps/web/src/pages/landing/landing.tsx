import { Spacer } from "../../components/ui/layout/spacer";
import { Transition } from "../../components/ui/layout/transition";
import { Footer } from "../../nav/footer";
import { Hero } from "./hero";
import { Problem } from "./problem";
import { Process } from "./process";
import { Pricing } from "./pricing";
import { Team } from "./team";
import { Faq } from "./faq";
import { NextStep } from "./next-step";

/**
 * @description Landing is the Vado marketing homepage - a single conversion funnel.
 * Hero (with the animated workflow board) → Problem → Process → Pricing → Team → FAQ → Book.
 * Process sits on the surface band and Pricing on a secondary-tinted band so the two
 * differentiators get visual weight.
 *
 * @example
 * // Mounted at the root path
 * <Route path="/" element={<Landing />} />
 */
export function Landing() {
    return (
        <>
            <section id="hero" aria-label="Introduction">
                <Hero />
            </section>
            <section id="problem" aria-label="The problem">
                <Spacer />
                <Problem />
                <Spacer />
            </section>
            <section id="process" aria-label="solution" className="bg-surface">
                <Transition className="h-16 sm:h-24 w-full" atTop={false} />
                <Process />
                <Spacer className="h-20 sm:h-32" />
            </section>
            <section id="pricing" aria-label="Pricing" className="bg-secondary/25 dark:bg-secondary/[0.04] border-y border-trim">
                <Spacer />
                <Pricing />
                <Spacer />
            </section>
            <section id="team" aria-label="team">
                <Spacer />
                <Team />
                <Spacer />
            </section>
            <section id="faq" aria-label="Frequently asked questions">
                <Faq />
                <Spacer className="h-8 sm:h-12" />
            </section>
            <section id="book" aria-label="Book a diagnostic">
                <Spacer className="h-16 sm:h-28" />
                <NextStep />
                <Spacer className="h-16 sm:h-28" />
            </section>
            <Footer />
        </>
    );
}
