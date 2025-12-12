import CategoriesSection from "@/components/home/CategoriesSection";
import Container from "@/components/common/Container";
import Banner from "@/components/home/Banner";
import HomeBrand from "@/components/home/HomeBrand";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import BestSellers from "@/components/home/BestSellers";
import { fetchData } from "@/lib/api";
import { Brand } from "@/types/type";

export default async function Home() {
  const brands = await fetchData<Brand[]>("/brands");

  return (
    <div>
      <Container className="min-h-screen flex py-7 gap-3">
        <CategoriesSection />
        <div className="flex-1">
          <Banner />
          <NewArrivals />
          <FeaturedProducts />
          <BestSellers />
          <HomeBrand brands={brands} />
        </div>
      </Container>
    </div>
  );
}