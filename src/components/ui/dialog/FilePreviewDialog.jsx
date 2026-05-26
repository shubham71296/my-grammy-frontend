import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeDialog } from "../../../features/ui/uiSlice";
import { ImageLightbox } from "../ImageLightbox";

export default function FilePreviewDialog() {
  const dispatch = useDispatch();
  const { openDialog, selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);

  const previewTitle = selectedData?.title || "Image preview";

  const images = useMemo(() => {
    if (dialogInfo?.check !== "view_img_video") return [];
    const list = selectedData?.images;
    if (Array.isArray(list) && list.length > 0) {
      return list
        .map((item) => ({
          url: item?.url || item,
          originalName: item?.originalName || previewTitle,
        }))
        .filter((item) => item.url);
    }
    const url = selectedData?.previewUrl;
    if (!url) return [];
    return [{ url, originalName: previewTitle }];
  }, [dialogInfo?.check, selectedData, previewTitle]);

  if (dialogInfo?.check !== "view_img_video") return null;

  return (
    <ImageLightbox
      open={openDialog}
      onClose={() => dispatch(closeDialog())}
      images={images}
      index={0}
      title={previewTitle}
    />
  );
}
