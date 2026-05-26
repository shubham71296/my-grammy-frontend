import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Inbox,
  Layers,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import CourseAccordion from "../../components/ui/accordion/CourseAccordion";
import CourseCard from "../../components/ui/card/CourseCard";
import { PageShell } from "../../components/ui/tw/PageShell";
import { useGetCoursesQuery } from "../../features/api/catalogApi";
import { openDialogAction, renderTableAction } from "../../features/ui/uiSlice";

const groupByInstrument = (courses) =>
  courses.reduce((acc, course) => {
    const key = course.instrument?.instrument_title || "Other instruments";
    if (!acc[key]) acc[key] = [];
    acc[key].push(course);
    return acc;
  }, {});

function MyCoursesList() {
  const { renderTable } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const { data: allCourses = [], refetch, isLoading } = useGetCoursesQuery({
    limit: 0,
  });
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allCourses;
    return allCourses.filter(
      (c) =>
        c.course_title?.toLowerCase().includes(q) ||
        c.instrument?.instrument_title?.toLowerCase().includes(q)
    );
  }, [allCourses, search]);

  const groupedCourses = useMemo(
    () => groupByInstrument(filteredCourses),
    [filteredCourses]
  );

  const instrumentCount = Object.keys(groupedCourses).length;
  const hasSearch = search.trim().length > 0;

  useEffect(() => {
    if (renderTable) {
      refetch();
      dispatch(renderTableAction({ renderTable: false }));
    }
  }, [renderTable, refetch, dispatch]);

  const handleEditLecture = (course) => {
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: course,
        dialogInfo: { check: "edit_course" },
      })
    );
  };

  const handleDeleteLecture = (course) => {
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: course,
        dialogInfo: { check: "delete_course" },
      })
    );
  };

  return (
    <PageShell className="pb-10">
      <header className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-violet-100/80 bg-gradient-to-br from-white via-violet-50/40 to-indigo-50/50 shadow-[0_18px_45px_-30px_rgba(76,29,149,0.35)]">
        <div
          className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-14 left-6 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
          <div className="flex flex-col items-center gap-3 text-center min-[520px]:flex-row min-[520px]:items-start min-[520px]:gap-4 min-[520px]:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-sm ring-1 ring-violet-200/70 sm:h-14 sm:w-14">
              <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-800 shadow-sm ring-1 ring-violet-100 sm:text-[11px]">
                <Sparkles className="h-3.5 w-3.5" />
                Learning catalog
              </span>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-navy sm:mt-3 sm:text-3xl">
                My courses
              </h2>
              <p className="mx-auto mt-1.5 max-w-xl text-xs leading-relaxed text-slate-600 min-[520px]:mx-0 sm:mt-2 sm:text-sm">
                Browse courses by instrument, open a course to manage lectures, or
                publish a new course.
              </p>
            </div>
          </div>

          <Link
            to="/admin/createcourse"
            className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 text-sm font-bold text-white shadow-md shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg active:translate-y-0 min-[520px]:w-auto"
          >
            <Plus className="h-5 w-5" />
            Create course
          </Link>
        </div>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Total courses
          </p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-navy">
            <BookOpen className="h-5 w-5 text-violet-600" />
            {isLoading ? "…" : allCourses.length.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Instrument groups
          </p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-brand-700">
            <Layers className="h-5 w-5 text-brand-600" />
            {isLoading ? "…" : instrumentCount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Quick tip
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-slate-600">
            Click a course card to open lectures and add more lessons.
          </p>
        </div>
      </div>

      {allCourses.length > 0 && (
        <section className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-violet-50/25 to-slate-50/80 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100/90 px-5 py-4 sm:px-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20">
              <Search className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-extrabold text-navy">Search courses</h2>
              <p className="text-xs text-muted">Filter by course or instrument name</p>
            </div>
            {hasSearch && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-red-50 hover:text-red-700"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
          <div className="p-5 sm:p-6">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Piano basics, Guitar…"
              className="input-search-elevated w-full max-w-xl"
            />
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-4">
          <div>
            <h2 className="text-base font-extrabold text-navy">Course library</h2>
            <p className="text-xs text-muted">Grouped by linked instrument</p>
          </div>
          {!isLoading && filteredCourses.length > 0 ? (
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800 ring-1 ring-violet-100/80">
              {filteredCourses.length} total{" "}
              {filteredCourses.length === 1 ? "course" : "courses"}
            </span>
          ) : null}
        </div>

        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            </div>
          ) : allCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-violet-200 bg-gradient-to-b from-violet-50/50 to-white py-16 text-center">
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Inbox className="h-8 w-8" />
              </span>
              <p className="text-lg font-extrabold text-navy">No courses yet</p>
              <p className="mt-2 max-w-sm text-sm text-slate-600">
                Add an instrument first, then create your first course and lectures.
              </p>
              <Link
                to="/admin/createcourse"
                className="btn-primary mt-6 inline-flex items-center gap-2 px-6 text-sm font-bold"
              >
                <Plus className="h-4 w-4" />
                Create course
              </Link>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 py-12 text-center">
              <p className="font-semibold text-slate-700">No courses match your search</p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-3 text-sm font-semibold text-brand-700 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.keys(groupedCourses).map((instrumentTitle, idx) => (
                <CourseAccordion
                  key={instrumentTitle + idx}
                  title={instrumentTitle}
                  count={groupedCourses[instrumentTitle].length}
                  courseNames={groupedCourses[instrumentTitle].map(
                    (c) => c.course_title
                  )}
                  defaultOpen={idx === 0}
                >
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {groupedCourses[instrumentTitle].map((course) => (
                      <CourseCard
                        key={course._id}
                        mode="admin"
                        course={course}
                        onEdit={handleEditLecture}
                        onDelete={handleDeleteLecture}
                      />
                    ))}
                  </div>
                </CourseAccordion>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default MyCoursesList;
