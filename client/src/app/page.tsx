import Banner from "@/components/home/Banner";
import HomeCategories from "@/components/home/HomeCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import BestSellers from "@/components/home/BestSellers";
import CosmeticsSection from "@/components/home/CosmeticsSection";
import AccessoriesSection from "@/components/home/AccessoriesSection";
import BagsSection from "@/components/home/BagsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HomeBrand from "@/components/home/HomeBrand";
import { fetchData } from "@/lib/api";
import { Brand } from "@/types/type";

export default async function Home() {
  const brands = await fetchData<Brand[]>("/brands");

  return (
    <main className="min-h-screen bg-tiendaLVLight flex flex-col">
      {/* Hero Section */}
      <Banner />

      {/* Trust Factors */}
      <FeaturesSection />

      {/* Horizontal Categories */}
      <HomeCategories />

      {/* Product Sections - Mix of featured and category-based */}
      <div className="space-y-0">
        <NewArrivals />
        <CosmeticsSection />
        <FeaturedProducts />
        <AccessoriesSection />
        <BestSellers />
        <BagsSection />
      </div>

      {/* Brands */}
      <div className="py-12 bg-white">
        <HomeBrand brands={brands} />
      </div>
    </main>
  );
}