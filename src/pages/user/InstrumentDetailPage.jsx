import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Music2,
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Images,
  ChevronRight,
  ImageOff,
} from "lucide-react";
import { useGetInstrumentByIdQuery } from "../../features/api/catalogApi";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useGuestLoginDialog } from "../../hooks/useGuestLoginDialog";
import { formatCurrency } from "../../utils/format";
import { PageShell } from "../../components/ui/tw/PageShell";
import { BackButton } from "../../components/ui/tw/BackButton";
import { Button } from "../../components/ui/tw/Button";
import { GalleryThumb } from "../../components/ui/tw/GalleryThumb";
import { Spinner } from "../../components/ui/tw/Spinner";
import { cn } from "../../lib/cn";

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Quality checked" },
  { icon: Sparkles, label: "Curated for learners" },
  { icon: Music2, label: "Studio-ready sound" },
];

const InstrumentDetailPage = ({ mode = "user" }) => {
  const isGuest = mode === "guest";
  const catalogPath = isGuest ? "/guest/guestinstruments" : "/user/instruments";
  const homePath = isGuest ? "/guest" : "/user";

  const { id } = useParams();
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const { data: instrument, isLoading, isError } = useGetInstrumentByIdQuery({
    id,
    guest: isGuest,
  });
  const { addToCart } = useAddToCart("instrument");
  const openGuestLoginDialog = useGuestLoginDialog();

  const images = instrument?.instrument_images ?? [];
  const imageCount = images.length;

  useEffect(() => {
    const first = instrument?.instrument_images?.[0]?.url;
    if (first) {
      setSelectedImage(first);
      setImageLoading(true);
      setImageFailed(false);
    } else {
      setSelectedImage("");
      setImageLoading(false);
      setImageFailed(true);
    }
  }, [instrument?._id, instrument?.instrument_images]);

  const selectImage = (url) => {
    if (url === selectedImage) return;
    setSelectedImage(url);
    setImageLoading(true);
    setImageFailed(false);
  };

  const handleCart = () => {
    if (isGuest) {
      openGuestLoginDialog();
      return;
    }
    addToCart(instrument);
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
          <h2 className="text-xl font-extrabold text-navy">Instrument not found</h2>
          <p className="mt-2 text-sm text-muted">
            This item may have been removed or the link is incorrect.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <BackButton to={catalogPath} label="Browse instruments" />
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  const description =
    instrument.instrurment_description ||
    "A beautifully crafted musical instrument, selected for students and performers who want reliable tone and comfortable playability.";

  return (
    <PageShell className="pb-28 lg:pb-10">
      <div className="mb-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:mb-5 sm:flex sm:flex-wrap sm:gap-3">
        <BackButton
          to={catalogPath}
          label={
            <>
              <span className="hidden min-[390px]:inline">All instruments</span>
              <span className="min-[390px]:hidden">All</span>
            </>
          }
          className="shrink-0 gap-1.5 px-2 py-1.5 text-xs sm:gap-2.5 sm:px-3 sm:py-2 sm:text-sm"
        />
        <nav
          className="flex min-w-0 items-center gap-1 text-xs text-muted sm:flex-1 sm:gap-1.5 sm:text-sm"
          aria-label="Breadcrumb"
        >
          <span className="hidden min-[360px]:inline">Instruments</span>
          <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 min-[360px]:block" aria-hidden />
          <span className="line-clamp-1 font-semibold text-brand-800">
            {instrument.instrument_title}
          </span>
        </nav>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)]">
        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:divide-x lg:divide-slate-100">
          {/* Gallery */}
          <section className="bg-slate-50/80 p-3 sm:p-6 lg:p-8">
            {imageCount > 0 && (
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/80">
                <Images className="h-3.5 w-3.5 text-brand-600" />
                {imageCount} {imageCount === 1 ? "photo" : "photos"}
              </span>
            )}

            <div className="relative flex h-[190px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm min-[380px]:h-[210px] min-[480px]:h-[250px] sm:h-[320px] sm:p-4 lg:h-[380px]">
              {imageLoading && (
                <Spinner className="absolute z-20" />
              )}
              {selectedImage && !imageFailed ? (
                <img
                  key={selectedImage}
                  src={selectedImage}
                  alt={instrument.instrument_title}
                  className={cn(
                    "block h-full max-h-full w-full max-w-full object-contain object-center transition-opacity duration-300",
                    imageLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageFailed(true);
                    setImageLoading(false);
                  }}
                />
              ) : (
                <div className="grid h-full w-full place-items-center rounded-xl bg-slate-100 px-3 text-center text-slate-400">
                  <div className="flex max-w-[10rem] flex-col items-center justify-center">
                    <ImageOff className="mb-2 h-7 w-7 sm:h-11 sm:w-11" />
                    <p className="text-xs font-semibold leading-snug sm:text-base">
                      No image available
                    </p>
                  </div>
                </div>
              )}
            </div>

            {imageCount > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-2 pb-2 min-[420px]:grid-cols-4 sm:mt-4 sm:grid-cols-5 sm:gap-2.5">
                {images.map((img, index) => (
                  <GalleryThumb
                    key={img.url || index}
                    src={img.url}
                    size="fill"
                    isActive={selectedImage === img.url}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedImage === img.url}
                    onClick={() => selectImage(img.url)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Product info */}
          <section className="flex flex-col p-4 sm:p-7 lg:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-700 ring-1 ring-brand-100 sm:text-[11px] sm:tracking-wider">
              <Music2 className="h-3.5 w-3.5" />
              Musical instrument
            </span>

            <h2 className="mt-3 text-[1.35rem] font-extrabold leading-[1.12] tracking-tight text-navy sm:mt-4 sm:text-3xl lg:text-[2rem]">
              {instrument.instrument_title}
            </h2>

            <div className="mt-4 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/80 to-white p-3 shadow-sm sm:p-4">
              <p className="text-[1.75rem] font-black leading-none tracking-tight text-brand-700 sm:text-4xl">
                {formatCurrency(instrument.instrument_price)}
              </p>
              <p className="mt-1.5 text-xs font-semibold leading-relaxed text-slate-500 sm:text-sm">
                Inclusive of available offers where applicable.
              </p>
            </div>

            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-xs font-semibold text-slate-700"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                About this instrument
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {description}
              </p>
            </div>

            {/* Desktop actions */}
            <div className="mt-8 hidden gap-3 sm:flex sm:flex-row">
              <Button
                className="min-h-12 flex-1 gap-2 rounded-xl px-6 text-base shadow-card"
                onClick={handleCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {isGuest ? "Sign in to add to cart" : "Add to cart"}
              </Button>
              <BackButton to={catalogPath} label="More instruments" className="shrink-0" />
            </div>
          </section>
        </div>
      </div>

      <p className="mb-3 mt-6 text-center text-xs text-muted lg:text-left">
        Need help choosing?{" "}
        <button
          type="button"
          onClick={() => navigate(homePath)}
          className="font-semibold text-brand-600 underline-offset-2 hover:underline"
        >
          Return to home
        </button>
      </p>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 w-full overflow-hidden border-t border-slate-200/90 bg-white/95 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-md sm:hidden">
        <div className="mx-auto grid w-full max-w-md grid-cols-[4.75rem_minmax(0,1fr)] gap-2 min-[360px]:grid-cols-[5.5rem_minmax(0,1fr)]">
          <BackButton
            to={catalogPath}
            label="Back"
            className="h-10 w-full justify-center gap-1 rounded-xl px-1.5 py-1 text-[11px] shadow-sm [&>span:first-child]:h-7 [&>span:first-child]:w-7 [&>span:last-child]:whitespace-nowrap"
          />
          <Button
            className="h-10 min-h-10 w-full min-w-0 gap-1.5 rounded-xl px-2 text-xs font-bold shadow-md"
            onClick={handleCart}
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            {isGuest ? "Sign in" : "Add to cart"}
          </Button>
        </div>
      </div>
    </PageShell>
  );
};

export default InstrumentDetailPage;
