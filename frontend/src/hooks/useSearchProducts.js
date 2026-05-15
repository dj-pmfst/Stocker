import { useState, useCallback } from "react";

const API = import.meta.env.VITE_API_URL;
const LIMIT = 10;

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getWarehouseId() {
  return localStorage.getItem("warehouseId") ?? "1";
}

export function useSearchProducts() {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [page, setPage] = useState(1);

  const fetchResults = useCallback(async (q, pageNum, replace = false) => {
    setLoading(true);
    const warehouseId = getWarehouseId();
    const params = new URLSearchParams({ page: pageNum, limit: LIMIT });
    if (q.trim()) params.set("search", q.trim());

    try {
      const res = await fetch(
        `${API}/warehouses/${warehouseId}/products?${params}`,
        { headers: authHeaders() }
      );
      if (!res.ok) throw new Error(res.status);
      const json = await res.json();
      const newProducts = Array.isArray(json.data)
        ? json.data
        : (json.data?.products ?? []);
      const totalPages = json.data?.totalPages ?? 1;

      setProducts((prev) =>
        replace ? newProducts : [...prev, ...newProducts]
      );
      setHasMore(pageNum < totalPages);
    } catch (err) {
      console.error("useSearchProducts fetch failed:", err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  const search = (q) => {
    setCurrentQuery(q);
    setProducts([]);
    setPage(1);
    setHasMore(false);
    fetchResults(q, 1, true);
  };

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(currentQuery, nextPage);
  }, [page, currentQuery, fetchResults]);

  const reset = () => {
    setProducts([]);
    setSearched(false);
    setHasMore(false);
    setPage(1);
    setCurrentQuery("");
  };

  return { products, hasMore, loading, searched, search, loadMore, reset };
}
