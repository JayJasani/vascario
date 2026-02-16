"use client"

import { useCart } from "@/context/CartContext"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

const stepVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -300 : 300,
        opacity: 0,
    }),
}

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart()
    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(1)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Form state
    const [shipping, setShipping] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        country: "",
    })

    const [payment, setPayment] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
        nameOnCard: "",
    })

    const goNext = () => {
        setDirection(1)
        setStep((s) => Math.min(s + 1, 3))
    }
    const goBack = () => {
        setDirection(-1)
        setStep((s) => Math.max(s - 1, 1))
    }

    const handlePlaceOrder = () => {
        const orderId = Math.floor(1000 + Math.random() * 9000)
        clearCart()
        router.push(`/order-success?order=${orderId}`)
    }

    if (!mounted) return null

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-[var(--vsc-cream)]">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-screen gap-8">
                    <p
                        className="text-2xl md:text-4xl font-bold text-[var(--vsc-gray-600)] uppercase tracking-[0.1em]"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        YOUR BAG IS EMPTY
                    </p>
                    <Link
                        href="/"
                        className="px-10 py-6 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        CONTINUE SHOPPING →
                    </Link>
                </div>
                <Footer />
            </main>
        )
    }

    const STEPS = [
        { num: "01", label: "SHIP" },
        { num: "02", label: "PAY" },
        { num: "03", label: "REVIEW" },
    ]

    return (
        <main className="min-h-screen bg-[var(--vsc-cream)]">
            <Navbar />

            <div className="pt-28 md:pt-36 pb-20 px-6 md:px-12 lg:px-20">
                {/* ===== TERMINAL TITLE ===== */}
                <div className="mb-12">
                    <h1
                        className="text-[var(--vsc-gray-900)] select-none"
                        style={{
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "clamp(3rem, 8vw, 7rem)",
                            lineHeight: 0.9,
                            letterSpacing: "-0.04em",
                            fontWeight: 700,
                            textTransform: "uppercase",
                        }}
                    >
                        CHECK
                        <span className="text-[var(--vsc-accent)]">OUT</span>
                    </h1>
                    <span
                        className="block mt-4 text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.3em]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        [ TERMINAL.VASCARIO ]
                    </span>
                </div>

                {/* ===== STEP PROGRESS BAR ===== */}
                <div className="flex items-center gap-0 mb-8 md:mb-16 border-2 md:border-4 border-[var(--vsc-gray-200)]">
                    {STEPS.map((s, i) => (
                        <button
                            key={s.num}
                            onClick={() => {
                                if (i + 1 < step) {
                                    setDirection(-1)
                                    setStep(i + 1)
                                }
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 md:gap-3 py-3 md:py-5 transition-all duration-300 ${step === i + 1
                                ? "bg-[var(--vsc-gray-900)] text-[var(--vsc-cream)]"
                                : step > i + 1
                                    ? "bg-[var(--vsc-cream)] text-[var(--vsc-gray-900)] cursor-pointer hover:bg-[var(--vsc-gray-200)]"
                                    : "bg-[var(--vsc-white)] text-[var(--vsc-gray-500)] cursor-default"
                                } ${i < STEPS.length - 1 ? "border-r-2 md:border-r-4 border-[var(--vsc-gray-200)]" : ""}`}
                            style={{ fontFamily: "var(--font-space-mono)" }}
                        >
                            <span className="text-base md:text-2xl font-bold">{s.num}</span>
                            <span className="hidden sm:inline text-xs md:text-sm font-bold uppercase tracking-[0.15em]">
                                {s.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ===== STEP CONTENT ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left — Form (2 cols on lg) */}
                    <div className="lg:col-span-2 relative pb-8" style={{ minHeight: "400px", overflowX: "clip" }}>
                        <AnimatePresence mode="wait" custom={direction}>
                            {step === 1 && (
                                <motion.div
                                    key="step-1"
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <StepShipping shipping={shipping} setShipping={setShipping} onNext={goNext} />
                                </motion.div>
                            )}
                            {step === 2 && (
                                <motion.div
                                    key="step-2"
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <StepPayment
                                        payment={payment}
                                        setPayment={setPayment}
                                        onNext={goNext}
                                        onBack={goBack}
                                    />
                                </motion.div>
                            )}
                            {step === 3 && (
                                <motion.div
                                    key="step-3"
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <StepReview
                                        shipping={shipping}
                                        items={items}
                                        cartTotal={cartTotal}
                                        onBack={goBack}
                                        onPlace={handlePlaceOrder}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right — Order summary mini */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 border-2 border-[var(--vsc-gray-200)] bg-[var(--vsc-white)]">
                            <div className="px-5 py-4 border-b-2 border-[var(--vsc-gray-200)]">
                                <h3
                                    className="text-xs font-bold text-[var(--vsc-accent)] uppercase tracking-[0.2em]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    YOUR ORDER
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-start pb-3 border-b border-dashed border-[var(--vsc-gray-700)]"
                                    >
                                        <div className="flex-1 min-w-0 pr-3">
                                            <span
                                                className="text-xs text-[var(--vsc-gray-900)] uppercase tracking-[0.05em] block truncate"
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                {item.name}
                                            </span>
                                            <span
                                                className="text-[10px] text-[var(--vsc-gray-500)] uppercase"
                                                style={{ fontFamily: "var(--font-space-mono)" }}
                                            >
                                                {item.size} × {item.quantity}
                                            </span>
                                        </div>
                                        <span
                                            className="text-xs font-bold text-[var(--vsc-gray-900)] shrink-0"
                                            style={{ fontFamily: "var(--font-space-mono)" }}
                                        >
                                            ${(item.price * item.quantity).toFixed(0)}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-2 border-t-2 border-[var(--vsc-gray-300)]">
                                    <span
                                        className="text-xs font-bold text-[var(--vsc-gray-900)] uppercase tracking-[0.1em]"
                                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                                    >
                                        TOTAL
                                    </span>
                                    <span
                                        className="text-lg font-bold text-[var(--vsc-accent)]"
                                        style={{ fontFamily: "var(--font-space-mono)" }}
                                    >
                                        ${cartTotal.toFixed(0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}

/* =========================================================================
   SUB-COMPONENTS — EACH STEP
   ========================================================================= */

function InputField({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
}: {
    label: string
    value: string
    onChange: (v: string) => void
    placeholder: string
    type?: string
}) {
    return (
        <div className="flex flex-col gap-3">
            <label
                className="text-xs text-[var(--vsc-accent)] uppercase tracking-[0.25em] font-bold"
                style={{ fontFamily: "var(--font-space-mono)" }}
            >
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-5 py-4 bg-[var(--vsc-cream)] border-2 border-[var(--vsc-gray-300)] text-[var(--vsc-gray-900)] text-sm uppercase tracking-[0.1em] placeholder:text-[var(--vsc-gray-400)] focus:outline-none focus:border-[var(--vsc-gray-900)] transition-colors duration-200"
                style={{ fontFamily: "var(--font-space-mono)" }}
            />
        </div>
    )
}

function StepShipping({
    shipping,
    setShipping,
    onNext,
}: {
    shipping: { fullName: string; email: string; address: string; city: string; zip: string; country: string }
    setShipping: React.Dispatch<React.SetStateAction<typeof shipping>>
    onNext: () => void
}) {
    const update = (key: keyof typeof shipping) => (v: string) =>
        setShipping((prev) => ({ ...prev, [key]: v }))

    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4 mb-8">
                <span
                    className="text-4xl md:text-5xl font-bold text-[var(--vsc-accent)]"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                    01
                </span>
                <div className="flex-1 h-1 bg-[var(--vsc-accent)]" />
                <span
                    className="text-sm font-bold text-[var(--vsc-white)] uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    SHIPPING
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <InputField label="FULL NAME" value={shipping.fullName} onChange={update("fullName")} placeholder="JOHN DOE" />
                <InputField label="EMAIL" value={shipping.email} onChange={update("email")} placeholder="JOHN@VASCARIO.COM" type="email" />
            </div>
            <InputField label="ADDRESS" value={shipping.address} onChange={update("address")} placeholder="123 STREET AVE" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <InputField label="CITY" value={shipping.city} onChange={update("city")} placeholder="NEW YORK" />
                <InputField label="ZIP CODE" value={shipping.zip} onChange={update("zip")} placeholder="10001" />
                <InputField label="COUNTRY" value={shipping.country} onChange={update("country")} placeholder="US" />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={onNext}
                    className="w-full md:w-auto px-6 py-4 md:px-10 md:py-6 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)] active:scale-[0.97]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    CONTINUE TO PAYMENT →
                </button>
            </div>
        </div>
    )
}

function StepPayment({
    payment,
    setPayment,
    onNext,
    onBack,
}: {
    payment: { cardNumber: string; expiry: string; cvv: string; nameOnCard: string }
    setPayment: React.Dispatch<React.SetStateAction<typeof payment>>
    onNext: () => void
    onBack: () => void
}) {
    const update = (key: keyof typeof payment) => (v: string) =>
        setPayment((prev) => ({ ...prev, [key]: v }))

    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4 mb-8">
                <span
                    className="text-4xl md:text-5xl font-bold text-[var(--vsc-accent)]"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                    02
                </span>
                <div className="flex-1 h-1 bg-[var(--vsc-accent)]" />
                <span
                    className="text-sm font-bold text-[var(--vsc-white)] uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    PAYMENT
                </span>
            </div>

            <InputField label="NAME ON CARD" value={payment.nameOnCard} onChange={update("nameOnCard")} placeholder="JOHN DOE" />
            <InputField label="CARD NUMBER" value={payment.cardNumber} onChange={update("cardNumber")} placeholder="4242 4242 4242 4242" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <InputField label="EXPIRY" value={payment.expiry} onChange={update("expiry")} placeholder="MM / YY" />
                <InputField label="CVV" value={payment.cvv} onChange={update("cvv")} placeholder="•••" />
            </div>

            {/* Security note */}
                <div className="flex items-center gap-3 py-4 px-5 bg-[var(--vsc-gray-100)] border border-dashed border-[var(--vsc-gray-300)]">
                <span className="text-[var(--vsc-accent)] text-lg">🔒</span>
                <span
                    className="text-[10px] text-[var(--vsc-gray-400)] uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    DEMO MODE — NO REAL CHARGES
                </span>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
                <button
                    onClick={onBack}
                    className="w-full sm:w-auto px-6 py-4 md:px-8 md:py-6 bg-transparent text-[var(--vsc-gray-900)] text-sm font-bold uppercase tracking-[0.2em] hover:text-[var(--vsc-gray-700)] transition-colors duration-200 border-2 md:border-4 border-[var(--vsc-gray-300)] hover:border-[var(--vsc-gray-600)]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    ← BACK
                </button>
                <button
                    onClick={onNext}
                    className="w-full sm:w-auto px-6 py-4 md:px-10 md:py-6 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)] active:scale-[0.97]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    REVIEW ORDER →
                </button>
            </div>
        </div>
    )
}

function StepReview({
    shipping,
    items,
    cartTotal,
    onBack,
    onPlace,
}: {
    shipping: { fullName: string; email: string; address: string; city: string; zip: string; country: string }
    items: { id: string; name: string; price: number; size: string; quantity: number }[]
    cartTotal: number
    onBack: () => void
    onPlace: () => void
}) {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4 mb-8">
                <span
                    className="text-4xl md:text-5xl font-bold text-[var(--vsc-accent)]"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                    03
                </span>
                <div className="flex-1 h-1 bg-[var(--vsc-accent)]" />
                <span
                    className="text-sm font-bold text-[var(--vsc-white)] uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    REVIEW
                </span>
            </div>

            {/* Shipping summary */}
            <div className="border-2 border-[var(--vsc-gray-600)] p-6 space-y-3">
                <h4
                    className="text-xs text-[var(--vsc-accent)] uppercase tracking-[0.25em] font-bold mb-4"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    SHIPPING TO
                </h4>
                <p
                    className="text-sm text-[var(--vsc-white)] uppercase tracking-[0.05em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    {shipping.fullName || "—"}
                </p>
                <p
                    className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.1em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    {shipping.address || "—"}, {shipping.city || "—"} {shipping.zip || "—"}
                </p>
                <p
                    className="text-xs text-[var(--vsc-gray-400)] uppercase tracking-[0.1em]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    {shipping.country || "—"}
                </p>
            </div>

            {/* Items list */}
            <div className="border-2 border-[var(--vsc-gray-600)] p-6">
                <h4
                    className="text-xs text-[var(--vsc-accent)] uppercase tracking-[0.25em] font-bold mb-6"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    ORDER ITEMS
                </h4>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center pb-3 border-b border-dashed border-[var(--vsc-gray-700)]"
                        >
                            <div>
                                <span
                                    className="text-xs text-[var(--vsc-white)] uppercase tracking-[0.05em] block"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    {item.name}
                                </span>
                                <span
                                    className="text-[10px] text-[var(--vsc-gray-500)]"
                                    style={{ fontFamily: "var(--font-space-mono)" }}
                                >
                                    SIZE: {item.size} — QTY: {item.quantity}
                                </span>
                            </div>
                            <span
                                className="text-xs font-bold text-[var(--vsc-white)]"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                ${(item.price * item.quantity).toFixed(0)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-6 mt-4 border-t-2 border-[var(--vsc-white)]">
                    <span
                        className="text-sm font-bold text-[var(--vsc-white)] uppercase tracking-[0.1em]"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        TOTAL
                    </span>
                    <span
                        className="text-xl font-bold text-[var(--vsc-accent)]"
                        style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                        ${cartTotal.toFixed(0)}
                    </span>
                </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
                <button
                    onClick={onBack}
                    className="w-full sm:w-auto px-6 py-4 md:px-8 md:py-6 bg-transparent text-[var(--vsc-white)] text-sm font-bold uppercase tracking-[0.2em] hover:text-[var(--vsc-accent)] transition-colors duration-200 border-2 md:border-4 border-[var(--vsc-gray-600)] hover:border-[var(--vsc-accent)]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    ← BACK
                </button>
                <button
                    onClick={onPlace}
                    className="w-full sm:w-auto px-6 py-4 md:px-10 md:py-6 bg-[var(--vsc-gray-900)] !text-[var(--vsc-cream)] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--vsc-gray-800)] hover:!text-[var(--vsc-white)] border-2 border-[var(--vsc-gray-900)] transition-all duration-200 hover:shadow-[0_0_20px_var(--vsc-accent-dim)] active:scale-[0.97]"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    PLACE ORDER →
                </button>
            </div>
        </div>
    )
}
