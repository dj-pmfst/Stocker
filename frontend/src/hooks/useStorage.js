import { useState, useCallback, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getWarehouseId() {
  return localStorage.getItem("warehouseId") ?? "1";
}

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
    const warehouseId = getWarehouseId();
    try {
      const res = await fetch(`${API}/warehouses/${warehouseId}/products`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(res.status);
      const json = await res.json();
      const products = Array.isArray(json.data)
        ? json.data
        : (json.data?.products ?? []);
      setStorageData(groupByLocation(products));
    } catch (err) {
      console.error("useStorage fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { storageData, loading, refetch: fetchProducts };
}
