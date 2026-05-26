import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { PageShell } from "../ui/tw/PageShell";
import { PageBannerWithSearch, PageContentCard, EmptyState } from "../ui/tw/PageHeader";
import { BackButton } from "../ui/tw/BackButton";
import { Spinner } from "../ui/tw/Spinner";
import { cn } from "../../lib/cn";

const CatalogListLayout = ({
  title,
  titleIcon: TitleIcon,
  subtitle,
  headerVariant = "brand",
  searchLabel = "Search",
  searchPlaceholder,
  listHeading,
  search,
  onSearchChange,
  children,
  emptyMessage = "No items found",
  emptyDescription,
  isEmpty,
  itemCount = 0,
  loading = false,
  error = null,
  backTo = "/user",
  backLabel = "Back to home",
  homeTo = "/user",
}) => {
  return (
    <PageShell>
      <PageBannerWithSearch
        icon={TitleIcon}
        title={title}
        subtitle={subtitle}
        variant={headerVariant}
        searchLabel={searchLabel}
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        itemCount={itemCount}
        loading={loading}
        error={error}
      />

      <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
        <PageContentCard>
          <div className="mb-4 flex flex-col gap-1 border-b border-slate-100 pb-4 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                {listHeading}
              </h2>
              <p className="text-xs text-muted">Tap a card to view details or add to cart</p>
            </div>
          </div>

          <div
            className={cn(
              "grid grid-cols-1 place-items-center gap-3 min-[420px]:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
              (loading || error || isEmpty) && "grid-cols-1 place-items-stretch"
            )}
          >
            {loading ? (
              <div className="col-span-full flex justify-center py-16">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="col-span-full rounded-xl border border-red-100 bg-red-50/80 py-10 text-center">
                <p className="text-sm font-semibold text-danger">
                  Could not load data. Check that the backend is running on port 8000.
                </p>
              </div>
            ) : isEmpty ? (
              <div className="col-span-full">
                <EmptyState
                  icon={TitleIcon}
                  title={emptyMessage}
                  description={
                    emptyDescription ||
                    "Try a different search term or browse our home page for featured items."
                  }
                  action={
                    <Link to={homeTo} className="btn-primary">
                      <Home className="h-4 w-4" />
                      Back to home
                    </Link>
                  }
                />
              </div>
            ) : (
              children
            )}
          </div>
        </PageContentCard>

        <BackButton to={backTo} label={backLabel} />
      </div>
    </PageShell>
  );
};

export default CatalogListLayout;
