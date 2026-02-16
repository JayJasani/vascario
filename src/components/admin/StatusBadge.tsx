import { cn } from "@/lib/utils";

type Status =
    | "PENDING"
    | "PAID"
    | "IN_PRODUCTION"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

const statusConfig: Record<Status, { bg: string; text: string; label: string }> = {
    PENDING: {
        bg: "bg-[#FFD600]/15",
        text: "text-[#FFD600]",
        label: "PENDING",
    },
    PAID: {
        bg: "bg-[#BAFF00]/15",
        text: "text-[#BAFF00]",
        label: "PAID",
    },
    IN_PRODUCTION: {
        bg: "bg-[#00BFFF]/15",
        text: "text-[#00BFFF]",
        label: "IN PRODUCTION",
    },
    SHIPPED: {
        bg: "bg-[#00E5FF]/15",
        text: "text-[#00E5FF]",
        label: "SHIPPED",
    },
    DELIVERED: {
        bg: "bg-[#F5F5F0]/15",
        text: "text-[#F5F5F0]",
        label: "DELIVERED",
    },
    CANCELLED: {
        bg: "bg-[#FF3333]/15",
        text: "text-[#FF3333]",
        label: "CANCELLED",
    },
};

interface StatusBadgeProps {
    status: Status;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                "inline-flex items-center gap-2 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.2em] uppercase border",
                config.bg,
                config.text,
                "border-current/20",
                className
            )}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {config.label}
        </span>
    );
}
