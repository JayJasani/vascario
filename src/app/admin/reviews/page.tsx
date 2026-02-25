"use client";

import { useState } from "react";
import useSWR from "swr";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminInput";
import { AdminLoadingBlock } from "@/components/admin/AdminLoadingBlock";
import { createReviewAction, updateReviewAction, deleteReviewAction } from "../actions";

interface ReviewItem {
    id: string;
    authorName: string;
    text: string;
    rating: number | null;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

async function fetchReviews(): Promise<ReviewItem[]> {
    const res = await fetch("/admin/reviews/api");
    return res.json();
}

export default function AdminReviewsPage() {
    const { data: reviews, mutate, isValidating } = useSWR("admin-reviews", fetchReviews, {
        refreshInterval: 15000,
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        authorName: "",
        text: "",
        rating: "" as string,
        sortOrder: "0",
    });
    const [editForm, setEditForm] = useState<{
        authorName: string;
        text: string;
        rating: string;
        sortOrder: string;
        isActive: boolean;
    } | null>(null);

    const showMessage = (type: "success" | "error", text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!form.authorName.trim() || !form.text.trim()) {
            showMessage("error", "Author name and review text are required.");
            return;
        }
        setSaving(true);
        try {
            const ratingNum = form.rating === "" ? null : Math.min(5, Math.max(1, parseInt(form.rating, 10)));
            const sortOrderNum = parseInt(form.sortOrder, 10) || 0;
            await createReviewAction(
                form.authorName.trim(),
                form.text.trim(),
                ratingNum ?? undefined,
                sortOrderNum
            );
            setForm({ authorName: "", text: "", rating: "", sortOrder: "0" });
            mutate();
            showMessage("success", "Review added. It will appear on the storefront.");
        } catch (err) {
            console.error(err);
            showMessage("error", "Failed to add review.");
        } finally {
            setSaving(false);
        }
    }

    async function handleUpdate(id: string) {
        if (!editForm) return;
        if (!editForm.authorName.trim() || !editForm.text.trim()) {
            showMessage("error", "Author name and review text are required.");
            return;
        }
        setSaving(true);
        try {
            const ratingNum =
                editForm.rating === "" ? null : Math.min(5, Math.max(1, parseInt(editForm.rating, 10)));
            const sortOrderNum = parseInt(editForm.sortOrder, 10) || 0;
            await updateReviewAction(id, {
                authorName: editForm.authorName.trim(),
                text: editForm.text.trim(),
                rating: ratingNum ?? null,
                sortOrder: sortOrderNum,
                isActive: editForm.isActive,
            });
            setEditingId(null);
            setEditForm(null);
            mutate();
            showMessage("success", "Review updated.");
        } catch (err) {
            console.error(err);
            showMessage("error", "Failed to update review.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this review? It will be removed from the storefront.")) return;
        setSaving(true);
        try {
            await deleteReviewAction(id);
            if (editingId === id) {
                setEditingId(null);
                setEditForm(null);
            }
            mutate();
            showMessage("success", "Review deleted.");
        } catch (err) {
            console.error(err);
            showMessage("error", "Failed to delete review.");
        } finally {
            setSaving(false);
        }
    }

