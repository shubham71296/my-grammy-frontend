import {
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  CirclePlay,
  CheckCircle2,
  GraduationCap,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { truncate } from "../../../utils/common-util";
import { IMAGE_PLACEHOLDER } from "../../../utils/image-constants";
import { getFirstMediaUrl } from "../../../utils/media";
import { Dropdown, DropdownItem } from "../tw/Dropdown";
import { cn } from "../../../lib/cn";
import { pc } from "./productCardStyles";

export default function CourseCard({
  course,
  mode = "user",
  onEdit,
  onDelete,
  onAddToCart,
  onViewDetails,
}) {
  const navigate = useNavigate();
  const isGuest = mode === "guest";
  const isAdmin = mode === "admin";
  const isUser = mode === "user";

  const title = course?.course_title;
  const description = course?.course_description;
  const price = course?.course_price;
  const image = getFirstMediaUrl(course?.thumbnail_image);

  const handleViewDetails = () => {
    if (isGuest && onViewDetails) {
      onViewDetails(course);
      return;
    }
    if (isAdmin) {
      navigate(`/admin/mycoursedetail/${course._id}`);
    } else {
      navigate(`/user/courses/${course._id}`);
    }
  };

  const priceLabel = isGuest
    ? `₹${Number(price || 0).toLocaleString("en-IN")}`
    : course.isPurchased && isUser
      ? "Owned"
      : `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const purchased = !isGuest && course.isPurchased && isUser;

  const goToDetail = () => {
    if (isAdmin) handleViewDetails();
  };

  return (
    <article
      className={cn(pc.root(), isAdmin && "cursor-pointer")}
      onClick={isAdmin ? goToDetail : undefined}
      onKeyDown={
        isAdmin
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goToDetail();
              }
            }
          : undefined
      }
      role={isAdmin ? "button" : undefined}
      tabIndex={isAdmin ? 0 : undefined}
    >
      <div className={pc.courseMedia}>
        <img
          src={image}
          alt={title}
          className={pc.courseImg}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = IMAGE_PLACEHOLDER;
          }}
        />
        <div className={pc.courseOverlay} />
        <span className={pc.playBtn} aria-hidden>
          <CirclePlay className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span
          className={cn(
            pc.priceBadge,
            purchased && "bg-emerald-600 text-white ring-0"
          )}
        >
          {priceLabel}
        </span>
      </div>

      <div className={pc.body}>
        {isAdmin && (
          <div
            className="absolute right-2 top-2 z-20"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm hover:bg-slate-50"
                  aria-label="Course actions"
                >
                  <MoreVertical className="h-3.5 w-3.5 text-slate-600" />
                </button>
              }
            >
              {(close) => (
                <>
                  <DropdownItem
                    onClick={() => {
                      close();
                      handleViewDetails();
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      close();
                      onEdit?.(course);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    danger
                    onClick={() => {
                      close();
                      onDelete?.(course);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownItem>
                </>
              )}
            </Dropdown>
          </div>
        )}

        <span className={pc.chip}>
          <GraduationCap className="mr-0.5 inline h-2.5 w-2.5" />
          Course
        </span>
        <h3 className={pc.title}>{title}</h3>
        <p className={pc.desc}>{truncate(description, 55)}</p>

        {!isAdmin && (
          <div className={pc.actions}>
            <button type="button" className={pc.btnOutline} onClick={handleViewDetails}>
              <Eye className="h-3 w-3 shrink-0" />
              View
            </button>
            {purchased ? (
              <span className={pc.btnOwned}>
                <CheckCircle2 className="h-3 w-3" />
                Owned
              </span>
            ) : (
              <button
                type="button"
                className={pc.btnPrimary}
                onClick={() => onAddToCart?.(course, "course")}
              >
                <ShoppingCart className="h-3 w-3 shrink-0" />
                Cart
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
