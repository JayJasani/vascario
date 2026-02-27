"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { StorefrontShell } from "@/components/layouts/StorefrontShell";
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

type OrderDetail = {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  paymentId: string | null;
  razorpayOrderId: string | null;
  paymentMethod: "ONLINE" | "COD" | null;
  createdAt: string | null;
  shippingAddress: Record<string, unknown>;
};

type OrderItemDetail = {
  id: string;
  productId: string;
  productName: string | null;
  productImage: string | null;
  productSlug: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  unitPrice: number;
};

export default function OrderDetailPageClient() {
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;
  const { user, loading } = useAuth();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItemDetail[]>([]);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/orders");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId) return;
      setLoadingOrder(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/users/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error ?? "Failed to load order");
        }
        const data = (await res.json()) as {
          order: OrderDetail;
          items: OrderItemDetail[];
        };
        setOrder(data.order);
        setItems(data.items);
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Unable to load this order right now.",
        );
      } finally {
        setLoadingOrder(false);
      }
    };

    if (user && orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

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
    <StorefrontShell>
      <main className="min-h-screen bg-[var(--vsc-cream)]">
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
              ORDER <span className="text-[var(--vsc-accent)]">DETAILS</span>
            </h1>
            {order && (
              <span
                className="block mt-4 text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                [ ORDER #{order.id} ]
              </span>
            )}
          </div>

          {loadingOrder ? (
            <p
              className="text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              FETCHING ORDER...
            </p>
          ) : error ? (
            <p
              className="text-xs text-[var(--vsc-accent)] uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {error}
            </p>
          ) : !order ? (
            <p
              className="text-xs text-[var(--vsc-gray-500)] uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              ORDER NOT FOUND.
            </p>
          ) : (
            <div className="space-y-8">
              {/* Summary */}
              <div className="border-2 sm:border-3 md:border-4 border-[var(--vsc-gray-200)] bg-[var(--vsc-white)] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p
                    className="text-xs text-[var(--vsc-gray-600)] uppercase tracking-[0.15em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    Order ID
                  </p>
                  <p
                    className="text-sm font-bold text-[var(--vsc-gray-900)] uppercase tracking-[0.1em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    #{order.id}
                  </p>
                  <p
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
                  </p>
                  {order.paymentMethod && (
                    <p
                      className="text-[10px] text-[var(--vsc-gray-700)] uppercase tracking-[0.18em]"
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      Payment:{" "}
                      <span className="font-bold">
                        {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online"}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-start sm:items-end gap-3">
                  <div className="flex items-center gap-4">
                    <StatusBadge
                      status={order.status}
                      className={userStatusStyles[order.status]}
                    />
                    <span
                      className="text-lg font-bold text-[var(--vsc-accent)]"
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                  <Link
                    href={`/order-success?order=${order.id}`}
                    className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] px-3 py-2 border border-[var(--vsc-gray-900)] text-[var(--vsc-gray-900)] hover:bg-[var(--vsc-gray-900)] hover:text-[var(--vsc-cream)] transition-colors"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    DOWNLOAD RECEIPT
                  </Link>
                </div>
              </div>

              {/* Products grid */}
              <div>
                <h2
                  className="text-xs font-bold text-[var(--vsc-gray-600)] uppercase tracking-[0.25em] mb-4"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  ITEMS IN THIS ORDER
                </h2>
                {items.length === 0 ? (
                  <p
                    className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    No line items found for this order.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <a
                        key={item.id}
                        href={
                          item.productSlug
                            ? `/product/${item.productSlug}`
                            : undefined
                        }
                        className="border border-[var(--vsc-gray-200)] bg-[var(--vsc-white)] flex flex-col hover:border-[var(--vsc-accent)] transition-colors"
                      >
                        <div className="relative w-full aspect-[4/5] bg-[var(--vsc-gray-100)]">
                          {item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt={item.productName ?? "Ordered item"}
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="p-3 space-y-1">
                          <p
                            className="text-xs font-bold text-[var(--vsc-gray-900)] uppercase tracking-[0.1em]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {item.productName ?? "Product"}
                          </p>
                          <p
                            className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.15em]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {item.size && `Size: ${item.size}`}{" "}
                            {item.color && `· Color: ${item.color}`}
                          </p>
                          <p
                            className="text-[10px] text-[var(--vsc-gray-500)] uppercase tracking-[0.15em]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            Qty: {item.quantity}
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-[var(--vsc-gray-200)]">
                            <span
                              className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.15em]"
                              style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                              Line total
                            </span>
                            <span
                              className="text-xs font-bold text-[var(--vsc-accent)]"
                              style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                              {formatPrice(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </StorefrontShell>
  );
}

