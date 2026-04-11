import type { Product } from "@/components/ProductCard";

export const products: Product[] = [
  { id: 1, title: "Sony A7 IV Camera", shop: "LensHub", location: "Mumbai", price: "₹1,200", priceLabel: "/ day", type: "rent", category: "photography" },
  { id: 2, title: "MacBook Pro 16\"", shop: "TechRent", location: "Bangalore", price: "₹2,500", priceLabel: "/ day", type: "rent", category: "tech" },
  { id: 3, title: "DJI Mavic 3 Drone", shop: "SkyGear", location: "Delhi", price: "₹18,000", priceLabel: "", type: "buy", category: "tech" },
  { id: 4, title: "Canon EF 70-200mm", shop: "LensHub", location: "Mumbai", price: "₹800", priceLabel: "/ day", type: "rent", category: "photography" },
  { id: 5, title: "Designer Lehenga Set", shop: "GlamCloset", location: "Jaipur", price: "₹3,500", priceLabel: "/ day", type: "rent", category: "fashion" },
  { id: 6, title: "PS5 Console + Games", shop: "PlayZone", location: "Pune", price: "₹1,000", priceLabel: "/ day", type: "rent", category: "gaming" },
  { id: 7, title: "GoPro Hero 12 Black", shop: "ActionCam", location: "Goa", price: "₹15,000", priceLabel: "", type: "buy", category: "photography" },
  { id: 8, title: "Razer Blade 15 Laptop", shop: "TechRent", location: "Hyderabad", price: "₹3,000", priceLabel: "/ day", type: "rent", category: "gaming" },
];
