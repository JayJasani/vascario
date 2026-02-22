"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type PrefetchLinkProps = ComponentProps<typeof Link>;

export function PrefetchLink({ href, prefetch = true, onMouseEnter, onPointerDown, ...props }: PrefetchLinkProps) {
  const router = useRouter();
  const hrefStr = typeof href === "string" ? href : href.pathname ?? "";

  const handlePrefetch = () => {
    if (hrefStr.startsWith("/")) router.prefetch(hrefStr);
  };

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onMouseEnter={(e) => {
        handlePrefetch();
        onMouseEnter?.(e);
      }}
      onPointerDown={(e) => {
        handlePrefetch();
        onPointerDown?.(e);
      }}
      {...props}
    />
  );
}
