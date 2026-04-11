import { Search, Zap, MapPin } from "lucide-react";

const steps = [
  { icon: Search, title: "Browse & Choose", desc: "Explore thousands of premium items near you." },
  { icon: Zap, title: "Zero-Login Booking", desc: "Book instantly — no account needed." },
  { icon: MapPin, title: "Pick Up & Enjoy", desc: "Collect your gear and start your adventure." },
];

const HowItWorks = () => {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It <span className="gradient-text">Works</span></h2>
        <p className="text-muted-foreground mb-12 max-w-lg mx-auto">Three simple steps to get premium gear in your hands.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <step.icon size={28} className="text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
