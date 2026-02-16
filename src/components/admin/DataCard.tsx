import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

interface OrderCardItem {
    productName: string;
    size: string;
    color: string;
    quantity: number;
}

interface DataCardProps {
    orderId: string;
    customerName: string;
    customerEmail: string;
    status: "PENDING" | "PAID" | "IN_PRODUCTION" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalAmount: string;
    items: OrderCardItem[];
    createdAt: string;
    className?: string;
    children?: React.ReactNode; // For action buttons
}

export function DataCard({
    orderId,
    customerName,
    customerEmail,
    status,
    totalAmount,
    items,
    createdAt,
    className,
    children,
}: DataCardProps) {
    return (
        <div
            className={cn(
                "border-2 border-[#2A2A2A] bg-[#0D0D0D] flex flex-col group hover:border-[#BAFF00]/30 transition-colors",
                className
            )}
        >
            {/* Header */}
            <div className="px-6 py-4 border-b-2 border-[#2A2A2A] flex items-center justify-between">
                <div>
                    <span className="font-mono text-[10px] text-[#666] tracking-[0.15em]">
                        ORDER //
                    </span>
                    <span className="font-mono text-xs text-[#BAFF00] tracking-[0.1em] ml-2">
                        {orderId.slice(0, 8).toUpperCase()}
                    </span>
                </div>
                <StatusBadge status={status} />
            </div>

            {/* Customer info */}
            <div className="px-6 py-4 border-b border-[#1A1A1A]">
                <p className="font-mono text-sm text-[#F5F5F0] font-bold uppercase tracking-[0.05em]">
                    {customerName}
                </p>
                <p className="font-mono text-[10px] text-[#666] tracking-[0.1em] mt-1">
                    {customerEmail}
                </p>
            </div>

            {/* Order items */}
            <div className="px-6 py-4 flex-1 space-y-3">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0"
                    >
                        <div>
                            <p className="font-mono text-xs text-[#F5F5F0] tracking-[0.05em] uppercase">
                                {item.productName}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="font-mono text-[10px] text-[#BAFF00] tracking-[0.1em]">
                                    {item.size}
                                </span>
                                <span className="text-[#2A2A2A]">│</span>
                                <div className="flex items-center gap-1.5">
                                    <div
                                        className="w-2.5 h-2.5 border border-[#2A2A2A]"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="font-mono text-[10px] text-[#666] tracking-[0.1em] uppercase">
                                        {item.color}
                                    </span>
                                </div>
                                <span className="text-[#2A2A2A]">│</span>
                                <span className="font-mono text-[10px] text-[#666] tracking-[0.1em]">
                                    QTY:{item.quantity}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t-2 border-[#2A2A2A] flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#666] tracking-[0.1em]">
                    {createdAt}
                </span>
                <span className="font-mono text-sm text-[#F5F5F0] font-bold tracking-[0.05em]">
                    ₹{totalAmount}
                </span>
            </div>

            {/* Action buttons */}
            {children && (
                <div className="px-6 py-4 border-t border-[#1A1A1A] flex gap-3 flex-wrap">
                    {children}
                </div>
            )}
        </div>
    );
}
