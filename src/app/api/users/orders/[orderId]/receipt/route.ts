import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { db, COLLECTIONS } from "@/lib/firebase";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const url = new URL(request.url);
  const queryToken = url.searchParams.get("idToken");
  if (queryToken && queryToken.trim()) {
    return queryToken.trim();
  }

  return null;
}

async function verifyUser(request: NextRequest) {
  const token = getToken(request);
  if (!token) return null;
  const adminAuth = getAuth();
  const decoded = await adminAuth.verifyIdToken(token);
  return { uid: decoded.uid, email: decoded.email ?? "" };
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return Response.json(
        { error: "Missing or invalid authorization" },
        { status: 401 },
      );
    }

    const { orderId } = await context.params;

    let orderDoc = await db
      .collection(COLLECTIONS.ORDERS)
      .doc(orderId)
      .get();

    if (!orderDoc.exists) {
      const byPaymentId = await db
        .collection(COLLECTIONS.ORDERS)
        .where("paymentId", "==", orderId)
        .limit(1)
        .get();

      if (!byPaymentId.empty) {
        orderDoc = byPaymentId.docs[0];
      } else {
        const byRazorpayOrderId = await db
          .collection(COLLECTIONS.ORDERS)
          .where("razorpayOrderId", "==", orderId)
          .limit(1)
          .get();

        if (!byRazorpayOrderId.empty) {
          orderDoc = byRazorpayOrderId.docs[0];
        }
      }
    }

    if (!orderDoc.exists) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = orderDoc.data() as any;

    if (orderData.userId !== user.uid) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const itemsSnapshot = await db
      .collection(COLLECTIONS.ORDER_ITEMS)
      .where("orderId", "==", orderDoc.id)
      .get();

    const items = itemsSnapshot.docs.map((doc) => {
      const data = doc.data() as {
        productName?: unknown;
        size?: unknown;
        color?: unknown;
        quantity?: unknown;
        unitPrice?: unknown;
      };
      return {
        id: doc.id,
        productName: (data.productName as string | null) ?? null,
        size: (data.size as string | null) ?? null,
        color: (data.color as string | null) ?? null,
        quantity: (data.quantity as number | null) ?? 0,
        unitPrice: Number(data.unitPrice ?? 0),
      };
    });

    const currency =
      typeof orderData.currency === "string" && orderData.currency.trim()
        ? orderData.currency
        : "INR";

    const totalAmount = Number(orderData.totalAmount ?? 0);
    const shipping = (orderData.shippingAddress ?? {}) as {
      fullName?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      zip?: string;
      country?: string;
    };

    const createdAtIso =
      orderData.createdAt?.toDate?.().toISOString?.() ?? null;

    const formattedDate = createdAtIso
      ? new Date(createdAtIso).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

    const itemsHtml =
      items.length > 0
        ? items
            .map((item) => {
              const lineTotal = item.unitPrice * item.quantity;
              return `
          <tr class="item-row">
            <td class="item-main">
              <div class="item-name">${escapeHtml(
                item.productName ?? "Product",
              )}</div>
              <div class="item-meta">
                SIZE: ${escapeHtml(item.size ?? "")}${
                item.color ? ` &mdash; COLOR: ${escapeHtml(item.color)}` : ""
              } &mdash; QTY: ${item.quantity}
              </div>
            </td>
            <td class="item-price">${escapeHtml(
              formatCurrency(lineTotal, currency),
            )}</td>
          </tr>
        `;
            })
            .join("")
        : `
        <tr>
          <td colspan="2" class="empty">
            ORDER DETAILS UNAVAILABLE &mdash; PLEASE CHECK YOUR EMAIL
          </td>
        </tr>
      `;

    const cityZipCountry = [
      shipping.city,
      shipping.zip,
      shipping.country,
    ].filter(Boolean);

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Vascario Receipt #${escapeHtml(orderId)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      *, *::before, *::after {
        box-sizing: border-box;
      }
      html, body {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Mono",
          "Space Grotesk", sans-serif;
        background: #f7f3eb;
        color: #111111;
      }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }
      .receipt {
        width: 100%;
        max-width: 540px;
        background: #f7f3eb;
        border: 1px solid #e2d8c8;
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
      }
      .receipt-header {
        padding: 32px 40px 20px 40px;
        text-align: center;
        border-bottom: 2px dashed #e2d8c8;
      }
      .brand {
        font-weight: 700;
        letter-spacing: -0.03em;
        font-size: 24px;
      }
      .subheading {
        margin-top: 4px;
        font-size: 10px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #7a7164;
      }
      .section {
        padding: 20px 40px;
        border-bottom: 2px dashed #e2d8c8;
      }
      .label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: #7a7164;
      }
      .value {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .ship-name {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .ship-line {
        font-size: 11px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #44403c;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      .items-heading {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        color: #7a7164;
        padding-bottom: 10px;
      }
      .item-row + .item-row > td {
        border-top: 1px dotted #e2d8c8;
      }
      .item-main {
        padding: 8px 0;
      }
      .item-name {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .item-meta {
        margin-top: 2px;
        font-size: 10px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #7a7164;
      }
      .item-price {
        width: 120px;
        text-align: right;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        white-space: nowrap;
      }
      .empty {
        padding: 12px 0;
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #7a7164;
        text-align: center;
      }
      .totals-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 4px;
      }
      .totals-label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: #7a7164;
      }
      .totals-value {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .totals-total-label {
        margin-top: 12px;
        padding-top: 8px;
        border-top: 2px solid #111111;
      }
      .totals-total-value {
        font-size: 16px;
        font-weight: 700;
      }
      .footer {
        padding: 20px 40px 16px 40px;
        text-align: center;
        border-top: 2px dashed #e2d8c8;
      }
      .footer-line-small {
        font-size: 10px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #7a7164;
      }
      .footer-brand {
        margin-top: 4px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .footer-tagline {
        margin-top: 6px;
        font-size: 10px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #7a7164;
      }
      @media print {
        html, body {
          background: #ffffff;
        }
        body {
          box-shadow: none;
        }
        .receipt {
          box-shadow: none;
          border: none;
        }
      }
    </style>
    <script>
      window.addEventListener("load", function () {
        try {
          window.print();
        } catch (e) {
          // ignore
        }
      });
    </script>
  </head>
  <body>
    <div class="receipt">
      <div class="receipt-header">
        <div class="brand">VASCARIO</div>
        <div class="subheading">DIGITAL RECEIPT</div>
      </div>
      <div class="section">
        <div class="row">
          <div class="label">Order</div>
          <div class="value">#${escapeHtml(orderId)}</div>
        </div>
        <div class="row">
          <div class="label">Date</div>
          <div class="value">${escapeHtml(formattedDate)}</div>
        </div>
        <div class="row">
          <div class="label">Status</div>
          <div class="value">CONFIRMED</div>
        </div>
      </div>
      ${
        shipping &&
        (shipping.fullName ||
          shipping.address ||
          shipping.city ||
          shipping.phone)
          ? `
      <div class="section">
        <div class="label" style="margin-bottom: 8px;">Shipping Address</div>
        ${
          shipping.fullName
            ? `<div class="ship-name">${escapeHtml(shipping.fullName)}</div>`
            : ""
        }
        ${
          shipping.phone
            ? `<div class="ship-line">${escapeHtml(shipping.phone)}</div>`
            : ""
        }
        ${
          shipping.email
            ? `<div class="ship-line">${escapeHtml(shipping.email)}</div>`
            : ""
        }
        ${
          shipping.address
            ? `<div class="ship-line">${escapeHtml(shipping.address)}</div>`
            : ""
        }
        ${
          cityZipCountry.length
            ? `<div class="ship-line">${escapeHtml(
                cityZipCountry.join(", "),
              )}</div>`
            : ""
        }
      </div>
      `
          : ""
      }
      <div class="section">
        <div class="items-heading">Items</div>
        <table>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>
      <div class="section">
        <div class="totals-row">
          <div class="totals-label">Subtotal</div>
          <div class="totals-value">${escapeHtml(
            formatCurrency(totalAmount, currency),
          )}</div>
        </div>
        <div class="totals-row">
          <div class="totals-label">Shipping</div>
          <div class="totals-value">FREE</div>
        </div>
        <div class="totals-row totals-total-label">
          <div class="totals-label">Total</div>
          <div class="totals-value totals-total-value">${escapeHtml(
            formatCurrency(totalAmount, currency),
          )}</div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-line-small">THANK YOU FOR SHOPPING WITH</div>
        <div class="footer-brand">VASCARIO</div>
        <div class="footer-tagline">WEAR THE CULTURE — EST. 2024</div>
      </div>
    </div>
  </body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Order receipt API GET error:", error);
    return Response.json(
      { error: "Failed to generate order receipt" },
      { status: 500 },
    );
  }
}

