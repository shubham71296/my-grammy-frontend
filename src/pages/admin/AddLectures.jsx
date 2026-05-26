import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CirclePlus,
  Film,
  GraduationCap,
  ListVideo,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import lecturesInputs from "../../utils/add-lectures-inputs";
import InputText from "../../components/ui/inputs/InputText";
import InputFile from "../../components/ui/inputs/InputFile";
import FilePreview from "../../components/ui/inputs/FilePreview";
import { resetInputs, validateInputs } from "../../utils/common-util";
import { useS3UploadPipeline } from "../../hooks/useS3UploadPipeline";
import toast from "react-hot-toast";
import { useAddLectureMutation } from "../../features/api/adminApi";
import { rollbackUploadedKeys } from "../../utils/s3-rollback";
import {
  DialogNotice,
  DialogSection,
  UploadProgressBar,
} from "../../components/ui/dialog/dialogLayout";
import { PageShell } from "../../components/ui/tw/PageShell";
import { Button } from "../../components/ui/tw/Button";
import { Spinner } from "../../components/ui/tw/Spinner";
import { Modal, ModalBody } from "../../components/ui/tw/Modal";
import { cn } from "../../lib/cn";

export default function AddLectures() {
  const location = useLocation();
  const { course_id, course_title } = location.state || {};
  const [inputs, setInputs] = useState(lecturesInputs);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { progressMap, uploadVideos } = useS3UploadPipeline();
  const [addLecture] = useAddLectureMutation();
  const navigate = useNavigate();

  const titleField = inputs.find((f) => f._key === "lecture_title");
  const videoField = inputs.find((f) => f._key === "lecture_video");
  const titleIndex = inputs.findIndex((f) => f._key === "lecture_title");
  const videoIndex = inputs.findIndex((f) => f._key === "lecture_video");

  const selectedVideos = Array.isArray(videoField?._value) ? videoField._value : [];
  const uploading = selectedVideos.filter((f) => {
        const key = f.name || f.originalName;
        const pct = progressMap[key];
        return pct > 0 && pct < 100;
      });
  const uploadModalFiles = loading ? selectedVideos : uploading;

  const handleChange = async (e, p1, i1, updatedFiles = null) => {
    const tempInputs = [...inputs];
    if (p1._type === "file") {
      if (updatedFiles !== null) {
        tempInputs[i1]._value = updatedFiles;
        setInputs([...tempInputs]);
        return;
      }
      const files = e?.target?.files;
      if (files && files.length > 0) {
        const allowedVideoTypes = [
          "video/mp4",
          "video/quicktime",
          "video/webm",
          "video/ogg",
        ];
        const maxVideoSize = 500 * 1024 * 1024;
        const validFiles = Array.from(files).filter((file) => {
          if (!allowedVideoTypes.includes(file.type)) {
            tempInputs[i1]._errorMsg =
              "Only MP4, MOV, WEBM and OGG videos are allowed";
            return false;
          }
          if (file.size > maxVideoSize) {
            tempInputs[i1]._errorMsg = "File size must be less than 500 MB";
            return false;
          }
          return true;
        });
        if (validFiles.length === 0) {
          setInputs([...tempInputs]);
          return;
        }

        tempInputs[i1]._value = [validFiles[0]];
        tempInputs[i1]._errorMsg = "";
        setInputs([...tempInputs]);
        if (e?.target) e.target.value = "";
      }
    } else {
      tempInputs[i1]._value = e.target.value;
      tempInputs[i1]._errorMsg = "";
    }
    setInputs(tempInputs);
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!course_id) {
      toast.error("Open this page from a course to add lectures.");
      return;
    }
    const obj1 = validateInputs(inputs);
    if (obj1.hasError) {
      setInputs(obj1.inputs);
      return;
    }
    try {
      setLoading(true);
      const payload = {};
      let videoFiles = [];
      inputs.forEach((item) => {
        if (item._type === "file") {
          if (item._key === "lecture_video" && Array.isArray(item._value))
            videoFiles = item._value;
        } else {
          payload[item._key] = item._value;
        }
      });

      payload.lecture_video = await uploadVideos(
        videoFiles,
        "private-course-videos"
      );
      payload.course_id = course_id;

      try {
        const res = await addLecture(payload).unwrap();
        toast.success(res?.msg || "Lecture added");
        setMessage(res?.msg || "Lecture added successfully.");
        setInputs(resetInputs(inputs));
      } catch (apiErr) {
        await rollbackUploadedKeys(
          payload.lecture_video.map((f) => f.key).filter(Boolean)
        );
        throw apiErr;
      }
    } catch (err) {
      const errorMsg =
        err?.data?.msg || err?.message || "Something went wrong!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInputs(resetInputs(lecturesInputs));
    setMessage("");
  }, []);

  const backTo = course_id
    ? `/admin/mycoursedetail/${course_id}`
    : "/admin/mycourseslist";

  return (
    <PageShell className="pb-12">
      <Modal open={loading} lockClose maxWidth="max-w-md">
        <ModalBody className="bg-gradient-to-b from-violet-50/60 to-white px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto flex max-w-sm flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30">
            <RefreshCw className="h-7 w-7 animate-spin" />
          </span>
          <div>
            <p className="text-base font-extrabold text-navy">Uploading lesson</p>
            <p className="mt-1 text-sm text-slate-500">
              Please keep this tab open until the video finishes uploading.
            </p>
          </div>

            <div className="w-full rounded-2xl border border-violet-100 bg-white/90 p-3 text-left shadow-sm ring-1 ring-violet-100/60">
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                <RefreshCw className="h-3 w-3 animate-spin" aria-hidden />
                Upload progress
              </p>
              {uploadModalFiles.length > 0 ? (
                uploadModalFiles.map((f, idx) => (
                  <UploadProgressBar
                    key={`modal-${f.name || f.originalName}-${idx}`}
                    label={f.name || f.originalName}
                    percent={progressMap[f.name || f.originalName] || 0}
                  />
                ))
              ) : (
                <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 ring-1 ring-slate-100">
                  Preparing upload…
                </p>
              )}
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Link
        to={backTo}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        {course_title ? "Back to course" : "All courses"}
      </Link>

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
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/25 sm:h-14 sm:w-14">
              <ListVideo className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-800 shadow-sm ring-1 ring-violet-100 sm:text-[11px]">
                <Sparkles className="h-3.5 w-3.5" />
                New lesson
              </span>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-navy sm:mt-3 sm:text-3xl">
                Add lecture
              </h2>
              {course_title ? (
                <p className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 min-[520px]:justify-start sm:text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-800">
                    <GraduationCap className="h-3.5 w-3.5 text-violet-600" />
                    {course_title}
                  </span>
                </p>
              ) : (
                <p className="mx-auto mt-1.5 max-w-xl text-xs leading-relaxed text-amber-700 min-[520px]:mx-0 sm:mt-2 sm:text-sm">
                  Select a course from your library first, then add lectures from its
                  detail page.
                </p>
              )}
            </div>
          </div>
          {course_id ? (
            <Link
              to={`/admin/mycoursedetail/${course_id}`}
              className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 text-sm font-bold text-white shadow-md shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg active:translate-y-0 min-[520px]:w-auto"
            >
              <PlayCircle className="h-4 w-4" />
              View playlist
            </Link>
          ) : null}
        </div>
      </header>

      {!course_id ? (
        <div className="mb-6 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 to-orange-50/50 p-5 shadow-sm">
          <p className="font-bold text-amber-900">No course selected</p>
          <p className="mt-1 text-sm text-amber-800/90">
            Go to My courses, open a course, and use &quot;Add lectures&quot; from the
            lecture playlist.
          </p>
          <Link
            to="/admin/mycourseslist"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:underline"
          >
            <GraduationCap className="h-4 w-4" />
            Browse courses
          </Link>
        </div>
      ) : null}

      {message ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50 to-teal-50/40 p-4 shadow-sm ring-1 ring-emerald-100/80">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
            <CirclePlus className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold text-emerald-900">Lecture saved</p>
            <p className="mt-0.5 text-sm text-emerald-800/90">{message}</p>
            <p className="mt-1 text-xs text-emerald-700/80">
              Add another lesson below or view the course playlist.
            </p>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50/80 to-indigo-50/40 px-5 py-4 sm:px-6">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-navy">
            <Film className="h-5 w-5 text-violet-600" />
            Lesson content
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Title and video file for this lesson
          </p>
        </div>

        <div className="space-y-5 bg-gradient-to-b from-violet-50/15 via-white to-slate-50/20 p-5 sm:p-6">
          <DialogNotice icon={Video} title="Before you upload" variant="brand">
            <ul className="list-inside list-disc space-y-0.5 text-sm">
              <li>One video per lecture — MP4, MOV, WEBM, or OGG.</li>
              <li>Maximum file size: 500 MB.</li>
              <li>Use a clear title so students know what they will learn.</li>
            </ul>
          </DialogNotice>

          {titleField && titleIndex >= 0 ? (
            <DialogSection title="Lesson title">
              <InputText
                {...titleField}
                onChange={(event) => handleChange(event, titleField, titleIndex)}
              />
            </DialogSection>
          ) : null}

          {videoField && videoIndex >= 0 ? (
            <DialogSection
              title="Lesson video"
              className="border-violet-100/90 ring-violet-100/40"
            >
              <div className="space-y-4">
                <InputFile
                  {...videoField}
                  onChange={(event) => handleChange(event, videoField, videoIndex)}
                />

                {Array.isArray(videoField._value) && videoField._value.length > 0 ? (
                  <FilePreview
                    files={videoField._value}
                    onRemove={(fileIndex) => {
                      const updated = videoField._value.filter(
                        (_, idx) => idx !== fileIndex
                      );
                      handleChange(null, videoField, videoIndex, updated);
                    }}
                  />
                ) : null}

                {uploading.length > 0 ? (
                  <div className="space-y-2 rounded-xl border border-violet-100/90 bg-violet-50/40 p-3 ring-1 ring-violet-100/50">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                      <RefreshCw className="h-3 w-3 animate-spin" aria-hidden />
                      Uploading…
                    </p>
                    {uploading.map((f, idx) => (
                      <UploadProgressBar
                        key={`${f.name || f.originalName}-${idx}`}
                        label={f.name || f.originalName}
                        percent={progressMap[f.name || f.originalName] || 0}
                      />
                    ))}
                  </div>
                ) : null}

                {videoField._errorMsg ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                    {videoField._errorMsg}
                  </p>
                ) : null}
              </div>
            </DialogSection>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-gradient-to-r from-violet-50/40 via-white to-indigo-50/30 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            variant="outline"
            onClick={() => navigate(backTo)}
            disabled={loading}
            className="min-h-11 sm:min-w-[120px]"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>

          {message && course_id ? (
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/mycoursedetail/${course_id}`)}
              className="inline-flex min-h-11 items-center gap-2 border-violet-200 text-violet-800 hover:bg-violet-50"
            >
              <PlayCircle className="h-4 w-4" />
              View playlist
            </Button>
          ) : null}

          <Button
            disabled={loading || !course_id}
            onClick={handleSubmit}
            className={cn(
              "inline-flex min-h-11 items-center justify-center gap-2 px-6 shadow-md shadow-violet-600/20 sm:min-w-[180px]",
              "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            )}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="border-white/30 border-t-white" />
                Adding…
              </>
            ) : (
              <>
                <CirclePlus className="h-4 w-4" aria-hidden />
                {message ? "Add another lecture" : "Add lecture"}
              </>
            )}
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
