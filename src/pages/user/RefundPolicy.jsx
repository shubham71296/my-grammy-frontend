import { RotateCcw } from "lucide-react";
import { PageShell, PagePanel } from "../../components/ui/tw/PageShell";

export default function RefundPolicy() {
  return (
    <PageShell narrow>
      <PagePanel title="Refund & Cancellation Policy" icon={RotateCcw}>
        <p className="-mt-2 mb-6 text-center text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm text-slate-600 sm:text-base">
          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              🛑 No Cancellation After Purchase
            </h2>
            <p>
              All sales are final. Once a purchase is completed, it cannot be cancelled or
              refunded unless explicitly stated.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              💼 Refunds for Duplicate or Failed Payments
            </h2>
            <p>
              In case of duplicate payments or technical errors, refunds will be processed
              within 7–10 working days.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              💳 Refund Processing Method
            </h2>
            <p>
              Refunds, if approved, will be credited back to the original payment method
              used at the time of purchase.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              📞 Contact for Refund Queries
            </h2>
            <p>
              For any refund-related questions, reach out to us at:
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
