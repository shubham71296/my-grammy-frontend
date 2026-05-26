import { FileText } from "lucide-react";
import { PageShell, PagePanel } from "../../components/ui/tw/PageShell";

export default function TermsConditions() {
  return (
    <PageShell narrow>
      <PagePanel title="Terms & Conditions" icon={FileText}>
        <p className="-mt-2 mb-6 text-center text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm text-slate-600 sm:text-base">
          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              📘 Agreement to Terms
            </h2>
            <p>
              By accessing and using Grammy Music India, you agree to comply with and be
              bound by these Terms & Conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              🛒 Product & Service Availability
            </h2>
            <p>
              All products and services offered are subject to availability. Prices may
              change at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              ⚠️ Unauthorized Use
            </h2>
            <p>
              Unauthorized use of this website may give rise to claims for damages and/or
              may be a criminal offense.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              🚫 Right to Refuse Service
            </h2>
            <p>
              We reserve the right to refuse service to anyone for any reason at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              📞 Contact Us
            </h2>
            <p>
              For any questions or concerns regarding these Terms & Conditions, reach out
              to us:
              <br />
              <strong>Email:</strong>{" "}
              <a
                href="mailto:grammymusicindia@gmail.com"
                className="break-all text-brand-600 hover:underline"
              >
                grammymusicindia@gmail.com
              </a>
            </p>
          </section>
        </div>
      </PagePanel>
    </PageShell>
  );
}
