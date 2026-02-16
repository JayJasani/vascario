"use client";

import { useState } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminInput";
import { createProduct, toggleProductActive } from "../actions";
import useSWR from "swr";

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    images: string[];
    colors: string[];
    sizes: string[];
    sku: string | null;
    isActive: boolean;
    createdAt: string;
}

async function fetchProducts(): Promise<Product[]> {
    const res = await fetch("/admin/drops/api");
    return res.json();
}

export default function DropsPage() {
    const { data: products, mutate } = useSWR("admin-products", fetchProducts, {
        fallbackData: [],
        refreshInterval: 10000,
    });
    const [showForm, setShowForm] = useState(false);
    const [preview, setPreview] = useState({
        name: "",
        price: "",
        description: "",
    });

    async function handleSubmit(formData: FormData) {
        await createProduct(formData);
        setShowForm(false);
        setPreview({ name: "", price: "", description: "" });
        mutate();
    }

    async function handleToggle(id: string) {
        await toggleProductActive(id);
        mutate();
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
                        Drop Manager
                    </h2>
                    <p className="font-mono text-xs text-[#666] tracking-[0.15em] uppercase mt-1">
            // Product Uploads &amp; Management
                    </p>
                </div>
                <AdminButton
                    variant={showForm ? "secondary" : "primary"}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "✕ Cancel" : "+ New Drop"}
                </AdminButton>
            </div>

            {/* ── CREATE FORM + LIVE PREVIEW ── */}
            {showForm && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    {/* Form */}
                    <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] p-8">
                        <span className="font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase block mb-6">
                            Create New Drop
                        </span>
                        <form action={handleSubmit} className="space-y-6">
                            <AdminInput
                                label="Drop Name"
                                name="name"
                                placeholder="PHANTOM THREAD V2"
                                required
                                onChange={(e) =>
                                    setPreview((p) => ({ ...p, name: e.target.value }))
                                }
                            />
                            <AdminTextarea
                                label="Description"
                                name="description"
                                placeholder="Heavy 300GSM cotton with precision-stitched embroidery..."
                                required
                                onChange={(e) =>
                                    setPreview((p) => ({ ...p, description: e.target.value }))
                                }
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <AdminInput
                                    label="Price"
                                    name="price"
                                    type="number"
                                    placeholder="2499"
                                    required
                                    hint="INR"
                                    onChange={(e) =>
                                        setPreview((p) => ({ ...p, price: e.target.value }))
                                    }
                                />
                                <AdminInput
                                    label="SKU"
                                    name="sku"
                                    placeholder="VSC-PT-002"
                                    hint="Optional"
                                />
                            </div>
                            <AdminInput
                                label="Image URLs"
                                name="images"
                                placeholder="https://..., https://..."
                                hint="Comma-separated"
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <AdminInput
                                    label="Colors"
                                    name="colors"
                                    placeholder="#000000, #333333"
                                    hint="Hex codes"
                                />
                                <AdminInput
                                    label="Sizes"
                                    name="sizes"
                                    placeholder="S, M, L, XL"
                                    required
                                />
                            </div>
                            <div className="pt-4">
                                <AdminButton type="submit" variant="primary">
                                    Deploy Drop
                                </AdminButton>
                            </div>
                        </form>
                    </div>

                    {/* Live Preview */}
                    <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] p-8">
                        <span className="font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase block mb-6">
                            Live Preview // Storefront Card
                        </span>
                        <div className="border-2 border-[#2A2A2A] bg-black p-6 max-w-sm">
                            {/* Mock product image area */}
                            <div className="aspect-[3/4] bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-6">
                                <span className="font-mono text-[10px] text-[#333] tracking-[0.2em] uppercase">
                                    Product Image
                                </span>
                            </div>
                            <div className="space-y-2">
                                <h3
                                    className="text-sm font-bold tracking-[-0.02em] uppercase"
                                    style={{
                                        fontFamily: "var(--font-space-grotesk), sans-serif",
                                    }}
                                >
                                    {preview.name || "DROP NAME"}
                                </h3>
                                <p className="font-mono text-[10px] text-[#666] tracking-[0.05em] line-clamp-2">
                                    {preview.description || "Product description will appear here..."}
                                </p>
                                <p className="font-mono text-lg text-[#BAFF00] font-bold tracking-[0.02em]">
                                    {preview.price ? `₹${Number(preview.price).toLocaleString("en-IN")}` : "₹0"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PRODUCT LIST ── */}
            <div className="border-2 border-[#2A2A2A]">
                <div className="px-6 py-4 border-b-2 border-[#2A2A2A] bg-[#0D0D0D]">
                    <span className="font-mono text-xs text-[#F5F5F0] tracking-[0.15em] uppercase font-bold">
                        All Drops ({products?.length ?? 0})
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#2A2A2A]">
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    SKU
                                </th>
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    Sizes
                                </th>
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!products || products.length === 0) ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center font-mono text-xs text-[#666] tracking-[0.1em]"
                                    >
                                        NO DROPS DEPLOYED // CREATE YOUR FIRST DROP
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-[#1A1A1A] hover:bg-[#0D0D0D] transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-[#BAFF00] tracking-[0.1em]">
                                            {product.sku ?? "—"}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-[#F5F5F0] tracking-[0.05em] uppercase">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-[#F5F5F0] font-bold tracking-[0.05em]">
                                            ₹{Number(product.price).toLocaleString("en-IN")}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[10px] text-[#999] tracking-[0.1em]">
                                            {product.sizes.join(" / ")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`font-mono text-[10px] tracking-[0.2em] uppercase font-bold ${product.isActive ? "text-[#BAFF00]" : "text-[#666]"
                                                    }`}
                                            >
                                                {product.isActive ? "● LIVE" : "○ ARCHIVED"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <AdminButton
                                                variant={product.isActive ? "ghost" : "secondary"}
                                                size="sm"
                                                onClick={() => handleToggle(product.id)}
                                            >
                                                {product.isActive ? "Archive" : "Reactivate"}
                                            </AdminButton>
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
