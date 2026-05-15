import { useState, useRef, useEffect } from "react";
import styles from "./search.module.css";

export default function Search({
  items = [],
  placeholder = "Search...",
  onSelect,
  onSearch,
  loading,
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef(null);

  const SearchIcon = () => <img src="/assets/search.svg" />;

  const getLabel = (item) =>
    item.size !== undefined
      ? `${item.name} (${item.size})`
      : (item.customName ??
        item.defaultProduct?.name ??
        item.name ??
        "Unknown");

  const suggestions = onSearch
    ? items
    : query.trim()
      ? items.filter((i) =>
          getLabel(i).toLowerCase().includes(query.toLowerCase())
        )
      : items;

  const showDropdown = focused && suggestions.length > 0;

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (item) => {
    setQuery(getLabel(item));
    setFocused(false);
    onSelect?.(item);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSelect?.(null);
    onSearch?.(val);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
        />
        {loading ? <span className={styles.spinner} /> : <SearchIcon />}
      </div>
      {showDropdown && (
        <div className={styles.dropdown}>
          {suggestions.map((item) => (
            <button
              key={item.id}
              className={styles.item}
              onMouseDown={() => handleSelect(item)}>
              {getLabel(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
