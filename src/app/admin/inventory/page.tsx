"use client";

import { useState } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { updateStock } from "../actions";
import useSWR from "swr";

interface StockItem {
    id: string;
    size: string;
    quantity: number;
    lowThreshold: number;
}

interface ProductStock {
    id: string;
    name: string;
    sku: string | null;
    sizes: string[];
    stock: StockItem[];
}

async function fetchInventory(): Promise<ProductStock[]> {
    const res = await fetch("/admin/inventory/api");
    return res.json();
}

export default function InventoryPage() {
    const { data: products, mutate } = useSWR("admin-inventory", fetchInventory, {
        fallbackData: [],
        refreshInterval: 10000,
    });
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    // Collect all unique sizes across all products
    const allSizes = Array.from(
        new Set(products?.flatMap((p) => p.sizes) ?? [])
    ).sort((a, b) => {
        const order = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
        return order.indexOf(a) - order.indexOf(b);
    });

    async function handleSave(stockId: string) {
        const qty = parseInt(editValue, 10);
        if (isNaN(qty) || qty < 0) return;
        await updateStock(stockId, qty);
        setEditingCell(null);
        setEditValue("");
        mutate();
    }

    function getStockColor(quantity: number, threshold: number): string {
        if (quantity <= 0) return "bg-[#FF3333]/20 text-[#FF3333]";
        if (quantity <= threshold) return "bg-[#FFD600]/20 text-[#FFD600]";
        return "bg-[#BAFF00]/10 text-[#BAFF00]";
    }

    return (
        <div className="space-y-10">
            {/* ── PAGE HEADER ── */}
            <div className="flex items-end justify-between">
                <div>
                    <h2
                        className="text-2xl font-bold tracking-[-0.03em] uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                        Inventory Matrix
                    </h2>
                    <p className="font-mono text-xs text-[#666] tracking-[0.15em] uppercase mt-1">
            // Stock Control Grid
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    {/* Legend */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-[#BAFF00]/30 border border-[#BAFF00]/50" />
                            <span className="font-mono text-[10px] text-[#666] tracking-[0.1em]">OK</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-[#FFD600]/30 border border-[#FFD600]/50" />
                            <span className="font-mono text-[10px] text-[#666] tracking-[0.1em]">LOW</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-[#FF3333]/30 border border-[#FF3333]/50" />
                            <span className="font-mono text-[10px] text-[#666] tracking-[0.1em]">OUT</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── INVENTORY GRID ── */}
            <div className="border-2 border-[#2A2A2A] overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-[#2A2A2A] bg-[#0D0D0D]">
                            <th className="px-6 py-4 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold min-w-[200px] sticky left-0 bg-[#0D0D0D] z-10 border-r-2 border-[#2A2A2A]">
                                Product
                            </th>
                            <th className="px-4 py-4 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold min-w-[100px]">
                                SKU
                            </th>
                            {allSizes.map((size) => (
                                <th
                                    key={size}
                                    className="px-4 py-4 text-center font-mono text-[10px] text-[#F5F5F0] tracking-[0.2em] uppercase font-bold min-w-[90px] border-l border-[#2A2A2A]"
                                >
                                    {size}
                                </th>
                            ))}
                            <th className="px-4 py-4 text-center font-mono text-[10px] text-[#BAFF00] tracking-[0.2em] uppercase font-bold min-w-[90px] border-l-2 border-[#2A2A2A]">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!products || products.length === 0) ? (
                            <tr>
                                <td
                                    colSpan={allSizes.length + 3}
                                    className="px-6 py-12 text-center font-mono text-xs text-[#666] tracking-[0.1em]"
                                >
                                    NO PRODUCTS IN INVENTORY // ADD DROPS FIRST
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                const totalStock = product.stock.reduce(
                                    (sum, s) => sum + s.quantity,
                                    0
                                );

                                return (
                                    <tr
                                        key={product.id}
                                        className="border-b border-[#1A1A1A] hover:bg-[#0D0D0D]/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-[#F5F5F0] tracking-[0.05em] uppercase sticky left-0 bg-black z-10 border-r-2 border-[#2A2A2A]">
                                            {product.name}
                                        </td>
                                        <td className="px-4 py-4 font-mono text-[10px] text-[#BAFF00] tracking-[0.1em]">
                                            {product.sku ?? "—"}
                                        </td>
                                        {allSizes.map((size) => {
                                            const stockItem = product.stock.find(
                                                (s) => s.size === size
                                            );
                                            if (!stockItem) {
                                                return (
                                                    <td
                                                        key={size}
                                                        className="px-4 py-4 text-center font-mono text-[10px] text-[#333] border-l border-[#2A2A2A]"
                                                    >
                                                        —
                                                    </td>
                                                );
                                            }

                                            const cellId = `${product.id}-${size}`;
                                            const isEditing = editingCell === cellId;

                                            return (
                                                <td
                                                    key={size}
                                                    className={`px-4 py-4 text-center border-l border-[#2A2A2A] ${getStockColor(
                                                        stockItem.quantity,
                                                        stockItem.lowThreshold
                                                    )}`}
                                                >
                                                    {isEditing ? (
                                                        <div className="flex items-center justify-center gap-1">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter")
                                                                        handleSave(stockItem.id);
                                                                    if (e.key === "Escape")
                                                                        setEditingCell(null);
                                                                }}
                                                                autoFocus
                                                                className="w-14 bg-black text-center font-mono text-sm border border-[#BAFF00] text-[#F5F5F0] py-1 focus:outline-none"
                                                            />
                                                            <button
                                                                onClick={() => handleSave(stockItem.id)}
                                                                className="font-mono text-[10px] text-[#BAFF00] hover:underline cursor-pointer"
                                                            >
                                                                ✓
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setEditingCell(cellId);
                                                                setEditValue(stockItem.quantity.toString());
                                                            }}
                                                            className="font-mono text-sm font-bold w-full cursor-pointer hover:underline"
                                                            title="Click to edit"
                                                        >
                                                            {stockItem.quantity}
                                                        </button>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-4 text-center font-mono text-sm text-[#F5F5F0] font-bold border-l-2 border-[#2A2A2A]">
                                            {totalStock}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── ALERT SUMMARY ── */}
            {products && products.length > 0 && (
                <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] p-6">
                    <span className="font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase block mb-4">
                        Stock Alerts
                    </span>
                    <div className="space-y-2">
                        {products.flatMap((product) =>
                            product.stock
                                .filter((s) => s.quantity <= s.lowThreshold)
                                .map((s) => (
                                    <div
                                        key={s.id}
                                        className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-2 h-2 ${s.quantity <= 0 ? "bg-[#FF3333]" : "bg-[#FFD600]"
                                                    }`}
                                            />
                                            <span className="font-mono text-xs text-[#F5F5F0] tracking-[0.05em] uppercase">
                                                {product.name}
                                            </span>
                                            <span className="font-mono text-[10px] text-[#BAFF00] tracking-[0.1em]">
                                                {s.size}
                                            </span>
                                        </div>
                                        <span
                                            className={`font-mono text-xs font-bold tracking-[0.1em] ${s.quantity <= 0 ? "text-[#FF3333]" : "text-[#FFD600]"
                                                }`}
                                        >
                                            {s.quantity <= 0 ? "OUT OF STOCK" : `${s.quantity} LEFT`}
                                        </span>
                                    </div>
                                ))
                        )}
                        {products.every((p) =>
                            p.stock.every((s) => s.quantity > s.lowThreshold)
                        ) && (
                                <p className="font-mono text-xs text-[#BAFF00] tracking-[0.1em]">
                                    ✓ ALL STOCK LEVELS NOMINAL
                                </p>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
}
