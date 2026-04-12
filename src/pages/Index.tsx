import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryFilters from "@/components/CategoryFilters";
import ProductCard, { type Product } from "@/components/ProductCard";
import HowItWorks from "@/components/HowItWorks";
import LeadModal from "@/components/LeadModal";
import { supabase } from "@/integrations/supabase/client";

type ProductTypeFilter = "all" | "rent" | "buy";

const Index = () => {
  const [category, setCategory] = useState("featured");
  const [typeFilter, setTypeFilter] = useState<ProductTypeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const catMatch = category === "featured" || p.category === category;
    const typeMatch = typeFilter === "all" || p.type === typeFilter;
    const q = searchQuery.toLowerCase();
    const searchMatch = !q || p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return catMatch && typeMatch && searchMatch;
  });

  const handleAction = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryFilters selected={category} onSelect={setCategory} />

      {/* Rent/Buy Toggle */}
      <section className="px-4 pb-4">
        <div className="container mx-auto flex justify-center">
          <div className="inline-flex rounded-lg border border-border bg-card p-1 gap-1">
            {(["all", "rent", "buy"] as ProductTypeFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                  typeFilter === t
                    ? "gradient-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "all" ? "All" : t === "rent" ? "For Rent" : "For Sale"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} onAction={handleAction} />
              ))}
            </div>
          )}
        </div>
      </section>

      <HowItWorks />

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 Rentra. All rights reserved.
      </footer>

      <LeadModal open={modalOpen} onOpenChange={setModalOpen} product={selectedProduct} />
    </div>
  );
};

export default Index;
