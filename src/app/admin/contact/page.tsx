"use client";

import useSWR from "swr";

interface ContactSubmission {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    query: string;
    createdAt: string;
}

async function fetchContactSubmissions(): Promise<ContactSubmission[]> {
    const res = await fetch("/admin/contact/api");
    return res.json();
}

export default function AdminContactPage() {
    const { data: submissions, mutate, isValidating } = useSWR("admin-contact", fetchContactSubmissions, {
        fallbackData: [],
    });

    return (
        <div className="space-y-10">
            {/* ── PAGE HEADER ── */}
            <div className="flex items-end justify-between">
                <div>
                    <h2
                        className="text-2xl font-bold tracking-[-0.03em] uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                        Contact Queries
                    </h2>
                    <p className="font-mono text-xs text-[#666] tracking-[0.15em] uppercase mt-1">
                        // Inquiries from contact form
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

            {/* ── TABLE ── */}
            <div className="border-2 border-[#2A2A2A]">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#2A2A2A] bg-[#0D0D0D]">
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase font-bold">
                                    Query
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!submissions?.length ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-12 text-center font-mono text-xs text-[#666] tracking-[0.1em]"
                                    >
                                        NO CONTACT SUBMISSIONS YET
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((sub) => (
                                    <tr
                                        key={sub.id}
                                        className="border-b border-[#1A1A1A] hover:bg-[#0D0D0D] transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-[10px] text-[#666] tracking-[0.1em] whitespace-nowrap">
                                            {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-[#F5F5F0] tracking-[0.05em]">
                                            {sub.firstName} {sub.lastName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={`mailto:${sub.email}`}
                                                className="font-mono text-xs text-[#BAFF00] hover:underline tracking-[0.05em]"
                                            >
                                                {sub.email}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[10px] text-[#999] tracking-[0.05em] max-w-md">
                                            <span className="line-clamp-3">{sub.query}</span>
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
