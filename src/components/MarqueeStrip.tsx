export function MarqueeStrip() {
    const text =
        "LIMITED DROP  //  VASCARIO SEASON 1  //  FREE SHIPPING WORLDWIDE  //  EMBROIDERED LUXURY  //  WEAR THE CULTURE  //  "

    return (
        <div className="relative overflow-hidden bg-[var(--vsc-accent)] py-3 select-none">
            <div className="marquee-track">
                {/* Duplicate content for seamless loop */}
                {[...Array(4)].map((_, i) => (
                    <span
                        key={i}
                        className="text-[var(--vsc-white)] text-xs md:text-sm font-bold uppercase tracking-[0.2em] whitespace-nowrap px-4"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        {text}
                    </span>
                ))}
            </div>
        </div>
    )
}
