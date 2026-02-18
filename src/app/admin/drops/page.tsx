"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Palette } from "lucide-react";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminInput";
import { AdminLoadingBlock } from "@/components/admin/AdminLoadingBlock";
import { createProduct, toggleProductActive, updateProductAction, deleteDropAction } from "../actions";
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

function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

async function extractPaletteFromImage(imageUrl: string, count = 6): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                const scale = Math.min(1, 150 / img.width, 150 / img.height);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Canvas not supported"));
                    return;
                }
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                const colorCount: Record<string, number> = {};
                const step = 5;
                for (let i = 0; i < data.length; i += 4 * step) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];
                    if (a < 128 || (r > 245 && g > 245 && b > 245)) continue;
                    const bucket = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
                    colorCount[bucket] = (colorCount[bucket] || 0) + 1;
                }
                const sorted = Object.entries(colorCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, count)
                    .map(([key]) => {
                        const [r, g, b] = key.split(",").map(Number);
                        return rgbToHex(r, g, b);
                    });
                resolve(sorted.length > 0 ? sorted : ["#000000"]);
            } catch (e) {
                reject(e);
            }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageUrl;
    });
}

async function fetchProducts(): Promise<Product[]> {
    const res = await fetch("/admin/drops/api");
    return res.json();
}

