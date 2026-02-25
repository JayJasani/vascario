declare global {
    interface Window {
        Razorpay?: any
    }
}

function loadRazorpayScript(): Promise<boolean> {
    if (typeof window === "undefined") return Promise.resolve(false)

    const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    )
    if (existing) {
        return Promise.resolve(true)
    }

    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

interface OpenCheckoutOptions {
    amount: number
    currency: string
    orderId: string
    keyId: string
    name: string
    description?: string
    prefill?: {
        name?: string
        email?: string
        contact?: string
    }
    notes?: Record<string, string>
    onSuccess: (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
    }) => void
    onFailure?: () => void
}

export async function openRazorpayCheckout(options: OpenCheckoutOptions) {
    const loaded = await loadRazorpayScript()
    if (!loaded || typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Failed to load Razorpay checkout script")
    }

    const rzp = new window.Razorpay({
        key: options.keyId,
        amount: options.amount,
        currency: options.currency,
        name: options.name,
        description: options.description,
        order_id: options.orderId,
        prefill: options.prefill,
        notes: options.notes,
        handler: (response: {
            razorpay_order_id: string
            razorpay_payment_id: string
            razorpay_signature: string
        }) => {
            options.onSuccess(response)
        },
        modal: {
            ondismiss: () => {
                if (options.onFailure) options.onFailure()
            },
        },
    })

    rzp.open()
}

export {}

