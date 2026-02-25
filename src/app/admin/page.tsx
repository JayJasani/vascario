import { getDashboardStats } from "./actions";
import { StatWidget } from "@/components/admin/StatWidget";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminButton } from "@/components/admin/AdminButton";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    await requireAdmin();
    const stats = await getDashboardStats();

    return (
        <div className="space-y-6">
            {/* ── PAGE HEADER ── */}
            <div className="flex items-end justify-between">
                <div>
                    <h2
                        className="text-xl font-bold tracking-[-0.03em] uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                        Command Center
                    </h2>
                    <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase mt-0.5">
            // System Overview
                    </p>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#BAFF00]" />
                    <span className="font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase">
                        Live
                    </span>
                </div>
            </div>

            {/* ── KPI STATS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
                <StatWidget
                    label="Total Revenue"
                    value={`₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`}
                    sublabel="All time"
                    accentColor="#BAFF00"
                />
                <StatWidget
                    label="Total Investment"
                    value={`₹${Number(stats.totalInvestment).toLocaleString("en-IN")}`}
                    sublabel="All partners"
                    accentColor="#00BFFF"
                />
                <StatWidget
                    label="Net (Revenue − Investment)"
                    value={`₹${(Number(stats.totalRevenue) - Number(stats.totalInvestment)).toLocaleString("en-IN")}`}
                    sublabel={Number(stats.totalRevenue) >= Number(stats.totalInvestment) ? "In profit" : "In deficit"}
                    accentColor={Number(stats.totalRevenue) >= Number(stats.totalInvestment) ? "#BAFF00" : "#FF3333"}
                />
                <StatWidget
                    label="Pending Orders"
                    value={stats.pendingOrders + stats.paidOrders}
                    sublabel="Needs attention"
                    accentColor="#FFD600"
                />
                <StatWidget
                    label="Low Stock Alerts"
                    value={stats.lowStockAlerts}
                    sublabel="Below threshold"
                    accentColor={stats.lowStockAlerts > 0 ? "#FF3333" : "#BAFF00"}
                />
                <StatWidget
                    label="Active Drops"
                    value={stats.activeProducts}
                    sublabel="Currently live"
                    accentColor="#00BFFF"
                />
            </div>

            {/* ── QUICK ACTIONS ── */}
            <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] p-4">
                <span className="font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase block mb-3">
                    Quick Actions
                </span>
                <div className="flex flex-wrap gap-2">
                    <Link href="/admin/drops">
                        <AdminButton variant="primary">New Drop</AdminButton>
                    </Link>
                    <Link href="/admin/orders">
                        <AdminButton variant="secondary">View Orders</AdminButton>
                    </Link>
                    <Link href="/admin/inventory">
                        <AdminButton variant="secondary">Inventory</AdminButton>
                    </Link>
                    <Link href="/admin/investment">
                        <AdminButton variant="secondary">Investments</AdminButton>
                    </Link>
                    <Link href="/admin/contact">
                        <AdminButton variant="secondary">Contact Queries</AdminButton>
                    </Link>
                </div>
            </div>

            {/* ── RECENT ORDERS TABLE ── */}
            <div className="border-2 border-[#2A2A2A]">
                {/* Table header bar */}
                <div className="px-4 py-3 border-b-2 border-[#2A2A2A] bg-[#0D0D0D] flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#F5F5F0] tracking-[0.15em] uppercase font-bold">
                        Recent Orders
                    </span>
                    <Link
                        href="/admin/orders"
                        className="font-mono text-[9px] text-[#BAFF00] tracking-[0.15em] uppercase hover:underline"
                    >
                        View All →
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#2A2A2A]">
                                <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                    Order ID
                                </th>
                                <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                    Customer
                                </th>
                                <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                    Items
                                </th>
                                <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                    Status
                                </th>
                                <th className="px-4 py-2 text-right font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center font-mono text-[10px] text-[#666] tracking-[0.1em]"
                                    >
                                        NO ORDERS YET // WAITING FOR FIRST DROP
                                    </td>
                                </tr>
                            ) : (
                                stats.recentOrders.map((order: { id: string; customerName: string; customerEmail: string; status: "PENDING" | "PAID" | "IN_PRODUCTION" | "SHIPPED" | "DELIVERED" | "CANCELLED"; totalAmount: string; items: { productName: string; size: string }[] }) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-[#1A1A1A] hover:bg-[#0D0D0D] transition-colors"
                                    >
                                        <td className="px-4 py-2.5 font-mono text-[10px] text-[#BAFF00] tracking-[0.1em]">
                                            {order.id.slice(0, 8).toUpperCase()}
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <p className="font-mono text-[10px] text-[#F5F5F0] tracking-[0.05em] uppercase">
                                                {order.customerName}
                                            </p>
                                            <p className="font-mono text-[9px] text-[#666] tracking-[0.05em]">
                                                {order.customerEmail}
                                            </p>
                                        </td>
                                        <td className="px-4 py-2.5 font-mono text-[9px] text-[#999] tracking-[0.05em]">
                                            {order.items
                                                .map((i: { productName: string; size: string }) => `${i.productName} (${i.size})`)
                                                .join(", ")}
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-4 py-2.5 text-right font-mono text-xs text-[#F5F5F0] font-bold tracking-[0.05em]">
                                            ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
