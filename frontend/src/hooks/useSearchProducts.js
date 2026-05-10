import { useState, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL;
const LIMIT = 10

export function useSearchProducts() {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [currentQuery, setCurrentQuery] = useState('')
  const [currentCategory, setCurrentCategory] = useState('All')

  const fetchResults = useCallback(async (q, cat, pageNum, replace = false) => {
    setLoading(true)
    const params = new URLSearchParams({ page: pageNum, limit: LIMIT })

    if (q.trim()) params.set('search', q)
    if (cat !== 'All') params.set('category', cat)

    const json = await fetch(`${API}/products?${params}`).then(r => r.json())
    const newProducts = json.data?.products || []
    const totalPages = json.data?.totalPages || 1
    
    setProducts(prev => replace ? newProducts : [...prev, ...newProducts])
    setHasMore(pageNum < totalPages)
    setLoading(false)
    setSearched(true)
  }, [])

  const search = (q, cat) => {
    setCurrentQuery(q)
    setCurrentCategory(cat)
    setProducts([])
    setPage(1)
    setHasMore(false)
    fetchResults(q, cat, 1, true)
  }

  const loadMore = useCallback(() => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchResults(currentQuery, currentCategory, nextPage)
  }, [page, currentQuery, currentCategory, fetchResults])

  const reset = () => {
    setProducts([])
    setSearched(false)
    setHasMore(false)
    setPage(1)
  }

  return { products, hasMore, loading, searched, search, loadMore, reset }
}