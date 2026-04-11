import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryFilters from "@/components/CategoryFilters";
import ProductCard, { type Product } from "@/components/ProductCard";
import HowItWorks from "@/components/HowItWorks";
import LeadModal from "@/components/LeadModal";
import { products } from "@/data/products";

const Index = () => {
  const [category, setCategory] = useState("featured");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = category === "featured" ? products : products.filter((p) => p.category === category);

  const handleAction = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoryFilters selected={category} onSelect={setCategory} />

      <section className="px-4 pb-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAction={handleAction} />
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 RentVibe. All rights reserved.
      </footer>

      <LeadModal open={modalOpen} onOpenChange={setModalOpen} product={selectedProduct} />
    </div>
  );
};

export default Index;
