export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--vsc-white)]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-2 border-[var(--vsc-gray-900)] border-t-transparent rounded-full animate-spin"
          aria-hidden
        />
        <span
          className="text-[10px] uppercase tracking-[0.2em] text-[var(--vsc-gray-500)]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Loading…
        </span>
      </div>
    </div>
  );
}
