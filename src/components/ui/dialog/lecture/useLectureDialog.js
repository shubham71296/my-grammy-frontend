import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import lecturesInputs from "../../../../utils/add-lectures-inputs";
import { resetInputs, validateInputs } from "../../../../utils/common-util";
import { useS3UploadPipeline } from "../../../../hooks/useS3UploadPipeline";
import { rollbackUploadedKeys } from "../../../../utils/s3-rollback";
import {
  useUpdateLectureMutation,
  useDeleteLectureMutation,
} from "../../../../features/api/adminApi";
import { closeDialog, renderTableAction } from "../../../../features/ui/uiSlice";

export function useLectureDialog() {
  const dispatch = useDispatch();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);
  const [inputs, setInputs] = useState(lecturesInputs);
  const [loading, setLoading] = useState(false);
  const { progressMap, uploadVideos, splitExistingAndNew, clearProgress } =
    useS3UploadPipeline();
  const [updateLecture] = useUpdateLectureMutation();
  const [deleteLecture] = useDeleteLectureMutation();

  const data = selectedData || {};
  const handleClose = () => dispatch(closeDialog());

  const handleChange = (e, p1, i1, updatedFiles = null) => {
    const tempInputs = [...inputs];
    if (p1._type === "file") {
      if (updatedFiles !== null) {
        tempInputs[i1]._value = updatedFiles;
        setInputs([...tempInputs]);
        return;
      }
      const files = e?.target?.files;
      if (files?.length > 0) {
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
      setInputs(tempInputs);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    const validated = validateInputs(inputs);
    if (validated.hasError) {
      setInputs(validated.inputs);
      return;
    }
    try {
      setLoading(true);
      const payload = {};
      inputs.forEach((item) => {
        if (item._type !== "file") payload[item._key] = item._value;
      });
      const fileField = inputs.find((i) => i._type === "file");
      const { existing, newFiles } = splitExistingAndNew(fileField?._value);
      payload.existing_videos = existing;
      payload.new_videos = await uploadVideos(newFiles, "private-course-videos");

      let res;
      try {
        res = await updateLecture({ id: selectedData._id, ...payload }).unwrap();
      } catch (apiErr) {
        await rollbackUploadedKeys(
          payload.new_videos?.map((f) => f.key).filter(Boolean)
        );
        throw apiErr;
      }
      dispatch(closeDialog());
      dispatch(renderTableAction({ renderTable: true }));
      toast.success(res?.msg || "Lecture updated");
      setInputs(resetInputs(inputs));
      clearProgress();
    } catch (err) {
      toast.error(err?.data?.msg || err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await deleteLecture(data._id).unwrap();
      dispatch(closeDialog());
      dispatch(renderTableAction({ renderTable: true }));
      toast.success(res?.msg || "Lecture deleted");
    } catch (err) {
      toast.error(err?.data?.msg || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedData || dialogInfo?.check !== "edit_lecture") return;
    const updated = lecturesInputs.map((item) => {
      if (item._type !== "file") {
        return { ...item, _value: selectedData[item._key] ?? "", _errorMsg: "" };
      }
      const existingVideos =
        selectedData?.lecture_video?.map((video) => ({
          key: video.key,
          url: video.url,
          originalName: video.originalName || "",
          mimeType: video.mimeType || "",
          size: video.size || 0,
          isExisting: true,
        })) || [];
      return { ...item, _value: existingVideos, _errorMsg: "" };
    });
    setInputs(updated);
  }, [selectedData, dialogInfo]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("dialogLoading", { detail: loading })
    );
  }, [loading]);

  return {
    dialogInfo,
    data,
    inputs,
    loading,
    progressMap,
    handleClose,
    handleChange,
    handleSubmit,
    handleDelete,
  };
}
