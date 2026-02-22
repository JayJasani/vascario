"use client";

import { useState, useRef, useEffect } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminLoadingBlock } from "@/components/admin/AdminLoadingBlock";
import { updateStaticContent } from "../actions";
import useSWR from "swr";
import Image from "next/image";

interface StaticContentItem {
    id: string;
    key: string;
    url: string;
    type: "video" | "image";
    redirectUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}

interface MessageState {
    type: "success" | "error" | null;
    text: string;
}

const STATIC_CONTENT_ITEMS = [
    { key: "onboard1", label: "Onboard Video 1", type: "video" as const, description: "Hero section background video" },
    { key: "onboard2", label: "Onboard Video 2", type: "video" as const, description: "Editorial section video" },
    { key: "tshirtCloseup", label: "T-Shirt Closeup Image", type: "image" as const, description: "Editorial section closeup image" },
    { key: "making_process", label: "Making Process", type: "video" as const, description: "Making process video" },
];

async function fetchStaticContent(): Promise<StaticContentItem[]> {
    const res = await fetch("/admin/static-content/api");
    return res.json();
}

export default function StaticContentPage() {
    const { data: contentItems, mutate } = useSWR("admin-static-content", fetchStaticContent, {
        refreshInterval: 10000,
    });
    const [uploading, setUploading] = useState<Record<string, boolean>>({});
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [redirectUrls, setRedirectUrls] = useState<Record<string, string>>({});
    const [messages, setMessages] = useState<Record<string, MessageState>>({});
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    // Initialize redirectUrls when contentItems loads
    useEffect(() => {
        if (contentItems) {
            const initialRedirectUrls: Record<string, string> = {};
            contentItems.forEach((item) => {
                if (item.redirectUrl) {
                    initialRedirectUrls[item.key] = item.redirectUrl;
                }
            });
            setRedirectUrls((prev) => ({ ...prev, ...initialRedirectUrls }));
        }
    }, [contentItems]);

    const getContentForKey = (key: string): StaticContentItem | undefined => {
        return contentItems?.find((item) => item.key === key);
    };

    const showMessage = (key: string, type: "success" | "error", text: string) => {
        setMessages((prev) => ({ ...prev, [key]: { type, text } }));
        setTimeout(() => {
            setMessages((prev) => {
                const newMessages = { ...prev };
                delete newMessages[key];
                return newMessages;
            });
        }, 5000);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    async function handleFileUpload(key: string, type: "video" | "image") {
        const input = fileInputRefs.current[key];
        if (!input || !input.files || input.files.length === 0) return;

        const file = input.files[0];
        
        // Validate file size (max 50MB for videos, 10MB for images)
        const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showMessage(key, "error", `File too large. Max size: ${formatFileSize(maxSize)}`);
            return;
        }

        setUploading((prev) => ({ ...prev, [key]: true }));
        setUploadProgress((prev) => ({ ...prev, [key]: 0 }));

        try {
            // Upload file to Firebase Storage
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);
            uploadFormData.append("key", key);

            // Simulate progress (Firebase Storage doesn't provide progress events in this setup)
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => ({
                    ...prev,
                    [key]: Math.min((prev[key] || 0) + 10, 90),
                }));
            }, 200);

            const uploadResponse = await fetch("/admin/static-content/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            clearInterval(progressInterval);
            setUploadProgress((prev) => ({ ...prev, [key]: 100 }));

            if (!uploadResponse.ok) {
                const error = await uploadResponse.json();
                throw new Error(error.error || "Upload failed");
            }

            const uploadData = await uploadResponse.json();

            // Save to Firestore
            setSaving((prev) => ({ ...prev, [key]: true }));
            const currentRedirectUrl = redirectUrls[key] || getContentForKey(key)?.redirectUrl || null;
            await updateStaticContent(key, uploadData.url, uploadData.type, currentRedirectUrl || null);

            // Reset file input
            if (input) {
                input.value = "";
            }

            // Show success message
            showMessage(key, "success", `${type === "video" ? "Video" : "Image"} uploaded successfully!`);

            // Refresh data
            mutate();
        } catch (error) {
            console.error("Upload error:", error);
            showMessage(
                key,
                "error",
                error instanceof Error ? error.message : "Failed to upload file"
            );
        } finally {
            setUploading((prev) => ({ ...prev, [key]: false }));
            setSaving((prev) => ({ ...prev, [key]: false }));
            setTimeout(() => {
                setUploadProgress((prev) => {
                    const newProgress = { ...prev };
                    delete newProgress[key];
                    return newProgress;
                });
            }, 1000);
        }
    }

    if (!contentItems) {
        return <AdminLoadingBlock />;
    }

    const totalItems = STATIC_CONTENT_ITEMS.length;
    const uploadedItems = contentItems?.filter((item) => item.url).length || 0;
    const itemsWithRedirect = contentItems?.filter((item) => item.redirectUrl).length || 0;

    return (
        <div className="space-y-8">
            {/* ── PAGE HEADER ── */}
            <div className="space-y-4">
                <div className="flex items-end justify-between">
                    <div>
                        <h2
                            className="text-2xl font-bold tracking-[-0.03em] uppercase"
                            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                        >
                            Static Content
                        </h2>
                        <p className="font-mono text-xs text-[#666] tracking-[0.15em] uppercase mt-1">
                            // Manage onboarding videos and images
                        </p>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] p-4 rounded-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-[#666] uppercase tracking-[0.15em]">
                                Total Items
                            </span>
                            <span className="text-xl font-bold text-[#BAFF00]">
                                {totalItems}
                            </span>
                        </div>
                    </div>
                    <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] p-4 rounded-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-[#666] uppercase tracking-[0.15em]">
                                Uploaded
                            </span>
                            <span className="text-xl font-bold text-[#BAFF00]">
                                {uploadedItems}/{totalItems}
                            </span>
                        </div>
                    </div>
                    <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] p-4 rounded-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-[#666] uppercase tracking-[0.15em]">
                                With Redirect
                            </span>
                            <span className="text-xl font-bold text-[#BAFF00]">
                                {itemsWithRedirect}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CONTENT ITEMS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STATIC_CONTENT_ITEMS.map((item) => {
                    const existingContent = getContentForKey(item.key);
                    const isUploading = uploading[item.key] || false;
                    const isSaving = saving[item.key] || false;
                    const isLoading = isUploading || isSaving;

                    const message = messages[item.key];
                    const progress = uploadProgress[item.key];

                    return (
                        <div
                            key={item.key}
                            className="bg-[#0D0D0D] border border-[#333] rounded-lg p-6 hover:border-[#444] transition-colors flex flex-col"
                        >
                            {/* Status Message */}
                            {message && (
                                <div
                                    className={`mb-4 p-3 rounded-lg border ${
                                        message.type === "success"
                                            ? "bg-[#BAFF00]/10 border-[#BAFF00]/30 text-[#BAFF00]"
                                            : "bg-[#FF3333]/10 border-[#FF3333]/30 text-[#FF3333]"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">
                                            {message.type === "success" ? "✓" : "✕"}
                                        </span>
                                        <p className="font-mono text-xs tracking-[0.1em]">
                                            {message.text}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Preview Section */}
                            <div className="mb-4">
                                <div className="relative aspect-video bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden group mb-3">
                                    {existingContent?.url ? (
                                        item.type === "video" ? (
                                            <video
                                                src={existingContent.url}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                playsInline
                                                autoPlay
                                                preload="metadata"
                                            />
                                        ) : (
                                            <Image
                                                src={existingContent.url}
                                                alt={item.label}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                loading="lazy"
                                            />
                                        )
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                            <div className="w-14 h-14 border-2 border-[#444] rounded-lg flex items-center justify-center bg-[#1A1A1A]">
                                                <span className="text-2xl text-[#666]">
                                                    {item.type === "video" ? "🎥" : "🖼️"}
                                                </span>
                                            </div>
                                            <span className="font-mono text-xs text-[#666] uppercase tracking-[0.15em]">
                                                No {item.type}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Upload Progress Overlay */}
                                    {isUploading && progress !== undefined && (
                                        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10 rounded-lg">
                                            <div className="text-center space-y-3 w-full px-4">
                                                <div className="w-full h-1.5 bg-[#333] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#BAFF00] transition-all duration-300 rounded-full"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <p className="font-mono text-xs text-[#BAFF00] uppercase tracking-[0.1em]">
                                                    {progress < 100 ? `Uploading... ${progress}%` : "Processing..."}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    {existingContent && !isLoading && (
                                        <div className="absolute top-2 right-2 bg-[#BAFF00] text-black px-2 py-1 rounded-md shadow-lg">
                                            <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold">
                                                ✓ Active
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                {existingContent?.url && (
                                    <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs text-[#999] uppercase tracking-[0.1em]">
                                                Type
                                            </span>
                                            <span className="font-mono text-xs text-[#BAFF00] uppercase font-semibold">
                                                {item.type === "video" ? "Video" : "Image"}
                                            </span>
                                        </div>
                                        {existingContent.redirectUrl && (
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-xs text-[#999] uppercase tracking-[0.1em]">
                                                    Clickable
                                                </span>
                                                <span className="font-mono text-xs text-[#BAFF00] uppercase font-semibold">
                                                    ✓ Enabled
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col space-y-4">
                                {/* Header */}
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex-1">
                                            <h3
                                                className="text-lg font-bold uppercase tracking-[-0.02em] mb-1"
                                                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                                            >
                                                {item.label}
                                            </h3>
                                            <p className="font-mono text-xs text-[#999] tracking-[0.1em]">
                                                {item.description}
                                            </p>
                                        </div>
                                        {isSaving && (
                                            <div className="flex items-center gap-1.5 text-[#BAFF00] px-2 py-1 bg-[#BAFF00]/10 rounded">
                                                <div className="w-1.5 h-1.5 bg-[#BAFF00] animate-pulse rounded-full" />
                                                <span className="font-mono text-[10px] uppercase tracking-[0.1em]">
                                                    Saving
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* URLs Display */}
                                    {existingContent?.url && (
                                        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-3 space-y-3">
                                            <div>
                                                <label className="font-mono text-[10px] text-[#999] uppercase tracking-[0.1em] block mb-1">
                                                    Content URL
                                                </label>
                                                <a
                                                    href={existingContent.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-mono text-[10px] text-[#BAFF00] hover:text-[#BAFF00]/80 break-all underline block hover:bg-[#BAFF00]/5 p-1.5 rounded transition-colors"
                                                >
                                                    {existingContent.url}
                                                </a>
                                            </div>
                                            {existingContent.redirectUrl && (
                                                <div>
                                                    <label className="font-mono text-[10px] text-[#999] uppercase tracking-[0.1em] block mb-1">
                                                        Redirect URL
                                                    </label>
                                                    <a
                                                        href={existingContent.redirectUrl || "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-mono text-[10px] text-[#BAFF00] hover:text-[#BAFF00]/80 break-all underline block hover:bg-[#BAFF00]/5 p-1.5 rounded transition-colors"
                                                    >
                                                        {existingContent.redirectUrl}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Redirect URL Input */}
                                <div className="space-y-2">
                                    <AdminInput
                                        key={`${item.key}-${existingContent?.updatedAt || 'new'}`}
                                        label="Redirect URL"
                                        hint="Optional redirect URL"
                                        type="url"
                                        placeholder="https://example.com"
                                        defaultValue={existingContent?.redirectUrl || ""}
                                        disabled={!existingContent || isLoading}
                                        onChange={(e) => {
                                            setRedirectUrls((prev) => ({
                                                ...prev,
                                                [item.key]: e.target.value,
                                            }));
                                        }}
                                        onBlur={async () => {
                                            if (existingContent) {
                                                const inputValue = redirectUrls[item.key];
                                                const newRedirectUrl = inputValue?.trim() || null;
                                                const currentRedirectUrl = existingContent.redirectUrl || null;
                                                
                                                if (newRedirectUrl !== currentRedirectUrl) {
                                                    if (newRedirectUrl && !/^https?:\/\/.+/.test(newRedirectUrl)) {
                                                        showMessage(item.key, "error", "Please enter a valid URL starting with http:// or https://");
                                                        return;
                                                    }

                                                    setSaving((prev) => ({ ...prev, [item.key]: true }));
                                                    try {
                                                        await updateStaticContent(
                                                            item.key,
                                                            existingContent.url,
                                                            existingContent.type,
                                                            newRedirectUrl
                                                        );
                                                        showMessage(item.key, "success", "Redirect URL updated!");
                                                        mutate();
                                                    } catch (error) {
                                                        console.error("Error updating redirect URL:", error);
                                                        showMessage(item.key, "error", "Failed to update redirect URL");
                                                    } finally {
                                                        setSaving((prev) => ({ ...prev, [item.key]: false }));
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    <p className="font-mono text-[10px] text-[#666] tracking-[0.1em] pl-1">
                                        Leave empty to disable. Must start with http:// or https://
                                    </p>
                                </div>

                                {/* Upload Section */}
                                <div className="space-y-2 mt-auto">
                                    <input
                                        ref={(el) => {
                                            fileInputRefs.current[item.key] = el;
                                        }}
                                        type="file"
                                        accept={item.type === "video" ? "video/*" : "image/*"}
                                        className="hidden"
                                        onChange={() => handleFileUpload(item.key, item.type)}
                                        disabled={isLoading}
                                    />
                                    <AdminButton
                                        onClick={() => fileInputRefs.current[item.key]?.click()}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading
                                            ? (isUploading ? "Uploading..." : "Saving...")
                                            : existingContent
                                            ? `Replace ${item.type === "video" ? "Video" : "Image"}`
                                            : `Upload ${item.type === "video" ? "Video" : "Image"}`}
                                    </AdminButton>
                                    <div className="flex items-center justify-center gap-2 text-xs">
                                        <span className="font-mono text-[#666] uppercase tracking-[0.1em]">
                                            Max:
                                        </span>
                                        <span className="font-mono text-[#BAFF00] font-semibold">
                                            {item.type === "video" ? "50 MB" : "10 MB"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
