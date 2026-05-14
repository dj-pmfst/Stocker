import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL;
const WAREHOUSE_ID = 1; // zaminit ovo

function groupByLocation(products) {
  const map = {};
  for (const product of products) {
    const zone = product.location?.zone ?? "Unassigned";
    const shelf = product.location?.shelf ?? "Unassigned";
    const key = `${zone}__${shelf}`;
    if (!map[key]) map[key] = { zone, shelf, items: [] };
    map[key].items.push({
      id: product.id,
      name: product.customName ?? product.defaultProduct?.name ?? "Unknown",
      sub: product.defaultProduct?.size ?? "",
      remaining: product.stock?.quantity ?? 0,
      warning:
        product.minimumQuantity != null &&
        (product.stock?.quantity ?? 0) <= product.minimumQuantity
          ? "Warning, order more!"
          : undefined,
    });
  }
  return Object.values(map);
}

export function useStorage() {
  const [storageData, setStorageData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/warehouses/${WAREHOUSE_ID}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStorageData(groupByLocation(data));
    } catch {
      console.error("Failed to fetch storage products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { storageData, loading, refetch: fetchProducts };
}
