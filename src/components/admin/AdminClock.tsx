"use client";

import { useState, useEffect } from "react";

export function AdminClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="font-mono text-[10px] text-[#666] tracking-[0.15em]">
            <span className="text-[#BAFF00]">●</span>{" "}
            <span suppressHydrationWarning>
                {now.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                })}
                {" // "}
                {now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                })}
            </span>
        </div>
    );
}
