import { MapPin } from "lucide-react";

export interface Product {
  id: number;
  title: string;
  shop: string;
  location: string;
  price: string;
  priceLabel: string;
  type: "rent" | "buy";
  category: string;
}

const ProductCard = ({ product, onAction }: { product: Product; onAction: (p: Product) => void }) => {
  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
      <div className="aspect-[4/3] bg-secondary flex items-center justify-center">
        <span className="text-4xl opacity-40">
          {product.category === "tech" ? "💻" : product.category === "photography" ? "📷" : product.category === "fashion" ? "👗" : product.category === "gaming" ? "🎮" : "📦"}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground truncate">{product.title}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin size={12} />
          <span>{product.shop} · {product.location}</span>
        </div>
        <p className="text-lg font-bold gradient-text">{product.price} <span className="text-xs font-normal text-muted-foreground">{product.priceLabel}</span></p>
        <button
          onClick={() => onAction(product)}
          className="w-full gradient-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          {product.type === "rent" ? "Rent Now" : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
