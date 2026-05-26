import { useNavigate } from "react-router-dom";
import { Eye, Music2, ShoppingCart } from "lucide-react";
import { truncate } from "../../../utils/common-util";
import { IMAGE_PLACEHOLDER } from "../../../utils/image-constants";
import { getFirstMediaUrl } from "../../../utils/media";
import { cn } from "../../../lib/cn";
import { pc } from "./productCardStyles";

export default function InstrumentCard({
  item,
  mode = "user",
  navTo,
  onViewDetails,
  onAddToCart,
}) {
  const navigate = useNavigate();
  const title = item?.instrument_title;
  const price = item?.instrument_price;
  const description = item?.instrurment_description;
  const image = getFirstMediaUrl(item?.instrument_images);

  const handleView = () => {
    if (mode === "guest" && onViewDetails) onViewDetails(item);
    else if (navTo) navigate(navTo);
  };

  const handleCart = (e) => {
    e.stopPropagation();
    onAddToCart?.(item, "instrument");
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleView}
      onKeyDown={(e) => e.key === "Enter" && handleView()}
      className={cn(pc.root("cursor-pointer"))}
    >
      <div className={pc.media}>
        <img
          src={image}
          alt={title}
          className={pc.img}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = IMAGE_PLACEHOLDER;
          }}
        />
        <span className={pc.priceBadge}>
          ₹{Number(price || 0).toLocaleString("en-IN")}
        </span>
      </div>

      <div className={pc.body}>
        <span className={pc.chip}>
          <Music2 className="mr-0.5 inline h-2.5 w-2.5" />
          Instrument
        </span>
        <h3 className={pc.title}>{title}</h3>
        <p className={pc.desc}>{truncate(description, 55)}</p>

        <div className={pc.actions} onClick={(e) => e.stopPropagation()}>
          <button type="button" className={pc.btnOutline} onClick={handleView}>
            <Eye className="h-3 w-3 shrink-0" />
            View
          </button>
          <button type="button" className={pc.btnPrimary} onClick={handleCart}>
            <ShoppingCart className="h-3 w-3 shrink-0" />
            Cart
          </button>
        </div>
      </div>
    </article>
  );
}
