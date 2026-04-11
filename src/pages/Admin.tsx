import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogOut, Package, Users, Trash2, Plus } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import type { Session } from "@supabase/supabase-js";

type Product = Tables<"products">;
type Lead = Tables<"leads"> & { products: Pick<Product, "name"> | null };

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) toast.error(error.message);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 bg-card border border-border rounded-xl p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold gradient-text">RentVibe Admin</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to manage your inventory</p>
          </div>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring" />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          <button onClick={handleLogin} disabled={authLoading}
            className="w-full gradient-primary text-primary-foreground font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
            {authLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <span className="text-lg font-bold gradient-text">RentVibe Admin</span>
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="inventory">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="inventory" className="gap-1.5 data-[state=active]:bg-secondary">
              <Package size={14} /> Inventory
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-1.5 data-[state=active]:bg-secondary">
              <Users size={14} /> Leads
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inventory"><InventoryTab /></TabsContent>
          <TabsContent value="leads"><LeadsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// ─── Inventory Tab ────────────────────────────────────────
const InventoryTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", type: "rent" as "rent" | "buy", category: "tech", shop: "", location: "", price_label: "/ day", image_url: "", description: "" });

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.price) { toast.error("Name and price are required."); return; }
    const { error } = await supabase.from("products").insert({
      name: form.name,
      price: parseFloat(form.price),
      type: form.type,
      category: form.category,
      shop: form.shop || null,
      location: form.location || null,
      price_label: form.price_label || null,
      image_url: form.image_url || null,
      description: form.description || null,
    });
    if (error) { toast.error("Failed to add product."); return; }
    toast.success("Product added!");
    setForm({ name: "", price: "", type: "rent", category: "tech", shop: "", location: "", price_label: "/ day", image_url: "", description: "" });
    setShowForm(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("Failed to delete."); return; }
    toast.success("Product deleted.");
    fetchProducts();
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">{products.length} Products</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 gradient-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <input placeholder="Product Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          <input placeholder="Price *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "rent" | "buy" })} className="input-field">
            <option value="rent">Rent</option>
            <option value="buy">Buy</option>
          </select>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
            <option value="tech">Tech</option>
            <option value="photography">Photography</option>
            <option value="fashion">Fashion</option>
            <option value="gaming">Gaming</option>
            <option value="outdoor">Outdoor</option>
          </select>
          <input placeholder="Shop Name" value={form.shop} onChange={(e) => setForm({ ...form, shop: e.target.value })} className="input-field" />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
          <input placeholder="Price Label (e.g. / day)" value={form.price_label} onChange={(e) => setForm({ ...form, price_label: e.target.value })} className="input-field" />
          <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
          <button onClick={handleAdd} className="gradient-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg hover:opacity-90 sm:col-span-2 lg:col-span-3">
            Save Product
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-3 px-3 font-medium">Name</th>
              <th className="py-3 px-3 font-medium">Type</th>
              <th className="py-3 px-3 font-medium">Category</th>
              <th className="py-3 px-3 font-medium">Price</th>
              <th className="py-3 px-3 font-medium">Status</th>
              <th className="py-3 px-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/50">
                <td className="py-3 px-3 text-foreground font-medium">{p.name}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.type === "rent" ? "bg-indigo-500/20 text-indigo-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                    {p.type}
                  </span>
                </td>
                <td className="py-3 px-3 text-muted-foreground capitalize">{p.category}</td>
                <td className="py-3 px-3 text-foreground">₹{p.price.toLocaleString()}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.status === "available" ? "bg-emerald-500/20 text-emerald-400" : "bg-destructive/20 text-destructive"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Leads Tab ────────────────────────────────────────────
const LeadsTab = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const fetchLeads = async () => {
    const { data } = await supabase
      .from("leads")
      .select("*, products(name)")
      .order("created_at", { ascending: false });
    setLeads((data as Lead[]) || []);
  };

  useEffect(() => { fetchLeads(); }, []);

  const isOverdue = (lead: Lead) => {
    return lead.status === "rented" && lead.end_date && new Date(lead.end_date) < new Date();
  };

  const handleStatusChange = async (lead: Lead, newStatus: string) => {
    const { error } = await supabase.from("leads").update({ status: newStatus as Lead["status"] }).eq("id", lead.id);
    if (error) { toast.error("Failed to update lead."); return; }

    // Update product status based on lead lifecycle
    if (lead.product_id) {
      if (newStatus === "rented") {
        await supabase.from("products").update({ status: "rented" as const }).eq("id", lead.product_id);
      } else if (newStatus === "returned") {
        await supabase.from("products").update({ status: "available" as const }).eq("id", lead.product_id);
      }
    }

    toast.success(`Lead status updated to "${newStatus}".`);
    fetchLeads();
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">{leads.length} Leads</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-3 px-3 font-medium">Customer</th>
              <th className="py-3 px-3 font-medium">Phone</th>
              <th className="py-3 px-3 font-medium">Product</th>
              <th className="py-3 px-3 font-medium">Dates</th>
              <th className="py-3 px-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className={`border-b border-border/50 ${isOverdue(lead) ? "bg-destructive/10" : "hover:bg-secondary/50"}`}
              >
                <td className="py-3 px-3 text-foreground font-medium">
                  {lead.customer_name}
                  {isOverdue(lead) && <span className="ml-2 text-xs text-destructive font-bold">OVERDUE</span>}
                </td>
                <td className="py-3 px-3 text-muted-foreground">{lead.customer_phone}</td>
                <td className="py-3 px-3 text-muted-foreground">{lead.products?.name || "—"}</td>
                <td className="py-3 px-3 text-muted-foreground text-xs">
                  {lead.start_date || "—"} → {lead.end_date || "—"}
                </td>
                <td className="py-3 px-3">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead, e.target.value)}
                    className="bg-secondary border border-border rounded-md px-2 py-1 text-xs text-foreground outline-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="rented">Rented</option>
                    <option value="returned">Returned</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
