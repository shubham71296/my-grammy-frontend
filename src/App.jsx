import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { getUserProfile } from "./features/auth/authSlice";
import { setCartCount } from "./features/cartSlice";
import { getCartBadgeCount } from "./utils/cart";
import { useGetCartItemsQuery } from "./features/api/catalogApi";
import RouteProgressBar from "./components/ui/loader/RouteProgressBar";
import ScrollToTop from "./components/ui/ScrollToTop";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";

function App() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { data: cartData } = useGetCartItemsQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (token) {
      dispatch(getUserProfile(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (cartData?.items) {
      dispatch(setCartCount(getCartBadgeCount(cartData.items)));
    } else if (!token) {
      dispatch(setCartCount(0));
    }
  }, [cartData, token, dispatch]);

  return (
    <>
      <RouteProgressBar />
      <ScrollToTop />
      <AppRoutes />
      <ScrollToTopButton />
    </>
  );
}

export default App;
