import { Truck } from "lucide-react";
import { PageShell, PagePanel } from "../../components/ui/tw/PageShell";

export default function ShippingPolicy() {
  return (
    <PageShell narrow>
      <PagePanel title="Shipping Policy" icon={Truck}>
        <p className="-mt-2 mb-6 text-center text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm text-slate-600 sm:text-base">
          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              🚚 No Physical Shipping
            </h2>
            <p>
              Maestro Music Classes does not ship any physical products. All our offerings
              are service-based.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              📌 How Services Are Delivered
            </h2>
            <p className="mb-2">Our services are provided through one of the following modes:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>In-person at our academy</li>
              <li>Digitally (online classes or digital content)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              📦 No Shipping Required
            </h2>
            <p>
              Since no tangible items are sold, shipping or physical delivery is not
              applicable for any of our services.
            </p>
          </section>
        </div>
      </PagePanel>
    </PageShell>
  );
}
