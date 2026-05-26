import { useEffect, useState } from "react";
import {
  BookOpen,
  ArrowLeft,
  GraduationCap,
  IndianRupee,
  Layers,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CourseVideoCard from "../../components/ui/card/CourseVideoCard";
import AddMoreCard from "../../components/ui/card/AddMoreCard";
import { openDialogAction, renderTableAction } from "../../features/ui/uiSlice";
import api from "../../api/axios";
import { formatCurrency } from "../../utils/format";
import { IMAGE_PLACEHOLDER } from "../../utils/image-constants";
import { getFirstMediaUrl } from "../../utils/media";
import { PageShell } from "../../components/ui/tw/PageShell";
import { Badge } from "../../components/ui/tw/Badge";
import { Spinner } from "../../components/ui/tw/Spinner";

const MyCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { renderTable } = useSelector((state) => state.ui);

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  const openFullScreen = (lec) => {
    const playlist = lectures
      .filter((item) => item.lecture_video?.[0]?.key)
      .map((item) => ({
        lectureId: item._id,
        videoKey: item.lecture_video?.[0]?.key,
        title: item.lecture_title,
      }));
    const currentIndex = Math.max(
      0,
      playlist.findIndex((item) => item.lectureId === lec._id)
    );

    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: {
          lectureId: lec._id,
          videoKey: lec.lecture_video?.[0]?.key,
          title: lec.lecture_title,
          playlist,
          currentIndex,
        },
        dialogInfo: { check: "view_video" },
      })
    );
  };

  const handleEditLecture = (lec) => {
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: lec,
        dialogInfo: { check: "edit_lecture" },
      })
    );
  };

  const handleDeleteLecture = (lec) => {
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: lec,
        dialogInfo: { check: "delete_lecture" },
      })
    );
  };

  const getCourseDetails = async (courseId) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/coursebyid/${courseId}`);
      const payload = response?.data?.data || response?.data;
      const courseData = payload?.course_data;
      const lecturesData = payload?.lectures_data || [];

      if (!courseData) {
        setCourse(null);
        setLectures([]);
      } else {
        setCourse(courseData);
        setLectures(Array.isArray(lecturesData) ? lecturesData : []);
      }
    } catch {
      setCourse(null);
      setLectures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getCourseDetails(id);
  }, [id]);

  useEffect(() => {
    if (renderTable) {
      if (!id) return;
      getCourseDetails(id);
      dispatch(renderTableAction({ renderTable: false }));
    }
  }, [renderTable, id, dispatch]);

  const thumbUrl = getFirstMediaUrl(course?.thumbnail_image, "");
  const instrumentTitle =
    course?.instrument?.instrument_title || course?.instrument || "—";

  const openThumbnailPreview = () => {
    if (!thumbUrl) return;
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: {
          previewUrl: thumbUrl,
          title: course.course_title || instrumentTitle,
        },
        dialogInfo: { check: "view_img_video" },
      })
    );
  };

  if (loading) {
    return (
      <PageShell className="pb-10">
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200/80 bg-white">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-slate-600">Loading course…</p>
        </div>
      </PageShell>
    );
  }

  if (!course) {
    return (
      <PageShell className="pb-10">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <BookOpen className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-lg font-extrabold text-navy">Course not found</p>
          <Link
            to="/admin/mycourseslist"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="pb-10">
      <Link
        to="/admin/mycourseslist"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        All courses
      </Link>

      <header className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)]">
        <div
          className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] via-white to-brand-500/[0.08]"
          aria-hidden
        />
        <div className="relative grid gap-6 p-6 sm:grid-cols-[minmax(0,280px)_1fr] sm:p-8">
          <button
            type="button"
            onClick={openThumbnailPreview}
            className="group relative flex aspect-[4/3] w-full max-w-[280px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3 shadow-lg ring-1 ring-slate-200/80 transition hover:ring-brand-300"
          >
            {thumbUrl ? (
              <img
                src={thumbUrl}
                alt={course.course_title}
                className="detail-thumb-img transition duration-500 group-hover:scale-[1.02]"
                onError={(e) => {
                  e.currentTarget.src = IMAGE_PLACEHOLDER;
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-violet-100">
                <GraduationCap className="h-16 w-16 text-brand-400" />
              </div>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-navy/50 text-sm font-bold tracking-wide text-white opacity-0 transition group-hover:opacity-100">
              Preview thumbnail
            </span>
          </button>

          <div className="flex min-w-0 flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-violet-800">
              <Sparkles className="h-3.5 w-3.5" />
              Course detail
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              {course.course_title}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-800">
                <Layers className="h-3.5 w-3.5 text-brand-600" />
                {instrumentTitle}
              </span>
              <Badge color="primary" className="normal-case text-sm">
                <IndianRupee className="mr-0.5 inline h-3.5 w-3.5" />
                {formatCurrency(course.course_price)}
              </Badge>
            </p>
            {course.course_description ? (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                {course.course_description}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Lectures in course
          </p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-brand-700">
            <PlayCircle className="h-5 w-5" />
            {lectures.length.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Manage
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-slate-600">
            Play, edit, or remove lectures · add new ones below.
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-violet-50/80 to-brand-50/50 px-5 py-4">
          <div>
            <h2 className="text-base font-extrabold text-navy">Lecture playlist</h2>
            <p className="text-xs text-muted">Tap play to preview a lesson</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-800 shadow-sm ring-1 ring-brand-100">
            {lectures.length} {lectures.length === 1 ? "video" : "videos"}
          </span>
        </div>

        <div className="p-5 sm:p-6">
          {lectures.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/30 py-14 text-center">
              <PlayCircle className="mb-3 h-10 w-10 text-brand-400" />
              <p className="font-semibold text-slate-800">No lectures yet</p>
              <p className="mt-1 text-sm text-slate-600">
                Add your first lecture to this course.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-start gap-x-3 gap-y-5">
              {lectures.map((lec, idx) => (
                <CourseVideoCard
                  key={lec._id}
                  lec={lec}
                  idx={idx}
                  openFullScreen={openFullScreen}
                  onEdit={handleEditLecture}
                  onDelete={handleDeleteLecture}
                />
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-start gap-x-3 gap-y-5 border-t border-slate-100 pt-6">
            <AddMoreCard
              title="Add lectures"
              onClick={() =>
                navigate("/admin/addlectures", {
                  state: {
                    course_id: id,
                    course_title: course.course_title,
                  },
                })
              }
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default MyCourseDetail;
