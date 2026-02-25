"use client";

import { useState } from "react";
import useSWR from "swr";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminInput";
import { AdminLoadingBlock } from "@/components/admin/AdminLoadingBlock";
import {
    createInvestmentAction,
    updateInvestmentAction,
    deleteInvestmentAction,
} from "../actions";

interface InvestmentItem {
    id: string;
    name: string;
    description: string;
    amount: string;
    createdAt: string;
    updatedAt: string;
}

async function fetchInvestments(): Promise<InvestmentItem[]> {
    const res = await fetch("/admin/investment/api");
    return res.json();
}

export default function AdminInvestmentPage() {
    const { data: investments, mutate, isValidating } = useSWR(
        "admin-investments",
        fetchInvestments,
        { refreshInterval: 15000 }
    );
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        amount: "",
    });
    const [editForm, setEditForm] = useState<{
        name: string;
        description: string;
        amount: string;
    } | null>(null);

    const showMessage = (type: "success" | "error", text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name.trim()) {
            showMessage("error", "Name is required.");
            return;
        }
        const amt = parseFloat(form.amount);
        if (isNaN(amt) || amt < 0) {
            showMessage("error", "Valid amount is required.");
            return;
        }
        setSaving(true);
        try {
            const fd = new FormData();
            fd.set("name", form.name.trim());
            fd.set("description", form.description.trim());
            fd.set("amount", form.amount);
            await createInvestmentAction(fd);
            setForm({ name: "", description: "", amount: "" });
            mutate();
            showMessage("success", "Investment added.");
        } catch (err) {
            console.error(err);
            showMessage("error", "Failed to add investment.");
        } finally {
            setSaving(false);
        }
    }

    async function handleUpdate(id: string) {
        if (!editForm) return;
        if (!editForm.name.trim()) {
            showMessage("error", "Name is required.");
            return;
        }
        const amt = parseFloat(editForm.amount);
        if (isNaN(amt) || amt < 0) {
            showMessage("error", "Valid amount is required.");
            return;
        }
        setSaving(true);
        try {
            const fd = new FormData();
            fd.set("name", editForm.name.trim());
            fd.set("description", editForm.description.trim());
            fd.set("amount", editForm.amount);
            await updateInvestmentAction(id, fd);
            setEditingId(null);
            setEditForm(null);
            mutate();
            showMessage("success", "Investment updated.");
        } catch (err) {
            console.error(err);
            showMessage("error", "Failed to update investment.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this investment?")) return;
        setSaving(true);
        try {
            await deleteInvestmentAction(id);
            if (editingId === id) {
                setEditingId(null);
                setEditForm(null);
            }
            mutate();
            showMessage("success", "Investment deleted.");
        } catch (err) {
            console.error(err);
            showMessage("error", "Failed to delete investment.");
        } finally {
            setSaving(false);
        }
    }

    function startEdit(inv: InvestmentItem) {
        setEditingId(inv.id);
        setEditForm({
            name: inv.name,
            description: inv.description,
            amount: inv.amount,
        });
    }

    const totalAmount = investments?.reduce((sum, i) => sum + parseFloat(i.amount || "0"), 0) ?? 0;

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h2
                        className="text-xl font-bold tracking-[-0.03em] uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                        Investment
                    </h2>
                    <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase mt-0.5">
                        // Track investments by name and description (6 partners)
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

            {/* Add new investment */}
            <div className="border-2 border-[#2A2A2A] p-4 bg-[#0D0D0D]">
                <h3 className="font-mono text-[9px] text-[#999] tracking-[0.15em] uppercase font-bold mb-3">
                    Add investment
                </h3>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput
                        label="Investor name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. John"
                        required
                    />
                    <AdminInput
                        label="Amount (₹)"
                        type="number"
                        min={0}
                        step="0.01"
                        value={form.amount}
                        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                        placeholder="0"
                        required
                    />
                    <div className="md:col-span-2">
                        <AdminTextarea
                            label="Description"
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            placeholder="What the investment is for…"
                        />
                    </div>
                    <div>
                        <AdminButton type="submit" disabled={saving}>
                            {saving ? "SAVING…" : "ADD INVESTMENT"}
                        </AdminButton>
                    </div>
                </form>
            </div>

            {/* Summary */}
            {investments && investments.length > 0 && (
                <div className="border-2 border-[#2A2A2A] p-4 bg-[#0D0D0D]">
                    <span className="font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase">
                        Total Investment
                    </span>
                    <p className="font-mono text-xl font-bold text-[#BAFF00] tracking-[-0.02em] mt-1.5">
                        ₹{totalAmount.toLocaleString("en-IN")}
                    </p>
                </div>
            )}

            {/* List */}
            {investments === undefined ? (
                <AdminLoadingBlock />
            ) : (
                <div className="border-2 border-[#2A2A2A]">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2A2A2A] bg-[#0D0D0D]">
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                        Description
                                    </th>
                                    <th className="px-4 py-2 text-right font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                        Amount
                                    </th>
                                    <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                                        Date
                                    </th>
                                    <th className="px-4 py-2 text-right font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold w-32">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!investments?.length ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center font-mono text-[10px] text-[#666] tracking-[0.1em]"
                                        >
                                            NO INVESTMENTS YET — ADD ONE ABOVE
                                        </td>
                                    </tr>
                                ) : (
                                    investments.map((inv) =>
                                        editingId === inv.id && editForm ? (
                                            <tr
                                                key={inv.id}
                                                className="border-b border-[#1A1A1A] bg-[#0D0D0D]"
                                            >
                                                <td colSpan={5} className="px-4 py-2.5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <AdminInput
                                                            label="Investor name"
                                                            value={editForm.name}
                                                            onChange={(e) =>
                                                                setEditForm((f) =>
                                                                    f ? { ...f, name: e.target.value } : f
                                                                )
                                                            }
                                                        />
                                                        <AdminInput
                                                            label="Amount (₹)"
                                                            type="number"
                                                            min={0}
                                                            step="0.01"
                                                            value={editForm.amount}
                                                            onChange={(e) =>
                                                                setEditForm((f) =>
                                                                    f ? { ...f, amount: e.target.value } : f
                                                                )
                                                            }
                                                        />
                                                        <div className="md:col-span-2">
                                                            <AdminTextarea
                                                                label="Description"
                                                                value={editForm.description}
                                                                onChange={(e) =>
                                                                    setEditForm((f) =>
                                                                        f ? { ...f, description: e.target.value } : f
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <AdminButton
                                                                type="button"
                                                                variant="primary"
                                                                size="sm"
                                                                disabled={saving}
                                                                onClick={() => handleUpdate(inv.id)}
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
                                                key={inv.id}
                                                className="border-b border-[#1A1A1A] hover:bg-[#0D0D0D] transition-colors"
                                            >
                                                <td className="px-4 py-2.5 font-mono text-[10px] text-[#F5F5F0] tracking-[0.05em]">
                                                    {inv.name}
                                                </td>
                                                <td className="px-4 py-2.5 font-mono text-[10px] text-[#999] tracking-[0.05em] max-w-md">
                                                    <span className="line-clamp-2">
                                                        {inv.description || "—"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-right font-mono text-xs font-bold text-[#BAFF00] tracking-[0.05em]">
                                                    ₹{Number(inv.amount).toLocaleString("en-IN")}
                                                </td>
                                                <td className="px-4 py-2.5 font-mono text-[10px] text-[#666] tracking-[0.05em]">
                                                    {new Date(inv.createdAt).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEdit(inv)}
                                                            className="font-mono text-[10px] text-[#BAFF00] hover:underline tracking-[0.1em] uppercase"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(inv.id)}
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
