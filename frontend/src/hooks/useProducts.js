import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL;
const LIMIT = 10;

export function useProducts(category) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchProducts = useCallback(async (pageNum, cat, replace = false) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pageNum), limit: String(LIMIT) })

    if (cat !== "All") params.set("category", cat);

    const json = await fetch(`${API}/products?${params}`).then((r) => r.json());
    const newProducts = json.data?.products || [];
    const totalPages = json.data?.totalPages || 1;

    setProducts((prev) => (replace ? newProducts : [...prev, ...newProducts]));
    setHasMore(pageNum < totalPages);
    setLoading(false);
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
    fetchProducts(1, category, true);
  }, [category]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, category);
  }, [page, category, fetchProducts]);

  return { products, hasMore, loading, initialLoad, loadMore };
}
