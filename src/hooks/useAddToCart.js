import { useCallback } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useAddToCartMutation } from "../features/api/catalogApi";
import { setCartCount } from "../features/cartSlice";
import { getCartBadgeCount } from "../utils/cart";

/**
 * Add item to cart via RTK Query. Cart count syncs from useGetCartItemsQuery in App.jsx.
 * @param {string} [defaultProductType] - "instrument" | "course" when cards omit the second arg
 */
export function useAddToCart(defaultProductType) {
  const dispatch = useDispatch();
  const [addToCartMutation, { isLoading }] = useAddToCartMutation();

  const addToCart = useCallback(
    async (item, productType) => {
      const type = productType ?? defaultProductType;
      if (!item?._id || !type) return;
      try {
        const data = await addToCartMutation({
          productId: item._id,
          productType: type,
        }).unwrap();
        dispatch(setCartCount(getCartBadgeCount(data?.items ?? [])));
        toast.success("Added to cart");
      } catch (err) {
        toast.error(err?.data?.msg || "Something went wrong!");
      }
    },
    [addToCartMutation, defaultProductType, dispatch]
  );

  return { addToCart, isLoading };
}
