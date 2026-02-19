import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "./auth-actions";

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
                    <aside className="w-64 border-r-2 border-[#2A2A2A] flex flex-col shrink-0 sticky top-0 h-screen">
                        {/* Brand block */}
                        <div className="px-6 py-6 border-b-2 border-[#2A2A2A]">
                            <Link href="/admin">
                                <h1
                                    className="text-xl font-bold tracking-[-0.03em] uppercase"
                                    style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                                >
                                    VASCARIO
                                </h1>
                                <p className="text-[10px] text-[#666] tracking-[0.2em] uppercase mt-1">
                  // Command Center
                                </p>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 py-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-4 px-6 py-4 text-xs tracking-[0.2em] uppercase text-[#999] hover:text-[#BAFF00] hover:bg-[#0D0D0D] border-l-2 border-transparent hover:border-[#BAFF00] transition-all"
                                >
                                    <span className="text-base">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* System info footer */}
                        <div className="border-t-2 border-[#2A2A2A] px-6 py-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 bg-[#BAFF00] animate-pulse" />
                                <span className="text-[10px] text-[#666] tracking-[0.15em] uppercase">
                                    System Online
                                </span>
                            </div>
                            <form action={logoutAction}>
                                <button
                                    type="submit"
                                    className="w-full text-left text-[10px] text-[#666] tracking-[0.15em] uppercase hover:text-[#FF3333] transition-colors"
                                >
                                    ✕ DISCONNECT
                                </button>
                            </form>
                        </div>
                    </aside>

                    {/* ── MAIN CONTENT ── */}
                    <main className="flex-1 flex flex-col min-h-screen">
                        {/* Top bar */}
                        <header className="border-b-2 border-[#2A2A2A] px-8 py-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 border-2 border-[#BAFF00]" />
                                <span className="text-xs tracking-[0.2em] uppercase text-[#666]">
                                    VASCARIO // CMD
                                </span>
                            </div>
                            <SystemClock />
                        </header>

                        {/* Page content */}
                        <div className="flex-1 p-8">{children}</div>
                    </main>
                </>
            ) : (
                // Not authenticated — render children (login page) without shell
                <main className="flex-1">{children}</main>
            )}
        </div>
    );
}

function SystemClock() {
    return (
        <div className="font-mono text-xs text-[#666] tracking-[0.15em]">
            <span className="text-[#BAFF00]">●</span>{" "}
            <span suppressHydrationWarning>
                {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                })}
                {" // "}
                {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })}
            </span>
        </div>
    );
}
