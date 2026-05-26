import { Film, RefreshCw, Sparkles, X } from "lucide-react";
import InputText from "../../inputs/InputText";
import InputFile from "../../inputs/InputFile";
import FilePreview from "../../inputs/FilePreview";
import { Button } from "../../tw/Button";
import { Spinner } from "../../tw/Spinner";
import { cn } from "../../../../lib/cn";
import {
  DialogHeaderBar,
  DialogNotice,
  DialogSection,
  ModalBody,
  ModalFooter,
  UploadProgressBar,
} from "../dialogLayout";

export default function LectureDialogEdit({
  data,
  inputs,
  loading,
  progressMap,
  handleClose,
  handleChange,
  handleSubmit,
}) {
  const titleField = inputs.find((f) => f._key === "lecture_title");
  const videoField = inputs.find((f) => f._key === "lecture_video");
  const titleIndex = inputs.findIndex((f) => f._key === "lecture_title");
  const videoIndex = inputs.findIndex((f) => f._key === "lecture_video");

  const uploading = Array.isArray(videoField?._value)
    ? videoField._value.filter((f) => {
        const key = f.name || f.originalName;
        const pct = progressMap[key];
        return pct > 0 && pct < 100;
      })
    : [];

  return (
    <>
      <DialogHeaderBar
        icon={Film}
        variant="lecture"
        title={data?.lecture_title || "Edit lecture"}
        subtitle="Update lesson title or replace the video"
        onClose={handleClose}
      />

      <ModalBody className="bg-gradient-to-b from-violet-50/20 via-white to-slate-50/30">
        <div className="space-y-5">
          <DialogNotice icon={Sparkles} title="Quick tips" variant="brand">
            <ul className="list-inside list-disc space-y-0.5 text-sm">
              <li>Use a clear, descriptive lesson title for students.</li>
              <li>Supported formats: MP4, MOV, WEBM, OGG — up to 500 MB.</li>
              <li>Tap × on a file preview to remove it, then upload a new video if needed.</li>
            </ul>
          </DialogNotice>

          {titleField && titleIndex >= 0 ? (
            <DialogSection title="Lesson details">
              <InputText
                {...titleField}
                onChange={(e) => handleChange(e, titleField, titleIndex)}
              />
            </DialogSection>
          ) : null}

          {videoField && videoIndex >= 0 ? (
            <DialogSection
              title="Video upload"
              className="border-violet-100/90 ring-violet-100/40"
            >
              <div className="space-y-4">
                <InputFile
                  {...videoField}
                  onChange={(e) => handleChange(e, videoField, videoIndex)}
                />

                {Array.isArray(videoField._value) && videoField._value.length > 0 ? (
                  <FilePreview
                    files={videoField._value}
                    onRemove={(fileIndex) => {
                      const updated = videoField._value.filter((_, idx) => idx !== fileIndex);
                      handleChange(null, videoField, videoIndex, updated);
                    }}
                  />
                ) : null}

                {uploading.length > 0 ? (
                  <div className="space-y-2 rounded-xl border border-violet-100/90 bg-violet-50/40 p-3 ring-1 ring-violet-100/50">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                      <RefreshCw className="h-3 w-3 animate-spin" aria-hidden />
                      Uploading video…
                    </p>
                    {uploading.map((f, idx) => (
                      <UploadProgressBar
                        key={`${f.key || f.name}-${idx}`}
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
      </ModalBody>

      <ModalFooter className="bg-gradient-to-r from-violet-50/50 via-white to-indigo-50/40">
        <Button
          disabled={loading}
          onClick={handleSubmit}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 px-6 shadow-md shadow-violet-600/20",
            "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          )}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="border-white/30 border-t-white" />
              Saving lesson…
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" aria-hidden />
              Save changes
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleClose} disabled={loading}>
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </ModalFooter>
    </>
  );
}
