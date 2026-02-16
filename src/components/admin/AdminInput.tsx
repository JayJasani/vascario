import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    hint?: string;
}

const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
    ({ label, hint, className, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#999] tracking-[0.2em] uppercase font-bold">
                    {label}
                    {hint && (
                        <span className="ml-3 font-normal text-[#666]">// {hint}</span>
                    )}
                </label>
                <input
                    ref={ref}
                    className={cn(
                        "w-full bg-[#0D0D0D] border-2 border-[#2A2A2A] text-[#F5F5F0] font-mono text-sm px-6 py-4 tracking-[0.05em] placeholder:text-[#333] placeholder:uppercase focus:border-[#BAFF00] focus:outline-none transition-colors",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

AdminInput.displayName = "AdminInput";

interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    hint?: string;
}

const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
    ({ label, hint, className, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#999] tracking-[0.2em] uppercase font-bold">
                    {label}
                    {hint && (
                        <span className="ml-3 font-normal text-[#666]">// {hint}</span>
                    )}
                </label>
                <textarea
                    ref={ref}
                    className={cn(
                        "w-full bg-[#0D0D0D] border-2 border-[#2A2A2A] text-[#F5F5F0] font-mono text-sm px-6 py-4 tracking-[0.05em] placeholder:text-[#333] placeholder:uppercase focus:border-[#BAFF00] focus:outline-none transition-colors resize-y min-h-[120px]",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

AdminTextarea.displayName = "AdminTextarea";

interface AdminSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
    label: string;
    hint?: string;
    options: { value: string; label: string }[];
}

const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
    ({ label, hint, className, options, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <label className="block font-mono text-[10px] text-[#999] tracking-[0.2em] uppercase font-bold">
                    {label}
                    {hint && (
                        <span className="ml-3 font-normal text-[#666]">// {hint}</span>
                    )}
                </label>
                <select
                    ref={ref}
                    className={cn(
                        "w-full bg-[#0D0D0D] border-2 border-[#2A2A2A] text-[#F5F5F0] font-mono text-sm px-6 py-4 tracking-[0.05em] focus:border-[#BAFF00] focus:outline-none transition-colors cursor-pointer appearance-none",
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
);

AdminSelect.displayName = "AdminSelect";

export { AdminInput, AdminTextarea, AdminSelect };
