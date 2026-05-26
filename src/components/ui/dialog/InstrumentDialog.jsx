import { useInstrumentDialog } from "./instrument/useInstrumentDialog";
import InstrumentDialogDelete from "./instrument/InstrumentDialogDelete";
import InstrumentDialogEdit from "./instrument/InstrumentDialogEdit";

export default function InstrumentDialog() {
  const ctx = useInstrumentDialog();
  const { dialogInfo } = ctx;

  if (dialogInfo?.check === "delete_instrument") {
    return <InstrumentDialogDelete {...ctx} />;
  }
  if (dialogInfo?.check === "edit_instrument") {
    return <InstrumentDialogEdit {...ctx} />;
  }

  return null;
}
