import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  CircleHelp,
  Sparkles,
  ChevronRight,
  GraduationCap,
  LogIn,
  Music,
  Quote,
  RefreshCw,
  Star,
} from "lucide-react";
import bannerImg from "../../assets/bannerImg.JPG";
import guitarImg from "../../assets/guitar.jpg";
import InstrumentCard from "../../components/ui/card/InstrumentCard";
import LocationMap from "../../components/ui/LocationMap";
import CourseCard from "../../components/ui/card/CourseCard";
import CatalogGridItem from "../../components/ui/CatalogGridItem";
import {
  HOME_STATS,
  HOME_FEATURES,
  HOME_STEPS,
  HOME_CATEGORIES,
  HOME_TESTIMONIALS,
  USER_QUICK_LINKS,
  GUEST_QUICK_LINKS,
} from "../../components/landing/homeContent";
import { useGetInstrumentsQuery, useGetCoursesQuery } from "../../features/api/catalogApi";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useGuestLoginDialog } from "../../hooks/useGuestLoginDialog";
import { LANDING_ROUTES } from "../../constants/landingRoutes";
import { Button } from "../../components/ui/tw/Button";
import { Spinner } from "../../components/ui/tw/Spinner";
import { cn } from "../../lib/cn";

const FEATURED_LIMIT = 6;

