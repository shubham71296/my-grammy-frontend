import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartCount } from "../../features/cartSlice";
import { catalogApi } from "../../features/api/catalogApi";
import { PageShell, PagePanel } from "../../components/ui/tw/PageShell";
import { Spinner } from "../../components/ui/tw/Spinner";

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(catalogApi.util.invalidateTags(["Cart"]));
    dispatch(
      catalogApi.endpoints.getCartItems.initiate(undefined, { forceRefetch: true })
    )
      .then((result) => {
        const count = result?.data?.items?.length ?? 0;
        dispatch(setCartCount(count));
      })
      .catch(() => dispatch(setCartCount(0)));

    const timer = setTimeout(() => navigate("/user/myorders"), 5000);
    return () => clearTimeout(timer);
  }, [navigate, dispatch]);

  return (
    <PageShell className="flex min-h-screen items-center justify-center">
      <PagePanel className="max-w-md text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <h1 className="text-lg font-bold text-brand-900">Processing your payment...</h1>
        <p className="mt-2 text-sm text-slate-600">
          Please wait while we confirm your order. You will be redirected shortly.
        </p>
      </PagePanel>
    </PageShell>
  );
};

export default PaymentProcessing;
