import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import crypto from "crypto";

setGlobalOptions({maxInstances: 10});

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
const RAZORPAY_WEBHOOK_COLLECTION = "razorpayWebhooks";

function verifyWebhookSignature(
  rawBody: Buffer,
  signature: string | undefined,
): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) {
    logger.error("RAZORPAY_WEBHOOK_SECRET is not configured");
    return false;
  }
  if (!signature) {
    logger.error("Missing x-razorpay-signature header");
    return false;
  }

  const hmac = crypto.createHmac("sha256", RAZORPAY_WEBHOOK_SECRET);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");
  return digest === signature;
}

async function createOrUpdateOrderFromPayment(event: any) {
  const payment = event?.payload?.payment?.entity;
  if (!payment) {
    logger.warn("Webhook payload missing payment entity");
    return;
  }

  const razorpayOrderId: string | undefined = payment.order_id;
  const paymentId: string | undefined = payment.id;
  const amount: number =
    typeof payment.amount === "number" ? payment.amount / 100 : 0;
  const currency: string = payment.currency || "INR";
  const notes: Record<string, unknown> = payment.notes || {};

  const customerEmail =
    (notes.email as string | undefined) ||
    (payment.email as string | undefined) ||
    "";
  const customerName =
    (notes.name as string | undefined) ||
    (payment.contact as string | undefined) ||
    "";

  const userId =
    (notes.userId as string | undefined) ||
    (notes.uid as string | undefined) ||
    null;

  const shippingAddress = {
    fullName: notes.name ?? null,
    email: notes.email ?? null,
    address: notes.address ?? null,
    city: notes.city ?? null,
    zip: notes.zip ?? null,
    country: notes.country ?? null,
  };

  const ordersCollection = db.collection("orders");

  let targetDoc: FirebaseFirestore.DocumentReference | null = null;

  if (razorpayOrderId) {
    const existingSnap = await ordersCollection
      .where("razorpayOrderId", "==", razorpayOrderId)
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      targetDoc = existingSnap.docs[0].ref;
    }
  }

  const now = admin.firestore.FieldValue.serverTimestamp();

  if (targetDoc) {
    await targetDoc.set(
      {
        status: "PAID",
        totalAmount: amount,
        paymentId,
        currency,
        userId,
        updatedAt: now,
      },
      {merge: true},
    );
  } else {
    await ordersCollection.add({
      userId,
      customerEmail,
      customerName,
      status: "PAID",
      totalAmount: amount,
      shippingAddress,
      paymentId,
      currency,
      razorpayOrderId: razorpayOrderId ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }
}

export const vascarioPaymentCallback = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const signature = req.header("x-razorpay-signature") as string | undefined;
  const rawBody = req.rawBody;

  if (!verifyWebhookSignature(rawBody, signature)) {
    res.status(400).send("Invalid signature");
    return;
  }

  const event = req.body;

  let logRef: FirebaseFirestore.DocumentReference | null = null;

  try {
    logRef = await db.collection(RAZORPAY_WEBHOOK_COLLECTION).add({
      eventType: event.event ?? null,
      payload: event,
      headers: req.headers,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      processed: false,
    });

    if (event.event === "payment.captured") {
      await createOrUpdateOrderFromPayment(event);
    }

    if (logRef) {
      await logRef.set(
        {
          processed: true,
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
    }

    res.status(200).send("OK");
  } catch (err) {
    logger.error("Error handling Razorpay webhook", err);

    if (logRef) {
      await logRef.set(
        {
          processed: false,
          error: err instanceof Error ? err.message : String(err),
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
    }

    res.status(500).send("Internal Server Error");
  }
});

