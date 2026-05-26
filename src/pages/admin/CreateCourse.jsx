import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CirclePlus,
  GraduationCap,
  ImageIcon,
  Layers,
  ListVideo,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import createCoursesInputs from "../../utils/create-courses-inputs";
import InputText from "../../components/ui/inputs/InputText";
import InputFile from "../../components/ui/inputs/InputFile";
import FilePreview from "../../components/ui/inputs/FilePreview";
import { resetInputs, validateInputs } from "../../utils/common-util";
import { useS3UploadPipeline } from "../../hooks/useS3UploadPipeline";
import { rollbackUploadedKeys } from "../../utils/s3-rollback";
import toast from "react-hot-toast";
import DropDown from "../../components/ui/inputs/DropDown";
import api from "../../api/axios";
import {
  useCheckCourseTitleMutation,
  useCreateCourseMutation,
} from "../../features/api/adminApi";
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

function getUploadingFiles(files, progressMap) {
  if (!Array.isArray(files)) return [];
  return files.filter((f) => {
    const key = f.name || f.originalName;
    const pct = progressMap[key];
    return pct > 0 && pct < 100;
  });
}

export default function CreateCourse() {
  const [inputs, setInputs] = useState(createCoursesInputs);
  const [loading, setLoading] = useState(false);
  const { progressMap, uploadImages } = useS3UploadPipeline();
  const [checkTitle] = useCheckCourseTitleMutation();
  const [createCourse] = useCreateCourseMutation();
  const navigate = useNavigate();

  const instrumentField = inputs.find((f) => f._key === "instrument");
  const instrumentIndex = inputs.findIndex((f) => f._key === "instrument");
  const thumbnailField = inputs.find((f) => f._key === "thumbnail_image");
  const thumbnailIndex = inputs.findIndex((f) => f._key === "thumbnail_image");
  const uploading = getUploadingFiles(thumbnailField?._value, progressMap);

  const textFields = inputs.filter(
    (f) =>
      ["text", "number", "password"].includes(f._type) &&
      f._key !== "course_description"
  );
  const descriptionField = inputs.find((f) => f._key === "course_description");
  const descriptionIndex = inputs.findIndex((f) => f._key === "course_description");

  const handleChange = async (e, p1, i1, updatedFiles = null) => {
    const tempInputs = [...inputs];
    if (p1._type === "file") {
      if (updatedFiles !== null) {
        tempInputs[i1]._value = updatedFiles;
        setInputs([...tempInputs]);
        return;
      }
      const files = e.target.files;
      if (files && files.length > 0) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSize = 100 * 1024 * 1024;
        const validFiles = Array.from(files).filter((file) => {
          if (!allowedTypes.includes(file.type)) {
            tempInputs[i1]._errorMsg = "Only JPG and PNG files are allowed";
            return false;
          }
          if (file.size > maxSize) {
            tempInputs[i1]._errorMsg = "File size must be less than 100 MB";
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
    const obj1 = validateInputs(inputs);
    if (obj1.hasError) {
      setInputs(obj1.inputs);
      return;
    }
    try {
      setLoading(true);
      const titleField = inputs.find((f) => f._key === "course_title");
      const title = titleField?._value?.trim();
      const check = await checkTitle({ course_title: title }).unwrap();
      if (!check?.success) {
        toast.error(check?.msg || "Title error");
        setLoading(false);
        return;
      }

      const payload = {};
      let imageFiles = [];
      inputs.forEach((item) => {
        if (item._type === "file") {
          if (item._key === "thumbnail_image" && Array.isArray(item._value))
            imageFiles = item._value;
        } else {
          payload[item._key] = item._value;
        }
      });
      payload.thumbnail_image = await uploadImages(
        imageFiles,
        "public-course-thumbnails"
      );

      try {
        const res = await createCourse(payload).unwrap();
        const dataobj = res?.data;
        toast.success(res?.msg || "Course created");
        setInputs(resetInputs(createCoursesInputs));
        navigate("/admin/addlectures", {
          state: {
            course_id: dataobj._id,
            course_title: dataobj.course_title,
          },
        });
      } catch (apiErr) {
        await rollbackUploadedKeys(
          payload.thumbnail_image.map((f) => f.key).filter(Boolean)
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

  const getAllInstrumentsData = async () => {
    try {
      const body = {
        query: {},
        projection: {},
        options: { skip: 0, limit: 0, sort: { createdAt: -1 } },
      };
      const response = await api.post("/admin/allinstumnts", body);
      const instrumentOptions = response.data.data.map((item) => ({
        label: item.instrument_title,
        value: item._id,
      }));
      setInputs((prevInputs) =>
        prevInputs.map((p) =>
          p._key === "instrument" ? { ...p, _options: instrumentOptions } : p
        )
      );
    } catch (error) {
      console.error("Error fetching instruments:", error);
      toast.error("Could not load instruments. Try refreshing the page.");
    }
  };

  useEffect(() => {
    setInputs(resetInputs(createCoursesInputs));
    getAllInstrumentsData();
  }, []);

  return (
    <PageShell className="pb-12">
      <Modal open={loading} lockClose maxWidth="max-w-sm">
        <ModalBody className="flex flex-col items-center gap-4 bg-gradient-to-b from-violet-50/50 to-white py-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30">
            <RefreshCw className="h-7 w-7 animate-spin" />
          </span>
          <div className="text-center">
            <p className="text-base font-extrabold text-navy">Creating course</p>
            <p className="mt-1 text-sm text-slate-500">
              Saving details and uploading thumbnail…
            </p>
          </div>
        </ModalBody>
      </Modal>

      <Link
        to="/admin/mycourseslist"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-violet-700"
      >
        <ArrowLeft className="h-4 w-4" />
        My courses
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
              <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-800 shadow-sm ring-1 ring-violet-100 sm:text-[11px]">
                <Sparkles className="h-3.5 w-3.5" />
                Learning catalog
              </span>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-navy sm:mt-3 sm:text-3xl">
                Create course
              </h2>
              <p className="mx-auto mt-1.5 max-w-xl text-xs leading-relaxed text-slate-600 min-[520px]:mx-0 sm:mt-2 sm:text-sm">
                Link a course to an instrument, then add lecture videos on the next
                step.
              </p>
            </div>
          </div>
          <Link
            to="/admin/mycourseslist"
            className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 text-sm font-bold text-white shadow-md shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg active:translate-y-0 min-[520px]:w-auto"
          >
            <BookOpen className="h-4 w-4" />
            Course library
          </Link>
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50/80 to-indigo-50/40 px-5 py-4 sm:px-6">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-navy">
            <BookOpen className="h-5 w-5 text-violet-600" />
            Course details
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Shown on the storefront and grouped under the linked instrument
          </p>
        </div>

        <div className="space-y-5 bg-gradient-to-b from-violet-50/15 via-white to-slate-50/20 p-5 sm:p-6">
          <DialogNotice icon={ListVideo} title="What happens next?" variant="brand">
            <ul className="list-inside list-disc space-y-0.5 text-sm">
              <li>Pick the instrument this course belongs to.</li>
              <li>After creating the course, you&apos;ll go straight to add lectures.</li>
              <li>Course thumbnail: one JPG or PNG image (max 100 MB).</li>
            </ul>
          </DialogNotice>

          {instrumentField && instrumentIndex >= 0 ? (
            <DialogSection title="Linked instrument">
              <div className="grid gap-3 rounded-2xl border border-violet-100/90 bg-gradient-to-br from-white via-violet-50/60 to-indigo-50/40 p-3 shadow-sm ring-1 ring-violet-100/70 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/25 sm:h-11 sm:w-11">
                  <Layers className="h-5 w-5" />
                </span>
                <div className="min-w-0 [&_select]:min-h-11 [&_select]:rounded-2xl [&_select]:bg-white">
                  <DropDown
                    {...instrumentField}
                    onChange={(event) =>
                      handleChange(event, instrumentField, instrumentIndex)
                    }
                  />
                </div>
              </div>
            </DialogSection>
          ) : null}

          <DialogSection title="Course info">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {textFields.map((field) => {
                const i1 = inputs.findIndex((f) => f._key === field._key);
                return (
                  <InputText
                    key={field._key}
                    {...field}
                    onChange={(event) => handleChange(event, field, i1)}
                  />
                );
              })}
            </div>
          </DialogSection>

          {descriptionField && descriptionIndex >= 0 ? (
            <DialogSection title="Description">
              <InputText
                {...descriptionField}
                onChange={(event) =>
                  handleChange(event, descriptionField, descriptionIndex)
                }
              />
            </DialogSection>
          ) : null}

          {thumbnailField && thumbnailIndex >= 0 ? (
            <DialogSection
              title="Course thumbnail"
              className="border-violet-100/90 ring-violet-100/40"
            >
              <div className="space-y-4">
                <InputFile
                  {...thumbnailField}
                  onChange={(event) =>
                    handleChange(event, thumbnailField, thumbnailIndex)
                  }
                />

                {Array.isArray(thumbnailField._value) &&
                thumbnailField._value.length > 0 ? (
                  <FilePreview
                    files={thumbnailField._value}
                    onRemove={(fileIndex) => {
                      const updated = thumbnailField._value.filter(
                        (_, idx) => idx !== fileIndex
                      );
                      handleChange(null, thumbnailField, thumbnailIndex, updated);
                    }}
                  />
                ) : null}

                {uploading.length > 0 ? (
                  <div className="space-y-2 rounded-xl border border-violet-100/90 bg-violet-50/40 p-3 ring-1 ring-violet-100/50">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                      <RefreshCw className="h-3 w-3 animate-spin" aria-hidden />
                      Uploading thumbnail…
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

                {thumbnailField._errorMsg ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                    {thumbnailField._errorMsg}
                  </p>
                ) : null}
              </div>
            </DialogSection>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-gradient-to-r from-violet-50/40 via-white to-indigo-50/30 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/mycourseslist")}
            disabled={loading}
            className="min-h-11 sm:min-w-[120px]"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className={cn(
              "inline-flex min-h-11 items-center justify-center gap-2 px-6 shadow-md shadow-violet-600/20 sm:min-w-[200px]",
              "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            )}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="border-white/30 border-t-white" />
                Creating…
              </>
            ) : (
              <>
                <CirclePlus className="h-4 w-4" aria-hidden />
                Create course
              </>
            )}
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
