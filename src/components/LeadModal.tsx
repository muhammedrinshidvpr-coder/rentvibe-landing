import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setName("");
    setPhone("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSuccess(false);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !product) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      product_id: product.id,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit booking. Please try again.");
      return;
    }

    toast.success("Booking Sent!");
    setSuccess(true);
  };

  const whatsappUrl = product
    ? `https://wa.me/?text=${encodeURIComponent(
        `Hi! I'd like to ${product.type === "rent" ? "rent" : "buy"} "${product.name}" (₹${product.price.toLocaleString()}${product.price_label || ""}). My name is ${name}, phone: ${phone}.`
      )}`
    : "#";

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {product?.type === "rent" ? "Rent" : "Buy"}: {product?.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {success ? "Your booking has been submitted!" : "Fill in your details to confirm."}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4 mt-2 text-center">
            <div className="text-4xl">🎉</div>
            <p className="text-foreground font-medium">Booking Sent Successfully!</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 gradient-primary text-primary-foreground font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>
        ) : (
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
              disabled={submitting}
              className="w-full gradient-primary text-primary-foreground font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Confirm Booking"}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const DateField = ({ label, date, onSelect }: { label: string; date?: Date; onSelect: (d: Date | undefined) => void }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        className={cn(
          "w-full flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none",
          date ? "text-foreground" : "text-muted-foreground"
        )}
      >
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
