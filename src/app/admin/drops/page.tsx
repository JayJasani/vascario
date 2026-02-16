"use client";

import { useState, useRef } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminInput";
import { createProduct, toggleProductActive, updateProductAction } from "../actions";
import useSWR from "swr";
import Image from "next/image";

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

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

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
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [preview, setPreview] = useState({ name: "", price: "", description: "" });
    const [formImages, setFormImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isFormOpen = showForm || !!editingProduct;
    const isEditMode = !!editingProduct;

    async function handleFileUpload(files: FileList | null) {
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            const uploadFormData = new FormData();
            Array.from(files).forEach((file) => uploadFormData.append("files", file));
            const response = await fetch("/admin/drops/api/upload", { method: "POST", body: uploadFormData });
            if (!response.ok) throw new Error("Upload failed");
            const data = await response.json();
            setFormImages((prev) => [...prev, ...data.urls]);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload images. Please try again.");
        } finally {
            setUploading(false);
        }
    }

    function removeImage(index: number) {
        setFormImages((prev) => prev.filter((_, i) => i !== index));
    }

    function closeForm() {
        setShowForm(false);
        setEditingProduct(null);
        setPreview({ name: "", price: "", description: "" });
        setFormImages([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleSubmit(formData: FormData) {
        formData.set("images", formImages.join(","));
        if (isEditMode && editingProduct) {
            await updateProductAction(editingProduct.id, formData);
        } else {
            await createProduct(formData);
        }
        closeForm();
        mutate();
    }

    async function handleToggle(id: string) {
        await toggleProductActive(id);
        mutate();
    }

    function openEdit(product: Product) {
        setEditingProduct(product);
        setShowForm(true);
        setFormImages(product.images ?? []);
        setPreview({ name: product.name, price: product.price, description: product.description });
        if (fileInputRef.current) fileInputRef.current.value = "";
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
                    variant={isFormOpen ? "secondary" : "primary"}
                    onClick={() => {
                        if (isFormOpen) {
                            closeForm();
                        } else {
                            setShowForm(true);
                            setEditingProduct(null);
                            setPreview({ name: "", price: "", description: "" });
                            setFormImages([]);
                        }
                    }}
                >
                    {isFormOpen ? "✕ Cancel" : "+ New Drop"}
                </AdminButton>
            </div>

            {/* ── FORM + LIVE PREVIEW ── */}
            {isFormOpen && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    {/* Form */}
                    <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] p-8">
                        <span className="font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase block mb-6">
                            {isEditMode ? `Edit Drop // ${editingProduct?.name}` : "Create New Drop"}
                        </span>
                        <form key={editingProduct?.id ?? "create"} action={handleSubmit} className="space-y-6">
                            <AdminInput
                                label="Drop Name"
                                name="name"
                                placeholder="PHANTOM THREAD V2"
                                required
                                defaultValue={isEditMode ? editingProduct?.name : undefined}
                                onChange={(e) =>
                                    setPreview((p) => ({ ...p, name: e.target.value }))
                                }
                            />
                            <AdminTextarea
                                label="Description"
                                name="description"
                                placeholder="Heavy 300GSM cotton with precision-stitched embroidery..."
                                required
                                defaultValue={isEditMode ? editingProduct?.description : undefined}
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
                                    defaultValue={isEditMode ? editingProduct?.price : undefined}
                                    onChange={(e) =>
                                        setPreview((p) => ({ ...p, price: e.target.value }))
                                    }
                                />
                                <AdminInput
                                    label="SKU"
                                    name="sku"
                                    placeholder="VSC-PT-002"
                                    hint="Optional"
                                    defaultValue={isEditMode ? (editingProduct?.sku ?? "") : undefined}
                                />
                            </div>
                            {/* Image Upload */}
                            <div>
                                <label className="block font-mono text-[10px] text-[#999] tracking-[0.2em] uppercase mb-2">
                                    Product Images
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className={`block w-full px-4 py-3 border-2 border-[#2A2A2A] bg-[#0D0D0D] cursor-pointer hover:border-[#BAFF00] transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    <span className="font-mono text-xs text-[#F5F5F0] tracking-[0.1em]">
                                        {uploading ? "Uploading..." : formImages.length > 0 ? `✓ ${formImages.length} image(s) uploaded` : "+ Upload Images"}
                                    </span>
                                </label>
                                {formImages.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                        {formImages.map((url, index) => (
                                            <div key={index} className="relative group aspect-square">
                                                <Image
                                                    src={url}
                                                    alt={`Upload ${index + 1}`}
                                                    fill
                                                    className="object-cover border-2 border-[#2A2A2A]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-[#BAFF00] text-[#0D0D0D] font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="font-mono text-[10px] text-[#666] tracking-[0.1em] mt-2">
                                    Upload multiple images (JPG, PNG, WebP)
                                </p>
                            </div>
                            <div>
                                <label className="block font-mono text-[10px] text-[#999] tracking-[0.2em] uppercase mb-2">
                                    Sizes
                                </label>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {SIZE_OPTIONS.map((size) => {
                                        const selected = isEditMode && editingProduct?.sizes?.includes(size);
                                        return (
                                            <label
                                                key={size}
                                                className="flex items-center gap-2 cursor-pointer group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="sizes"
                                                    value={size}
                                                    defaultChecked={isEditMode ? selected : undefined}
                                                    className="w-4 h-4 accent-[#BAFF00] bg-[#0D0D0D] border-2 border-[#2A2A2A] cursor-pointer focus:ring-[#BAFF00]"
                                                />
                                                <span className="font-mono text-xs text-[#F5F5F0] tracking-[0.1em] group-hover:text-[#BAFF00] transition-colors">
                                                    {size}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                                <p className="font-mono text-[10px] text-[#666] tracking-[0.1em] mt-2">
                                    Select one or more sizes
                                </p>
                            </div>
                            <div>
                                <AdminInput
                                    label="Colors"
                                    name="colors"
                                    placeholder="#000000, #333333"
                                    hint="Hex codes"
                                    defaultValue={isEditMode ? (editingProduct?.colors?.join(", ") ?? "") : undefined}
                                />
                            </div>
                            <div className="pt-4">
                                <AdminButton type="submit" variant="primary">
                                    {isEditMode ? "Save Changes" : "Deploy Drop"}
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
                            {/* Product image preview */}
                            <div className="aspect-[3/4] bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden mb-6 relative">
                                {formImages.length > 0 ? (
                                    <Image
                                        src={formImages[0]}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="font-mono text-[10px] text-[#333] tracking-[0.2em] uppercase">
                                            Product Image
                                        </span>
                                    </div>
                                )}
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
                                            <div className="flex items-center justify-end gap-2">
                                                <AdminButton
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEdit(product)}
                                                >
                                                    Edit
                                                </AdminButton>
                                                <AdminButton
                                                    variant={product.isActive ? "ghost" : "secondary"}
                                                    size="sm"
                                                    onClick={() => handleToggle(product.id)}
                                                >
                                                    {product.isActive ? "Archive" : "Reactivate"}
                                                </AdminButton>
                                            </div>
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
