"use client";

import { useRef, useEffect } from "react";

export interface ReviewItem {
    id: string;
    authorName: string;
    text: string;
    rating: number | null;
}

interface ReviewsSectionProps {
    reviews: ReviewItem[];
}

// Star SVG component
function StarIcon({ filled = false, className = "" }: { filled?: boolean; className?: string }) {
    return (
        <svg
            className={className}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8 0L9.79611 5.52786L15.6085 5.52786L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786L6.20389 5.52786L8 0Z"
                fill={filled ? "#FFD700" : "#4A4A4A"}
                fillOpacity={filled ? 1 : 0.3}
            />
        </svg>
    );
}

// Star rating component
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1 mb-4" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= rating} className="w-4 h-4 md:w-5 md:h-5" />
            ))}
        </div>
    );
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1 }
        );
        section.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => section.querySelectorAll(".reveal").forEach((el) => observer.unobserve(el));
    }, []);

    if (!reviews.length) return null;

    return (
        <section id="reviews" ref={sectionRef} className="pt-12 sm:pt-24 md:pt-32 pb-12 sm:pb-24 md:pb-32">
            <div className="px-6 md:px-12 lg:px-20 mb-8 sm:mb-14">
                <span
                    className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] block mb-3 reveal"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    [ 003 ] Reviews
                </span>
                <h2
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--vsc-gray-900)] leading-tight reveal"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                    What people say
                </h2>
            </div>

            <div className="px-6 md:px-12 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="reveal border border-[var(--vsc-gray-700)] bg-[var(--vsc-gray-950)] p-6 md:p-8 flex flex-col hover:border-[var(--vsc-gray-600)] transition-colors"
                        >
                            {review.rating != null && <StarRating rating={review.rating} />}
                            <blockquote
                                className="text-[var(--vsc-gray-300)] text-sm md:text-base leading-relaxed flex-1 mb-6"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                &ldquo;{review.text}&rdquo;
                            </blockquote>
                            <cite className="font-bold text-[var(--vsc-gray-100)] text-sm not-italic" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                — {review.authorName}
                            </cite>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
