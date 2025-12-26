export interface Designer {
  id: string;
  name: string;
  slug: string;
  about: string | null;
  created_at: string;
}

export interface Maker {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Color {
  id: string;
  name: string;
  slug: string;
  hex_code: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  created_at: string;
}

export interface Style {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Period {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  created_at: string;
}

export type ProductStatus = 'available' | 'on_hold' | 'sold' | 'inventory';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  tags: string[] | null;
  materials: string | null;
  short_description: string | null;
  long_description: string | null;
  price: number | null;
  year_created: string | null;
  product_dimensions: string | null;
  box_dimensions: string | null;
  dimension_notes: string | null;
  featured_image_url: string | null;
  status: ProductStatus;
  designer_id: string | null;
  designer_attribution: string | null;
  maker_id: string | null;
  maker_attribution: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  style_id: string | null;
  period_id: string | null;
  period_attribution: string | null;
  country_id: string | null;
  firstdibs_url: string | null;
  chairish_url: string | null;
  ebay_url: string | null;
  notes: string | null;
  go_live_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductWithRelations extends Product {
  designer: Designer | null;
  maker: Maker | null;
  category: Category | null;
  subcategory: Subcategory | null;
  style: Style | null;
  period: Period | null;
  country: Country | null;
  product_colors: Array<{ color: Color }>;
  product_images: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductHold {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  hold_duration_hours: number;
  created_at: string;
  expires_at: string;
}

export interface Offer {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  offer_amount: number;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export interface PurchaseInquiry {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface FilterState {
  designer?: string;
  maker?: string;
  color?: string;
  category?: string;
  subcategory?: string;
  style?: string;
  period?: string;
  country?: string;
  yearFrom?: number;
  yearTo?: number;
  search?: string;
}
