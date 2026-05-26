import { cn } from "../../lib/cn";

/** Grid cell — cards stretch to full column width for even rows. */
const CatalogGridItem = ({ children, className, ...rest }) => (
  <div className={cn("flex w-full min-w-0", className)} {...rest}>
    {children}
  </div>
);

export default CatalogGridItem;
