"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import type { OrderStatus } from "@/models/order";
import { StatusBadge } from "@/components/admin/StatusBadge";

const userStatusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-[#FFD600] text-black border-[#FFD600]",
  PAID: "bg-[#BAFF00] text-black border-[#BAFF00]",
  FAILED: "bg-[#FF9900] text-black border-[#FF9900]",
  IN_PRODUCTION: "bg-[#00BFFF] text-black border-[#00BFFF]",
  SHIPPED: "bg-[#00E5FF] text-black border-[#00E5FF]",
  DELIVERED: "bg-[#F5F5F0] text-black border-[#F5F5F0]",
  CANCELLED: "bg-[#FF3333] text-white border-[#FF3333]",
};

type UserOrderSummary = {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  paymentId: string | null;
  razorpayOrderId: string | null;
  paymentMethod: "ONLINE" | "COD" | null;
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
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-3 border border-[var(--vsc-gray-200)] bg-[var(--vsc-cream)] hover:border-[var(--vsc-accent)] transition-colors"
                  >
                    <div className="flex flex-col gap-1 items-start">
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
                      {order.paymentMethod && (
                        <span
                          className="inline-flex w-fit self-start mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--vsc-gray-700)] bg-[var(--vsc-white)]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          {order.paymentMethod === "COD" ? "COD" : "ONLINE"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge
                        status={order.status}
                        className={userStatusStyles[order.status]}
                      />
                      <span
                        className="text-sm font-bold text-[var(--vsc-accent)]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </Link>
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

