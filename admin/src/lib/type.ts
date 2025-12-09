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
  categoryType: "Featured" | "Hot Categories" | "Top Categories";
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
  featured?: boolean;
  isActive?: boolean;
  createdAt: string;
};

export type Banner = {
  _id: string;
  name: string;
  title: string;
  startFrom: number; // Keep as number according to original file, though Date might be better logic wise, stick to file content for now or match usage. The controller reads it as Date?
  // Controller calls "startFrom" but doesn't cast. Model says Date. Frontend form uses input type="number" and parses int.
  // Sticking to original type definition context but updating image.
  image:
  | string
  | {
    url: string;
    publicId: string;
  };
  bannerType: string;
  createdAt: string;
};

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
