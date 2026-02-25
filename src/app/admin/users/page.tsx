"use client";

import { AdminLoadingBlock } from "@/components/admin/AdminLoadingBlock";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import useSWR from "swr";

const UserGrowthChart = dynamic(
  () => import("@/components/admin/UserGrowthChart").then((m) => m.UserGrowthChart),
  { ssr: false }
);

interface AdminUser {
  id: string;
  uid: string;
  email: string;
  phoneNumber?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
}

async function fetchAdminUsers(): Promise<AdminUser[]> {
  const res = await fetch("/admin/users/api");
  if (!res.ok) {
    throw new Error("Failed to load users");
  }
  return res.json();
}

export default function AdminUsersPage() {
  const {
    data: users,
    isValidating,
    mutate,
    error,
  } = useSWR<AdminUser[]>("admin-users", fetchAdminUsers, {
    refreshInterval: 30000,
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUserId && users && users.length > 0) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId]);

  const selectedUser = users?.find((u) => u.id === selectedUserId) ?? null;

  return (
    <div className="flex gap-4 h-full">
      {/* ── USER SIDEBAR ── */}
      <aside className="w-72 border-2 border-[#2A2A2A] bg-[#050505] flex flex-col">
        <div className="px-4 py-3 border-b-2 border-[#2A2A2A] flex items-center justify-between">
          <div>
            <h2
              className="text-sm font-bold tracking-[-0.03em] uppercase"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Users
            </h2>
            <p className="font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase mt-0.5">
              // Select a user to inspect
            </p>
            {users !== undefined && (
              <p className="font-mono text-[9px] text-[#999] tracking-[0.15em] uppercase mt-0.5">
                TOTAL USERS: {users.length}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => mutate()}
            disabled={isValidating}
            className="font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-1 border border-[#2A2A2A] hover:border-[#BAFF00] hover:text-[#BAFF00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isValidating ? "…" : "REFRESH"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users === undefined ? (
            <div className="p-4">
              <AdminLoadingBlock />
            </div>
          ) : !users.length ? (
            <p className="p-4 font-mono text-[10px] text-[#666] tracking-[0.1em]">
              NO USERS FOUND
            </p>
          ) : (
            <ul className="divide-y divide-[#1A1A1A]">
              {users.map((user) => {
                const name =
                  user.displayName ||
                  [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                  user.email;

                const isActive = user.id === selectedUserId;

                return (
                  <li key={user.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedUserId(user.id)}
                      className={`w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors border-l-2 ${
                        isActive
                          ? "bg-[#0D0D0D] border-[#BAFF00]"
                          : "border-transparent hover:bg-[#050505]"
                      }`}
                    >
                      <span className="font-mono text-[10px] tracking-[0.1em] text-[#F5F5F0] uppercase line-clamp-1">
                        {name}
                      </span>
                      <span className="font-mono text-[9px] tracking-[0.1em] text-[#777] line-clamp-1">
                        {user.email}
                      </span>
                      {user.phoneNumber && (
                        <span className="font-mono text-[9px] tracking-[0.1em] text-[#555] line-clamp-1">
                          {user.phoneNumber}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* ── USER OVERVIEW ── */}
      <section className="flex-1 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2
              className="text-xl font-bold tracking-[-0.03em] uppercase"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              User Overview
            </h2>
            <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase mt-0.5">
              // Inspect account profile and metadata
            </p>
          </div>
          {error && (
            <p className="font-mono text-[10px] text-[#FF3333] tracking-[0.1em]">
              FAILED TO LOAD USERS
            </p>
          )}
        </div>

        {/* User growth chart */}
        {users !== undefined && users.length > 0 && (
          <div className="border-2 border-[#2A2A2A] bg-[#050505] p-4 overflow-hidden">
            <h3 className="font-mono text-[9px] text-[#999] tracking-[0.15em] uppercase font-bold mb-3">
              User Growth
            </h3>
            <UserGrowthChart users={users} />
          </div>
        )}

        {!selectedUser ? (
          <div className="border-2 border-dashed border-[#2A2A2A] p-6 flex items-center justify-center">
            <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase text-center">
              SELECT A USER FROM THE LEFT SIDEBAR TO VIEW DETAILS
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Basic profile */}
            <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] p-4">
              <h3 className="font-mono text-[9px] text-[#999] tracking-[0.15em] uppercase font-bold mb-3">
                Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase">
                    Name
                  </p>
                  <p className="font-mono text-sm text-[#F5F5F0] tracking-[0.05em] mt-1">
                    {selectedUser.displayName ||
                      [selectedUser.firstName, selectedUser.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                      "—"}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase">
                    Email
                  </p>
                  <p className="font-mono text-sm text-[#BAFF00] tracking-[0.05em] mt-1 break-all">
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase">
                    Phone
                  </p>
                  <p className="font-mono text-sm text-[#F5F5F0] tracking-[0.05em] mt-1">
                    {selectedUser.phoneNumber || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* System metadata */}
            <div className="border-2 border-[#2A2A2A] bg-[#050505] p-4">
              <h3 className="font-mono text-[9px] text-[#999] tracking-[0.15em] uppercase font-bold mb-3">
                System Metadata
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono tracking-[0.05em]">
                <div>
                  <p className="text-[9px] text-[#666] uppercase">UID</p>
                  <p className="mt-1 text-[#F5F5F0] break-all">
                    {selectedUser.uid}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-[#666] uppercase">
                    Internal Record ID
                  </p>
                  <p className="mt-1 text-[#F5F5F0] break-all">
                    {selectedUser.id}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-[#666] uppercase">Created</p>
                  <p className="mt-1 text-[#F5F5F0]">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleString("en-IN")
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-[#666] uppercase">
                    Last Updated
                  </p>
                  <p className="mt-1 text-[#F5F5F0]">
                    {selectedUser.updatedAt
                      ? new Date(selectedUser.updatedAt).toLocaleString("en-IN")
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
