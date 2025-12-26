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

export type ProductStatus = 'available' | 'on_hold' | 'sold';

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
  year_created: number | null;
  product_width: number | null;
  product_height: number | null;
  product_depth: number | null;
  product_weight: number | null;
  dimension_notes: string | null;
  box_width: number | null;
  box_height: number | null;
  box_depth: number | null;
  box_weight: number | null;
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
  firstdibs_url: string | null;
  chairish_url: string | null;
  ebay_url: string | null;
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
  yearFrom?: number;
  yearTo?: number;
  search?: string;
}
