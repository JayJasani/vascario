import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type AdminButtonVariant = "primary" | "secondary" | "destructive" | "ghost";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: AdminButtonVariant;
    size?: "default" | "sm";
}

const variantStyles: Record<AdminButtonVariant, string> = {
    primary:
        "bg-[#BAFF00] text-black border-[#BAFF00] hover:bg-transparent hover:text-[#BAFF00]",
    secondary:
        "bg-transparent text-[#F5F5F0] border-[#2A2A2A] hover:border-[#BAFF00] hover:text-[#BAFF00]",
    destructive:
        "bg-[#FF3333] text-black border-[#FF3333] hover:bg-transparent hover:text-[#FF3333]",
    ghost:
        "bg-transparent text-[#999] border-transparent hover:text-[#BAFF00] hover:border-[#2A2A2A]",
};

const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
    ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "font-mono font-bold tracking-[0.2em] uppercase border-2 transition-all cursor-pointer",
                    size === "default" ? "px-8 py-4 text-xs" : "px-4 py-2 text-[10px]",
                    variantStyles[variant],
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

AdminButton.displayName = "AdminButton";

export { AdminButton };
export type { AdminButtonProps };
