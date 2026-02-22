"use server";

import * as DashboardController from "@/controllers/admin/DashboardController";
import * as OrderController from "@/controllers/admin/OrderController";
import * as ContactController from "@/controllers/admin/ContactController";
import * as NewsletterController from "@/controllers/admin/NewsletterController";
import * as ProductController from "@/controllers/admin/ProductController";
import * as InventoryController from "@/controllers/admin/InventoryController";
import * as StaticContentController from "@/controllers/admin/StaticContentController";
import * as ReviewController from "@/controllers/admin/ReviewController";
import * as InvestmentController from "@/controllers/admin/InvestmentController";
import type { OrderStatus } from "@/models/order";

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
    return DashboardController.getDashboardStats();
}

// ─── ORDERS ────────────────────────────────────────────────────────────────────

export async function getOrders(statusFilter?: OrderStatus) {
    return OrderController.getOrders(statusFilter);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    return OrderController.updateOrderStatus(orderId, status);
}

export async function addTrackingInfo(orderId: string, trackingNumber: string, carrier: string) {
    return OrderController.addTrackingInfo(orderId, trackingNumber, carrier);
}

// ─── CONTACT ───────────────────────────────────────────────────────────────────

export async function getAdminContactSubmissions() {
    return ContactController.getAdminContactSubmissions();
}

// ─── NEWSLETTER ────────────────────────────────────────────────────────────────

export async function getAdminNewsletterSubscriptions() {
    return NewsletterController.getAdminNewsletterSubscriptions();
}

// ─── PRODUCTS / DROPS ──────────────────────────────────────────────────────────

export async function getProducts() {
    return ProductController.getProducts();
}

export async function createProduct(formData: FormData) {
    return ProductController.createProduct(formData);
}

export async function toggleProductActive(productId: string) {
    return ProductController.toggleProductActive(productId);
}

export async function toggleProductFeatured(productId: string) {
    return ProductController.toggleProductFeatured(productId);
}

export async function updateProductAction(productId: string, formData: FormData) {
    return ProductController.updateProduct(productId, formData);
}

export async function deleteDropAction(productId: string) {
    return ProductController.deleteProduct(productId);
}

// ─── INVENTORY ─────────────────────────────────────────────────────────────────

export async function getStockLevels() {
    return InventoryController.getStockLevels();
}

export async function updateStock(stockLevelId: string, quantity: number) {
    return InventoryController.updateStock(stockLevelId, quantity);
}

// ─── STATIC CONTENT ────────────────────────────────────────────────────────────

export async function getStaticContent() {
    return StaticContentController.getStaticContent();
}

export async function updateStaticContent(
    key: string,
    url: string,
    type: "video" | "image",
    redirectUrl?: string | null
) {
    return StaticContentController.updateStaticContent(key, url, type, redirectUrl);
}

export async function deleteStaticContentAction(key: string) {
    return StaticContentController.deleteStaticContentAction(key);
}

// ─── REVIEWS ───────────────────────────────────────────────────────────────────

export async function getReviewsAction() {
    return ReviewController.getReviews();
}

export async function createReviewAction(
    authorName: string,
    text: string,
    rating?: number | null,
    sortOrder?: number
) {
    return ReviewController.createReview(authorName, text, rating, sortOrder);
}

export async function updateReviewAction(
    id: string,
    updates: { authorName?: string; text?: string; rating?: number | null; sortOrder?: number; isActive?: boolean }
) {
    return ReviewController.updateReview(id, updates);
}

export async function deleteReviewAction(id: string) {
    return ReviewController.deleteReview(id);
}

// ─── INVESTMENTS ───────────────────────────────────────────────────────────────

export async function getInvestmentsAction() {
    return InvestmentController.getInvestments();
}

export async function createInvestmentAction(formData: FormData) {
    return InvestmentController.createInvestment(formData);
}

export async function updateInvestmentAction(id: string, formData: FormData) {
    return InvestmentController.updateInvestment(id, formData);
}

export async function deleteInvestmentAction(id: string) {
    return InvestmentController.deleteInvestment(id);
}
