"use client";

import useSWR from "swr";
import Link from "next/link";
import { AdminLoadingBlock } from "@/components/admin/AdminLoadingBlock";

interface BackInStockNotification {
    id: string;
    email: string;
    productId: string;
    productSlug: string;
    size: string | null;
    createdAt: string;
}

async function fetchBackInStockNotifications(): Promise<BackInStockNotification[]> {
    const res = await fetch("/admin/back-in-stock/api");
    return res.json();
}

export default function AdminBackInStockPage() {
    const { data: notifications, mutate, isValidating } = useSWR(
        "admin-back-in-stock",
        fetchBackInStockNotifications
    );

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h2
                        className="text-xl font-bold tracking-[-0.03em] uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                        Back in stock
                    </h2>
                    <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase mt-0.5">
                        // Notify me when available signups
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => mutate()}
                    disabled={isValidating}
                    className="font-mono text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 border-2 border-[#2A2A2A] hover:border-[#BAFF00] hover:text-[#BAFF00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isValidating ? "REFRESHING…" : "REFRESH"}
                </button>
            </div>

            {notifications === undefined ? (
                <AdminLoadingBlock />
            ) : (
                <div className="border-2 border-[#2A2A2A]">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2A2A2A] bg-[#0D0D0D]">
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                        Date
                                    </th>
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                        Email
                                    </th>
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                        Product
                                    </th>
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                        Size
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!notifications?.length ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center font-mono text-[10px] text-[#666] tracking-[0.1em]"
                                        >
                                            NO BACK-IN-STOCK SIGNUPS YET
                                        </td>
                                    </tr>
                                ) : (
                                    notifications.map((n) => (
                                        <tr
                                            key={n.id}
                                            className="border-b border-[#1A1A1A] hover:bg-[#0D0D0D] transition-colors"
                                        >
                                            <td className="px-4 py-2.5 font-mono text-[9px] text-[#666] tracking-[0.1em] whitespace-nowrap">
                                                {new Date(n.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <a
                                                    href={`mailto:${n.email}`}
                                                    className="font-mono text-[10px] text-[#BAFF00] hover:underline tracking-[0.05em]"
                                                >
                                                    {n.email}
                                                </a>
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-[10px] text-[#F5F5F0] tracking-[0.05em]">
                                                <Link
                                                    href={`/product/${n.productSlug}`}
                                                    className="text-[#BAFF00] hover:underline"
                                                >
                                                    {n.productSlug}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-[9px] text-[#999] tracking-[0.05em]">
                                                {n.size ?? "—"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {notifications && notifications.length > 0 && (
                <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase">
                    {notifications.length} signup{notifications.length === 1 ? "" : "s"} total
                </p>
            )}
        </div>
    );
}
