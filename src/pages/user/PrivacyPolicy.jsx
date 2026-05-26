import { Shield } from "lucide-react";
import { PageShell, PagePanel } from "../../components/ui/tw/PageShell";

export default function PrivacyPolicy() {
  return (
    <PageShell narrow>
      <PagePanel title="Privacy Policy" icon={Shield}>
        <p className="-mt-2 mb-6 text-center text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm text-slate-600 sm:text-base">
          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              🔒 Your Privacy Matters
            </h2>
            <p>
              Grammy Music India respects your privacy and is committed to safeguarding
              your personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              📌 Information We Collect
            </h2>
            <p>
              We collect personal details such as your name, email, phone number, and
              payment information solely to process orders and deliver our services
              effectively.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              💳 Secure Payment Handling
            </h2>
            <p>
              All payments are securely processed through Razorpay. We do not store your
              card or banking details on our servers.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              🚫 No Data Sharing
            </h2>
            <p>
              We do not sell, trade, or rent users&apos; personal identification
              information to anyone.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              📞 Contact Us
            </h2>
            <p>
              If you have any privacy-related questions or concerns, feel free to reach
              out:
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
