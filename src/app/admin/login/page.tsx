"use client";

import { useActionState } from "react";
import { loginAction } from "../auth-actions";

export default function AdminLoginPage() {
    const [state, formAction, isPending] = useActionState(
        async (_prev: { error?: string } | null, formData: FormData) => {
            return await loginAction(formData);
        },
        null
    );

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Scanline overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-10 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
                }}
            />

            <div className="relative z-20 w-full max-w-lg">
                {/* Terminal header */}
                <div className="border-2 border-[#2A2A2A] border-b-0 px-4 py-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase">
                        System Access
                    </span>
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[#FF3333]" />
                        <div className="w-1.5 h-1.5 bg-[#FFD600]" />
                        <div className="w-1.5 h-1.5 bg-[#BAFF00]" />
                    </div>
                </div>

                {/* Main login box */}
                <div className="border-2 border-[#2A2A2A] p-6">
                    <div className="mb-5">
                        <h1
                            className="text-2xl font-bold tracking-[-0.03em] uppercase mb-1.5"
                            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                        >
                            VASCARIO
                        </h1>
                        <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase">
                            Command Center // Auth Required
                        </p>
                    </div>

                    <form action={formAction}>
                        <label className="block mb-1.5 font-mono text-[10px] text-[#999] tracking-[0.15em] uppercase">
                            Access Code
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            autoFocus
                            placeholder="ENTER ACCESS CODE"
                            className="w-full bg-[#0D0D0D] border-2 border-[#2A2A2A] text-[#F5F5F0] font-mono text-xs px-4 py-2.5 tracking-[0.1em] uppercase placeholder:text-[#333] focus:border-[#BAFF00] focus:outline-none transition-colors"
                        />

                        {state?.error && (
                            <p className="mt-2 font-mono text-[10px] text-[#FF3333] tracking-[0.1em] uppercase">
                                ✕ {state.error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-4 w-full bg-[#BAFF00] text-black font-mono font-bold text-xs tracking-[0.15em] uppercase px-5 py-2.5 border-2 border-[#BAFF00] hover:bg-transparent hover:text-[#BAFF00] transition-colors disabled:opacity-50"
                        >
                            {isPending ? "AUTHENTICATING..." : "AUTHORIZE"}
                        </button>
                    </form>
                </div>

                {/* Footer bar */}
                <div className="border-2 border-[#2A2A2A] border-t-0 px-6 py-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#333] tracking-[0.15em]">
                        VASCARIO CMD v1.0
                    </span>
                    <span className="font-mono text-[10px] text-[#333] tracking-[0.15em]">
                        ENCRYPTED
                    </span>
                </div>
            </div>
        </div>
    );
}
