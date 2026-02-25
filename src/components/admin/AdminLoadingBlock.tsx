export function AdminLoadingBlock() {
  return (
    <div className="border-2 border-[#2A2A2A] bg-[#0D0D0D] flex items-center justify-center py-10 md:py-14">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#BAFF00] border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-[10px] text-[#666] tracking-[0.15em] uppercase">
          Loading…
        </p>
      </div>
    </div>
  );
}
