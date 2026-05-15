import { useState, useEffect } from "react";
import { INITIAL_SCAN_RESULTS } from "../constants/scanResults";

const API = import.meta.env.VITE_API_URL;

export function useScanResults() {
  const [scanResults, setScanResults] = useState([]);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const warehouseId = localStorage.getItem("warehouseId");

    Promise.all(
      INITIAL_SCAN_RESULTS.map(async ({ id, amm }) => {
        const res = await fetch(
          `${API}/warehouses/${warehouseId}/products/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return null;
        const json = await res.json();
        const p = json.data ?? json;
        return {
          id: p.id,
          name: p.customName ?? p.defaultProduct?.name ?? "Unknown",
          size: p.defaultProduct?.unitOfMeasure ?? "",
          qty: p.stock?.quantity ?? 0,
          amm,
        };
      })
    )
      .then((results) =>
        setScanResults(results.filter(Boolean).filter((item) => item.qty > 0))
      )
      .catch((err) => console.error("Failed to load scan products:", err));
  }, []);

  const updateAmm = (id, amm) => {
    setScanResults((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amm } : item))
    );
  };

  const applyResults = async () => {
    setApplying(true);
    const token = localStorage.getItem("token");
    const warehouseId = localStorage.getItem("warehouseId");

    try {
      const results = await Promise.all(
        scanResults.map(async (item) => {
          const newQty = Math.max(0, item.qty - item.amm);
          await fetch(
            `${API}/warehouses/${warehouseId}/products/${item.id}/stock`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ quantity: newQty }),
            }
          );
          return { id: item.id, newQty };
        })
      );

      setScanResults((prev) =>
        prev
          .map((item) => {
            const r = results.find((r) => r.id === item.id);
            return r ? { ...item, qty: r.newQty } : item;
          })
          .filter((item) => item.qty > 0)
      );

      return { ok: true };
    } catch (err) {
      console.error("Failed to apply scan results:", err);
      return { ok: false, error: err.message };
    } finally {
      setApplying(false);
    }
  };

  return { scanResults, updateAmm, applyResults, applying };
}
