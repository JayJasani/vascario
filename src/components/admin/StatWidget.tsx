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
                "border-2 border-[#2A2A2A] bg-[#0D0D0D] p-6 flex flex-col justify-between min-h-[160px] group hover:border-[#BAFF00]/30 transition-colors",
                className
            )}
        >
            {/* Label */}
            <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-[#666] tracking-[0.2em] uppercase">
                    {label}
                </span>
                <div
                    className="w-2 h-2"
                    style={{ backgroundColor: accentColor }}
                />
            </div>

            {/* Value */}
            <div>
                <p
                    className="font-mono text-3xl font-bold tracking-[-0.02em]"
                    style={{ color: accentColor }}
                >
                    {value}
                </p>
                <div className="flex items-center gap-3 mt-2">
                    {sublabel && (
                        <span className="font-mono text-[10px] text-[#666] tracking-[0.1em] uppercase">
                            {sublabel}
                        </span>
                    )}
                    {trend && (
                        <span
                            className={cn(
                                "font-mono text-[10px] tracking-[0.1em] font-bold",
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