export default function LandingPage({ mode = "user" }) {
  const isGuest = mode === "guest";
  const routes = LANDING_ROUTES[mode];
  const navigate = useNavigate();
  const { addToCart } = useAddToCart();
  const openGuestLoginDialog = useGuestLoginDialog();
  const { user } = useSelector((state) => state.auth);
  const displayName = user?.em?.split("@")[0] || "Musician";

  const listArgs = { guest: isGuest, limit: FEATURED_LIMIT, skip: 0 };

  const {
    data: instrumentList = [],
    isLoading: loadingInstruments,
    isError: instrumentsError,
    refetch: refetchInstruments,
  } = useGetInstrumentsQuery(listArgs);
  const {
    data: courseList = [],
    isLoading: loadingCourses,
    isError: coursesError,
    refetch: refetchCourses,
  } = useGetCoursesQuery(listArgs);

  const loading = loadingInstruments || loadingCourses;
  const hasError = instrumentsError || coursesError;
  const quickLinks = isGuest ? GUEST_QUICK_LINKS : USER_QUICK_LINKS;

  const handleViewDetails = (item, type) => {
    if (type === "instrument") navigate(routes.instrumentDetail(item._id));
    else if (type === "course") navigate(routes.courseDetail(item._id));
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-3 px-4">
        <p className="text-danger">Could not load featured content.</p>
        <Button
          onClick={() => {
            refetchInstruments();
            refetchCourses();
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Hero */}
      <section
        aria-label="Hero"
        className="relative overflow-hidden text-white"
      >
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImg})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-indigo-900/75 to-slate-900/85" aria-hidden />
        <div
          className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Grammy Music Academy · Indore
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {isGuest ? (
                  <>Your journey into <span className="text-sky-300">music</span> starts here</>
                ) : (
                  <>
                    Welcome back, <span className="text-sky-300">{displayName}</span>
                  </>
                )}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base lg:mx-0">
                Premium instruments, expert-led video courses, and a welcoming academy —
                everything you need to learn, perform, and grow with confidence.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Link to={routes.instruments} className="btn-primary w-full sm:w-auto">
                  Browse Instruments
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={routes.courses}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/40",
                    "px-4 py-2.5 text-sm font-bold backdrop-blur-sm transition hover:bg-white/15 sm:w-auto"
                  )}
                >
                  <GraduationCap className="h-4 w-4" />
                  Explore Courses
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {HOME_STATS.slice(0, 4).map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
                  >
                    <Icon className="mb-2 h-5 w-5 text-sky-300" />
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-[11px] text-white/75">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="relative z-10 mx-auto -mt-6 max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-3 text-center shadow-md transition hover:-translate-y-0.5 hover:shadow-lg min-[380px]:flex-row min-[380px]:gap-3 min-[380px]:text-left sm:p-4"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                    item.color
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="whitespace-nowrap text-xs font-bold text-navy min-[380px]:text-sm">{item.label}</p>
                  <p className="text-[11px] leading-snug text-muted">{item.desc}</p>
                </div>
                <ChevronRight className="ml-auto hidden h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 sm:block" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Offer banner */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900 via-brand-700 to-indigo-600 p-6 text-white sm:p-8">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-200">
                Limited-time bundle
              </p>
              <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">
                Buy an instrument — get the matching course FREE
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/90">
                Pair your gear with structured lessons. Learn faster with the perfect
                instrument + course combination.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Link
                to={routes.instruments}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand-900 hover:bg-sky-50"
              >
                <Music className="h-4 w-4" />
                Shop instruments
              </Link>
              <Link
                to={routes.courses}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/50 px-5 py-2.5 text-sm font-bold hover:bg-white/10"
              >
                <GraduationCap className="h-4 w-4" />
                View courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <SectionHeading
          eyebrow="What we teach"
          title="Find your instrument"
          subtitle="From classical piano to modern vocals — explore categories that match your style."
        />
        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
          {HOME_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                to={routes.instruments}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
              >
                <Icon className="h-4 w-4 text-brand-600" />
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Grammy */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <SectionHeading
          eyebrow="Why choose us"
          title="Learn with Grammy"
          subtitle="A complete music ecosystem — shop, learn, and grow in one place."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-bold text-navy">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-brand-50/40 p-6 sm:p-8">
          <SectionHeading
            eyebrow="Simple process"
            title="How it works"
            subtitle="Three easy steps from browsing to playing your first song."
            centered
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {HOME_STEPS.map((step) => (
              <div key={step.step} className="relative text-center md:text-left">
                <span className="text-4xl font-black text-brand-200">{step.step}</span>
                <h3 className="mt-2 font-bold text-navy">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedSection
        title="Featured Instruments"
        subtitle="Hand-picked gear for beginners and advancing players."
        viewAllTo={routes.instruments}
        empty={instrumentList.length === 0}
        emptyText="New instruments coming soon — check back shortly."
      >
        {instrumentList.map((it) => (
          <CatalogGridItem key={it._id}>
            <InstrumentCard
              item={it}
              mode={isGuest ? "guest" : "user"}
              navTo={!isGuest ? routes.instrumentDetail(it._id) : undefined}
              onViewDetails={
                isGuest ? () => handleViewDetails(it, "instrument") : undefined
              }
              onAddToCart={isGuest ? openGuestLoginDialog : addToCart}
            />
          </CatalogGridItem>
        ))}
      </FeaturedSection>

      <FeaturedSection
        title="Popular Courses"
        subtitle="Structured lessons with video lectures and clear milestones."
        viewAllTo={routes.courses}
        courses
        empty={courseList.length === 0}
        emptyText="Courses are being added — explore again soon."
      >
        {courseList.map((course) => (
          <CatalogGridItem key={course._id}>
            <CourseCard
              course={course}
              mode={isGuest ? "guest" : "user"}
              onViewDetails={
                isGuest ? () => handleViewDetails(course, "course") : undefined
              }
              onAddToCart={isGuest ? openGuestLoginDialog : addToCart}
            />
          </CatalogGridItem>
        ))}
      </FeaturedSection>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SectionHeading
          eyebrow="Community"
          title="Stories from our learners"
          subtitle="Real feedback from students and buyers across Indore and beyond."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {HOME_TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm"
            >
              <Quote className="h-8 w-8 text-brand-200" />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-2 font-bold text-navy">{t.name}</p>
              <p className="text-xs text-muted">{t.role}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA + testimonial highlight */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm md:flex-row md:p-8">
          <img
            src={guitarImg}
            alt=""
            className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-4 ring-brand-100"
          />
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-extrabold text-brand-900">
              Ready to start your musical journey?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Join hundreds of learners who trust Grammy for instruments, courses, and
              in-person guidance at our Indore academy.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to={routes.courses} className="btn-primary whitespace-nowrap">
              <GraduationCap className="h-4 w-4" />
              Start learning
            </Link>
            {!isGuest && (
              <Link to="/user/faq" className="btn-outline whitespace-nowrap">
                <CircleHelp className="h-4 w-4" />
                FAQs
              </Link>
            )}
            {isGuest && (
              <Link to="/login" className="btn-outline whitespace-nowrap">
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </section>

      <LocationSection />

      {/* Bottom stats strip */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-brand-900 p-5 text-white sm:grid-cols-4 sm:gap-4 sm:p-6">
          {HOME_STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="text-center">
                <Icon className="mx-auto h-5 w-5 text-sky-300" />
                <p className="mt-2 text-lg font-bold sm:text-xl">{s.value}</p>
                <p className="text-[10px] text-white/70 sm:text-xs">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle, centered }) {
  return (
    <div className={cn(centered && "text-center")}>
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-extrabold text-brand-900 sm:text-2xl">{title}</h2>
      <p
        className={cn(
          "mt-1 max-w-2xl text-sm text-muted",
          centered && "mx-auto"
        )}
      >
        {subtitle}
      </p>
    </div>
  );
}

function FeaturedSection({
  title,
  subtitle,
  viewAllTo,
  children,
  courses = false,
  empty,
  emptyText,
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow={courses ? "Courses" : "Shop"} title={title} subtitle={subtitle} />
        <Link
          to={viewAllTo}
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5",
            courses
              ? "bg-gradient-to-r from-brand-700 to-indigo-600"
              : "bg-gradient-to-r from-brand-600 to-violet-600"
          )}
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {empty ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center text-sm text-muted">
          {emptyText}
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 place-items-center gap-3 min-[420px]:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {children}
        </div>
      )}
    </div>
  );
}

function LocationSection() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10">
      <SectionHeading
        eyebrow="Visit us"
        title="Maestro Music Academy, Indore"
        subtitle="Modern classrooms, quality instruments, and mentors for every skill level."
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {[
            "Flute, guitar, piano & vocal training under one roof.",
            "Flexible batches for kids, teens, and adults.",
            "Instrument showroom — try before you buy.",
          ].map((line) => (
            <div
              key={line}
              className="flex gap-3 rounded-xl border border-slate-200/90 bg-white p-4 text-sm text-slate-600"
            >
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
              {line}
            </div>
          ))}
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800"
          >
            Contact us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm lg:col-span-3">
          <LocationMap city="Maestro Music Classes - Flute, Guitar, Piano & Singing Academy, Indore" />
        </div>
      </div>
    </div>
  );
}
