import CategoriesSection from "@/components/home/CategoriesSection";
import Container from "@/components/common/Container";
import Banner from "@/components/home/Banner";
import ProductsList from "@/components/home/ProductList";

export default function Home() {
    return (
        <div>
          <Container className="min-h-screen flex py-7 gap-3">
          <CategoriesSection />
          <div className="flex-1">
          <Banner />
          <ProductsList />
          {/* babyTravelSection */}
          {/* confyApparealSection */}
          {/* FeaturedServicesSection */}
          </div>
        </Container>
      </div>
    );
}