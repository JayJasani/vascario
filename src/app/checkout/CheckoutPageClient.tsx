"use client";

import { StorefrontShell } from "@/components/layouts/StorefrontShell";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useUserProfile, type UserProfile as UserProfileType } from "@/context/UserProfileContext";
import {
  trackAddShippingInfo,
  trackBeginCheckout,
  trackPurchase,
  type AnalyticsItem,
} from "@/lib/analytics";
import { openRazorpayCheckout } from "@/lib/payments/razorpay-client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

type PaymentMethod = "ONLINE" | "COD";

type AvailableCoupon = {
  code: string;
  label: string;
  type: "PERCENT" | "FLAT";
  value: number;
  minCartTotal: number | null;
  maxDiscount: number | null;
  isActive: boolean;
  isPublic: boolean;
  isApplicable: boolean;
  discountAmount: number;
  reason: string | null;
};

export default function CheckoutPageClient() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { formatPrice } = useCurrency();
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ONLINE");
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    label: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [serverSubtotal, setServerSubtotal] = useState<number | null>(null);
  const [serverDiscount, setServerDiscount] = useState<number | null>(null);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [showCouponList, setShowCouponList] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[] | null>(null);
  const [loadingAvailableCoupons, setLoadingAvailableCoupons] = useState(false);
  const [availableCouponsError, setAvailableCouponsError] = useState<string | null>(null);
  const router = useRouter();

  const beginCheckoutFired = useRef(false);

  const subtotal = serverSubtotal ?? cartTotal;
  const couponDiscount =
    serverDiscount != null ? serverDiscount : 0;
  const effectiveTotal =
    serverTotal != null ? serverTotal : Math.max(0, subtotal - couponDiscount);

  useEffect(() => {
    setMounted(true);
  }, []);

  const buildAnalyticsItems = (): AnalyticsItem[] =>
    items.map((item, i) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.size,
      index: i,
    }));

  useEffect(() => {
    if (mounted && items.length > 0 && !beginCheckoutFired.current) {
      beginCheckoutFired.current = true;
      trackBeginCheckout({
        currency: "INR",
        value: effectiveTotal,
        items: buildAnalyticsItems(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, items.length, effectiveTotal]);

  // Form state
  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Prefill name/email from profile when available
  useEffect(() => {
    if (!user || !profile) return;

    setShipping((prev) => {
      const hasName = prev.fullName.trim().length > 0;
      const hasEmail = prev.email.trim().length > 0;

      if (hasName && hasEmail) return prev;

      const profileName =
        profile.displayName ||
        [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();

      return {
        ...prev,
        fullName:
          hasName ||
          !(
            profileName ||
            user.displayName ||
            user.email
          )
            ? prev.fullName
            : profileName || user.displayName || user.email || "",
        email: hasEmail || !user.email ? prev.email : user.email ?? prev.email,
      };
    });
  }, [profile, user]);

  // Prefill address from default saved address when first available
  useEffect(() => {
    if (!profile || !profile.addresses || profile.addresses.length === 0) return;
    if (selectedAddressId) return;

    const defaultAddress =
      profile.addresses.find((a) => a.isDefault) ?? profile.addresses[0];
    if (!defaultAddress) return;

    setSelectedAddressId(defaultAddress.id);
    setShipping((prev) => ({
      ...prev,
      fullName: defaultAddress.fullName || prev.fullName,
      address:
        defaultAddress.line1 +
        (defaultAddress.line2 ? `, ${defaultAddress.line2}` : ""),
      city: defaultAddress.city,
      zip: defaultAddress.postalCode,
      country: defaultAddress.country,
    }));
  }, [profile, selectedAddressId]);

  const goNext = () => {
    if (step === 1) {
      trackAddShippingInfo({
        currency: "INR",
        value: effectiveTotal,
        items: buildAnalyticsItems(),
        shipping_tier: "standard",
      });
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 2));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const clearServerCart = async () => {
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to clear server cart", err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);

      if (paymentMethod === "COD") {
        const codRes = await fetch("/api/orders/create-cod", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalAmount: effectiveTotal,
            subtotalAmount: subtotal,
            discountAmount: couponDiscount,
            couponCode: appliedCoupon?.code ?? null,
            currency: "INR",
            userId: user?.uid ?? "",
            shipping,
            items: items.map((item) => ({
              id: item.id,
              name: item.name,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
              color: item.color ?? null,
              image: item.image ?? "",
              slug: item.slug ?? "",
            })),
          }),
        });

        if (!codRes.ok) {
          // eslint-disable-next-line no-alert
          alert("Unable to place COD order. Please try again.");
          return;
        }

        const codData = (await codRes.json()) as {
          orderId: string;
          totalAmount: number;
          currency: string;
        };

        const transactionId = codData.orderId;

        let orderRefId = "";
        if (typeof window !== "undefined") {
          const snapshot = {
            id: transactionId,
            total: effectiveTotal,
            subtotal,
            discountAmount: couponDiscount,
            couponCode: appliedCoupon?.code ?? null,
            items: items.map((item) => ({
              id: item.id,
              name: item.name,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
              color: item.color ?? null,
            })),
            shipping,
            createdAt: new Date().toISOString(),
          };

          try {
            const keyPrefix = "vascario:lastOrder:";
            const uuid =
              window.crypto && "randomUUID" in window.crypto
                ? window.crypto.randomUUID()
                : `${Date.now().toString(36)}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`;
            orderRefId = uuid;
            window.sessionStorage.setItem(
              `${keyPrefix}${orderRefId}`,
              JSON.stringify(snapshot),
            );
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to persist last order snapshot", err);
          }
        }

        trackPurchase({
          transaction_id: transactionId,
          currency: "INR",
          value: effectiveTotal,
          items: buildAnalyticsItems(),
          shipping: 0,
        });

        await clearServerCart();
        clearCart();
        const refQuery = orderRefId ? `&ref=${encodeURIComponent(orderRefId)}` : "";
        router.push(`/order-success?order=${transactionId}${refQuery}`);
      } else {
        const amountInPaise = Math.round(effectiveTotal * 100);

        const orderRes = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: "INR",
            receipt: `vascario_rcpt_${Date.now().toString(36)}`,
            userId: user?.uid ?? "",
            shipping,
            items: items.map((item) => ({
              id: item.id,
              name: item.name,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
              color: item.color ?? null,
              image: item.image ?? "",
              slug: item.slug ?? "",
            })),
            notes: {
              userId: user?.uid ?? "",
              email: shipping.email,
              name: shipping.fullName,
              address: shipping.address,
              city: shipping.city,
              zip: shipping.zip,
              country: shipping.country,
            },
            subtotalAmount: subtotal,
            discountAmount: couponDiscount,
            couponCode: appliedCoupon?.code ?? null,
          }),
        });

        if (!orderRes.ok) {
          // eslint-disable-next-line no-alert
          alert("Unable to start payment. Please try again.");
          return;
        }

        const orderData = (await orderRes.json()) as {
          orderId: string;
          amount: number;
          currency: string;
          keyId: string;
        };

        await openRazorpayCheckout({
          amount: orderData.amount,
          currency: orderData.currency,
          orderId: orderData.orderId,
          keyId: orderData.keyId,
          name: "VASCARIO",
          description: "Order payment",
          prefill: {
            name: shipping.fullName,
            email: shipping.email,
            contact: shipping.phone.replace(/\D/g, "").slice(0, 10) || undefined,
          },
          notes: {
            userId: user?.uid ?? "",
          },
          onSuccess: async (response) => {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            });

            if (!verifyRes.ok) {
              // eslint-disable-next-line no-alert
              alert("Payment verification failed. Please contact support.");
              return;
            }

            const verifyData = (await verifyRes.json()) as {
              success: boolean;
              orderId?: string | null;
            };

            const orderDocId = verifyData.orderId ?? null;
            const transactionId = response.razorpay_payment_id;
            const orderIdentifier = orderDocId ?? transactionId;

            // Persist a lightweight snapshot of this order for the success page
            let orderRefId = "";
            if (typeof window !== "undefined") {
              const snapshot = {
                id: orderIdentifier,
                total: effectiveTotal,
                subtotal,
                discountAmount: couponDiscount,
                couponCode: appliedCoupon?.code ?? null,
                items: items.map((item) => ({
                  id: item.id,
                  name: item.name,
                  size: item.size,
                  quantity: item.quantity,
                  price: item.price,
                  color: item.color ?? null,
                })),
                shipping,
                createdAt: new Date().toISOString(),
              };

              try {
                const keyPrefix = "vascario:lastOrder:";
                const uuid =
                  window.crypto && "randomUUID" in window.crypto
                    ? window.crypto.randomUUID()
                    : `${Date.now().toString(36)}-${Math.random()
                        .toString(36)
                        .slice(2, 8)}`;
                orderRefId = uuid;
                window.sessionStorage.setItem(
                  `${keyPrefix}${orderRefId}`,
                  JSON.stringify(snapshot),
                );
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error("Failed to persist last order snapshot", err);
              }
            }

            trackPurchase({
              transaction_id: transactionId,
              currency: "INR",
              value: effectiveTotal,
              items: buildAnalyticsItems(),
              shipping: 0,
            });

            await clearServerCart();
            clearCart();
            const refQuery = orderRefId ? `&ref=${encodeURIComponent(orderRefId)}` : "";
            router.push(`/order-success?order=${orderIdentifier}${refQuery}`);
          },
          onFailure: async () => {
            try {
              await fetch("/api/razorpay/mark-order-cancelled", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpayOrderId: orderData.orderId,
                }),
              });
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("Failed to mark order as cancelled", err);
            } finally {
              // eslint-disable-next-line no-alert
              alert("Payment was cancelled.");
            }
          },
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error during payment", error);
      // eslint-disable-next-line no-alert
      alert("Something went wrong while processing the payment.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!mounted) return null;

  if (!user) {
    return (
      <StorefrontShell>
        <main className="min-h-screen bg-[var(--vsc-cream)]">
          <div className="flex flex-col items-center justify-center min-h-screen gap-6 sm:gap-8 px-4">
            <p
              className="text-xl sm:text-2xl md:text-4xl font-bold text-[var(--vsc-gray-600)] uppercase tracking-[0.1em] text-center"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              SIGN IN TO CHECK OUT
            </p>
            <Link
              href="/login?redirect=/checkout"
              className="w-full sm:w-auto text-center px-6 sm:px-10 py-4 sm:py-6 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              SIGN IN →
            </Link>
          </div>
        </main>
      </StorefrontShell>
    );
  }

  if (items.length === 0) {
    return (
      <StorefrontShell>
        <main className="min-h-screen bg-[var(--vsc-cream)]">
          <div className="flex flex-col items-center justify-center min-h-screen gap-6 sm:gap-8 px-4">
            <p
              className="text-xl sm:text-2xl md:text-4xl font-bold text-[var(--vsc-gray-600)] uppercase tracking-[0.1em] text-center"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              YOUR BAG IS EMPTY
            </p>
            <Link
              href="/"
              className="w-full sm:w-auto text-center px-6 sm:px-10 py-4 sm:py-6 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              CONTINUE SHOPPING →
            </Link>
          </div>
        </main>
      </StorefrontShell>
    );
  }

  const STEPS = [
    { num: "01", label: "SHIP" },
    { num: "02", label: "PAY" },
  ];

  const applyCouponByCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      setAppliedCoupon(null);
      setCouponError("Enter a code to apply");
      return;
    }
    setApplyingCoupon(true);
    setCouponError(null);
    void (async () => {
      try {
        const res = await fetch("/api/cart/apply-coupon", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          error?: string;
          coupon?: { code: string; label: string };
          subtotal?: number;
          discountAmount?: number;
          total?: number;
        };
        if (!res.ok || !data.ok) {
          setAppliedCoupon(null);
          setServerSubtotal(null);
          setServerDiscount(null);
          setServerTotal(null);
          setCouponError(data.error || "Unable to apply coupon");
          return;
        }
        if (!data.coupon) {
          setAppliedCoupon(null);
          setCouponError("Unable to apply coupon");
          return;
        }
        setAppliedCoupon({
          code: data.coupon.code,
          label: data.coupon.label,
        });
        setCouponCodeInput(data.coupon.code);
        setServerSubtotal(
          typeof data.subtotal === "number" ? data.subtotal : null,
        );
        setServerDiscount(
          typeof data.discountAmount === "number"
            ? data.discountAmount
            : null,
        );
        setServerTotal(typeof data.total === "number" ? data.total : null);
      } catch {
        setAppliedCoupon(null);
        setServerSubtotal(null);
        setServerDiscount(null);
        setServerTotal(null);
        setCouponError("Failed to apply coupon. Please try again.");
      } finally {
        setApplyingCoupon(false);
      }
    })();
  };

  const handleApplyCoupon = () => {
    applyCouponByCode(couponCodeInput);
  };

  const handleApplyCouponFromList = (code: string) => {
    setCouponCodeInput(code);
    applyCouponByCode(code);
    setShowCouponList(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponCodeInput("");
    setServerSubtotal(null);
    setServerDiscount(null);
    setServerTotal(null);
  };

  const handleToggleCouponList = () => {
    const next = !showCouponList;
    setShowCouponList(next);
    if (!next) return;

    // Already loaded and not currently loading – just show cached list
    if (availableCoupons && !loadingAvailableCoupons) return;

    setLoadingAvailableCoupons(true);
    setAvailableCouponsError(null);
    void (async () => {
      try {
        const res = await fetch("/api/cart/available-coupons");
        const data = (await res.json()) as {
          ok: boolean;
          error?: string;
          coupons?: AvailableCoupon[];
        };
        if (!res.ok || !data.ok || !data.coupons) {
          setAvailableCoupons(null);
          setAvailableCouponsError(data.error || "Unable to load offers");
          return;
        }
        setAvailableCoupons(data.coupons);
      } catch {
        setAvailableCoupons(null);
        setAvailableCouponsError("Failed to load offers. Please try again.");
      } finally {
        setLoadingAvailableCoupons(false);
      }
    })();
  };

  return (
    <StorefrontShell>
      <main className="min-h-screen bg-[var(--vsc-cream)]">
        <div className="pt-24 sm:pt-28 md:pt-36 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 lg:px-20">
        {/* ===== TERMINAL TITLE ===== */}
        <div className="mb-8 sm:mb-12">
          <h1
            className="text-[var(--vsc-gray-900)] select-none"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            CHECK
            <span className="text-[var(--vsc-accent)]">OUT</span>
          </h1>
          <span
            className="block mt-4 text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.3em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            [ TERMINAL.VASCARIO ]
          </span>
        </div>

        {/* ===== STEP PROGRESS BAR ===== */}
        <div className="flex items-center gap-0 mb-6 sm:mb-8 md:mb-16 border-2 sm:border-3 md:border-4 border-[var(--vsc-gray-200)]">
          {STEPS.map((s, i) => (
            <button
              key={s.num}
              onClick={() => {
                if (i + 1 < step) {
                  setDirection(-1);
                  setStep(i + 1);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 md:gap-3 py-2.5 sm:py-3 md:py-5 transition-all duration-300 ${
                step === i + 1
                  ? "bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)]"
                  : step > i + 1
                    ? "bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)] cursor-pointer hover:bg-[var(--vsc-gray-200)]"
                    : "bg-[var(--vsc-white)] text-[var(--vsc-gray-500)] cursor-default"
              } ${i < STEPS.length - 1 ? "border-r-2 sm:border-r-3 md:border-r-4 border-[var(--vsc-gray-200)]" : ""}`}
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              <span className="text-sm sm:text-base md:text-2xl font-bold">
                {s.num}
              </span>
              <span className="hidden sm:inline text-xs md:text-sm font-bold uppercase tracking-[0.15em]">
                {s.label}
              </span>
            </button>
          ))}
        </div>

        {/* ===== STEP CONTENT ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left — Form (2 cols on lg) */}
          <div
            className="lg:col-span-2 relative pb-6 sm:pb-8"
            style={{ minHeight: "350px", overflowX: "clip" }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <StepShipping
                    shipping={shipping}
                    setShipping={setShipping}
                    savedAddresses={profile?.addresses}
                    selectedAddressId={selectedAddressId}
                    setSelectedAddressId={setSelectedAddressId}
                    onNext={goNext}
                  />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <StepReview
                    shipping={shipping}
                    items={items}
                    subtotal={subtotal}
                    discountAmount={couponDiscount}
                    total={effectiveTotal}
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={setPaymentMethod}
                    onBack={goBack}
                    onPlace={handlePlaceOrder}
                    isPlacingOrder={isPlacingOrder}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — Order summary mini */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 sm:top-24 md:top-28 border-2 sm:border-3 md:border-4 border-[var(--vsc-gray-200)] bg-[var(--vsc-white)]">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b-2 border-[var(--vsc-gray-200)]">
                <h3
                  className="text-xs font-bold text-[var(--vsc-accent)] uppercase tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  YOUR ORDER
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex justify-between items-start pb-3 border-b border-dashed border-[var(--vsc-gray-700)]"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <span
                        className="text-xs text-[var(--vsc-gray-900)] uppercase tracking-[0.05em] block truncate"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="text-[10px] text-[var(--vsc-gray-500)] uppercase"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {item.size} × {item.quantity}
                      </span>
                    </div>
                    <span
                      className="text-xs font-bold text-[var(--vsc-gray-900)] shrink-0"
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                {/* Coupon (temporarily disabled) + totals */}
                <div className="mt-4 space-y-3">
                  {/* {false && (
                    <div className="space-y-2">
                      <span
                        className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.25em]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        Discount code
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCodeInput}
                          onChange={(e) => {
                            setCouponCodeInput(e.target.value.toUpperCase());
                            if (couponError) setCouponError(null);
                          }}
                          placeholder="VASCARIO10"
                          className="flex-1 px-3 py-2 border border-[var(--vsc-gray-300)] bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)] text-xs tracking-[0.15em] uppercase placeholder:text-[var(--vsc-gray-400)] focus:outline-none focus:border-[var(--vsc-gray-900)]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        />
                        {appliedCoupon ? (
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] border border-[var(--vsc-gray-900)] text-[var(--vsc-gray-900)] hover:bg-[var(--vsc-gray-900)] hover:text-[var(--vsc-cream)] transition-colors"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={subtotal <= 0 || applyingCoupon}
                            className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] border border-[var(--vsc-gray-900)] text-[var(--vsc-gray-900)] hover:bg-[var(--vsc-gray-900)] hover:text-[var(--vsc-cream)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {applyingCoupon ? "Applying…" : "Apply"}
                          </button>
                        )}
                      </div>
                      {appliedCoupon && (
                        <p
                          className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.18em]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Applied: {appliedCoupon.label || appliedCoupon.code}
                        </p>
                      )}
                      {couponError && (
                        <p
                          className="text-[10px] text-[#ef4444] uppercase tracking-[0.18em]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          {couponError}
                        </p>
                      )}
                      <div className="mt-1 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handleToggleCouponList}
                          className="text-[10px] text-[var(--vsc-gray-700)] hover:text-[var(--vsc-gray-900)] uppercase tracking-[0.18em] underline-offset-2 hover:underline"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          {showCouponList ? "Hide all offers" : "View all offers"}
                        </button>
                        {availableCoupons && availableCoupons.length > 0 && (
                          <span
                            className="text-[9px] text-[var(--vsc-gray-500)] uppercase tracking-[0.18em]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {availableCoupons.filter((c) => c.isApplicable).length} applicable
                          </span>
                        )}
                      </div>
                      {showCouponList && (
                        <div className="mt-3 border border-[var(--vsc-gray-200)] bg-[var(--vsc-cream)] divide-y divide-[var(--vsc-gray-200)] max-h-64 overflow-y-auto">
                          {loadingAvailableCoupons && (
                            <div
                              className="px-3 py-2 text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.18em]"
                              style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                              Loading offers…
                            </div>
                          )}
                          {availableCouponsError && !loadingAvailableCoupons && (
                            <div
                              className="px-3 py-2 text-[10px] text-[#ef4444] uppercase tracking-[0.18em]"
                              style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                              {availableCouponsError}
                            </div>
                          )}
                          {!loadingAvailableCoupons &&
                            !availableCouponsError &&
                            (availableCoupons && availableCoupons.length > 0 ? (
                              availableCoupons.map((c) => (
                                <div
                                  key={c.code}
                                  className="flex items-center justify-between px-3 py-2 gap-3"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="text-[10px] text-[var(--vsc-gray-900)] uppercase tracking-[0.12em] truncate"
                                      style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                      {c.label || c.code}
                                    </p>
                                    <p
                                      className="text-[9px] text-[var(--vsc-gray-600)] uppercase tracking-[0.12em]"
                                      style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                      {c.type === "PERCENT"
                                        ? `${c.value}% OFF`
                                        : `₹${Math.round(c.value).toLocaleString("en-IN")} OFF`}
                                      {c.minCartTotal != null &&
                                        ` · Min ₹${Math.round(c.minCartTotal).toLocaleString("en-IN")}`}
                                    </p>
                                    <p
                                      className={`text-[9px] uppercase tracking-[0.14em] mt-0.5 ${
                                        c.isApplicable
                                          ? "text-[var(--vsc-accent)]"
                                          : "text-[var(--vsc-gray-500)]"
                                      }`}
                                      style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                      {c.isApplicable
                                        ? c.discountAmount > 0
                                          ? `Active • Save ${formatPrice(c.discountAmount)}`
                                          : "Active for your cart"
                                        : c.reason || "Not applicable for this order"}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    disabled={!c.isApplicable || applyingCoupon}
                                    onClick={() => handleApplyCouponFromList(c.code)}
                                    className={`px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] border border-[var(--vsc-gray-900)] transition-colors ${
                                      c.isApplicable && !applyingCoupon
                                        ? "text-[var(--vsc-gray-900)] hover:bg-[var(--vsc-gray-900)] hover:text-[var(--vsc-cream)]"
                                        : "text-[var(--vsc-gray-400)] bg-[var(--vsc-gray-200)] cursor-not-allowed"
                                    }`}
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                  >
                                    {c.isApplicable ? "Apply" : "Inactive"}
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div
                                className="px-3 py-2 text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.18em]"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                              >
                                No offers available right now.
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )} */}

                  <div className="space-y-1 border-t border-[var(--vsc-gray-200)] pt-3">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.2em]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        Subtotal
                      </span>
                      <span
                        className="text-xs font-bold text-[var(--vsc-gray-900)]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between items-center">
                        <span
                          className="text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.2em]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Discount
                        </span>
                        <span
                          className="text-xs font-bold text-[var(--vsc-accent)]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          -{formatPrice(couponDiscount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-[var(--vsc-gray-300)] mt-1">
                      <span
                        className="text-xs font-bold text-[var(--vsc-gray-900)] uppercase tracking-[0.1em]"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        Total
                      </span>
                      <span
                        className="text-lg font-bold text-[var(--vsc-accent)]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {formatPrice(effectiveTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </StorefrontShell>
  );
}

/* =========================================================================
   SUB-COMPONENTS — EACH STEP
   ========================================================================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <label
        className="text-xs text-[var(--vsc-accent)] uppercase tracking-[0.25em] font-bold"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        className={`w-full px-3 py-3 sm:px-4 sm:py-3 md:px-5 md:py-4 bg-[var(--vsc-cream)] border-2 text-[var(--vsc-gray-900)] text-xs sm:text-sm uppercase tracking-[0.1em] placeholder:text-[var(--vsc-gray-400)] focus:outline-none transition-colors duration-200 ${
          error
            ? "border-red-500 focus:border-red-600"
            : "border-[var(--vsc-gray-300)] focus:border-[var(--vsc-gray-900)]"
        }`}
        style={{ fontFamily: "var(--font-space-mono)" }}
      />
      {error && (
        <span className="text-xs text-red-500 uppercase tracking-[0.05em]" style={{ fontFamily: "var(--font-space-mono)" }}>
          {error}
        </span>
      )}
    </div>
  );
}

const SHIPPING_REQUIRED_FIELDS = [
  "fullName",
  "phone",
  "address",
  "city",
  "zip",
  "country",
] as const;

function StepShipping({
  shipping,
  setShipping,
  savedAddresses,
  selectedAddressId,
  setSelectedAddressId,
  onNext,
}: {
  shipping: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  setShipping: React.Dispatch<React.SetStateAction<typeof shipping>>;
  savedAddresses?: UserProfileType["addresses"];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof typeof shipping, string>>>({});
  const update = (key: keyof typeof shipping) => (v: string) => {
    setShipping((prev) => ({ ...prev, [key]: v }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleContinue = () => {
    const nextErrors: Partial<Record<keyof typeof shipping, string>> = {};
    for (const key of SHIPPING_REQUIRED_FIELDS) {
      const val = shipping[key].trim();
      if (!val) {
        const label =
          key === "fullName"
            ? "Full name"
            : key === "zip"
              ? "ZIP code"
              : key.charAt(0).toUpperCase() + key.slice(1);
        nextErrors[key] = `${label} is required`;
      }
    }
    if (shipping.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
      nextErrors.email = "Please enter a valid email address";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onNext();
  };

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <span
          className="text-4xl md:text-5xl font-bold text-[var(--vsc-accent)]"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          01
        </span>
        <div className="flex-1 h-1 bg-[var(--vsc-accent)]" />
        <span
          className="text-sm font-bold text-[var(--vsc-white)] uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          SHIPPING
        </span>
      </div>

      {savedAddresses && savedAddresses.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.25em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Saved addresses
            </span>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <label
                  key={addr.id}
                  className="flex items-start gap-3 cursor-pointer"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  <input
                    type="radio"
                    name="saved-address"
                    className="mt-1"
                    checked={isSelected}
                    onChange={() => {
                      setSelectedAddressId(addr.id);
                      setShipping((prev) => ({
                        ...prev,
                        fullName: addr.fullName || prev.fullName,
                        address:
                          addr.line1 +
                          (addr.line2 ? `, ${addr.line2}` : ""),
                        city: addr.city,
                        zip: addr.postalCode,
                        country: addr.country,
                      }));
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[var(--vsc-gray-900)] uppercase tracking-[0.15em]">
                        {addr.fullName || addr.label || "Address"}
                      </span>
                      {addr.isDefault && (
                        <span
                          className="px-2 py-0.5 rounded-full bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)] text-[9px] uppercase tracking-[0.2em]"
                          style={{
                            display: "inline-flex",
                            width: "fit-content",
                          }}
                        >
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.1em] leading-relaxed">
                      {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ""}
                      <br />
                      {addr.city}
                      {addr.state ? `, ${addr.state}` : ""} {addr.postalCode}
                      <br />
                      {addr.country}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <InputField
          label="FULL NAME"
          value={shipping.fullName}
          onChange={update("fullName")}
          placeholder="JOHN DOE"
          required
          error={errors.fullName}
        />
        <InputField
          label="EMAIL"
          value={shipping.email}
          onChange={update("email")}
          placeholder="JOHN@VASCARIO.COM"
          type="email"
          error={errors.email}
        />
      </div>
      <InputField
        label="MOBILE NUMBER"
        value={shipping.phone}
        onChange={update("phone")}
        placeholder="98765 43210"
        type="tel"
        required
        error={errors.phone}
      />
      <InputField
        label="ADDRESS"
        value={shipping.address}
        onChange={update("address")}
        placeholder="123 STREET AVE"
        required
        error={errors.address}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
        <InputField
          label="CITY"
          value={shipping.city}
          onChange={update("city")}
          placeholder="NEW YORK"
          required
          error={errors.city}
        />
        <InputField
          label="ZIP CODE"
          value={shipping.zip}
          onChange={update("zip")}
          placeholder="10001"
          required
          error={errors.zip}
        />
        <InputField
          label="COUNTRY"
          value={shipping.country}
          onChange={update("country")}
          placeholder="US"
          required
          error={errors.country}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleContinue}
          className="w-full md:w-auto px-4 py-3 sm:px-6 sm:py-4 md:px-10 md:py-6 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] border-2 border-black transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)] active:scale-[0.97]"
          style={{
            fontFamily: "var(--font-space-mono)",
            backgroundColor: "black",
            color: "white",
          }}
        >
          CONTINUE TO PAYMENT →
        </button>
      </div>
    </div>
  );
}

function StepPayment({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return null;
}

function StepReview({
  shipping,
  items,
  subtotal,
  discountAmount,
  total,
  paymentMethod,
  onPaymentMethodChange,
  onBack,
  onPlace,
  isPlacingOrder,
}: {
  shipping: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
  }[];
  subtotal: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onBack: () => void;
  onPlace: () => void;
  isPlacingOrder: boolean;
}) {
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <span
          className="text-4xl md:text-5xl font-bold text-[var(--vsc-accent)]"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          02
        </span>
        <div className="flex-1 h-1 bg-[var(--vsc-accent)]" />
        <span
          className="text-sm font-bold text-[var(--vsc-white)] uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          PAY
        </span>
      </div>

      {/* Shipping summary */}
      <div className="border-2 border-[var(--vsc-gray-600)] p-4 sm:p-6 space-y-3">
        <h4
          className="text-xs text-[var(--vsc-accent)] uppercase tracking-[0.25em] font-bold mb-4"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          SHIPPING TO
        </h4>
        <p
          className="text-sm text-[var(--vsc-white)] uppercase tracking-[0.05em]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {shipping.fullName || "—"}
        </p>
        {shipping.phone ? (
          <p
            className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.1em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {shipping.phone}
          </p>
        ) : null}
        <p
          className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {shipping.address || "—"}, {shipping.city || "—"}{" "}
          {shipping.zip || "—"}
        </p>
        <p
          className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {shipping.country || "—"}
        </p>
      </div>

      {/* Items list */}
      <div className="border-2 border-[var(--vsc-gray-600)] p-4 sm:p-6">
        <h4
          className="text-xs text-[var(--vsc-accent)] uppercase tracking-[0.25em] font-bold mb-6"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          ORDER ITEMS
        </h4>
        <div className="space-y-3 sm:space-y-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex justify-between items-center pb-3 border-b border-dashed border-[var(--vsc-gray-700)]"
            >
              <div>
                <span
                  className="text-xs text-[var(--vsc-white)] uppercase tracking-[0.05em] block"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {item.name}
                </span>
                <span
                  className="text-[10px] text-[var(--vsc-gray-500)]"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  SIZE: {item.size} — QTY: {item.quantity}
                </span>
              </div>
              <span
                className="text-xs font-bold text-[var(--vsc-white)]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-4 sm:pt-6 mt-3 sm:mt-4 border-t-2 border-[var(--vsc-black)] space-y-1">
          <div className="flex justify-between items-center">
            <span
              className="text-xs text-[var(--vsc-gray-600)] uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Subtotal
            </span>
            <span
              className="text-xs font-bold text-[var(--vsc-black)]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {formatPrice(subtotal)}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between items-center">
              <span
                className="text-xs text-[var(--vsc-gray-600)] uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Discount
              </span>
              <span
                className="text-xs font-bold text-[var(--vsc-accent)]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                -{formatPrice(discountAmount)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2">
            <span
              className="text-sm font-bold uppercase tracking-[0.1em]"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "black" }}
            >
              Total
            </span>
            <span
              className="text-xl font-bold text-[var(--vsc-accent)]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div className="border-2 border-[var(--vsc-gray-600)] p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h4
          className="text-xs text-[var(--vsc-accent)] uppercase tracking-[0.25em] font-bold"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          PAYMENT METHOD
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            className={`flex items-center gap-3 w-full px-4 py-3 border text-xs uppercase tracking-[0.15em] cursor-pointer transition-colors ${
              paymentMethod === "ONLINE"
                ? "bg-[var(--vsc-accent)] text-[var(--vsc-white)] border-[var(--vsc-accent)]"
                : "bg-transparent text-black border-[var(--vsc-gray-600)] hover:border-[var(--vsc-accent)]"
            }`}
            style={{
              fontFamily: "var(--font-space-mono)",
              fontWeight: paymentMethod === "ONLINE" ? 700 : 400,
            }}
          >
            <input
              type="radio"
              name="payment-method"
              value="ONLINE"
              checked={paymentMethod === "ONLINE"}
              onChange={() => onPaymentMethodChange("ONLINE")}
              className="w-3 h-3 sm:w-4 sm:h-4 accent-[var(--vsc-accent)]"
            />
            <span className="text-[9px] sm:text-[11px]">
              ONLINE (UPI / NETBANKING / CARDS)
            </span>
          </label>
          <label
            className={`flex items-center gap-3 w-full px-4 py-3 border text-xs uppercase tracking-[0.15em] cursor-pointer transition-colors ${
              paymentMethod === "COD"
                ? "bg-[var(--vsc-accent)] text-[var(--vsc-white)] border-[var(--vsc-accent)]"
                : "bg-transparent text-black border-[var(--vsc-gray-600)] hover:border-[var(--vsc-accent)]"
            }`}
            style={{
              fontFamily: "var(--font-space-mono)",
              fontWeight: paymentMethod === "COD" ? 700 : 400,
            }}
          >
            <input
              type="radio"
              name="payment-method"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => onPaymentMethodChange("COD")}
              className="w-3 h-3 sm:w-4 sm:h-4 accent-[var(--vsc-accent)]"
            />
            <span>CASH ON DELIVERY</span>
          </label>
        </div>
        <p
          className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.15em]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          COD orders are confirmed now and paid in cash when the parcel is delivered.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 bg-transparent text-[var(--vsc-white)] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:text-[var(--vsc-accent)] transition-colors duration-200 border-2 md:border-4 border-[var(--vsc-gray-600)] hover:border-[var(--vsc-accent)]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          ← BACK
        </button>
        <button
          onClick={onPlace}
          disabled={isPlacingOrder}
          className="w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-4 md:px-10 md:py-6 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] border-2 border-black transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            fontFamily: "var(--font-space-mono)",
            backgroundColor: "black",
            color: "white",
          }}
        >
          {isPlacingOrder
            ? "PROCESSING..."
            : paymentMethod === "COD"
              ? "PLACE COD ORDER \u2192"
              : "PAY NOW \u2192"}
        </button>
      </div>
    </div>
  );
}
