import CategoriesSection from "@/components/home/CategoriesSection";
import Container from "@/components/common/Container";
import Banner from "@/components/home/Banner";
import ProductsList from "@/components/home/ProductList";
import HomeBrand from "@/components/home/HomeBrand";
import { fetchData } from "@/lib/api";
import { Brand } from "@/types/type";
import FeaturedCollectionSection from "@/components/home/FeaturedCollectionSection";
import BeautyAccessoriesSection from "@/components/home/BeautyAccessoriesSection";

export default async function Home() {

  const brands = await fetchData<Brand[]>("/brands");
  return (
    <div>
      <Container className="min-h-screen flex py-7 gap-3">
        <CategoriesSection />
        <div className="flex-1">
          <Banner />
          <ProductsList />
          <HomeBrand brands={brands} />
          <FeaturedCollectionSection />
          <BeautyAccessoriesSection />
        </div>
      </Container>
    </div>
  );
}