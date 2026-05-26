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

export default function CourseDialogEdit({
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
        title={data?.course_title || "Course"}
        subtitle="Update course details"
        onClose={handleClose}
      />
      <ModalBody className="bg-gradient-to-b from-slate-50/30 to-white">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {inputs.map((p1, i1) => {
            if (["text", "number", "password"].includes(p1._type)) {
              return (
                <div key={i1} className="lg:col-span-1">
                  <InputText
                    {...p1}
                    onChange={(e) => handleChange(e, p1, i1)}
                  />
                </div>
              );
            }
            if (p1._type === "file") {
              return (
                <div key={i1} className="lg:col-span-1">
                  <InputFile
                    {...p1}
                    onChange={(e) => handleChange(e, p1, i1)}
                  />
                  <FilePreview
                    files={p1._value}
                    onRemove={(fileIndex) => {
                      const updated = p1._value.filter(
                        (_, idx) => idx !== fileIndex
                      );
                      handleChange(null, p1, i1, updated);
                    }}
                  />
                  {Array.isArray(p1._value) &&
                    p1._value.map((f, idx) => (
                      <UploadProgressBar
                        key={`${f.key || f.name}-${idx}`}
                        label={f.name || f.originalName}
                        percent={progressMap[f.name] || 0}
                      />
                    ))}
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
              Update Course
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
