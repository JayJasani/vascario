export default function LookbookLoading() {
  return (
    <main className="min-h-screen bg-[var(--vsc-cream)]">
      <div className="fixed top-0 left-0 right-0 h-[73px] bg-[var(--vsc-white)]/90 border-b border-[var(--vsc-gray-200)] z-50" />
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-20">
        <div className="space-y-4">
          <div className="h-3 bg-[var(--vsc-gray-200)] w-24" />
          <div className="h-16 md:h-24 bg-[var(--vsc-gray-200)] w-3/4" />
          <div className="h-4 bg-[var(--vsc-gray-200)] w-64" />
        </div>
      </section>
      <section className="px-6 md:px-12 lg:px-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          <div className="md:col-span-7 aspect-[4/5] md:aspect-square bg-[var(--vsc-gray-200)]" />
          <div className="md:col-span-5 aspect-square bg-[var(--vsc-gray-200)]" />
          <div className="md:col-span-5 aspect-square bg-[var(--vsc-gray-200)]" />
          <div className="md:col-span-7 aspect-[4/5] md:aspect-square bg-[var(--vsc-gray-200)]" />
        </div>
      </section>
    </main>
  );
}
