import { MapPin } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products">;

const categoryEmoji: Record<string, string> = {
  tech: "💻",
  photography: "📷",
  fashion: "👗",
  gaming: "🎮",
  outdoor: "🏕️",
};

const ProductCard = ({ product, onAction }: { product: Product; onAction: (p: Product) => void }) => {
  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
      <div className="aspect-square bg-secondary flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl opacity-40">{categoryEmoji[product.category] || "📦"}</span>
        )}
      </div>
      <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-3">
        <h3 className="font-semibold text-foreground truncate text-xs sm:text-base">{product.name}</h3>
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
          <MapPin size={10} className="sm:w-3 sm:h-3" />
          <span className="truncate">{product.shop} · {product.location}</span>
        </div>
        <p className="text-sm sm:text-lg font-bold gradient-text">
          ₹{product.price.toLocaleString()}{" "}
          <span className="text-[9px] sm:text-xs font-normal text-muted-foreground">{product.price_label}</span>
        </p>
        <button
          onClick={() => onAction(product)}
          className="w-full gradient-primary text-primary-foreground text-[11px] sm:text-sm font-medium py-1.5 sm:py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          {product.type === "rent" ? "Rent Now" : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
