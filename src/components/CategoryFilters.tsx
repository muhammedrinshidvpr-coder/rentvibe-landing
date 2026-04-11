import { useState } from "react";

const categories = [
  { label: "🔥 Featured", value: "featured" },
  { label: "💻 Tech", value: "tech" },
  { label: "📷 Photography", value: "photography" },
  { label: "👗 Fashion", value: "fashion" },
  { label: "🎮 Gaming", value: "gaming" },
  { label: "🏕️ Outdoor", value: "outdoor" },
];

const CategoryFilters = ({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) => {
  return (
    <section className="px-4 py-6">
      <div className="container mx-auto flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              selected === cat.value
                ? "gradient-primary text-primary-foreground shadow-lg shadow-indigo-500/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilters;
