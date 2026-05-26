import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CirclePlus,
  ImageIcon,
  Library,
  RefreshCw,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import instrumentsInputs from "../../utils/add-instruments-inputs";
import InputText from "../../components/ui/inputs/InputText";
import InputFile from "../../components/ui/inputs/InputFile";
import FilePreview from "../../components/ui/inputs/FilePreview";
import { useS3UploadPipeline } from "../../hooks/useS3UploadPipeline";
import { rollbackUploadedKeys } from "../../utils/s3-rollback";
import { resetInputs, validateInputs } from "../../utils/common-util";
import toast from "react-hot-toast";
import {
  useCheckInstrumentTitleMutation,
  useCreateInstrumentMutation,
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

export default function AddInstruments() {
  const [inputs, setInputs] = useState(instrumentsInputs);
  const [loading, setLoading] = useState(false);
  const { progressMap, uploadImages, clearProgress } = useS3UploadPipeline();
  const [checkTitle] = useCheckInstrumentTitleMutation();
  const [createInstrument] = useCreateInstrumentMutation();
  const navigate = useNavigate();

  const imageField = inputs.find((f) => f._key === "instrument_images");
  const imageIndex = inputs.findIndex((f) => f._key === "instrument_images");
  const uploading = getUploadingFiles(imageField?._value, progressMap);

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

        const oldFiles = Array.isArray(tempInputs[i1]._value)
          ? tempInputs[i1]._value
          : [];
        const allowsMultiple = !!p1._multiple;
        tempInputs[i1]._value = allowsMultiple
          ? [...oldFiles, ...validFiles]
          : [...validFiles];
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
      const titleField = inputs.find((f) => f._key === "instrument_title");
      const title = titleField?._value?.trim();
      const check = await checkTitle({ instrument_title: title }).unwrap();
      if (!check?.success) {
        toast.error(check?.msg || "Title error");
        setLoading(false);
        return;
      }

      const payload = {};
      let imageFiles = [];
      inputs.forEach((item) => {
        if (item._type === "file") {
          if (item._key === "instrument_images" && Array.isArray(item._value))
            imageFiles = item._value;
        } else {
          payload[item._key] = item._value;
        }
      });

      payload.instrument_images = await uploadImages(
        imageFiles,
        "public-instruments"
      );

      try {
        const res = await createInstrument(payload).unwrap();
        toast.success(res?.msg || "Instrument added");
        setInputs(resetInputs(instrumentsInputs));
        clearProgress();
        navigate("/admin/myinstrumentslist");
      } catch (apiErr) {
        await rollbackUploadedKeys(
          payload.instrument_images.map((f) => f.key).filter(Boolean)
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
    setInputs(resetInputs(instrumentsInputs));
  }, []);

  const textFields = inputs.filter(
    (f) =>
      ["text", "number", "password"].includes(f._type) &&
      f._key !== "instrurment_description"
  );
  const descriptionField = inputs.find((f) => f._key === "instrurment_description");
  const descriptionIndex = inputs.findIndex((f) => f._key === "instrurment_description");

  return (
    <PageShell className="pb-12">
      <Modal open={loading} lockClose maxWidth="max-w-sm">
        <ModalBody className="flex flex-col items-center gap-4 bg-gradient-to-b from-brand-50/50 to-white py-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/30">
            <RefreshCw className="h-7 w-7 animate-spin" />
          </span>
          <div className="text-center">
            <p className="text-base font-extrabold text-navy">Publishing instrument</p>
            <p className="mt-1 text-sm text-slate-500">
              Uploading photos and saving your listing…
            </p>
          </div>
        </ModalBody>
      </Modal>

      <Link
        to="/admin/myinstrumentslist"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        My instruments
      </Link>

      <header className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-brand-100/80 bg-gradient-to-br from-white via-brand-50/40 to-indigo-50/50 shadow-[0_18px_45px_-30px_rgba(2,2,94,0.35)]">
        <div
          className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-brand-500/10 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-14 left-6 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
          <div className="flex flex-col items-center gap-3 text-center min-[520px]:flex-row min-[520px]:items-start min-[520px]:gap-4 min-[520px]:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/25 sm:h-14 sm:w-14">
              <Library className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-800 shadow-sm ring-1 ring-brand-100 sm:text-[11px]">
                <Sparkles className="h-3.5 w-3.5" />
                Store catalog
              </span>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-navy sm:mt-3 sm:text-3xl">
                Add instrument
              </h2>
              <p className="mx-auto mt-1.5 max-w-xl text-xs leading-relaxed text-slate-600 min-[520px]:mx-0 sm:mt-2 sm:text-sm">
                List a new instrument for sale with photos, price, and description.
              </p>
            </div>
          </div>
          <Link
            to="/admin/myinstrumentslist"
            className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg active:translate-y-0 min-[520px]:w-auto"
          >
            <Store className="h-4 w-4" />
            View catalog
          </Link>
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-100 bg-gradient-to-r from-brand-50/80 to-indigo-50/40 px-5 py-4 sm:px-6">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-navy">
            <Library className="h-5 w-5 text-brand-600" />
            Instrument listing
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Details shown on the storefront instrument page
          </p>
        </div>

        <div className="space-y-5 bg-gradient-to-b from-brand-50/15 via-white to-slate-50/20 p-5 sm:p-6">
          <DialogNotice icon={ImageIcon} title="Photo tips" variant="brand">
            <ul className="list-inside list-disc space-y-0.5 text-sm">
              <li>Upload multiple JPG or PNG images (max 100 MB each).</li>
              <li>Use clear, well-lit photos from different angles.</li>
              <li>The first image is used as the main thumbnail in listings.</li>
            </ul>
          </DialogNotice>

          <DialogSection title="Basic details">
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

          {imageField && imageIndex >= 0 ? (
            <DialogSection
              title="Product photos"
              className="border-brand-100/90 ring-brand-100/40"
            >
              <div className="space-y-4">
                <InputFile
                  {...imageField}
                  onChange={(event) => handleChange(event, imageField, imageIndex)}
                />

                {Array.isArray(imageField._value) && imageField._value.length > 0 ? (
                  <FilePreview
                    files={imageField._value}
                    onRemove={(fileIndex) => {
                      const updated = imageField._value.filter(
                        (_, idx) => idx !== fileIndex
                      );
                      handleChange(null, imageField, imageIndex, updated);
                    }}
                  />
                ) : null}

                {uploading.length > 0 ? (
                  <div className="space-y-2 rounded-xl border border-brand-100/90 bg-brand-50/40 p-3 ring-1 ring-brand-100/50">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                      <RefreshCw className="h-3 w-3 animate-spin" aria-hidden />
                      Uploading photos…
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

                {imageField._errorMsg ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                    {imageField._errorMsg}
                  </p>
                ) : null}
              </div>
            </DialogSection>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-gradient-to-r from-brand-50/40 via-white to-indigo-50/30 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/myinstrumentslist")}
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
              "inline-flex min-h-11 items-center justify-center gap-2 px-6 shadow-md shadow-brand-600/20 sm:min-w-[200px]",
              "bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700"
            )}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="border-white/30 border-t-white" />
                Publishing…
              </>
            ) : (
              <>
                <CirclePlus className="h-4 w-4" aria-hidden />
                Add instrument
              </>
            )}
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
