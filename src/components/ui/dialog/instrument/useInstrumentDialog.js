import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import instrumentsInputs from "../../../../utils/add-instruments-inputs";
import {
  resetInputs,
  validateInputs,
} from "../../../../utils/common-util";
import { useS3UploadPipeline } from "../../../../hooks/useS3UploadPipeline";
import { rollbackUploadedKeys } from "../../../../utils/s3-rollback";
import {
  useCheckInstrumentTitleMutation,
  useUpdateInstrumentMutation,
  useDeleteInstrumentMutation,
} from "../../../../features/api/adminApi";
import { closeDialog, renderTableAction } from "../../../../features/ui/uiSlice";

export function useInstrumentDialog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);
  const [inputs, setInputs] = useState(instrumentsInputs);
  const [loading, setLoading] = useState(false);
  const { progressMap, uploadImages, splitExistingAndNew, clearProgress } =
    useS3UploadPipeline();
  const [checkTitle] = useCheckInstrumentTitleMutation();
  const [updateInstrument] = useUpdateInstrumentMutation();
  const [deleteInstrument] = useDeleteInstrumentMutation();

  const handleClose = () => dispatch(closeDialog());

  const handleChange = async (e, p1, i1, updatedFiles = null) => {
    const tempInputs = [...inputs];
    if (p1._type === "file") {
      if (updatedFiles !== null) {
        tempInputs[i1]._value = updatedFiles;
        setInputs([...tempInputs]);
        return;
      }
      const files = e.target.files;
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
        const oldFiles = Array.isArray(tempInputs[i1]._value) ? tempInputs[i1]._value : [];
        tempInputs[i1]._value = p1._multiple
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
      const check = await checkTitle({
        instrument_title: title,
        instrument_id: selectedData?._id,
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
      payload.new_images = await uploadImages(newFiles, "public-instruments");

      let res;
      try {
        res = await updateInstrument({
          id: selectedData._id,
          ...payload,
        }).unwrap();
      } catch (apiErr) {
        await rollbackUploadedKeys(
          payload.new_images?.map((f) => f.key).filter(Boolean)
        );
        throw apiErr;
      }
      dispatch(closeDialog());
      dispatch(renderTableAction({ renderTable: true }));
      toast.success(res?.msg || "Instrument updated");
      setInputs(resetInputs(inputs));
      navigate("/admin/myinstrumentslist");
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
      const res = await deleteInstrument(selectedData._id).unwrap();
      dispatch(closeDialog());
      dispatch(renderTableAction({ renderTable: true }));
      toast.success(res?.msg || "Instrument deleted");
      navigate("/admin/myinstrumentslist");
    } catch (err) {
      toast.error(err?.data?.msg || err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedData || dialogInfo?.check !== "edit_instrument") return;
    const updated = instrumentsInputs.map((item) => {
      if (item._type !== "file") {
        return { ...item, _value: selectedData[item._key] || "", _errorMsg: "" };
      }
      const existingImages =
        selectedData?.instrument_images?.map((img) => ({
          key: img.key,
          url: img.url,
          originalName: img.originalName || "",
          mimeType: img.mimeType || img.type || "image/jpeg",
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
    data: selectedData || {},
    loading,
    inputs,
    progressMap,
    handleClose,
    handleChange,
    handleSubmit,
    handleDelete,
  };
}
