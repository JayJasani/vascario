export default function CollectionLoading() {
  return (
    <main className="min-h-screen">
      <div className="fixed top-0 left-0 right-0 h-[73px] bg-[var(--vsc-white)]/90 border-b border-[var(--vsc-gray-200)] z-50" />
      <section className="pt-28 md:pt-36 pb-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="animate-pulse columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="break-inside-avoid mb-4 sm:mb-6">
              <div className="aspect-[3/4] bg-[var(--vsc-gray-200)]" />
              <div className="bg-[var(--vsc-gray-900)] px-4 py-3 mt-0">
                <div className="h-4 bg-[var(--vsc-gray-700)] w-2/3 mb-2" />
                <div className="h-4 bg-[var(--vsc-gray-700)] w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
