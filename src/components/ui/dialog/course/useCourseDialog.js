import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import createCoursesInputs from "../../../../utils/create-courses-inputs";
import { resetInputs, validateInputs } from "../../../../utils/common-util";
import { useS3UploadPipeline } from "../../../../hooks/useS3UploadPipeline";
import { rollbackUploadedKeys } from "../../../../utils/s3-rollback";
import {
  useCheckCourseTitleMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "../../../../features/api/adminApi";
import { closeDialog, renderTableAction } from "../../../../features/ui/uiSlice";

export function useCourseDialog() {
  const dispatch = useDispatch();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);
  const [inputs, setInputs] = useState(createCoursesInputs);
  const [loading, setLoading] = useState(false);
  const { progressMap, uploadImages, splitExistingAndNew, clearProgress } =
    useS3UploadPipeline();
  const [checkTitle] = useCheckCourseTitleMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

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
      const title = inputs.find((f) => f._key === "course_title")?._value?.trim();
      const check = await checkTitle({
        course_title: title,
        course_id: selectedData?._id,
      }).unwrap();
      if (!check?.success) {
        toast.error(check?.msg || "Title error");
        return;
      }

      const payload = {};
      inputs.forEach((item) => {
        if (item._type !== "file") payload[item._key] = item._value;
      });
      const fileField = inputs.find((i) => i._type === "file");
      const { existing, newFiles } = splitExistingAndNew(fileField?._value);
      payload.existing_images = existing;
      payload.new_images = await uploadImages(newFiles, "public-course-thumbnails");

      let res;
      try {
        res = await updateCourse({ id: selectedData._id, ...payload }).unwrap();
      } catch (apiErr) {
        await rollbackUploadedKeys(
          payload.new_images?.map((f) => f.key).filter(Boolean)
        );
        throw apiErr;
      }
      dispatch(closeDialog());
      dispatch(renderTableAction({ renderTable: true }));
      toast.success(res?.msg || "Course updated");
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
      const res = await deleteCourse(data._id).unwrap();
      dispatch(closeDialog());
      dispatch(renderTableAction({ renderTable: true }));
      toast.success(res?.msg || "Course deleted");
    } catch (err) {
      toast.error(err?.data?.msg || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedData || dialogInfo?.check !== "edit_course") return;
    const updated = createCoursesInputs.map((item) => {
      if (item._type !== "file") {
        return { ...item, _value: selectedData[item._key] ?? "", _errorMsg: "" };
      }
      const existingImages =
        selectedData?.thumbnail_image?.map((img) => ({
          key: img.key,
          url: img.url,
          originalName: img.originalName || "",
          mimeType: img.mimeType || "image/jpeg",
          size: img.size || 1000,
          isExisting: true,
        })) || [];
      return { ...item, _value: existingImages, _errorMsg: "" };
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
