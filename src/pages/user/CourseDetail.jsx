import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Guitar,
  PlayCircle,
  Sparkles,
  Video,
  ZoomIn,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import LectureCard from "../../components/ui/card/LectureCard";
import { useGuestLoginDialog } from "../../hooks/useGuestLoginDialog";
import { formatCurrency } from "../../utils/format";
import { useGetCourseByIdQuery } from "../../features/api/catalogApi";
import { openDialogAction } from "../../features/ui/uiSlice";
import { IMAGE_PLACEHOLDER } from "../../utils/image-constants";
import { PageShell } from "../../components/ui/tw/PageShell";
import { BackButton } from "../../components/ui/tw/BackButton";
import { Badge } from "../../components/ui/tw/Badge";
import { Button } from "../../components/ui/tw/Button";
import { Spinner } from "../../components/ui/tw/Spinner";
import { cn } from "../../lib/cn";

const HIGHLIGHTS = [
  { icon: Video, label: "HD video lessons" },
  { icon: GraduationCap, label: "Step-by-step path" },
  { icon: Sparkles, label: "Practice-ready content" },
];

const CourseDetail = ({ mode = "user" }) => {
  const isGuest = mode === "guest";
  const catalogPath = isGuest ? "/guest/guestcourses" : "/user/courses";
  const homePath = isGuest ? "/guest" : "/user";

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const openGuestLoginDialog = useGuestLoginDialog();

  const { data, isLoading: loading, isError } = useGetCourseByIdQuery(
    { id, guest: isGuest },
    { skip: !id }
  );
  const course = data?.course ?? null;
  const lectures = data?.lectures ?? [];

  const thumbnailUrl = course?.thumbnail_image?.[0]?.url || IMAGE_PLACEHOLDER;
  const instrumentTitle =
    course?.instrument?.instrument_title || course?.instrument || null;

  const openPreview = () => {
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: {
          previewUrl: course?.thumbnail_image?.[0]?.url,
          title: course?.course_title,
        },
        dialogInfo: { check: "view_img_video" },
      })
    );
  };

  const openFullScreen = (lec) => {
    if (isGuest) {
      openGuestLoginDialog();
      return;
    }
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: {
          lectureId: lec._id,
          videoKey: lec.lecture_video?.[0]?.key,
          title: lec.lecture_title,
        },
        dialogInfo: { check: "view_video" },
      })
    );
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-muted">Loading course…</p>
        </div>
      </PageShell>
    );
  }

  if (isError || !course) {
    return (
      <PageShell narrow>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-soft">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-danger">
            <BookOpen className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-navy">Course not found</h2>
          <p className="mt-2 text-sm text-muted">
            This course may have been removed or the link is incorrect.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <BackButton to={catalogPath} label="Browse courses" />
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  const description =
    course.course_description ||
    "Structured lessons designed to help you learn at your own pace with clear guidance from start to finish.";

  return (
    <PageShell className="pb-10">
      <div className="mb-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:mb-5 sm:flex sm:flex-wrap sm:gap-3">
        <BackButton
          to={catalogPath}
          label={
            <>
              <span className="hidden min-[390px]:inline">All courses</span>
              <span className="min-[390px]:hidden">All</span>
            </>
          }
          className="shrink-0 gap-1.5 px-2 py-1.5 text-xs sm:gap-2.5 sm:px-3 sm:py-2 sm:text-sm"
        />
        <nav
          className="flex min-w-0 items-center gap-1 text-xs text-muted sm:flex-1 sm:gap-1.5 sm:text-sm"
          aria-label="Breadcrumb"
        >
          <span className="hidden min-[360px]:inline">Courses</span>
          <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 min-[360px]:block" aria-hidden />
          <span className="line-clamp-1 font-semibold text-brand-800">
            {course.course_title}
          </span>
        </nav>
      </div>

      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)]">
        <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:divide-x lg:divide-slate-100">
          <section className="bg-slate-50/80 p-4 sm:p-6 lg:p-8">
            <button
              type="button"
              onClick={openPreview}
              className="group relative mx-auto block w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm outline-none transition duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              <div className="relative flex min-h-[200px] w-full items-center justify-center bg-gradient-to-b from-slate-50 to-white p-4 sm:min-h-[260px] lg:min-h-[300px]">
                <img
                  src={thumbnailUrl}
                  alt={course.course_title}
                  className="product-card__img max-h-[200px] w-full max-w-full object-contain transition duration-300 group-hover:scale-[1.02] sm:max-h-[240px] lg:max-h-[280px]"
                  onError={(e) => {
                    e.currentTarget.src = IMAGE_PLACEHOLDER;
                  }}
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/0 transition group-hover:bg-slate-900/25">
                  <span className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg transition group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" />
                    Preview
                  </span>
                </span>
              </div>
            </button>
            <p className="mt-3 text-center text-xs text-muted">
              Tap thumbnail to enlarge
            </p>
          </section>

          <section className="flex flex-col p-5 sm:p-7 lg:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">
              <GraduationCap className="h-3.5 w-3.5" />
              Online course
            </span>

            <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-navy sm:text-3xl">
              {course.course_title}
            </h2>

            {instrumentTitle && (
              <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2 text-sm text-amber-900">
                <Guitar className="h-4 w-4 shrink-0 text-amber-700" />
                <span>
                  Bundled with{" "}
                  <strong className="font-bold">{instrumentTitle}</strong>
                </span>
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge
                color={course.isPurchased ? "success" : "primary"}
                className="normal-case text-sm"
              >
                {course.isPurchased ? "✓ Purchased" : formatCurrency(course.course_price)}
              </Badge>
              <Badge
                color={course.isPurchased ? "success" : "default"}
                className="normal-case"
              >
                {course.isPurchased ? "Full access" : `${lectures.length} lectures`}
              </Badge>
            </div>

            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-xs font-semibold text-slate-700"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                About this course
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {description}
              </p>
            </div>

            <div className="mt-8 hidden sm:block">
              <BackButton to={catalogPath} label="More courses" />
            </div>
          </section>
        </div>
      </div>

      {/* Lectures */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-navy sm:text-xl">
                <PlayCircle className="h-5 w-5 text-brand-600" />
                Course lectures
              </h2>
              <Badge color="default" className="normal-case">
                {lectures.length} {lectures.length === 1 ? "lesson" : "lessons"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              {isGuest
                ? "Sign in to watch full lesson videos."
                : course.isPurchased
                  ? "You have access to all lessons below."
                  : "Preview the curriculum — purchase to unlock playback."}
            </p>
          </div>
          <Badge
            color={course.isPurchased ? "success" : "warning"}
            className="w-fit normal-case"
          >
            {course.isPurchased ? "Unlocked" : "Preview mode"}
          </Badge>
        </div>

        {lectures.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-14 text-center">
            <Video className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">
              No lectures available yet
            </p>
            <p className="mt-1 text-xs text-muted">
              Check back soon — new lessons may be added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {lectures.map((lec, idx) => (
              <LectureCard
                key={lec._id}
                lec={lec}
                index={idx}
                variant="light"
                onPlay={openFullScreen}
              />
            ))}
          </div>
        )}
      </section>

      <p className="mt-6 text-center text-xs text-muted sm:text-left">
        <button
          type="button"
          onClick={() => navigate(homePath)}
          className="font-semibold text-brand-600 underline-offset-2 hover:underline"
        >
          Return to home
        </button>
      </p>

      <div className="mt-6 sm:hidden">
        <BackButton to={catalogPath} label="All courses" className="w-full justify-center" />
      </div>
    </PageShell>
  );
};

export default CourseDetail;
