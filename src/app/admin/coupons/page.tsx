"use client";

import { useState } from "react";
import useSWR from "swr";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminLoadingBlock } from "@/components/admin/AdminLoadingBlock";
import {
  createCouponAction,
  updateCouponAction,
  deleteCouponAction,
} from "../actions";
import type { CouponType } from "@/lib/coupons";

interface AdminCouponView {
  id: string;
  code: string;
  label: string;
  type: CouponType;
  value: string;
  minCartTotal: string;
  maxDiscount: string;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

async function fetchCoupons(): Promise<AdminCouponView[]> {
  const res = await fetch("/admin/coupons/api");
  return res.json();
}

export default function AdminCouponsPage() {
  const {
    data: coupons,
    mutate,
    isValidating,
  } = useSWR("admin-coupons", fetchCoupons, { refreshInterval: 15000 });

  const [savingId, setSavingId] = useState<string | "new" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    label: "",
    type: "PERCENT" as CouponType,
    value: "",
    minCartTotal: "",
    maxDiscount: "",
    isActive: true,
    isPublic: false,
  });

  const [editForm, setEditForm] = useState<AdminCouponView | null>(null);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 4000);
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      showMessage("Code is required.");
      return;
    }
    if (!newCoupon.value.trim() || Number(newCoupon.value) <= 0) {
      showMessage("Discount value must be greater than zero.");
      return;
    }
    setSavingId("new");
    try {
      const fd = new FormData();
      fd.set("code", newCoupon.code);
      fd.set("label", newCoupon.label);
      fd.set("type", newCoupon.type);
      fd.set("value", newCoupon.value);
      fd.set("minCartTotal", newCoupon.minCartTotal);
      fd.set("maxDiscount", newCoupon.maxDiscount);
      if (newCoupon.isActive) fd.set("isActive", "on");
      if (newCoupon.isPublic) fd.set("isPublic", "on");
      await createCouponAction(fd);
      setNewCoupon({
        code: "",
        label: "",
        type: "PERCENT",
        value: "",
        minCartTotal: "",
        maxDiscount: "",
        isActive: true,
        isPublic: false,
      });
      mutate();
      showMessage("Coupon created.");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      showMessage("Failed to create coupon.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleUpdate(id: string) {
    if (!editForm) return;
    if (!editForm.code.trim()) {
      showMessage("Code is required.");
      return;
    }
    if (!editForm.value.trim() || Number(editForm.value) <= 0) {
      showMessage("Discount value must be greater than zero.");
      return;
    }
    setSavingId(id);
    try {
      const fd = new FormData();
      fd.set("code", editForm.code);
      fd.set("label", editForm.label);
      fd.set("type", editForm.type);
      fd.set("value", editForm.value);
      fd.set("minCartTotal", editForm.minCartTotal);
      fd.set("maxDiscount", editForm.maxDiscount);
      if (editForm.isActive) fd.set("isActive", "on");
      if (editForm.isPublic) fd.set("isPublic", "on");
      await updateCouponAction(id, fd);
      setEditingId(null);
      setEditForm(null);
      mutate();
      showMessage("Coupon updated.");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      showMessage("Failed to update coupon.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    setSavingId(id);
    try {
      await deleteCouponAction(id);
      if (editingId === id) {
        setEditingId(null);
        setEditForm(null);
      }
      mutate();
      showMessage("Coupon deleted.");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      showMessage("Failed to delete coupon.");
    } finally {
      setSavingId(null);
    }
  }

  function startEdit(coupon: AdminCouponView) {
    setEditingId(coupon.id);
    setEditForm({ ...coupon });
  }

  if (!coupons) {
    return <AdminLoadingBlock />;
  }

  const activeCount = coupons.filter((c) => c.isActive).length;
  const publicCount = coupons.filter((c) => c.isPublic).length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2
            className="text-xl font-bold tracking-[-0.03em] uppercase"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Coupons
          </h2>
          <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase mt-0.5">
            // Manage discount codes & thresholds
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
        <div className="font-mono text-[10px] text-[#BAFF00] tracking-[0.1em]">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-2 border-[#2A2A2A] p-4 bg-[#0D0D0D]">
          <span className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase">
            Total coupons
          </span>
          <p className="font-mono text-xl font-bold text-[#BAFF00] tracking-[-0.02em] mt-1.5">
            {coupons.length}
          </p>
        </div>
        <div className="border-2 border-[#2A2A2A] p-4 bg-[#0D0D0D]">
          <span className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase">
            Active
          </span>
          <p className="font-mono text-xl font-bold text-[#BAFF00] tracking-[-0.02em] mt-1.5">
            {activeCount}
          </p>
        </div>
        <div className="border-2 border-[#2A2A2A] p-4 bg-[#0D0D0D]">
          <span className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase">
            Visible to customers
          </span>
          <p className="font-mono text-xl font-bold text-[#BAFF00] tracking-[-0.02em] mt-1.5">
            {publicCount}
          </p>
        </div>
      </div>

      {/* Create new */}
      <div className="border-2 border-[#2A2A2A] p-4 bg-[#0D0D0D]">
        <h3 className="font-mono text-[9px] text-[#999] tracking-[0.15em] uppercase font-bold mb-3">
          Create coupon
        </h3>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <AdminInput
            label="Code"
            value={newCoupon.code}
            onChange={(e) =>
              setNewCoupon((c) => ({ ...c, code: e.target.value.toUpperCase() }))
            }
            placeholder="WELCOME10"
            required
          />
          <AdminInput
            label="Label"
            value={newCoupon.label}
            onChange={(e) =>
              setNewCoupon((c) => ({ ...c, label: e.target.value }))
            }
            placeholder="10% off welcome"
          />
          <div>
            <label className="block font-mono text-[9px] text-[#999] tracking-[0.15em] uppercase mb-1.5">
              Type
            </label>
            <select
              className="w-full bg-black border-2 border-[#2A2A2A] px-3 py-2 text-xs font-mono tracking-[0.1em] uppercase"
              value={newCoupon.type}
              onChange={(e) =>
                setNewCoupon((c) => ({ ...c, type: e.target.value as CouponType }))
              }
            >
              <option value="PERCENT">Percent (%)</option>
              <option value="FLAT">Flat (₹)</option>
            </select>
          </div>
          <AdminInput
            label={newCoupon.type === "PERCENT" ? "Value (%)" : "Value (₹)"}
            type="number"
            min={0}
            step="0.01"
            value={newCoupon.value}
            onChange={(e) =>
              setNewCoupon((c) => ({ ...c, value: e.target.value }))
            }
            required
          />
          <AdminInput
            label="Min cart total (₹)"
            type="number"
            min={0}
            step="0.01"
            value={newCoupon.minCartTotal}
            onChange={(e) =>
              setNewCoupon((c) => ({ ...c, minCartTotal: e.target.value }))
            }
            placeholder="Optional"
          />
          <AdminInput
            label="Max discount (₹)"
            type="number"
            min={0}
            step="0.01"
            value={newCoupon.maxDiscount}
            onChange={(e) =>
              setNewCoupon((c) => ({ ...c, maxDiscount: e.target.value }))
            }
            placeholder="Optional"
          />
          <div className="flex flex-col gap-2 mt-2">
            <label className="inline-flex items-center gap-2">
              <input
                id="new-active"
                type="checkbox"
                checked={newCoupon.isActive}
                onChange={(e) =>
                  setNewCoupon((c) => ({ ...c, isActive: e.target.checked }))
                }
                className="w-4 h-4 accent-[#BAFF00] bg-[#0D0D0D] border-2 border-[#2A2A2A] cursor-pointer"
              />
              <span className="font-mono text-[10px] text-[#F5F5F0] tracking-[0.1em] uppercase">
                Active
              </span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                id="new-public"
                type="checkbox"
                checked={newCoupon.isPublic}
                onChange={(e) =>
                  setNewCoupon((c) => ({ ...c, isPublic: e.target.checked }))
                }
                className="w-4 h-4 accent-[#BAFF00] bg-[#0D0D0D] border-2 border-[#2A2A2A] cursor-pointer"
              />
              <span className="font-mono text-[10px] text-[#F5F5F0] tracking-[0.1em] uppercase">
                Visible to customers
              </span>
            </label>
          </div>
          <div className="md:col-span-3">
            <AdminButton type="submit" disabled={savingId === "new"}>
              {savingId === "new" ? "CREATING…" : "CREATE COUPON"}
            </AdminButton>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="border-2 border-[#2A2A2A]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A2A] bg-[#0D0D0D]">
                <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                  Code
                </th>
                <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                  Label
                </th>
                <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                  Type / Value
                </th>
                <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                  Rules
                </th>
                <th className="px-4 py-2 text-left font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold">
                  Status
                </th>
                <th className="px-4 py-2 text-right font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase font-bold w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center font-mono text-[10px] text-[#666] tracking-[0.1em]"
                  >
                    NO COUPONS YET — CREATE ONE ABOVE
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) =>
                  editingId === coupon.id && editForm ? (
                    <tr
                      key={coupon.id}
                      className="border-b border-[#1A1A1A] bg-[#0D0D0D]"
                    >
                      <td colSpan={6} className="px-4 py-2.5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <AdminInput
                            label="Code"
                            value={editForm.code}
                            onChange={(e) =>
                              setEditForm((c) =>
                                c ? { ...c, code: e.target.value.toUpperCase() } : c,
                              )
                            }
                          />
                          <AdminInput
                            label="Label"
                            value={editForm.label}
                            onChange={(e) =>
                              setEditForm((c) =>
                                c ? { ...c, label: e.target.value } : c,
                              )
                            }
                          />
                          <div>
                            <label className="block font-mono text-[9px] text-[#999] tracking-[0.15em] uppercase mb-1.5">
                              Type
                            </label>
                            <select
                              className="w-full bg-black border-2 border-[#2A2A2A] px-3 py-2 text-xs font-mono tracking-[0.1em] uppercase"
                              value={editForm.type}
                              onChange={(e) =>
                                setEditForm((c) =>
                                  c ? { ...c, type: e.target.value as CouponType } : c,
                                )
                              }
                            >
                              <option value="PERCENT">Percent (%)</option>
                              <option value="FLAT">Flat (₹)</option>
                            </select>
                          </div>
                          <AdminInput
                            label={
                              editForm.type === "PERCENT" ? "Value (%)" : "Value (₹)"
                            }
                            type="number"
                            min={0}
                            step="0.01"
                            value={editForm.value}
                            onChange={(e) =>
                              setEditForm((c) =>
                                c ? { ...c, value: e.target.value } : c,
                              )
                            }
                          />
                          <AdminInput
                            label="Min cart total (₹)"
                            type="number"
                            min={0}
                            step="0.01"
                            value={editForm.minCartTotal}
                            onChange={(e) =>
                              setEditForm((c) =>
                                c ? { ...c, minCartTotal: e.target.value } : c,
                              )
                            }
                          />
                          <AdminInput
                            label="Max discount (₹)"
                            type="number"
                            min={0}
                            step="0.01"
                            value={editForm.maxDiscount}
                            onChange={(e) =>
                              setEditForm((c) =>
                                c ? { ...c, maxDiscount: e.target.value } : c,
                              )
                            }
                          />
                          <div className="flex flex-col gap-2 mt-2">
                            <label className="inline-flex items-center gap-2">
                              <input
                                id={`edit-active-${coupon.id}`}
                                type="checkbox"
                                checked={editForm.isActive}
                                onChange={(e) =>
                                  setEditForm((c) =>
                                    c ? { ...c, isActive: e.target.checked } : c,
                                  )
                                }
                                className="w-4 h-4 accent-[#BAFF00] bg-[#0D0D0D] border-2 border-[#2A2A2A] cursor-pointer"
                              />
                              <span className="font-mono text-[10px] text-[#F5F5F0] tracking-[0.1em] uppercase">
                                Active
                              </span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <input
                                id={`edit-public-${coupon.id}`}
                                type="checkbox"
                                checked={editForm.isPublic}
                                onChange={(e) =>
                                  setEditForm((c) =>
                                    c ? { ...c, isPublic: e.target.checked } : c,
                                  )
                                }
                                className="w-4 h-4 accent-[#BAFF00] bg-[#0D0D0D] border-2 border-[#2A2A2A] cursor-pointer"
                              />
                              <span className="font-mono text-[10px] text-[#F5F5F0] tracking-[0.1em] uppercase">
                                Visible to customers
                              </span>
                            </label>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <AdminButton
                              type="button"
                              variant="primary"
                              size="sm"
                              disabled={savingId === coupon.id}
                              onClick={() => handleUpdate(coupon.id)}
                            >
                              Save
                            </AdminButton>
                            <AdminButton
                              type="button"
                              variant="secondary"
                              size="sm"
                              disabled={savingId === coupon.id}
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
                      key={coupon.id}
                      className="border-b border-[#1A1A1A] hover:bg-[#0D0D0D] transition-colors"
                    >
                      <td className="px-4 py-2.5 font-mono text-[10px] text-[#BAFF00] tracking-[0.1em]">
                        {coupon.code}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[10px] text-[#F5F5F0] tracking-[0.05em] uppercase">
                        {coupon.label}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[10px] text-[#F5F5F0] tracking-[0.05em]">
                        {coupon.type === "PERCENT"
                          ? `${coupon.value}%`
                          : `₹${Number(coupon.value).toLocaleString("en-IN")}`}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[9px] text-[#999] tracking-[0.05em]">
                        {coupon.minCartTotal
                          ? `Min: ₹${Number(coupon.minCartTotal).toLocaleString(
                              "en-IN",
                            )}`
                          : "No min"}
                        {" • "}
                        {coupon.maxDiscount
                          ? `Max: ₹${Number(coupon.maxDiscount).toLocaleString(
                              "en-IN",
                            )}`
                          : "No cap"}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[10px] tracking-[0.1em] uppercase">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={
                              coupon.isActive ? "text-[#BAFF00]" : "text-[#666]"
                            }
                          >
                            {coupon.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                          <span className="text-[9px] text-[#999] tracking-[0.1em]">
                            {coupon.isPublic ? "VISIBLE TO CUSTOMERS" : "HIDDEN"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(coupon)}
                            className="font-mono text-[10px] text-[#BAFF00] hover:underline tracking-[0.1em] uppercase"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(coupon.id)}
                            disabled={savingId === coupon.id}
                            className="font-mono text-[10px] text-[#FF3333] hover:underline tracking-[0.1em] uppercase disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

