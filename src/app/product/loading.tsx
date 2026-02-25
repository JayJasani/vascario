export default function ProductLoading() {
  return (
    <main className="min-h-screen">
      {/* Navbar placeholder */}
      <div className="fixed top-0 left-0 right-0 h-[73px] bg-[var(--vsc-white)]/90 border-b border-[var(--vsc-gray-200)] z-50" />
      {/* Product skeleton */}
      <section className="pt-28 md:pt-36 pb-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Image placeholder */}
          <div className="md:col-span-5 aspect-[4/5] bg-[var(--vsc-gray-200)]" />
          {/* Content placeholder */}
          <div className="md:col-span-7 space-y-4">
            <div className="h-8 bg-[var(--vsc-gray-200)] w-3/4" />
            <div className="h-6 bg-[var(--vsc-gray-200)] w-1/4" />
            <div className="h-px bg-[var(--vsc-gray-200)]" />
            <div className="space-y-2">
              <div className="h-4 bg-[var(--vsc-gray-200)] w-full" />
              <div className="h-4 bg-[var(--vsc-gray-200)] w-5/6" />
              <div className="h-4 bg-[var(--vsc-gray-200)] w-4/6" />
            </div>
            <div className="flex gap-2 pt-4">
              <div className="h-10 w-10 bg-[var(--vsc-gray-200)]" />
              <div className="h-10 w-10 bg-[var(--vsc-gray-200)]" />
              <div className="h-10 w-10 bg-[var(--vsc-gray-200)]" />
            </div>
            <div className="h-12 bg-[var(--vsc-gray-200)] w-full mt-8" />
          </div>
        </div>
      </section>
    </main>
  );
}
