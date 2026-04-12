import { Search } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
      <div className="container mx-auto text-center relative">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight sm:leading-tight mb-4 animate-fade-in-up">
          Premium Gear, <span className="gradient-text">On Demand.</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10" style={{ animationDelay: "0.15s", opacity: 0, animation: "fade-in-up 0.6s ease-out 0.15s forwards" }}>
          Rent or buy top-tier tech, fashion, and equipment instantly.
        </p>
        <div className="max-w-2xl mx-auto flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 sm:p-2" style={{ animationDelay: "0.3s", opacity: 0, animation: "fade-in-up 0.6s ease-out 0.3s forwards" }}>
          <Search className="ml-2 sm:ml-3 text-muted-foreground shrink-0" size={18} />
          <input
            type="text"
            placeholder="Search cameras, laptops, drones..."
            className="flex-1 min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-2"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button className="gradient-primary text-primary-foreground font-medium text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:opacity-90 transition-opacity shrink-0">
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
