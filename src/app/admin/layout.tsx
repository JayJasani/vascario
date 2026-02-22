import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { logoutAction } from "./auth-actions";
import { AdminClock } from "@/components/admin/AdminClock";

export const metadata: Metadata = {
    title: "VASCARIO // COMMAND CENTER",
    description: "Vascario internal admin dashboard",
};

const navItems = [
    { label: "DASHBOARD", href: "/admin", icon: "◈" },
    { label: "DROPS", href: "/admin/drops", icon: "▣" },
    { label: "ORDERS", href: "/admin/orders", icon: "⬡" },
    { label: "INVENTORY", href: "/admin/inventory", icon: "▦" },
    { label: "STATIC CONTENT", href: "/admin/static-content", icon: "▤" },
    { label: "REVIEWS", href: "/admin/reviews", icon: "★" },
    { label: "INVESTMENT", href: "/admin/investment", icon: "◆" },
    { label: "CONTACT", href: "/admin/contact", icon: "✉" },
    { label: "NEWSLETTER", href: "/admin/newsletter", icon: "◉" },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side auth guard (replaces deprecated middleware)
    const cookieStore = await cookies();
    const token = cookieStore.get("vascario-admin-token")?.value;
    const secret = process.env.ADMIN_SECRET;

    // Check if we're on the login page by checking if children renders the login form
    // We handle this via the route structure — login has its own layout group
    const isAuthenticated = secret && token === secret;

    return (
        <div className="min-h-screen bg-black text-[#F5F5F0] font-mono flex">
            {isAuthenticated ? (
                <>
                    {/* ── SIDEBAR ── */}
                    <aside className="w-52 border-r-2 border-[#2A2A2A] flex flex-col shrink-0 sticky top-0 h-screen">
                        {/* Brand block */}
                        <div className="px-4 py-4 border-b-2 border-[#2A2A2A]">
                            <Link href="/admin">
                                <h1
                                    className="text-base font-bold tracking-[-0.03em] uppercase"
                                    style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                                >
                                    VASCARIO
                                </h1>
                                <p className="text-[9px] text-[#666] tracking-[0.2em] uppercase mt-0.5">
                  // Command Center
                                </p>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 py-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#999] hover:text-[#BAFF00] hover:bg-[#0D0D0D] border-l-2 border-transparent hover:border-[#BAFF00] transition-all"
                                >
                                    <span className="text-sm">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* System info footer */}
                        <div className="border-t-2 border-[#2A2A2A] px-4 py-3">
                            <div className="flex items-center gap-1.5 mb-2">
                                <div className="w-1.5 h-1.5 bg-[#BAFF00]" />
                                <span className="text-[9px] text-[#666] tracking-[0.15em] uppercase">
                                    System Online
                                </span>
                            </div>
                            <form action={logoutAction}>
                                <button
                                    type="submit"
                                    className="w-full text-left text-[9px] text-[#666] tracking-[0.15em] uppercase hover:text-[#FF3333] transition-colors"
                                >
                                    ✕ DISCONNECT
                                </button>
                            </form>
                        </div>
                    </aside>

                    {/* ── MAIN CONTENT ── */}
                    <main className="flex-1 flex flex-col min-h-screen text-sm">
                        {/* Top bar */}
                        <header className="border-b-2 border-[#2A2A2A] px-5 py-2.5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 border-2 border-[#BAFF00]" />
                                <span className="text-[10px] tracking-[0.2em] uppercase text-[#666]">
                                    VASCARIO // CMD
                                </span>
                            </div>
                            <AdminClock />
                        </header>

                        {/* Page content */}
                        <div className="flex-1 p-5">{children}</div>
                    </main>
                </>
            ) : (
                // Not authenticated — render children (login page) without shell
                <main className="flex-1">{children}</main>
            )}
        </div>
    );
}

