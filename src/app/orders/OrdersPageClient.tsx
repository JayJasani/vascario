"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";

type UserOrderSummary = {
  id: string;
  status: string;
  totalAmount: number;
  paymentId: string | null;
  razorpayOrderId: string | null;
  createdAt: string | null;
};

export default function OrdersPageClient() {
  const { user, loading } = useAuth();
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const [orders, setOrders] = useState<UserOrderSummary[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/orders");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoadingOrders(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/users/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error ?? "Failed to load orders");
        }
        const data = (await res.json()) as { orders: UserOrderSummary[] };
        setOrders(data.orders);
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Unable to load your orders right now.",
        );
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading || (!user && loading)) {
    return (
      <main className="min-h-screen bg-[var(--vsc-cream)] flex items-center justify-center">
        <span
          className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.3em]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          LOADING...
        </span>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[var(--vsc-cream)]">
      <Navbar />

      <div className="pt-24 sm:pt-28 md:pt-36 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="mb-8 sm:mb-12">
          <h1
            className="text-[var(--vsc-gray-900)] select-none"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            YOUR <span className="text-[var(--vsc-accent)]">ORDERS</span>
          </h1>
          <span
            className="block mt-4 text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.3em]"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            [ ORDER.HISTORY ]
          </span>
        </div>

        <div className="border-2 sm:border-3 md:border-4 border-[var(--vsc-gray-200)] bg-[var(--vsc-white)]">
          <div className="px-4 sm:px-6 py-4 border-b-2 border-[var(--vsc-gray-200)]">
            <h2
              className="text-xs font-bold text-[var(--vsc-accent)] uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              ORDER LOG
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            {loadingOrders ? (
              <p
                className="text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                FETCHING YOUR ORDERS...
              </p>
            ) : error ? (
              <p
                className="text-xs text-[var(--vsc-accent)] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {error}
              </p>
            ) : orders.length === 0 ? (
              <p
                className="text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                YOU HAVEN&apos;T PLACED ANY ORDERS YET.
              </p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-3 border border-[var(--vsc-gray-200)] bg-[var(--vsc-cream)]"
                  >
                    <div className="flex flex-col gap-1">
                      <span
                        className="text-xs font-bold text-[var(--vsc-gray-900)] uppercase tracking-[0.15em]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        ORDER #{order.id}
                      </span>
                      <span
                        className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.15em]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "DATE UNKNOWN"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className="text-xs font-bold uppercase px-2 py-1 border border-[var(--vsc-gray-400)]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {order.status}
                      </span>
                      <span
                        className="text-sm font-bold text-[var(--vsc-accent)]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

