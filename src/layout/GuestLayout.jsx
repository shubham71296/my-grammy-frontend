import { Suspense, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import PageSpinner from "../components/ui/loader/PageSpinner";
import {
  Share2,
  Camera,
  Video,
  Phone,
  MapPin,
  Home,
  Music,
  GraduationCap,
  X,
  Menu,
  LogIn,
  ChevronDown,
} from "lucide-react";
import WebsiteLogoImage from "../assets/grammy-icon1.jpg";
import AppDialog from "../components/ui/dialog/AppDialog";
import { Drawer } from "../components/ui/tw/Drawer";
import { Dropdown, DropdownItem } from "../components/ui/tw/Dropdown";
import { cn } from "../lib/cn";

const openInMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Maestro Music Classes Indore"
)}`;

const menuItems = [
  { id: "Home", label: "Home", icon: Home, to: "/guest", end: true },
  {
    id: "Instruments",
    label: "Instruments",
    icon: Music,
    to: "/guest/guestinstruments",
  },
  {
    id: "Courses",
    label: "Courses",
    icon: GraduationCap,
    to: "/guest/guestcourses",
  },
];

const GuestLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("Home");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/guest") {
      setActive("Home");
    } else if (
      location.pathname.includes("guestcourses") ||
      location.pathname.includes("guestcourse/")
    ) {
      setActive("Courses");
    } else if (
      location.pathname.includes("guestinstruments") ||
      location.pathname.includes("guestinstrument/")
    ) {
      setActive("Instruments");
    }
    setDrawerOpen(false);
  }, [location.pathname]);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-brand-900 shadow-[0_4px_30px_rgba(2,2,94,0.22)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2.5 px-3 sm:gap-4 sm:px-4 lg:h-[4.25rem] lg:px-6">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20 md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={2.25} />
          </button>

          <NavLink
            to="/guest"
            end
            onClick={() => setActive("Home")}
            className={cn(
              "group flex min-w-0 shrink-0 items-center gap-2 rounded-2xl py-1 pr-1.5 hover:bg-white/5 sm:gap-3 sm:pr-2",
              active === "Home" && "bg-white/10"
            )}
          >
            <img
              src={WebsiteLogoImage}
              alt="Grammy Music"
              className="h-10 w-10 rounded-xl object-cover shadow-lg ring-2 ring-white/25 transition group-hover:ring-white/40 sm:h-11 sm:w-11"
            />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-bold tracking-tight text-white">Grammy</p>
              <p className="text-[11px] font-medium text-white/55">Music Academy</p>
            </div>
          </NavLink>

          <nav className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-0.5 rounded-2xl border border-white/10 bg-white/[0.06] p-1 backdrop-blur-sm">
              {menuItems.map((it) => {
                const Icon = it.icon;
                const isActive = active === it.id;
                return (
                  <NavLink
                    key={it.id}
                    to={it.to}
                    end={it.end}
                    onClick={() => setActive(it.id)}
                    className={cn(
                      "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                      isActive
                        ? "bg-white text-brand-900 shadow-md shadow-black/10"
                        : "text-white/90 hover:bg-white/12 hover:text-white active:bg-white/20"
                    )}
                  >
                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                      <Icon size={18} strokeWidth={2.25} />
                    </span>
                    <span className="hidden xl:inline">{it.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          <div className="ml-auto flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3">
            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 py-1.5 pl-3 pr-1.5 transition hover:bg-white/15"
                >
                  <span className="hidden max-w-[120px] truncate text-sm font-semibold text-white/95 sm:block lg:max-w-[160px]">
                    Guest User
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-inner">
                    G
                  </span>
                  <ChevronDown size={16} className="hidden text-white/60 sm:block" />
                </button>
              }
            >
              {(close) => (
                <>
                  <div className="border-b border-slate-100 px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-navy">Guest User</p>
                    <p className="text-xs text-muted">Browse instruments & courses</p>
                  </div>
                  <DropdownItem
                    onClick={() => {
                      close();
                      navigate("/login");
                    }}
                  >
                    <LogIn size={16} className="text-emerald-600" />
                    Login / Signup
                  </DropdownItem>
                </>
              )}
            </Dropdown>
          </div>
        </div>
      </header>

      <Drawer open={drawerOpen} onClose={closeDrawer}>
        <div className="relative flex min-h-full flex-col bg-white">
          <div className="relative overflow-hidden border-b border-slate-200 bg-brand-900 px-4 py-5 text-white">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={WebsiteLogoImage}
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-white/30"
                />
                <div>
                  <p className="text-lg font-bold">Grammy</p>
                  <p className="text-xs text-white/70">Discover music learning</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 transition hover:bg-white/25"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <p className="relative mt-3 truncate text-sm text-white/80">
              Guest browsing mode
            </p>
          </div>

          <nav className="flex flex-col gap-1 p-3">
            {menuItems.map((it) => {
              const Icon = it.icon;
              const isActive = active === it.id;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    setActive(it.id);
                    navigate(it.to);
                    closeDrawer();
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition",
                    isActive
                      ? "bg-brand-100 text-brand-800"
                      : "text-slate-700 hover:bg-brand-50 active:bg-brand-100"
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <Icon size={18} strokeWidth={2.25} />
                  </span>
                  {it.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-200 p-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              onClick={() => {
                closeDrawer();
                navigate("/login");
              }}
            >
              <LogIn size={18} /> Login / Signup
            </button>
          </div>
        </div>
      </Drawer>

      <div className="h-16 lg:h-[4.25rem]" aria-hidden />
      <Suspense fallback={<PageSpinner />}>
        <Outlet />
      </Suspense>
      <AppDialog />

      <footer className="footer-gradient mt-8 px-4 py-10 text-white sm:px-6 md:mt-12 md:py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-2 text-base font-bold sm:text-lg md:text-xl">
              Grammy
            </h3>
            <p className="text-sm text-white/80">
              Bringing music and learning together — explore instruments,
              courses, and creativity.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-bold">Follow Us</h3>
            <div className="flex gap-1">
              <a
                href="https://www.facebook.com/shubh.patidarr"
                className="rounded-lg p-2 transition hover:bg-white/10"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <Share2 size={20} aria-hidden />
              </a>
              <a
                href="https://www.instagram.com/shubhampatidar_o1?igsh=ZXR6NDdnb3I5bnBv"
                className="rounded-lg p-2 transition hover:bg-white/10"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Camera size={20} aria-hidden />
              </a>
              <a
                href="https://youtube.com/@keymelodies?si=O_jdBIjP5R_BjkWg"
                className="rounded-lg p-2 transition hover:bg-white/10"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <Video size={20} aria-hidden />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-bold">Contact Us</h3>
            <div className="flex items-center gap-2 text-sm text-white/85 hover:text-white">
              <Phone size={16} />
              <span className="font-medium">+917880222377</span>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-bold">Our Location</h3>
            <button
              type="button"
              className="flex w-full items-start gap-2 text-left text-sm text-white/85 transition hover:text-white"
              onClick={() => window.open(openInMaps, "_blank")}
            >
              <MapPin size={18} className="mt-0.5 shrink-0 text-red-400" />
              <span>
                <span className="block font-semibold">Maestro Music Classes</span>
                <span className="mt-0.5 block text-xs opacity-85">
                  H16, Keshar Bagh Rd, near Charming Kidz School, Nalanda Parisar,
                  Indore, Madhya Pradesh 452009
                </span>
              </span>
            </button>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-6xl border-t border-white/20 pt-4 text-center text-sm text-white/70">
          © {new Date().getFullYear()} Grammy. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default GuestLayout;
