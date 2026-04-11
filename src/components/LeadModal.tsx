import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Product } from "./ProductCard";

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const LeadModal = ({ open, onOpenChange, product }: LeadModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSubmit = () => {
    const data = {
      product: product?.title,
      name,
      phone,
      startDate: startDate ? format(startDate, "PPP") : null,
      endDate: endDate ? format(endDate, "PPP") : null,
    };
    console.log("Booking confirmed:", data);
    setName("");
    setPhone("");
    setStartDate(undefined);
    setEndDate(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">{product?.type === "rent" ? "Rent" : "Buy"}: {product?.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">Fill in your details to confirm.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="grid grid-cols-2 gap-3">
            <DateField label="Start Date" date={startDate} onSelect={setStartDate} />
            <DateField label="End Date" date={endDate} onSelect={setEndDate} />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full gradient-primary text-primary-foreground font-medium py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Confirm Booking
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DateField = ({ label, date, onSelect }: { label: string; date?: Date; onSelect: (d: Date | undefined) => void }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button className={cn(
        "w-full flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none",
        date ? "text-foreground" : "text-muted-foreground"
      )}>
        <CalendarIcon size={14} />
        {date ? format(date, "MMM d") : label}
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
      <Calendar
        mode="single"
        selected={date}
        onSelect={onSelect}
        initialFocus
        className="p-3 pointer-events-auto"
      />
    </PopoverContent>
  </Popover>
);

export default LeadModal;
