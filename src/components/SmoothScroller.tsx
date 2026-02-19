"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"

export function SmoothScroller({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null)

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            // Prevent scroll position restoration
            syncTouch: false,
        })

        lenisRef.current = lenis
        
        // Expose Lenis instance globally for ScrollToTop component
        if (typeof window !== "undefined") {
            (window as any).lenis = lenis
        }

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            if (typeof window !== "undefined") {
                delete (window as any).lenis
            }
            lenis.destroy()
        }
    }, [])

    return <>{children}</>
}
