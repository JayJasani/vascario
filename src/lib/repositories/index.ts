/**
 * Firestore data access layer, split by controller/domain.
 * Re-export all repository functions and types for use by controllers.
 */

// Re-export types from models
export type { OrderStatus } from "@/models/order";
export type { Product } from "@/models/product";
export type { StockLevel } from "@/models/stock";
export type { Design } from "@/models/design";
export type { OrderItem, Order, OrderWithItems } from "@/models/order";
export type { AuditLog } from "@/models/audit";
export type { ContactSubmission } from "@/models/contact";
export type { NewsletterSubscription } from "@/models/newsletter";
export type { StaticContent } from "@/models/static-content";
export type { Review } from "@/models/review";
export type { Investment } from "@/models/investment";

// Product
export {
    getProductById,
    getProductBySlug,
    getAllProducts,
    getActiveProducts,
    getFeaturedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "./product.repository";

// Stock
export {
    getStockLevelsByProductId,
    getAllStockLevels,
    getStockTotalsByProduct,
    createStockLevel,
    updateStockLevel,
    getLowStockAlerts,
    deleteStockLevelsByProductId,
} from "./stock.repository";

// Order
export {
    getOrderById,
    getAllOrders,
    getRecentOrders,
    getOrdersWithItems,
    getRecentOrdersWithItems,
    createOrder,
    updateOrder,
    countOrders,
    aggregateOrderTotal,
    getOrderItemsByOrderId,
    createOrderItem,
} from "./order.repository";

// Design
export { getDesignById, createDesign } from "./design.repository";

// Audit
export { createAuditLog } from "./audit.repository";

// Contact
export { createContactSubmission, getContactSubmissions } from "./contact.repository";

// Newsletter
export { createNewsletterSubscription, getNewsletterSubscriptions } from "./newsletter.repository";

// Static Content
export {
    getStaticContentByKey,
    getAllStaticContent,
    upsertStaticContent,
    deleteStaticContent,
} from "./static-content.repository";

// Review
export {
    getAllReviews,
    getActiveReviews,
    createReview,
    updateReview,
    deleteReview,
} from "./review.repository";

// Investment
export {
    getAllInvestments,
    createInvestment,
    updateInvestment,
    deleteInvestment,
    getTotalInvestment,
} from "./investment.repository";
