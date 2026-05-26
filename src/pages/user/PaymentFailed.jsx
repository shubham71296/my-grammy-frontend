import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, ShoppingCart } from "lucide-react";
import api from "../../api/axios";
import { PageShell, PagePanel } from "../../components/ui/tw/PageShell";
import { Button } from "../../components/ui/tw/Button";
import { Spinner } from "../../components/ui/tw/Spinner";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const retryPayment = async () => {
    try {
      setLoading(true);
      const res = await api.post("/user/create-checkout-session");
      const { razorpayOrderId, amount, currency, key } = res.data.data;

      const options = {
        key,
        amount,
        currency,
        name: "Music Academy",
        description: "Retry Payment",
        order_id: razorpayOrderId,
        handler: () => navigate("/user/payment-processing"),
        modal: {
          ondismiss: () => navigate("/user/payment-failed"),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () => navigate("/user/payment-failed"));
      razorpay.open();
    } catch {
      alert("Retry failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell className="flex min-h-screen items-center justify-center">
      <PagePanel className="max-w-md text-center">
        <h2 className="text-xl font-bold text-danger">Payment Failed</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your payment could not be completed. No money was deducted.
        </p>
        <Button className="mt-4 w-full" onClick={retryPayment} disabled={loading}>
          {loading ? (
            <Spinner size="sm" className="border-white border-t-white/40" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Retry Payment
        </Button>
        <Button variant="ghost" className="mt-2 w-full" onClick={() => navigate("/user/cart")}>
          <ShoppingCart className="h-4 w-4" />
          Back to Cart
        </Button>
      </PagePanel>
    </PageShell>
  );
};

export default PaymentFailed;
