import { getAnalytics } from "./index";
import type {
  AnalyticsItem,
  ViewItemListParams,
  SelectItemParams,
  ViewItemParams,
  AddToCartParams,
  RemoveFromCartParams,
  ViewCartParams,
  BeginCheckoutParams,
  AddShippingInfoParams,
  AddPaymentInfoParams,
  PurchaseParams,
  SearchParams,
  SelectSearchResultParams,
  AddToWishlistParams,
  RemoveFromWishlistParams,
  LoginParams,
  SignUpParams,
  SelectSizeParams,
  SelectColorParams,
  ChangeQuantityParams,
  ImageGalleryNavigateParams,
  CurrencyChangeParams,
  ClickNavLinkParams,
  NewsletterSignupParams,
  ContactFormSubmitParams,
  ScrollToSectionParams,
  PageViewParams,
} from "./types";

// Re-export AnalyticsItem for convenience
export type { AnalyticsItem };

const a = () => getAnalytics();

// ---------- Page ----------

export function trackPageView(params: PageViewParams) {
  a().track("page_view", params);
}

// ---------- E-commerce funnel ----------

export function trackViewItemList(params: ViewItemListParams) {
  a().track("view_item_list", params);
}

export function trackSelectItem(params: SelectItemParams) {
  a().track("select_item", params);
}

export function trackViewItem(params: ViewItemParams) {
  a().track("view_item", params);
}

export function trackAddToCart(params: AddToCartParams) {
  a().track("add_to_cart", params);
}

export function trackRemoveFromCart(params: RemoveFromCartParams) {
  a().track("remove_from_cart", params);
}

export function trackViewCart(params: ViewCartParams) {
  a().track("view_cart", params);
}

export function trackBeginCheckout(params: BeginCheckoutParams) {
  a().track("begin_checkout", params);
}

export function trackAddShippingInfo(params: AddShippingInfoParams) {
  a().track("add_shipping_info", params);
}

export function trackAddPaymentInfo(params: AddPaymentInfoParams) {
  a().track("add_payment_info", params);
}

export function trackPurchase(params: PurchaseParams) {
  a().track("purchase", params);
}

// ---------- Search ----------

export function trackSearch(params: SearchParams) {
  a().track("search", params);
}

export function trackSelectSearchResult(params: SelectSearchResultParams) {
  a().track("select_search_result", params);
}

// ---------- Wishlist ----------

export function trackAddToWishlist(params: AddToWishlistParams) {
  a().track("add_to_wishlist", params);
}

export function trackRemoveFromWishlist(params: RemoveFromWishlistParams) {
  a().track("remove_from_wishlist", params);
}

// ---------- Auth ----------

export function trackLogin(params: LoginParams) {
  a().track("login", params);
}

export function trackSignUp(params: SignUpParams) {
  a().track("sign_up", params);
}

// ---------- Product interactions ----------

export function trackSelectSize(params: SelectSizeParams) {
  a().track("select_size", params);
}

export function trackSelectColor(params: SelectColorParams) {
  a().track("select_color", params);
}

export function trackChangeQuantity(params: ChangeQuantityParams) {
  a().track("change_quantity", params);
}

export function trackImageGalleryNavigate(params: ImageGalleryNavigateParams) {
  a().track("image_gallery_navigate", params);
}

// ---------- UI interactions ----------

export function trackCurrencyChange(params: CurrencyChangeParams) {
  a().track("currency_change", params);
}

export function trackClickNavLink(params: ClickNavLinkParams) {
  a().track("click_nav_link", params);
}

export function trackOpenSearch() {
  a().track("open_search", {});
}

export function trackOpenAccountDrawer() {
  a().track("open_account_drawer", {});
}

export function trackOpenMobileMenu() {
  a().track("open_mobile_menu", {});
}

export function trackNewsletterSignup(params: NewsletterSignupParams) {
  a().track("newsletter_signup", params);
}

export function trackContactFormSubmit(params: ContactFormSubmitParams) {
  a().track("contact_form_submit", params);
}

export function trackScrollToSection(params: ScrollToSectionParams) {
  a().track("scroll_to_section", params);
}

// ---------- Identity ----------

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  a().identify(userId, traits);
}

export function resetUser() {
  a().reset();
}
