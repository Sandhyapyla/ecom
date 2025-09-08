import { ItemsAPI } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore, useCartStore } from "@/store";
import { useEffect, useMemo, useState } from "react";

const categories = [
  { value: "apparel", label: "Apparel" },
  { value: "footwear", label: "Footwear" },
  { value: "electronics", label: "Electronics" },
  { value: "home", label: "Home" },
];

export default function ItemsPage() {
  const [addingToCart, setAddingToCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { toast } = useToast();
  const addToCart = useCartStore((s) => s.add);
  const auth = useAuthStore();

  const filters = useMemo(
    () => ({ q, category, minPrice, maxPrice }),
    [q, category, minPrice, maxPrice]
  );

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (filters.q) params.q = filters.q;
        if (filters.category) params.category = filters.category;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        const { data } = await ItemsAPI.list(params);
        setItems(data.items || []);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast({ title: "Failed to load items" });
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q, filters.category, filters.minPrice, filters.maxPrice]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1 space-y-3">
        <Input
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </aside>
      <section className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <div>Loading...</div>}
        {!loading &&
          items.map((it) => (
            <Card key={it.id}>
              <CardHeader>
                <CardTitle className="text-base">{it.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={it.image}
                  alt={it.title}
                  className="w-full h-40 object-cover rounded"
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {it.category}
                </div>
                <div className="font-semibold mt-1">₹{it.price}</div>
                <Button
                  disabled={addingToCart}
                  className="mt-3 w-full"
                  onClick={async () => {
                    if (!auth?.token) {
                      toast({ title: "Please login to add items" });
                      return;
                    }
                    try {
                      setAddingToCart(true);
                      await addToCart(it.id, 1);
                      toast({ title: "Item added to cart" });
                    } catch {
                      toast({ title: "Failed to add item to cart" });
                    } finally {
                      setAddingToCart(false);
                    }
                  }}
                >
                  Add to cart
                </Button>
              </CardContent>
            </Card>
          ))}
      </section>
    </div>
  );
}