    function startEdit(r: ReviewItem) {
        setEditingId(r.id);
        setEditForm({
            authorName: r.authorName,
            text: r.text,
            rating: r.rating != null ? String(r.rating) : "",
            sortOrder: String(r.sortOrder),
            isActive: r.isActive,
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h2
                        className="text-xl font-bold tracking-[-0.03em] uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                        User Reviews
                    </h2>
                    <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase mt-0.5">
                        // Add and manage reviews shown on the storefront
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

            {message && (
                <div
                    className={
                        message.type === "success"
                            ? "font-mono text-[10px] text-[#BAFF00] tracking-[0.1em]"
                            : "font-mono text-[10px] text-[#FF3333] tracking-[0.1em]"
                    }
                >
                    {message.text}
                </div>
            )}

            {/* Add new review */}
            <div className="border-2 border-[#2A2A2A] p-4 bg-[#0D0D0D]">
                <h3 className="font-mono text-[9px] text-[#999] tracking-[0.15em] uppercase font-bold mb-3">
                    Add review
                </h3>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <AdminInput
                            label="Author name"
                            value={form.authorName}
                            onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                            placeholder="e.g. John D."
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <AdminTextarea
                            label="Review text"
                            value={form.text}
                            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                            placeholder="What the customer said…"
                            required
                        />
                    </div>
                    <AdminInput
                        label="Rating (1–5)"
                        hint="optional"
                        type="number"
                        min={1}
                        max={5}
                        value={form.rating}
                        onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                        placeholder="—"
                    />
                    <AdminInput
                        label="Sort order"
                        hint="lower = first on storefront"
                        type="number"
                        value={form.sortOrder}
                        onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                    />
                    <div className="md:col-span-2">
                        <AdminButton type="submit" disabled={saving}>
                            {saving ? "SAVING…" : "ADD REVIEW"}
                        </AdminButton>
                    </div>
                </form>
            </div>

            {/* List */}
            {reviews === undefined ? (
                <AdminLoadingBlock />
            ) : (
                <div className="border-2 border-[#2A2A2A]">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2A2A2A] bg-[#0D0D0D]">
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                        Author
                                    </th>
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                        Review
                                    </th>
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold w-20">
                                        Rating
                                    </th>
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold w-24">
                                        Order
                                    </th>
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold w-24">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-right font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold w-32">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!reviews?.length ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-8 text-center font-mono text-[10px] text-[#666] tracking-[0.1em]"
                                        >
                                            NO REVIEWS YET — ADD ONE ABOVE
                                        </td>
                                    </tr>
                                ) : (
                                    reviews.map((r) =>
                                        editingId === r.id && editForm ? (
                                            <tr
                                                key={r.id}
                                                className="border-b border-[#1A1A1A] bg-[#0D0D0D]"
                                            >
                                                <td colSpan={6} className="px-4 py-2.5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <AdminInput
                                                            label="Author"
                                                            value={editForm.authorName}
                                                            onChange={(e) =>
                                                                setEditForm((f) =>
                                                                    f ? { ...f, authorName: e.target.value } : f
                                                                )
                                                            }
                                                        />
                                                        <div className="md:col-span-2">
                                                            <AdminTextarea
                                                                label="Review text"
                                                                value={editForm.text}
                                                                onChange={(e) =>
                                                                    setEditForm((f) =>
                                                                        f ? { ...f, text: e.target.value } : f
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <AdminInput
                                                            label="Rating (1–5)"
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={editForm.rating}
                                                            onChange={(e) =>
                                                                setEditForm((f) =>
                                                                    f ? { ...f, rating: e.target.value } : f
                                                                )
                                                            }
                                                        />
                                                        <AdminInput
                                                            label="Sort order"
                                                            type="number"
                                                            value={editForm.sortOrder}
                                                            onChange={(e) =>
                                                                setEditForm((f) =>
                                                                    f ? { ...f, sortOrder: e.target.value } : f
                                                                )
                                                            }
                                                        />
                                                        <div className="flex items-center gap-4">
                                                            <label className="flex items-center gap-2 font-mono text-[10px] text-[#999] tracking-[0.1em] uppercase cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={editForm.isActive}
                                                                    onChange={(e) =>
                                                                        setEditForm((f) =>
                                                                            f
                                                                                ? { ...f, isActive: e.target.checked }
                                                                                : f
                                                                        )
                                                                    }
                                                                    className="rounded border-2 border-[#2A2A2A] bg-[#0D0D0D] text-[#BAFF00] focus:ring-[#BAFF00]"
                                                                />
                                                                Visible on storefront
                                                            </label>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <AdminButton
                                                                type="button"
                                                                variant="primary"
                                                                size="sm"
                                                                disabled={saving}
                                                                onClick={() => handleUpdate(r.id)}
                                                            >
                                                                Save
                                                            </AdminButton>
                                                            <AdminButton
                                                                type="button"
                                                                variant="secondary"
                                                                size="sm"
                                                                disabled={saving}
                                                                onClick={() => {
                                                                    setEditingId(null);
                                                                    setEditForm(null);
                                                                }}
                                                            >
                                                                Cancel
                                                            </AdminButton>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr
                                                key={r.id}
                                                className="border-b border-[#1A1A1A] hover:bg-[#0D0D0D] transition-colors"
                                            >
                                                <td className="px-4 py-2.5 font-mono text-[10px] text-[#F5F5F0] tracking-[0.05em]">
                                                    {r.authorName}
                                                </td>
                                                <td className="px-4 py-2.5 font-mono text-[10px] text-[#999] tracking-[0.05em] max-w-xs">
                                                    <span className="line-clamp-2">{r.text}</span>
                                                </td>
                                                <td className="px-4 py-2.5 font-mono text-[10px] text-[#666]">
                                                    {r.rating != null ? `${r.rating} ★` : "—"}
                                                </td>
                                                <td className="px-4 py-2.5 font-mono text-[10px] text-[#666]">
                                                    {r.sortOrder}
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <span
                                                        className={
                                                            r.isActive
                                                                ? "font-mono text-[10px] text-[#BAFF00] tracking-[0.1em]"
                                                                : "font-mono text-[10px] text-[#666] tracking-[0.1em]"
                                                        }
                                                    >
                                                        {r.isActive ? "Visible" : "Hidden"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEdit(r)}
                                                            className="font-mono text-[10px] text-[#BAFF00] hover:underline tracking-[0.1em] uppercase"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(r.id)}
                                                            disabled={saving}
                                                            className="font-mono text-[10px] text-[#FF3333] hover:underline tracking-[0.1em] uppercase disabled:opacity-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
