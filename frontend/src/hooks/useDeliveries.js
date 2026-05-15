import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL;

function getMostFrequent(deliveries, limit = 5) {
    const counts = {};
    for (const delivery of deliveries) {
      for (const item of delivery.items) {
        const id = item.product.id;
        if (!counts[id]) {
            counts[id] = {
                id,
                name:
                  item.product.customName ??
                  item.product.defaultProduct?.name ??
                  "Unknown",
                sub: `Last ordered: ${item.quantity} · ${item.product.defaultProduct?.size ?? item.product.defaultProduct?.unitOfMeasure ?? ""}`.trim(),
                image: item.product.defaultProduct?.imageUrl?.[0] ?? null,
                totalOrdered: 0,
                lastQuantity: item.stock?.quantity,
                remaining: item.product.stock?.quantity ?? ""
              };
        }
        counts[id].totalOrdered += item.quantity;
        counts[id].lastQuantity = item.quantity;
      }
    }
    return Object.values(counts)
      .sort((a, b) => b.totalOrdered - a.totalOrdered)
      .slice(0, limit);
  }

export function useDeliveries() {
  const [usualPurchases, setUsualPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const warehouseId = localStorage.getItem("warehouseId");

      if (!warehouseId) {
        console.error("No warehouseId in localStorage");
        return;
      }

      const res = await fetch(`${API}/warehouses/${warehouseId}/deliveries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const deliveries = json.data ?? json;
      setUsualPurchases(
        getMostFrequent(Array.isArray(deliveries) ? deliveries : [])
      );
    } catch {
      console.error("Failed to fetch deliveries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return { usualPurchases, loading };
}
