// GA4-compatible e-commerce item
export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_variant?: string; // size
  item_category?: string; // color
  index?: number;
  item_list_id?: string;
  item_list_name?: string;
}

// ---------- E-commerce event params ----------

export interface ViewItemListParams {
  item_list_id?: string;
  item_list_name?: string;
  items: AnalyticsItem[];
}

export interface SelectItemParams {
  item_list_id?: string;
  item_list_name?: string;
  items: AnalyticsItem[];
}

export interface ViewItemParams {
  currency: string;
  value: number;
  items: AnalyticsItem[];
}

export interface AddToCartParams {
  currency: string;
  value: number;
  items: AnalyticsItem[];
}

export interface RemoveFromCartParams {
  currency: string;
  value: number;
  items: AnalyticsItem[];
}

export interface ViewCartParams {
  currency: string;
  value: number;
  items: AnalyticsItem[];
}

export interface BeginCheckoutParams {
  currency: string;
  value: number;
  items: AnalyticsItem[];
  coupon?: string;
}

export interface AddShippingInfoParams {
  currency: string;
  value: number;
  items: AnalyticsItem[];
  shipping_tier?: string;
}

export interface AddPaymentInfoParams {
  currency: string;
  value: number;
  items: AnalyticsItem[];
  payment_type?: string;
}

export interface PurchaseParams {
  transaction_id: string;
  currency: string;
  value: number;
  items: AnalyticsItem[];
  shipping?: number;
  tax?: number;
  coupon?: string;
}

// ---------- Engagement event params ----------

export interface SearchParams {
  search_term: string;
  results_count?: number;
}

export interface SelectSearchResultParams {
  search_term: string;
  item_id: string;
  item_name: string;
  index?: number;
}

export interface AddToWishlistParams {
  currency: string;
  value: number;
  items: AnalyticsItem[];
}

export interface RemoveFromWishlistParams {
  currency: string;
  value: number;
  items: AnalyticsItem[];
}

export interface LoginParams {
  method: string;
}

export interface SignUpParams {
  method: string;
}

// ---------- Custom interaction params ----------

export interface SelectSizeParams {
  item_id: string;
  item_name: string;
  size: string;
}

export interface SelectColorParams {
  item_id: string;
  item_name: string;
  color: string;
}

export interface ChangeQuantityParams {
  item_id: string;
  item_name: string;
  quantity: number;
  previous_quantity: number;
}

export interface ImageGalleryNavigateParams {
  item_id: string;
  item_name: string;
  image_index: number;
  method: "thumbnail" | "prev" | "next";
}

export interface CurrencyChangeParams {
  from_currency: string;
  to_currency: string;
}

export interface ClickNavLinkParams {
  link_text: string;
  link_url: string;
  location: "header" | "footer" | "mobile_menu";
}

export interface NewsletterSignupParams {
  method: string;
  location: string;
}

export interface ContactFormSubmitParams {
  form_id: string;
}

export interface ScrollToSectionParams {
  section_name: string;
}

export interface PageViewParams {
  page_path: string;
  page_title?: string;
  page_search?: string;
}

// Union map of all events for type safety
export interface AnalyticsEventMap {
  page_view: PageViewParams;
  view_item_list: ViewItemListParams;
  select_item: SelectItemParams;
  view_item: ViewItemParams;
  add_to_cart: AddToCartParams;
  remove_from_cart: RemoveFromCartParams;
  view_cart: ViewCartParams;
  begin_checkout: BeginCheckoutParams;
  add_shipping_info: AddShippingInfoParams;
  add_payment_info: AddPaymentInfoParams;
  purchase: PurchaseParams;
  search: SearchParams;
  select_search_result: SelectSearchResultParams;
  add_to_wishlist: AddToWishlistParams;
  remove_from_wishlist: RemoveFromWishlistParams;
  login: LoginParams;
  sign_up: SignUpParams;
  select_size: SelectSizeParams;
  select_color: SelectColorParams;
  change_quantity: ChangeQuantityParams;
  image_gallery_navigate: ImageGalleryNavigateParams;
  currency_change: CurrencyChangeParams;
  click_nav_link: ClickNavLinkParams;
  open_search: Record<string, never>;
  open_account_drawer: Record<string, never>;
  open_mobile_menu: Record<string, never>;
  newsletter_signup: NewsletterSignupParams;
  contact_form_submit: ContactFormSubmitParams;
  scroll_to_section: ScrollToSectionParams;
}

export type AnalyticsEventName = keyof AnalyticsEventMap;
