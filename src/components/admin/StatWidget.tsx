import { cn } from "@/lib/utils";

interface StatWidgetProps {
    label: string;
    value: string | number;
    sublabel?: string;
    trend?: { value: string; positive: boolean };
    accentColor?: string;
    className?: string;
}

export function StatWidget({
    label,
    value,
    sublabel,
    trend,
    accentColor = "#BAFF00",
    className,
}: StatWidgetProps) {
    return (
        <div
            className={cn(
                "border-2 border-[#2A2A2A] bg-[#0D0D0D] p-4 flex flex-col justify-between min-h-[100px] group hover:border-[#BAFF00]/30 transition-colors",
                className
            )}
        >
            {/* Label */}
            <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] text-[#666] tracking-[0.15em] uppercase">
                    {label}
                </span>
                <div
                    className="w-1.5 h-1.5"
                    style={{ backgroundColor: accentColor }}
                />
            </div>

            {/* Value */}
            <div>
                <p
                    className="font-mono text-xl font-bold tracking-[-0.02em]"
                    style={{ color: accentColor }}
                >
                    {value}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    {sublabel && (
                        <span className="font-mono text-[9px] text-[#666] tracking-[0.1em] uppercase">
                            {sublabel}
                        </span>
                    )}
                    {trend && (
                        <span
                            className={cn(
                                "font-mono text-[9px] tracking-[0.1em] font-bold",
                                trend.positive ? "text-[#BAFF00]" : "text-[#FF3333]"
                            )}
                        >
                            {trend.positive ? "▲" : "▼"} {trend.value}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
