import { Mail } from "lucide-react";
import { PageShell, PagePanel } from "../../components/ui/tw/PageShell";

export default function ContactUs() {
  return (
    <PageShell narrow>
      <PagePanel title="Contact Us" icon={Mail}>
        <p className="-mt-2 mb-6 text-center text-sm text-slate-600">
          We&apos;d love to hear from you. Contact us anytime!
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
              🏢 Business Name
            </h2>
            <p className="ml-1 text-sm text-slate-600 sm:text-base">Maestro Music Classes</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 sm:text-lg">📧 Email</h2>
            <a
              href="mailto:grammymusicindia@gmail.com"
              className="ml-1 break-all text-sm text-brand-600 hover:underline sm:text-base"
            >
              grammymusicindia@gmail.com
            </a>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 sm:text-lg">☎️ Phone</h2>
            <p className="ml-1 text-sm text-slate-600 sm:text-base">+91 78802 22377</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 sm:text-lg">📍 Address</h2>
            <p className="ml-1 text-sm leading-relaxed text-slate-600 sm:text-base">
              H16, Keshar Bagh Rd, Near Charming Kidz School,
              <br />
              Nalanda Parisar, Indore, Madhya Pradesh – 452009
            </p>
          </section>
        </div>
      </PagePanel>
    </PageShell>
  );
}
