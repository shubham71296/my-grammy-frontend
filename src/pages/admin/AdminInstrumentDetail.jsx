import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Calendar,
  ChevronRight,
  IndianRupee,
  Library,
  Music2,
  Pencil,
  Trash2,
} from "lucide-react";
import { useGetInstrumentByIdQuery } from "../../features/api/catalogApi";
import { openDialogAction } from "../../features/ui/uiSlice";
import {
  formatInstrumentCurrency,
  formatInstrumentDate,
  normalizeInstrumentImages,
} from "../../components/ui/dialog/instrument/instrumentDialogUtils";
import { InstrumentGallery } from "../../components/ui/InstrumentGallery";
import { PageShell } from "../../components/ui/tw/PageShell";
import { BackButton } from "../../components/ui/tw/BackButton";
import { Button } from "../../components/ui/tw/Button";
import { Spinner } from "../../components/ui/tw/Spinner";

const LIST_PATH = "/admin/myinstrumentslist";

export default function AdminInstrumentDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data: instrument, isLoading, isError } = useGetInstrumentByIdQuery({ id });

  const images = useMemo(
    () => normalizeInstrumentImages(instrument),
    [instrument?.instrument_images, instrument?._id]
  );

  const openEdit = () => {
    if (!instrument) return;
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: instrument,
        dialogInfo: { check: "edit_instrument", title: "", content: "" },
      })
    );
  };

  const openDelete = () => {
    if (!instrument) return;
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: instrument,
        dialogInfo: {
          check: "delete_instrument",
          title: "Delete Instrument",
          content:
            "Are you sure want to delete the selected Instrument? If yes then all the reference data will also be deleted!",
        },
      })
    );
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-muted">Loading instrument…</p>
        </div>
      </PageShell>
    );
  }

  if (isError || !instrument) {
    return (
      <PageShell narrow>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-soft">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-danger">
            <Music2 className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-extrabold text-navy">Instrument not found</h1>
          <p className="mt-2 text-sm text-muted">
            This item may have been removed or the link is incorrect.
          </p>
          <div className="mt-6 flex justify-center">
            <BackButton to={LIST_PATH} label="Back to instruments list" />
          </div>
        </div>
      </PageShell>
    );
  }

  const title = instrument.instrument_title || "—";
  const price = formatInstrumentCurrency(instrument.instrument_price);
  const description =
    instrument.instrurment_description?.trim() || "No description provided.";
  const listedOn = formatInstrumentDate(instrument.createdAt);

  return (
    <PageShell wide className="pb-10">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <BackButton to={LIST_PATH} label="Instruments list" />
        <nav
          className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted"
          aria-label="Breadcrumb"
        >
          <span>Admin</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1 font-semibold text-brand-800">{title}</span>
        </nav>
      </div>

      <header className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)]">
        <div
          className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.06] via-transparent to-brand-500/[0.08]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-brand-100 text-brand-700 shadow-sm">
              <Library className="h-7 w-7" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                Instrument detail
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={openEdit}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" className="gap-2 text-danger hover:border-red-200 hover:bg-red-50" onClick={openDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)]">
        <div className="grid items-start lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.75fr)] lg:divide-x lg:divide-slate-100">
          <section className="min-w-0 bg-slate-50/80 p-4 sm:p-6 lg:p-8">
            <InstrumentGallery
              images={images}
              title={title}
              size="large"
              thumbnailsMode="grid"
            />
          </section>

          <section className="flex flex-col p-5 sm:p-7 lg:p-8">
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-50 to-violet-50/40 px-5 py-4 ring-1 ring-brand-100/80">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-600">
                <IndianRupee className="h-3 w-3" />
                Store price
              </p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-brand-700">{price}</p>
            </div>

            <dl className="space-y-0">
              <div className="border-b border-slate-100/90 py-3.5">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Product name
                </dt>
                <dd className="mt-1 text-sm font-semibold text-navy">{title}</dd>
              </div>
              <div className="border-b border-slate-100/90 py-3.5">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Description
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</dd>
              </div>
              <div className="flex gap-3 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Calendar className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Listed on
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">{listedOn}</dd>
                </div>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
