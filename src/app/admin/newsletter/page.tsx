"use client";

import useSWR from "swr";
import { AdminLoadingBlock } from "@/components/admin/AdminLoadingBlock";

interface NewsletterSubscription {
    id: string;
    email: string;
    createdAt: string;
}

async function fetchNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    const res = await fetch("/admin/newsletter/api");
    return res.json();
}

export default function AdminNewsletterPage() {
    const { data: subscriptions, mutate, isValidating } = useSWR(
        "admin-newsletter",
        fetchNewsletterSubscriptions
    );

    return (
        <div className="space-y-10">
            <div className="flex items-end justify-between">
                <div>
                    <h2
                        className="text-2xl font-bold tracking-[-0.03em] uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                        Newsletter
                    </h2>
                    <p className="font-mono text-xs text-[#666] tracking-[0.15em] uppercase mt-1">
                        // Emails subscribed to the website
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => mutate()}
                    disabled={isValidating}
                    className="font-mono text-[10px] tracking-[0.15em] uppercase px-4 py-2 border-2 border-[#2A2A2A] hover:border-[#BAFF00] hover:text-[#BAFF00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isValidating ? "REFRESHING…" : "REFRESH"}
                </button>
            </div>

            {subscriptions === undefined ? (
                <AdminLoadingBlock />
            ) : (
            <div className="border-2 border-[#2A2A2A]">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#2A2A2A] bg-[#0D0D0D]">
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    #
                                </th>
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    Subscribed at
                                </th>
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!subscriptions?.length ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-12 text-center font-mono text-xs text-[#666] tracking-[0.1em]"
                                    >
                                        NO SUBSCRIBERS YET
                                    </td>
                                </tr>
                            ) : (
                                subscriptions.map((sub, index) => (
                                    <tr
                                        key={sub.id}
                                        className="border-b border-[#1A1A1A] hover:bg-[#0D0D0D] transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-[10px] text-[#666] tracking-[0.1em] w-12">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[10px] text-[#666] tracking-[0.1em] whitespace-nowrap">
                                            {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={`mailto:${sub.email}`}
                                                className="font-mono text-xs text-[#BAFF00] hover:underline tracking-[0.05em]"
                                            >
                                                {sub.email}
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            )}

            {subscriptions && subscriptions.length > 0 && (
                <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase">
                    {subscriptions.length} subscriber{subscriptions.length === 1 ? "" : "s"} total
                </p>
            )}
        </div>
    );
}
