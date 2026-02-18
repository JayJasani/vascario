export function AdminLoadingBlock() {
  return (
    <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] flex items-center justify-center py-16 md:py-24">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#BAFF00] border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-xs text-[#666] tracking-[0.2em] uppercase">
          Loading…
        </p>
      </div>
    </div>
  );
}
