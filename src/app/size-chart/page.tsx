"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import {
  MENS_SIZE_DATA,
  WOMENS_REGULAR_SIZES,
  WOMENS_PLUS_SIZES,
  INTERNATIONAL_SIZES,
} from "@/lib/size-chart-data";

export default function SizeChartPage() {
  const [gender, setGender] = useState<"men" | "women">("men");
  const [unit, setUnit] = useState<"in" | "cm">("in");

  return (
    <main className="min-h-screen bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)]">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 lg:px-40 max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-10 md:mb-14">
          <p
            className="text-[10px] text-[var(--vsc-accent)] uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Size Guide
          </p>

          {/* Gender Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Category:
            </span>
            <div className="relative inline-flex bg-[var(--vsc-gray-200)] rounded-full p-1 min-w-fit">
              {/* Sliding indicator */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-white border border-[var(--vsc-gray-300)] transition-all duration-200 ease-out"
                style={{
                  width: gender === "men" ? "calc(50% - 4px)" : "calc(50% - 6px)",
                  left: gender === "men" ? "4px" : "calc(52% - 6px)",
                }}
              />
              {/* Buttons */}
              <button
                onClick={() => setGender("men")}
                className={`relative z-10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors whitespace-nowrap ${
                  gender === "men"
                    ? "text-[var(--vsc-gray-900)]"
                    : "text-[var(--vsc-gray-600)]"
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Men&apos;s
              </button>
              <button
                onClick={() => setGender("women")}
                className={`relative z-10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors whitespace-nowrap ${
                  gender === "women"
                    ? "text-[var(--vsc-gray-900)]"
                    : "text-[var(--vsc-gray-600)]"
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Women&apos;s
              </button>
            </div>
          </div>

          <h1
            className="text-section text-[var(--vsc-gray-900)] mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {gender === "men" ? "Men's Tops" : "Women's Tops"}
          </h1>
          <p
            className="text-xs md:text-sm text-[var(--vsc-gray-400)] uppercase tracking-[0.2em] mb-6"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            The measurements on the size chart are body measurements. Find your correct size in the chart below. Scroll horizontally to see more sizes.
          </p>

          {/* Unit Toggle */}
          <div className="flex items-center gap-4">
            <span
              className="text-[10px] text-[var(--vsc-gray-600)] uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Unit:
            </span>
            <div className="relative inline-flex bg-[var(--vsc-gray-200)] rounded-full p-1">
              {/* Sliding indicator */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-white border border-[var(--vsc-gray-300)] transition-all duration-200 ease-out"
                style={{
                  width: "calc(50% - 4px)",
                  left: unit === "in" ? "4px" : "calc(50% + 2px)",
                }}
              />
              {/* Buttons */}
              <button
                onClick={() => setUnit("in")}
                className={`relative z-10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                  unit === "in"
                    ? "text-[var(--vsc-gray-900)]"
                    : "text-[var(--vsc-gray-600)]"
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                in
              </button>
              <button
                onClick={() => setUnit("cm")}
                className={`relative z-10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                  unit === "cm"
                    ? "text-[var(--vsc-gray-900)]"
                    : "text-[var(--vsc-gray-600)]"
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                cm
              </button>
            </div>
          </div>
        </header>

        {/* Men's Size Chart */}
        {gender === "men" && (
          <div className="mb-16">
            <h2
              className="text-subsection text-[var(--vsc-gray-900)] mb-6"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Size Chart
            </h2>

            <div className="overflow-x-auto no-scrollbar">
              <div className="inline-block min-w-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[var(--vsc-gray-900)]">
                      <th
                        className="text-left py-4 px-4 text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-900)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        Size
                      </th>
                      {MENS_SIZE_DATA.sizes.map((size) => (
                        <th
                          key={size}
                          className="text-center py-4 px-3 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-900)] min-w-[80px]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          {size}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--vsc-gray-200)]">
                      <td
                        className="py-4 px-4 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-600)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        Chest ({unit})
                      </td>
                      {MENS_SIZE_DATA.chest[unit].map((value, idx) => (
                        <td
                          key={idx}
                          className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-[var(--vsc-gray-200)]">
                      <td
                        className="py-4 px-4 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-600)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        Waist ({unit})
                      </td>
                      {MENS_SIZE_DATA.waist[unit].map((value, idx) => (
                        <td
                          key={idx}
                          className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-[var(--vsc-gray-200)]">
                      <td
                        className="py-4 px-4 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-600)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        Hip ({unit})
                      </td>
                      {MENS_SIZE_DATA.hip[unit].map((value, idx) => (
                        <td
                          key={idx}
                          className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b-2 border-[var(--vsc-gray-900)]">
                      <td
                        className="py-4 px-4 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-600)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                      >
                        Height ({unit === "in" ? "in" : "cm"})
                      </td>
                      {MENS_SIZE_DATA.height[unit].map((value, idx) => (
                        <td
                          key={idx}
                          className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Women's Size Charts */}
        {gender === "women" && (
          <>
            {/* Regular Sizes */}
            <div className="mb-12">
              <h2
                className="text-subsection text-[var(--vsc-gray-900)] mb-6"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Size Chart (XXS - XXL)
              </h2>

              <div className="overflow-x-auto no-scrollbar">
                <div className="inline-block min-w-full">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[var(--vsc-gray-900)]">
                        <th
                          className="text-left py-4 px-4 text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-900)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Size
                        </th>
                        {WOMENS_REGULAR_SIZES.sizes.map((size) => (
                          <th
                            key={size}
                            className="text-center py-4 px-3 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-900)] min-w-[80px]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {size}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--vsc-gray-200)]">
                        <td
                          className="py-4 px-4 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-600)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Bust ({unit})
                        </td>
                        {WOMENS_REGULAR_SIZES.bust[unit].map((value, idx) => (
                          <td
                            key={idx}
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-[var(--vsc-gray-200)]">
                        <td
                          className="py-4 px-4 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-600)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Waist ({unit})
                        </td>
                        {WOMENS_REGULAR_SIZES.waist[unit].map((value, idx) => (
                          <td
                            key={idx}
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b-2 border-[var(--vsc-gray-900)]">
                        <td
                          className="py-4 px-4 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-600)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Hip ({unit})
                        </td>
                        {WOMENS_REGULAR_SIZES.hip[unit].map((value, idx) => (
                          <td
                            key={idx}
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Plus Sizes */}
            <div className="mb-12">
              <h2
                className="text-subsection text-[var(--vsc-gray-900)] mb-6"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Size Chart (0X - 4X)
              </h2>

              <div className="overflow-x-auto no-scrollbar">
                <div className="inline-block min-w-full">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[var(--vsc-gray-900)]">
                        <th
                          className="text-left py-4 px-4 text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-900)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Size
                        </th>
                        {WOMENS_PLUS_SIZES.sizes.map((size) => (
                          <th
                            key={size}
                            className="text-center py-4 px-3 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-900)] min-w-[80px]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {size}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--vsc-gray-200)]">
                        <td
                          className="py-4 px-4 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-600)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Bust ({unit})
                        </td>
                        {WOMENS_PLUS_SIZES.bust[unit].map((value, idx) => (
                          <td
                            key={idx}
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-[var(--vsc-gray-200)]">
                        <td
                          className="py-4 px-4 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-600)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Waist ({unit})
                        </td>
                        {WOMENS_PLUS_SIZES.waist[unit].map((value, idx) => (
                          <td
                            key={idx}
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b-2 border-[var(--vsc-gray-900)]">
                        <td
                          className="py-4 px-4 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-600)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Hip ({unit})
                        </td>
                        {WOMENS_PLUS_SIZES.hip[unit].map((value, idx) => (
                          <td
                            key={idx}
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* International Size Conversion */}
            <div className="mb-16">
              <h2
                className="text-subsection text-[var(--vsc-gray-900)] mb-6"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                International Size Conversion
              </h2>

              <div className="overflow-x-auto no-scrollbar">
                <div className="inline-block min-w-full">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[var(--vsc-gray-900)]">
                        <th
                          className="text-left py-4 px-4 text-xs uppercase tracking-[0.2em] text-[var(--vsc-gray-900)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          Size
                        </th>
                        <th
                          className="text-center py-4 px-3 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-900)] min-w-[80px]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          US
                        </th>
                        <th
                          className="text-center py-4 px-3 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-900)] min-w-[80px]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          UK
                        </th>
                        <th
                          className="text-center py-4 px-3 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-900)] min-w-[80px]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          EU
                        </th>
                        <th
                          className="text-center py-4 px-3 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-900)] min-w-[80px]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          FR
                        </th>
                        <th
                          className="text-center py-4 px-3 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-900)] min-w-[80px]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          IT
                        </th>
                        <th
                          className="text-center py-4 px-3 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-900)] min-w-[80px]"
                          style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                          KR
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {INTERNATIONAL_SIZES.sizes.map((size, idx) => (
                        <tr
                          key={size}
                          className={`border-b ${idx === INTERNATIONAL_SIZES.sizes.length - 1 ? "border-b-2 border-[var(--vsc-gray-900)]" : "border-[var(--vsc-gray-200)]"}`}
                        >
                          <td
                            className="py-4 px-4 text-xs uppercase tracking-[0.15em] text-[var(--vsc-gray-600)] sticky left-0 bg-[var(--vsc-cream)] z-10"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {size}
                          </td>
                          <td
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {INTERNATIONAL_SIZES.us[idx] || "-"}
                          </td>
                          <td
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {INTERNATIONAL_SIZES.uk[idx] || "-"}
                          </td>
                          <td
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {INTERNATIONAL_SIZES.eu[idx] || "-"}
                          </td>
                          <td
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {INTERNATIONAL_SIZES.fr[idx] || "-"}
                          </td>
                          <td
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {INTERNATIONAL_SIZES.it[idx] || "-"}
                          </td>
                          <td
                            className="py-4 px-3 text-xs text-center text-[var(--vsc-gray-700)]"
                            style={{ fontFamily: "var(--font-space-mono)" }}
                          >
                            {INTERNATIONAL_SIZES.kr[idx] || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Fit Tips */}
          <section>
            <h2
              className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-4 uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Fit Tips
            </h2>
            <div
              className="space-y-4 text-sm leading-relaxed text-[var(--vsc-gray-700)]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {gender === "men" ? (
                <>
                  <p>
                    <strong className="text-[var(--vsc-gray-900)]">Tall Tops Sizes (6&apos; – 6&apos;5&quot;/183-196cm):</strong>{" "}
                    1.75&quot;/4.5cm longer in length than regular tops. Sleeve length is adjusted proportionately depending on silhouette. Tall sizes are only available for select styles.
                  </p>
                  <p>
                    If you&apos;re on the borderline between two sizes, order the smaller size for a tighter fit or the larger size for a looser fit. If your measurements for chest and waist correspond to two different suggested sizes, order the size indicated by your chest measurement.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong className="text-[var(--vsc-gray-900)]">Tall Top Sizes (5&apos;8&quot; – 6&apos;/173-183cm):</strong>{" "}
                    1.75&quot;/4.5cm longer in length than regular tops. Sleeve length is adjusted proportionately depending on silhouette. Tall Sizes are only available for select styles.
                  </p>
                  <p>
                    If you&apos;re on the borderline between two sizes, order the smaller size for a tighter fit or the larger size for a looser fit. If your measurements for bust and waist correspond to two different suggested sizes, order the size indicated by your bust measurement.
                  </p>
                </>
              )}
            </div>
          </section>

          {/* How To Measure */}
          <section>
            <h2
              className="text-base md:text-lg text-[var(--vsc-gray-900)] mb-4 uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              How To Measure
            </h2>
            <div
              className="space-y-6 text-sm leading-relaxed text-[var(--vsc-gray-700)]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {gender === "men" ? (
                <>
                  <div>
                    <h3 className="text-[var(--vsc-gray-900)] font-semibold mb-2 uppercase tracking-[0.1em]">
                      CHEST:
                    </h3>
                    <p>
                      Measure around the fullest part of your chest, keeping the measuring tape horizontal.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[var(--vsc-gray-900)] font-semibold mb-2 uppercase tracking-[0.1em]">
                      WAIST:
                    </h3>
                    <p>
                      Measure around the narrowest part (typically where your body bends side to side), keeping the tape horizontal.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[var(--vsc-gray-900)] font-semibold mb-2 uppercase tracking-[0.1em]">
                      HIPS:
                    </h3>
                    <p>
                      Measure around the fullest part of your hips, keeping the tape horizontal.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-[var(--vsc-gray-900)] font-semibold mb-2 uppercase tracking-[0.1em]">
                      BUST:
                    </h3>
                    <p>
                      Measure around the fullest part of your bust, keeping the measuring tape horizontal.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[var(--vsc-gray-900)] font-semibold mb-2 uppercase tracking-[0.1em]">
                      WAIST:
                    </h3>
                    <p>
                      Measure around the narrowest part (typically where your body bends side to side), keeping the tape horizontal.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[var(--vsc-gray-900)] font-semibold mb-2 uppercase tracking-[0.1em]">
                      HIPS:
                    </h3>
                    <p>
                      Measure around the fullest part of your hips, keeping the tape horizontal.
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
