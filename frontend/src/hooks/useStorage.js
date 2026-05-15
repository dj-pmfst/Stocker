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

    if (!map[zone]) map[zone] = { zone, shelves: {} };
    if (!map[zone].shelves[shelf])
      map[zone].shelves[shelf] = { shelf, items: [] };

    map[zone].shelves[shelf].items.push({
      id: product.id,
      image: product.defaultProduct?.imageUrl?.[0]
        ? `${API}/${product.defaultProduct.imageUrl[0]}`
        : null,
      name: product.customName ?? product.defaultProduct?.name ?? "Unknown",
      sub: product.defaultProduct?.size ?? product.defaultProduct?.unitOfMeasure ?? "",
      remaining: product.stock?.quantity ?? "",
      warning:
        product.minimumQuantity != null &&
        (product.stock?.quantity ?? 0) <= product.minimumQuantity
          ? "Warning, order more!"
          : undefined,
    });
    console.log("image:", product.defaultProduct?.imageUrl);
  }

  return Object.values(map).map((z) => ({
    zone: z.zone,
    shelves: Object.values(z.shelves),
  }));
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
      console.log(
        "raw product 0:",
        JSON.stringify(json.data?.[0]?.defaultProduct)
      );
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
