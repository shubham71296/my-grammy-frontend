import { BadgeCheck, BookOpen, Music, ReceiptText, ShieldCheck, Sparkles } from "lucide-react";
import WebsiteLogoImage from "../../assets/grammy-icon1.jpg";
import { cn } from "../../lib/cn";

const featureCards = [
  { title: "Instrument store", text: "Curated gear for every learner", icon: Music },
  { title: "Video courses", text: "Structured lessons at your pace", icon: BookOpen },
  { title: "Secure checkout", text: "Fast cart and payment flow", icon: ReceiptText },
  { title: "Student access", text: "Orders and courses in one place", icon: BadgeCheck },
];

export default function AuthShell({
  title,
  subtitle,
  eyebrow = "Welcome back",
  children,
  footer,
  maxWidth = "max-w-md",
  contentMaxWidth = "max-w-md",
  steps,
}) {
  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <aside className="relative hidden overflow-hidden bg-brand-900 text-white lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute -right-20 bottom-16 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative flex min-h-full w-full flex-col justify-between px-10 py-10 xl:px-14">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={WebsiteLogoImage}
                alt="Grammy"
                className="h-12 w-12 rounded-2xl object-cover shadow-lg ring-2 ring-white/25"
              />
              <div>
                <p className="text-lg font-extrabold leading-tight">Grammy</p>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  Music academy
                </p>
              </div>
            </div>

            <div className="mt-14 max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Instruments, courses, orders
              </span>
              <p className="mt-5 text-3xl font-black leading-tight tracking-tight xl:text-4xl">
                Learn music, buy instruments, and manage everything in one place.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                A clean account experience for students and shoppers, built around
                secure access and simple navigation.
              </p>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-3">
              {featureCards.map(({ title: cardTitle, text, icon: Icon }) => (
                <div
                  key={cardTitle}
                  className="rounded-2xl border border-white/12 bg-white/[0.07] p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/[0.11]"
                >
                  <Icon className="h-5 w-5 text-sky-300" />
                  <p className="mt-3 text-xs font-black uppercase tracking-wide text-white/65">
                    {cardTitle}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="flex items-center gap-2 text-xs font-semibold text-white/55">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            Secure login · Student purchases · Course access
          </p>
        </div>
      </aside>

      <main className="page-gradient flex min-h-[100dvh] items-center justify-center px-4 py-6 sm:px-6 lg:bg-white lg:py-10">
        <div className={cn("w-full", maxWidth)}>
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <img
              src={WebsiteLogoImage}
              alt="Grammy"
              className="h-11 w-11 rounded-2xl object-cover shadow-md ring-2 ring-brand-100"
            />
            <div>
              <p className="text-base font-extrabold text-brand-900">Grammy</p>
              <p className="text-xs font-semibold text-muted">Instruments & courses</p>
            </div>
          </div>

          <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.35)] sm:p-7">
            <div className={cn("mx-auto", contentMaxWidth)}>
              <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-brand-700">
                {eyebrow}
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>
              ) : null}

              {steps ? (
                <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-1.5">
                  {steps.map(({ label, active }) => (
                    <span
                      key={label}
                      className={cn(
                        "rounded-xl px-2 py-2 text-center text-[10px] font-black uppercase tracking-wide transition",
                        active ? "bg-brand-100 text-brand-800 shadow-sm" : "text-slate-400"
                      )}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-6">{children}</div>
            </div>
          </section>

          {footer ? <div className="mt-5 text-center">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}
