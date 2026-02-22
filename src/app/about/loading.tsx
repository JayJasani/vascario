export default function AboutLoading() {
  return (
    <main className="min-h-screen bg-[var(--vsc-cream)]">
      <div className="fixed top-0 left-0 right-0 h-[73px] bg-[var(--vsc-white)]/90 border-b border-[var(--vsc-gray-200)] z-50" />
      <section className="pt-32 pb-24 px-6 md:px-12 lg:px-40 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-3 bg-[var(--vsc-gray-200)] w-16" />
          <div className="h-10 bg-[var(--vsc-gray-200)] w-48" />
          <div className="h-4 bg-[var(--vsc-gray-200)] w-72" />
          <div className="pt-8 space-y-3">
            <div className="h-4 bg-[var(--vsc-gray-200)] w-full" />
            <div className="h-4 bg-[var(--vsc-gray-200)] w-5/6" />
            <div className="h-4 bg-[var(--vsc-gray-200)] w-4/6" />
          </div>
        </div>
      </section>
    </main>
  );
}
