import { MapPin } from "lucide-react";
import { cn } from "../../lib/cn";

const LocationMap = ({ city }) => {
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(city)}&output=embed`;
  const openInMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city)}`;

  return (
    <div className="mt-4 p-1">
      <div
        className={cn(
          "glass-panel overflow-hidden rounded-2xl shadow-md",
          "h-[260px] sm:h-[340px] md:h-[420px]"
        )}
      >
        <iframe
          title="Maestro Music Classes Location"
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
        />
      </div>

      <button
        type="button"
        onClick={() => window.open(openInMaps, "_blank")}
        className={cn(
          "group mx-auto mt-2 flex w-full max-w-2xl cursor-pointer items-start gap-2 rounded-xl p-4",
          "text-left transition hover:-translate-y-0.5 hover:bg-brand-600/5 hover:shadow-lg"
        )}
      >
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-500 transition group-hover:scale-110" />
        <div>
          <p className="font-bold text-slate-800 group-hover:underline">
            Maestro Music Classes – Flute, Guitar, Piano & Singing Academy
          </p>
          <p className="text-sm text-slate-600">
            H16, Keshar Bagh Rd, near Charming Kidz School, Nalanda Parisar,
            Indore, Madhya Pradesh 452009, India
          </p>
          <p className="mt-1 text-xs font-semibold text-brand-600">
            Open Mon–Sat • 10:00 AM – 8:00 PM (Tap to open map)
          </p>
        </div>
      </button>
    </div>
  );
};

export default LocationMap;
