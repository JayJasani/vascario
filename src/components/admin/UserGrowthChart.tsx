"use client";

import { useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

export interface AdminUserForChart {
    id: string;
    createdAt?: string;
}

interface UserGrowthChartProps {
    users: AdminUserForChart[];
}

export function UserGrowthChart({ users }: UserGrowthChartProps) {
    const data = useMemo(() => {
        if (!users || users.length === 0) return [];

        const countsByDate = new Map<string, number>();

        for (const user of users) {
            if (!user.createdAt) continue;
            const date = new Date(user.createdAt);
            if (Number.isNaN(date.getTime())) continue;

            const key = date.toISOString().slice(0, 10);
            countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1);
        }

        const sortedEntries = Array.from(countsByDate.entries()).sort(([a], [b]) =>
            a.localeCompare(b)
        );

        let cumulative = 0;
        return sortedEntries.map(([date, count]) => {
            cumulative += count;
            return {
                dateLabel: new Date(date).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                }),
                cumulative,
            };
        });
    }, [users]);

    if (data.length === 0) {
        return (
            <p className="font-mono text-[10px] text-[#666] tracking-[0.1em] uppercase">
                NOT ENOUGH DATA TO DISPLAY GROWTH
            </p>
        );
    }

    return (
        <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#BAFF00" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#BAFF00" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1A1A1A" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="dateLabel"
                        tick={{ fontSize: 10, fill: "#777", fontFamily: "var(--font-mono)" }}
                        tickLine={false}
                        axisLine={{ stroke: "#333" }}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: "#777", fontFamily: "var(--font-mono)" }}
                        tickLine={false}
                        axisLine={{ stroke: "#333" }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#050505",
                            border: "1px solid #2A2A2A",
                            borderRadius: 4,
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                        }}
                        cursor={{ stroke: "#333", strokeDasharray: "3 3" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#BAFF00"
                        fillOpacity={1}
                        fill="url(#userGrowthGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

