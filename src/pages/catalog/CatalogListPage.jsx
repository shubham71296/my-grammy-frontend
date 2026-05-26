import { Music, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InstrumentCard from "../../components/ui/card/InstrumentCard";
import CourseCard from "../../components/ui/card/CourseCard";
import CatalogGridItem from "../../components/ui/CatalogGridItem";
import CatalogListLayout from "../../components/catalog/CatalogListLayout";
import { useCatalogListQuery } from "../../hooks/useCatalogListQuery";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useGuestLoginDialog } from "../../hooks/useGuestLoginDialog";
import { LANDING_ROUTES } from "../../constants/landingRoutes";

const CONFIG = {
  instruments: {
    title: "Instruments",
    titleIcon: Music,
    headerVariant: "instruments",
    subtitle:
      "Premium guitars, keyboards, pedals, and accessories — curated for learners and performers.",
    searchLabel: "Search instruments",
    searchPlaceholder: "e.g. guitar, keyboard, pedal…",
    listHeading: "Shop instruments",
    emptyMessage: "No instruments found",
    emptyDescription: "We may be restocking. Check back soon or contact the academy.",
  },
  courses: {
    title: "Courses",
    titleIcon: BookOpen,
    headerVariant: "courses",
    subtitle:
      "Structured video lessons with expert guidance — learn at your own pace.",
    searchLabel: "Search courses",
    searchPlaceholder: "e.g. piano, guitar, vocals…",
    listHeading: "Browse courses",
    emptyMessage: "No courses found",
    emptyDescription: "New courses are added regularly. Try another keyword.",
  },
};

export default function CatalogListPage({ catalog, guest = false }) {
  const navigate = useNavigate();
  const routes = LANDING_ROUTES[guest ? "guest" : "user"];
  const meta = CONFIG[catalog];
  const { search, setSearch, data: list, isLoading, isError } = useCatalogListQuery({
    catalog,
    guest,
  });
  const { addToCart } = useAddToCart(catalog === "instruments" ? "instrument" : "course");
  const openGuestLoginDialog = useGuestLoginDialog();

  return (
    <CatalogListLayout
      loading={isLoading}
      error={isError}
      title={meta.title}
      titleIcon={meta.titleIcon}
      subtitle={meta.subtitle}
      headerVariant={meta.headerVariant}
      searchLabel={meta.searchLabel}
      searchPlaceholder={meta.searchPlaceholder}
      listHeading={meta.listHeading}
      search={search}
      onSearchChange={setSearch}
      isEmpty={!isLoading && !isError && list.length === 0}
      emptyMessage={meta.emptyMessage}
      emptyDescription={meta.emptyDescription}
      itemCount={list.length}
      backTo={guest ? "/guest" : "/user"}
      backLabel="Back to home"
      homeTo={guest ? "/guest" : "/user"}
    >
      {catalog === "instruments"
        ? list.map((it) => (
            <CatalogGridItem key={it._id}>
              <InstrumentCard
                item={it}
                mode={guest ? "guest" : "user"}
                navTo={guest ? undefined : routes.instrumentDetail(it._id)}
                onViewDetails={
                  guest ? () => navigate(routes.instrumentDetail(it._id)) : undefined
                }
                onAddToCart={guest ? openGuestLoginDialog : addToCart}
              />
            </CatalogGridItem>
          ))
        : list.map((course) => (
            <CatalogGridItem key={course._id}>
              <CourseCard
                course={course}
                mode={guest ? "guest" : "user"}
                onViewDetails={
                  guest ? () => navigate(routes.courseDetail(course._id)) : undefined
                }
                onAddToCart={guest ? openGuestLoginDialog : addToCart}
              />
            </CatalogGridItem>
          ))}
    </CatalogListLayout>
  );
}
