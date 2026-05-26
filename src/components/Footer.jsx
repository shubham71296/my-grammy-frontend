import { Link } from "react-router-dom";
import { Phone, MapPin, Share2, Video, Camera } from "lucide-react";
import { cn } from "../lib/cn";

const openInMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Maestro Music Classes - Flute, Guitar, Piano & Singing Academy, Indore"
)}`;

const linkClass =
  "block py-1 text-sm text-white/85 transition hover:text-white";

const Footer = () => (
  <footer className={cn("footer-gradient mt-8 text-white md:mt-12")}>
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight">Grammy Music</h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">
            Bringing music and learning together — explore instruments, courses, and creativity.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/90">
            Quick links
          </h4>
          <Link to="/user" className={linkClass}>
            Home
          </Link>
          <Link to="/user/courses" className={linkClass}>
            Courses
          </Link>
          <Link to="/user/instruments" className={linkClass}>
            Instruments
          </Link>
          <Link to="/user/faq" className={linkClass}>
            FAQ
          </Link>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/90">
            Follow us
          </h4>
          <div className="flex gap-1">
            <a
              href="https://www.facebook.com/shubh.patidarr"
              className="rounded-lg p-2 text-white/90 transition hover:bg-white/10"
              aria-label="Facebook"
            >
              <Share2 size={18} />
            </a>
            <a
              href="https://www.instagram.com/shubhampatidar_o1?igsh=ZXR6NDdnb3I5bnBv"
              className="rounded-lg p-2 text-white/90 transition hover:bg-white/10"
              aria-label="Instagram"
            >
              <Camera size={18} />
            </a>
            <a
              href="https://youtube.com/@keymelodies?si=O_jdBIjP5R_BjkWg"
              className="rounded-lg p-2 text-white/90 transition hover:bg-white/10"
              aria-label="YouTube"
            >
              <Video size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/90">
            Contact
          </h4>
          <div className="mb-4 flex items-center gap-2 text-sm text-white/90">
            <Phone size={18} />
            <span className="font-medium">+91 7880222377</span>
          </div>
          <button
            type="button"
            onClick={() => window.open(openInMaps, "_blank")}
            className="flex w-full cursor-pointer items-start gap-2 rounded-lg text-left text-sm text-white/90 transition hover:text-white"
          >
            <MapPin size={18} className="mt-0.5 shrink-0 text-red-400" />
            <span>
              <span className="block font-semibold">Maestro Music Classes</span>
              <span className="mt-1 block text-xs leading-relaxed text-white/75">
                H16, Keshar Bagh Rd, near Charming Kidz School, Indore, MP 452009
              </span>
            </span>
          </button>
        </div>
      </div>

      <div className="mt-8 border-t border-white/15 pt-6 text-center text-xs text-white/60 sm:text-sm">
        © {new Date().getFullYear()} Grammy Music. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
