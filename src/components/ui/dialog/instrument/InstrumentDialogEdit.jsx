import { Pencil, RefreshCw, X } from "lucide-react";
import InputText from "../../inputs/InputText";
import InputFile from "../../inputs/InputFile";
import FilePreview from "../../inputs/FilePreview";
import { Button } from "../../tw/Button";
import { Spinner } from "../../tw/Spinner";
import {
  DialogHeaderBar,
  ModalBody,
  ModalFooter,
  UploadProgressBar,
} from "../dialogLayout";

export default function InstrumentDialogEdit({
  data,
  inputs,
  loading,
  progressMap,
  handleClose,
  handleChange,
  handleSubmit,
}) {
  return (
    <>
      <DialogHeaderBar
        icon={Pencil}
        variant="edit"
        title={data.instrument_title || "Instrument"}
        subtitle="Update listing details"
        onClose={handleClose}
      />
      <ModalBody className="bg-gradient-to-b from-slate-50/30 to-white">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {inputs.map((p1, i1) => {
            const fullWidth =
              p1._type === "file" || Boolean(p1._options?.multiline);

            if (["text", "number", "password"].includes(p1._type)) {
              return (
                <div key={i1} className={fullWidth ? "lg:col-span-2" : "lg:col-span-1"}>
                  <InputText
                    {...p1}
                    onChange={(event) => handleChange(event, p1, i1)}
                  />
                </div>
              );
            }
            if (p1._type === "file") {
              const uploading = Array.isArray(p1._value)
                ? p1._value.filter((f) => {
                    const key = f.name || f.originalName;
                    const pct = progressMap[key];
                    return pct > 0 && pct < 100;
                  })
                : [];

              return (
                <div key={i1} className="lg:col-span-2">
                  <InputFile
                    {...p1}
                    onChange={(event) => handleChange(event, p1, i1)}
                  />
                  <FilePreview
                    files={p1._value}
                    onRemove={(fileIndex) => {
                      const updatedFiles = p1._value.filter(
                        (_, idx) => idx !== fileIndex
                      );
                      handleChange(null, p1, i1, updatedFiles);
                    }}
                  />
                  {uploading.length > 0 ? (
                    <div className="mt-3 space-y-2 rounded-xl border border-brand-100/80 bg-brand-50/30 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                        Uploading…
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
                </div>
              );
            }
            return null;
          })}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button disabled={loading} onClick={handleSubmit} className="inline-flex items-center gap-2">
          {loading ? (
            <>
              <Spinner size="sm" className="border-white/30 border-t-white" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" aria-hidden />
              Update Instrument
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
