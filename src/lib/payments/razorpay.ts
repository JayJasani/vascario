import crypto from "crypto"

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    // This runs only on the server (API routes / server components).
    // eslint-disable-next-line no-console
    console.warn("Razorpay environment variables are not set. Payments will fail until configured.")
}

interface CreateOrderParams {
    amount: number
    currency: string
    receipt: string
    notes?: Record<string, string>
}

interface RazorpayOrderResponse {
    id: string
    amount: number
    currency: string
    status: string
    receipt: string | null
}

export async function createRazorpayOrder(params: CreateOrderParams): Promise<RazorpayOrderResponse> {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay keys are not configured")
    }

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")

    const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
            amount: params.amount,
            currency: params.currency,
            receipt: params.receipt,
            notes: params.notes,
        }),
    })

    if (!response.ok) {
        // eslint-disable-next-line no-console
        console.error("Failed to create Razorpay order", await response.text())
        throw new Error("Failed to create Razorpay order")
    }

    const data = (await response.json()) as RazorpayOrderResponse
    return data
}

export function verifyRazorpaySignature({
    orderId,
    paymentId,
    signature,
}: {
    orderId: string
    paymentId: string
    signature: string
}): boolean {
    if (!RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay key secret is not configured")
    }

    const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)
    hmac.update(`${orderId}|${paymentId}`)
    const digest = hmac.digest("hex")

    return digest === signature
}

export function getRazorpayKeyId(): string {
    if (!RAZORPAY_KEY_ID) {
        throw new Error("Razorpay key id is not configured")
    }
    return RAZORPAY_KEY_ID
}

