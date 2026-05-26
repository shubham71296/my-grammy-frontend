import {
  ShoppingCart,
  CreditCard,
  Music,
  GraduationCap,
  ShieldCheck,
  Gift,
  Truck,
  Headphones,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItemCard from "../../components/ui/card/CartItemCard";
import { setCartCount } from "../../features/cartSlice";
import { getFullName } from "../../utils/common-util";
import {
  getCartProductId,
  normalizeMongoId,
  isFreeWithInstrumentItem,
  getCartBadgeCount,
  getVisibleCartUnits,
} from "../../utils/cart";
import toast from "react-hot-toast";
import {
  useGetCartItemsQuery,
  useIncreaseCartQuantityMutation,
  useDecreaseCartQuantityMutation,
  useRemoveFromCartMutation,
  useCreateCheckoutSessionMutation,
  useVerifyPaymentMutation,
} from "../../features/api/catalogApi";
import { PageShell } from "../../components/ui/tw/PageShell";
import {
  PageHeader,
  PageContentCard,
  EmptyState,
} from "../../components/ui/tw/PageHeader";
import { Button } from "../../components/ui/tw/Button";
import { BackButton } from "../../components/ui/tw/BackButton";
import { Spinner } from "../../components/ui/tw/Spinner";
import { cn } from "../../lib/cn";

const PERKS = [
  { icon: Gift, text: "Free courses bundled with qualifying instruments" },
  { icon: Truck, text: "Fast dispatch on instrument orders" },
  { icon: Headphones, text: "Support for orders & course access" },
];

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { data: cart, isLoading, isError } = useGetCartItemsQuery();
  const [increaseQty] = useIncreaseCartQuantityMutation();
  const [decreaseQty] = useDecreaseCartQuantityMutation();
  const [removeItem] = useRemoveFromCartMutation();
  const [createCheckout, { isLoading: loadingButton }] =
    useCreateCheckoutSessionMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const items = cart?.items ?? [];

  const { instruments, paidCourses, freeByInstrument, freeCount } = useMemo(() => {
    const inst = items.filter((i) => i.productType === "instruments");
    const instrumentIds = new Set(inst.map((i) => getCartProductId(i)).filter(Boolean));

    const free = items.filter((i) => {
      if (!isFreeWithInstrumentItem(i)) return false;
      const linked = normalizeMongoId(i.linkedInstrumentId);
      return linked && instrumentIds.has(linked);
    });

    const paid = items.filter(
      (i) => i.productType === "course_masters" && !isFreeWithInstrumentItem(i)
    );

    const bundles = inst.map((instrument) => {
      const instId = getCartProductId(instrument);
      const courses = free.filter(
        (c) => normalizeMongoId(c.linkedInstrumentId) === instId
      );
      return { instrument, courses };
    });

    return {
      instruments: inst,
      paidCourses: paid,
      freeByInstrument: bundles.filter((b) => b.courses.length > 0),
      freeCount: free.length,
    };
  }, [items]);

  const cartIsEmpty =
    instruments.length === 0 && paidCourses.length === 0 && freeCount === 0;

  const visibleLineCount = instruments.length + paidCourses.length + freeCount;
  const subtotal = [...instruments, ...paidCourses, ...freeByInstrument.flatMap((b) => b.courses)].reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const itemUnits = getVisibleCartUnits(items);
  const paidLineCount = instruments.length + paidCourses.length;

  useEffect(() => {
    if (!isLoading && !isError) {
      dispatch(setCartCount(getCartBadgeCount(items)));
    }
  }, [items, isLoading, isError, dispatch]);

  const cartPayload = (item) => ({
    productId: getCartProductId(item),
    productType: item.productType,
  });

  const syncCountFromCart = (cartData) => {
    dispatch(setCartCount(getCartBadgeCount(cartData?.items ?? [])));
  };

  const handleIncrease = async (item) => {
    try {
      const next = await increaseQty(cartPayload(item)).unwrap();
      syncCountFromCart(next);
    } catch {
      toast.error("Could not update quantity");
    }
  };

  const handleDecrease = async (item) => {
    try {
      const next = await decreaseQty(cartPayload(item)).unwrap();
      syncCountFromCart(next);
    } catch {
      toast.error("Could not update quantity");
    }
  };

  const handleRemoveCart = async (item) => {
    const payload = cartPayload(item);
    if (!payload.productId || !payload.productType) return;
    try {
      const next = await removeItem(payload).unwrap();
      syncCountFromCart(next);
    } catch {
      toast.error("Could not remove item");
    }
  };

  const handleCheckout = async () => {
    try {
      const { razorpayOrderId, amount, currency, key } =
        await createCheckout().unwrap();

      const options = {
        key,
        amount,
        currency,
        name: "Grammy Music",
        description: "Course / Instrument Purchase",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();
            navigate("/user/payment-processing");
          } catch {
            toast.error("Payment verification failed");
            navigate("/user/payment-failed");
          }
        },
        modal: { ondismiss: () => navigate("/user/payment-failed") },
        prefill: {
          email: user?.em,
          name: getFullName(user?.firstname, user?.lastname),
        },
        theme: { color: "#4338ca" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () => navigate("/user/payment-failed"));
      razorpay.open();
    } catch (err) {
      toast.error(err?.data?.msg || "Payment failed. Please try again.");
    }
  };

  return (
    <PageShell>
      <PageHeader
        icon={ShoppingCart}
        title="My Cart"
        subtitle="Review instruments and courses. Free lessons are added automatically when you buy a matching instrument."
        variant="cart"
      >
        {!isLoading && !isError && !cartIsEmpty && (
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm">
            {itemUnits} {itemUnits === 1 ? "unit" : "units"} · {visibleLineCount}{" "}
            {visibleLineCount === 1 ? "line" : "lines"}
          </span>
        )}
      </PageHeader>

      {!isLoading && !isError && !cartIsEmpty && (
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {PERKS.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2.5 text-xs text-slate-600"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 space-y-5">
        {isLoading ? (
          <PageContentCard>
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          </PageContentCard>
        ) : isError ? (
          <PageContentCard>
            <p className="py-12 text-center text-sm font-semibold text-danger">
              Failed to load cart. Please refresh the page.
            </p>
          </PageContentCard>
        ) : cartIsEmpty ? (
          <PageContentCard>
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              description="Explore instruments and courses — add what you love and checkout in minutes."
              action={
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link to="/user/instruments" className="btn-primary">
                    <Music className="h-4 w-4" />
                    Browse instruments
                  </Link>
                  <Link to="/user/courses" className="btn-outline">
                    <GraduationCap className="h-4 w-4" />
                    View courses
                  </Link>
                </div>
              }
            />
          </PageContentCard>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 space-y-5">
              <PageContentCard>
                <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Your items
                </h2>
                <p className="mb-5 text-xs text-muted">
                  {paidLineCount} paid {paidLineCount === 1 ? "item" : "items"}
                  {freeCount > 0 &&
                    ` · ${freeCount} free ${freeCount === 1 ? "course" : "courses"} included`}
                </p>

                <div className="space-y-6">
                  {instruments.map((item) => {
                    const bundle = freeByInstrument.find(
                      (b) =>
                        getCartProductId(b.instrument) === getCartProductId(item)
                    );

                    return (
                      <div key={`inst-${getCartProductId(item)}`} className="space-y-3">
                        <CartItemCard
                          item={item}
                          onRemove={() => handleRemoveCart(item)}
                          onIncrease={() => handleIncrease(item)}
                          onDecrease={() => handleDecrease(item)}
                        />

                        {bundle && bundle.courses.length > 0 && (
                          <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-white p-4">
                            <div className="mb-3 flex items-center gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                                <Sparkles className="h-4 w-4" />
                              </span>
                              <div>
                                <p className="text-sm font-bold text-emerald-900">
                                  Free courses with this instrument
                                </p>
                                <p className="text-xs text-emerald-800/80">
                                  {bundle.courses.length}{" "}
                                  {bundle.courses.length === 1
                                    ? "course"
                                    : "courses"}{" "}
                                  included at no extra cost
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {bundle.courses.map((course) => (
                                <CartItemCard
                                  key={`free-${getCartProductId(course)}`}
                                  item={course}
                                  compact
                                  bundledWith={item.title}
                                  onRemove={() => handleRemoveCart(course)}
                                  onIncrease={() => handleIncrease(course)}
                                  onDecrease={() => handleDecrease(course)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {paidCourses.map((item) => (
                    <CartItemCard
                      key={`paid-course-${getCartProductId(item)}`}
                      item={item}
                      onRemove={() => handleRemoveCart(item)}
                      onIncrease={() => handleIncrease(item)}
                      onDecrease={() => handleDecrease(item)}
                    />
                  ))}
                </div>
              </PageContentCard>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 px-4 py-3 text-xs leading-relaxed text-slate-600">
                <strong className="text-slate-800">Tip:</strong> Removing an
                instrument also removes its bundled free courses. Paid courses
                stay in your cart until you remove them.
              </div>
            </div>

            <aside className="w-full shrink-0 lg:sticky lg:top-[5.5rem] lg:w-[340px]">
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_16px_40px_-20px_rgba(15,23,42,0.15)]">
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
                  <h2 className="text-lg font-extrabold text-navy">Order summary</h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Secure payment via Razorpay
                  </p>
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Instruments</span>
                    <span className="font-semibold text-navy">
                      {instruments.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Paid courses</span>
                    <span className="font-semibold text-navy">
                      {paidCourses.length}
                    </span>
                  </div>
                  {freeCount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">Free with instrument</span>
                      <span className="font-bold text-emerald-700">{freeCount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Total units</span>
                    <span className="font-semibold text-navy">{itemUnits}</span>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex items-end justify-between">
                    <span className="font-bold text-navy">Amount due</span>
                    <span className="text-2xl font-extrabold text-brand-600">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {freeCount > 0 && (
                    <p
                      className={cn(
                        "rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-center text-xs font-semibold text-emerald-800"
                      )}
                    >
                      You&apos;re getting {freeCount} course
                      {freeCount !== 1 ? "s" : ""} free with your instrument
                      {freeCount !== 1 ? "s" : ""}!
                    </p>
                  )}
                  <Button
                    variant="primary"
                    fullWidth
                    disabled={loadingButton}
                    className="mt-1 py-3 text-base font-bold"
                    onClick={handleCheckout}
                  >
                    {loadingButton ? (
                      <>
                        <Spinner
                          size="sm"
                          className="border-white/30 border-t-white"
                        />
                        Redirecting…
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Proceed to pay
                      </>
                    )}
                  </Button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-[10px] text-muted">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Encrypted checkout · Instant confirmation
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}

        <BackButton to="/user" label="Back to home" />
      </div>
    </PageShell>
  );
};

export default Cart;