export default function DropsPage() {
    const { data: products, mutate } = useSWR("admin-products", fetchProducts, {
        refreshInterval: 10000,
    });
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [preview, setPreview] = useState({ name: "", price: "", description: "" });
    const [formImages, setFormImages] = useState<string[]>([]);
    const [formColors, setFormColors] = useState<string[]>(["#000000"]);
    const [editingColor, setEditingColor] = useState<{ index: number; originalHex: string } | null>(null);
    const [pickerPlacement, setPickerPlacement] = useState<"top" | "bottom">("bottom");
    const [uploading, setUploading] = useState(false);
    const [extractingPalette, setExtractingPalette] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const colorPickerRef = useRef<HTMLDivElement>(null);

    const isFormOpen = showForm || !!editingProduct;

    useLayoutEffect(() => {
        if (!editingColor) return;
        function updatePlacement() {
            const el = colorPickerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const pickerHeight = 280;
            const spaceBelow = typeof window !== "undefined" ? window.innerHeight - rect.bottom : pickerHeight;
            setPickerPlacement(spaceBelow < pickerHeight ? "top" : "bottom");
        }
        updatePlacement();
        document.addEventListener("scroll", updatePlacement, true);
        window.addEventListener("resize", updatePlacement);
        return () => {
            document.removeEventListener("scroll", updatePlacement, true);
            window.removeEventListener("resize", updatePlacement);
        };
    }, [editingColor]);

    useEffect(() => {
        const ec = editingColor;
        if (!ec) return;
        const { index, originalHex } = ec;
        function handleOutside(e: MouseEvent | TouchEvent) {
            const target = e.target as Node;
            if (colorPickerRef.current && !colorPickerRef.current.contains(target)) {
                setFormColors((prev) =>
                    prev.map((c, i) => (i === index ? originalHex : c))
                );
                setEditingColor(null);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("touchstart", handleOutside, { passive: true });
        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("touchstart", handleOutside);
        };
    }, [editingColor]);
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

    async function handleExtractPalette(imageIndex = 0) {
        if (formImages.length === 0 || !formImages[imageIndex]) return;
        setExtractingPalette(true);
        try {
            const palette = await extractPaletteFromImage(formImages[imageIndex]);
            setFormColors(palette);
        } catch (e) {
            console.error("Palette extraction failed:", e);
            alert("Could not extract palette. Ensure the image is accessible (CORS).");
        } finally {
            setExtractingPalette(false);
        }
    }

    function closeForm() {
        setShowForm(false);
        setEditingProduct(null);
        setPreview({ name: "", price: "", description: "" });
        setFormImages([]);
        setFormColors(["#000000"]);
        setEditingColor(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleSubmit(formData: FormData) {
        formData.set("images", formImages.join(","));
        formData.set("colors", formColors.join(","));
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

    async function handleDelete(product: Product) {
        if (!confirm(`Delete drop "${product.name}"? This will remove the product and all its stock levels. This cannot be undone.`)) return;
        setDeletingId(product.id);
        try {
            await deleteDropAction(product.id);
            if (editingProduct?.id === product.id) {
                setEditingProduct(null);
                closeForm();
            }
            mutate();
        } finally {
            setDeletingId(null);
        }
    }

    function openEdit(product: Product) {
        setEditingProduct(product);
        setShowForm(true);
        setFormImages(product.images ?? []);
        setFormColors(
            product.colors?.length
                ? product.colors.map((c) => (c.startsWith("#") ? c : `#${c}`))
                : ["#000000"]
        );
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
                        Product Uploads &amp; Management
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
                            setFormColors(["#000000"]);
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
                                placeholder="Heavy 240GSM cotton with precision-stitched embroidery..."
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
                                    className={`block w-full px-4 py-3 border-2 border-[#2A2A2A] bg-[#0D0D0D] cursor-pointer hover:border-[#BAFF00] transition-colors flex items-center justify-center ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                                                    onClick={() => handleExtractPalette(index)}
                                                    disabled={extractingPalette}
                                                    className="absolute top-1 left-1 w-8 h-8 bg-[#0D0D0D]/90 border-2 border-[#2A2A2A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-[#BAFF00] disabled:opacity-50"
                                                    title="Generate palette from this image"
                                                >
                                                    <Palette className="w-4 h-4 text-[#BAFF00]" />
                                                </button>
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
                            <div ref={colorPickerRef} className="relative">
                                <label className="block font-mono text-[10px] text-[#999] tracking-[0.2em] uppercase mb-2">
                                    Colors
                                </label>
                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    {formColors.map((hex, index) => (
                                        <div
                                            key={`${hex}-${index}`}
                                            className="flex items-center gap-2 p-2 border-2 border-[#2A2A2A] bg-[#0D0D0D]"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setEditingColor({ index, originalHex: hex })}
                                                className={`w-10 h-10 shrink-0 cursor-pointer border-2 rounded-sm transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#BAFF00] ${editingColor?.index === index
                                                        ? "border-[#BAFF00] ring-2 ring-[#BAFF00]"
                                                        : "border-[#2A2A2A]"
                                                    }`}
                                                style={{ backgroundColor: hex }}
                                                title="Tap to open picker, then drag to select color"
                                            />
                                            <span className="font-mono text-[10px] text-[#999] tracking-[0.1em] min-w-[4.5rem]">
                                                {hex.toUpperCase()}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFormColors((prev) =>
                                                        prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
                                                    )
                                                }
                                                className="font-mono text-xs text-[#666] hover:text-[#FF3333] transition-colors cursor-pointer"
                                                title="Remove color"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setFormColors((prev) => [...prev, "#000000"])}
                                        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-[#2A2A2A] font-mono text-[10px] text-[#666] tracking-[0.1em] uppercase hover:border-[#BAFF00] hover:text-[#BAFF00] transition-colors"
                                    >
                                        + Add color
                                    </button>
                                </div>
                                {editingColor !== null && (
                                    <div
                                        role="dialog"
                                        aria-label="Pick color"
                                        className={`absolute left-0 z-50 border-2 border-[#2A2A2A] bg-[#0D0D0D] p-4 shadow-lg min-w-[220px] ${pickerPlacement === "top"
                                                ? "bottom-full mb-2"
                                                : "top-full mt-2"
                                            }`}
                                    >
                                        <span className="font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase block mb-3">
                                            Pick Color
                                        </span>
                                        <div className="[&_.react-colorful]:h-36 [&_.react-colorful]:w-full">
                                            <HexColorPicker
                                                color={formColors[editingColor.index] ?? "#000000"}
                                                onChange={(newHex) =>
                                                    setFormColors((prev) =>
                                                        prev.map((c, i) =>
                                                            i === editingColor.index ? newHex : c
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <AdminButton
                                                type="button"
                                                variant="primary"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => setEditingColor(null)}
                                            >
                                                Done
                                            </AdminButton>
                                            <AdminButton
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => {
                                                    setFormColors((prev) =>
                                                        prev.map((c, i) =>
                                                            i === editingColor.index ? editingColor.originalHex : c
                                                        )
                                                    );
                                                    setEditingColor(null);
                                                }}
                                            >
                                                Cancel
                                            </AdminButton>
                                        </div>
                                    </div>
                                )}
                                <p className="font-mono text-[10px] text-[#666] tracking-[0.1em] mt-2">
                                    Tap swatch → drag on picker to select → Done
                                </p>
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
                                <div className="font-mono text-[10px] text-[#666] tracking-[0.05em] space-y-1 line-clamp-3">
                                    {(preview.description || "Product description will appear here...")
                                        .split(/\r?\n/)
                                        .filter(Boolean)
                                        .map((line, idx) => (
                                            <p key={idx}>{line}</p>
                                        ))}
                                </div>
                                <p className="font-mono text-lg text-[#BAFF00] font-bold tracking-[0.02em]">
                                    {preview.price ? `₹${Number(preview.price).toLocaleString("en-IN")}` : "₹0"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PRODUCT LIST ── */}
            {products === undefined ? (
                <AdminLoadingBlock />
            ) : (
            <div className="border-2 border-[#2A2A2A]">
                <div className="px-6 py-4 border-b-2 border-[#2A2A2A] bg-[#0D0D0D]">
                    <span className="font-mono text-xs text-[#F5F5F0] tracking-[0.15em] uppercase font-bold">
                        All Drops ({products.length})
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
                            {products.length === 0 ? (
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
                                            <div className="flex items-center justify-end gap-2 flex-wrap">
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
                                                <AdminButton
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(product)}
                                                    disabled={deletingId === product.id}
                                                    className="text-[#FF3333] hover:bg-[#FF3333]/10 hover:text-[#FF3333]"
                                                >
                                                    {deletingId === product.id ? "…" : "Delete"}
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
            )}

        </div>
    );
}
