import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { getUserProfile } from "./features/auth/authSlice";
import { useEffect } from "react";
import axios from "axios";
import { setCartCount } from "./features/cartSlice";
import api from "./api/axios";
import RouteProgressBar from "./components/ui/loader/RouteProgressBar";


function App() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
 
  useEffect(() => {
    if (token) {
      dispatch(getUserProfile(token));
      loadCartCount();
    }
  }, [token, dispatch]);

  const loadCartCount = async () => {
    try {
      const res = await api.get("/user/getcartitems");
      const count = res.data?.data?.items?.length || 0;
      dispatch(setCartCount(count));
    } catch (err) {
      console.log("Error loading cart count:", err);
    }
  };
  return <>
    <RouteProgressBar />
    <AppRoutes />
  </>
}

export default App

