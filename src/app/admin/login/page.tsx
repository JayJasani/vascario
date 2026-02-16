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
                <div className="border-2 border-[#2A2A2A] border-b-0 px-6 py-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-[#666] tracking-[0.2em] uppercase">
                        System Access
                    </span>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 bg-[#FF3333]" />
                        <div className="w-2 h-2 bg-[#FFD600]" />
                        <div className="w-2 h-2 bg-[#BAFF00]" />
                    </div>
                </div>

                {/* Main login box */}
                <div className="border-2 border-[#2A2A2A] p-10">
                    <div className="mb-8">
                        <h1
                            className="text-3xl font-bold tracking-[-0.03em] uppercase mb-2"
                            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                        >
                            VASCARIO
                        </h1>
                        <p className="font-mono text-xs text-[#666] tracking-[0.15em] uppercase">
                            Command Center // Auth Required
                        </p>
                    </div>

                    <form action={formAction}>
                        <label className="block mb-2 font-mono text-xs text-[#999] tracking-[0.2em] uppercase">
                            Access Code
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            autoFocus
                            placeholder="ENTER ACCESS CODE"
                            className="w-full bg-[#0D0D0D] border-2 border-[#2A2A2A] text-[#F5F5F0] font-mono text-sm px-6 py-4 tracking-[0.1em] uppercase placeholder:text-[#333] focus:border-[#BAFF00] focus:outline-none transition-colors"
                        />

                        {state?.error && (
                            <p className="mt-3 font-mono text-xs text-[#FF3333] tracking-[0.1em] uppercase">
                                ✕ {state.error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-6 w-full bg-[#BAFF00] text-black font-mono font-bold text-sm tracking-[0.2em] uppercase px-8 py-4 border-2 border-[#BAFF00] hover:bg-transparent hover:text-[#BAFF00] transition-colors disabled:opacity-50"
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
