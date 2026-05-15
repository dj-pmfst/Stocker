import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL;

function authHeaders(json = false) {
  const token = localStorage.getItem("token");
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search?.trim()) params.set("search", search.trim());
      const query = params.size ? `?${params}` : "";

      const res = await fetch(`${API}/default-products${query}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      setProducts(json.data ?? json ?? []);
    } catch (err) {
      console.error("useProducts fetch failed:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}
