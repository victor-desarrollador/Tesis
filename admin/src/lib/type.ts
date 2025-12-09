export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "cliente" | "deliveryman";
  createdAt: string;
  updatedAt: string;
}

export type Brand = {
  _id: string;
  name: string;
  image?:
  | string
  | {
    url: string;
    publicId: string;
  }; // Image is optional, can be string or object
  createdAt: string;
};

export type Category = {
  _id: string;
  name: string;
  image?:
  | string
  | {
    url: string;
    publicId: string;
  };
  categoryType: "Destacados" | "Más vendidos" | "Categorías populares" | "Ofertas" | "Nuevos ingresos";
  createdAt: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  rating: number;
  numReviews: number;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  category: Category;
  brand: Brand;
  discountPercentage: number;
  featured?: boolean;
  isActive?: boolean;
  createdAt: string;
};

export type Banner = {
  _id: string;
  name: string;
  title: string;
  startFrom: number;
  image:
  | string
  | {
    url: string;
    publicId: string;
  };
  bannerType: string;
  createdAt: string;
};

// ... existing types
export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "completed" | "cancelled";
  paymentStatus: "paid" | "failed" | "pending";
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface StatsData {
  counts: {
    users: number;
    products: number;
    categories: number;
    brands: number;
    orders: number;
    totalRevenue: number;
  };
  roles: { name: string; value: number }[];
  categories: { name: string; value: number }[];
  brands: { name: string; value: number }[];
}
