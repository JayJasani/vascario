"use client";

import { useState } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { DataCard } from "@/components/admin/DataCard";
import { AdminLoadingBlock } from "@/components/admin/AdminLoadingBlock";
import { updateOrderStatus, addTrackingInfo } from "../actions";
import useSWR from "swr";

type OrderStatus = "PENDING" | "PAID" | "IN_PRODUCTION" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
    productName: string;
    size: string;
    color: string;
    quantity: number;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    status: OrderStatus;
    totalAmount: string;
    trackingNumber: string | null;
    trackingCarrier: string | null;
    notes: string | null;
    createdAt: string;
    items: OrderItem[];
}

const TABS: { label: string; value: OrderStatus | "ALL" }[] = [
    { label: "ALL", value: "ALL" },
    { label: "PENDING", value: "PENDING" },
    { label: "PAID", value: "PAID" },
    { label: "IN PROD", value: "IN_PRODUCTION" },
    { label: "SHIPPED", value: "SHIPPED" },
    { label: "DELIVERED", value: "DELIVERED" },
];

async function fetchOrders(): Promise<Order[]> {
    const res = await fetch("/admin/orders/api");
    return res.json();
}

export default function OrdersPage() {
    const { data: orders, mutate } = useSWR("admin-orders", fetchOrders, {
        refreshInterval: 5000, // Poll every 5s for live updates
    });
    const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
    const [trackingModal, setTrackingModal] = useState<string | null>(null);

    const filteredOrders =
        orders === undefined
            ? undefined
            : activeTab === "ALL"
                ? orders
                : orders.filter((o) => o.status === activeTab);

    async function handleStatusUpdate(orderId: string, status: OrderStatus) {
        await updateOrderStatus(orderId, status);
        mutate();
    }

    async function handleTracking(e: React.FormEvent<HTMLFormElement>, orderId: string) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const trackingNumber = form.get("trackingNumber") as string;
        const carrier = form.get("carrier") as string;
        await addTrackingInfo(orderId, trackingNumber, carrier);
        setTrackingModal(null);
        mutate();
    }

    return (
        <div className="space-y-6">
            {/* ── PAGE HEADER ── */}
            <div className="flex items-end justify-between">
                <div>
                    <h2
                        className="text-xl font-bold tracking-[-0.03em] uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                        Order Pipeline
                    </h2>
                    <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase mt-0.5">
            // Fulfillment &amp; Tracking
                    </p>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#BAFF00]" />
                    <span className="font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase">
                        Polling 5s
                    </span>
                </div>
            </div>

            {/* ── FILTER TABS ── */}
            <div className="flex flex-wrap gap-1.5 border-2 border-[#2A2A2A] bg-[#0D0D0D] p-2">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`font-mono text-[10px] tracking-[0.2em] uppercase px-5 py-3 border-2 transition-all cursor-pointer font-bold ${activeTab === tab.value
                                ? "bg-[#BAFF00] text-black border-[#BAFF00]"
                                : "bg-transparent text-[#999] border-[#2A2A2A] hover:border-[#BAFF00] hover:text-[#BAFF00]"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── BENTO GRID ── */}
            {orders === undefined ? (
                <AdminLoadingBlock />
            ) : filteredOrders && filteredOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredOrders.map((order) => (
                        <DataCard
                            key={order.id}
                            orderId={order.id}
                            customerName={order.customerName}
                            customerEmail={order.customerEmail}
                            status={order.status}
                            totalAmount={order.totalAmount}
                            items={order.items}
                            createdAt={new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        >
                            {/* Action buttons based on status */}
                            {order.status === "PAID" && (
                                <AdminButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(order.id, "IN_PRODUCTION")}
                                >
                                    Start Production
                                </AdminButton>
                            )}
                            {order.status === "IN_PRODUCTION" && (
                                <AdminButton
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setTrackingModal(order.id)}
                                >
                                    Mark as Shipped
                                </AdminButton>
                            )}
                            {order.status === "SHIPPED" && (
                                <>
                                    <AdminButton
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleStatusUpdate(order.id, "DELIVERED")}
                                    >
                                        Mark Delivered
                                    </AdminButton>
                                    {order.trackingNumber && (
                                        <span className="font-mono text-[10px] text-[#00E5FF] tracking-[0.1em]">
                                            📦 {order.trackingCarrier}: {order.trackingNumber}
                                        </span>
                                    )}
                                </>
                            )}
                        </DataCard>
                    ))}
                </div>
            ) : (
                <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] p-16 text-center">
                    <p className="font-mono text-xs text-[#666] tracking-[0.1em] uppercase">
                        No orders found for this filter
                    </p>
                </div>
            )}

            {/* ── TRACKING MODAL ── */}
            {trackingModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] p-5 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-[10px] text-[#F5F5F0] tracking-[0.15em] uppercase font-bold">
                                Add Tracking Info
                            </span>
                            <button
                                onClick={() => setTrackingModal(null)}
                                className="font-mono text-[10px] text-[#666] hover:text-[#FF3333] transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => handleTracking(e, trackingModal)}
                            className="space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="block font-mono text-[9px] text-[#999] tracking-[0.15em] uppercase font-bold">
                                    Carrier
                                </label>
                                <input
                                    name="carrier"
                                    required
                                    placeholder="FEDEX / USPS / DHL"
                                    className="w-full bg-black border-2 border-[#2A2A2A] text-[#F5F5F0] font-mono text-xs px-4 py-2.5 tracking-[0.05em] uppercase placeholder:text-[#333] focus:border-[#BAFF00] focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block font-mono text-[9px] text-[#999] tracking-[0.15em] uppercase font-bold">
                                    Tracking Number
                                </label>
                                <input
                                    name="trackingNumber"
                                    required
                                    placeholder="1Z999AA10123456784"
                                    className="w-full bg-black border-2 border-[#2A2A2A] text-[#F5F5F0] font-mono text-xs px-4 py-2.5 tracking-[0.05em] placeholder:text-[#333] focus:border-[#BAFF00] focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <AdminButton type="submit" variant="primary">
                                    Ship Order
                                </AdminButton>
                                <AdminButton
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setTrackingModal(null)}
                                >
                                    Cancel
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
