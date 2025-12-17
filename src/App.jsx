import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { getUserProfile } from "./features/auth/authSlice";
import { useEffect } from "react";
import axios from "axios";
import { setCartCount } from "./features/cartSlice";

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
      const res = await axios.get("/api/user/getcartitems", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("resp@@@@@@@@@@@@@@@@",res)

      const count = res.data?.data?.items?.length || 0;
      dispatch(setCartCount(count));
    } catch (err) {
      console.log("Error loading cart count:", err);
    }
  };
  return <AppRoutes />
}

export default App

//http://localhost:5173/user/payment-success?session_id=cs_test_a1rQqC4sWyVPD8shjsY5LdBEm8EJ7GCdub57dIMZygaInWCWUjYjQs33DZ
