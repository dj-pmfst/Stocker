import { useState, useRef, useEffect } from "react";
import styles from "./search.module.css";

const SearchIcon = () => <img src="/assets/search.svg" />;

export default function Search({
  items = [],
  placeholder = "Search...",
  onSelect,
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef(null);

  const suggestions = query.trim()
    ? items.filter((i) =>
        `${i.name} (${i.size})`.toLowerCase().includes(query.toLowerCase())
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
    setQuery(`${item.name} (${item.size})`);
    setFocused(false);
    onSelect?.(item);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSelect?.(null);
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
        <SearchIcon />
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          {suggestions.map((item) => (
            <button
              key={item.id}
              className={styles.item}
              onMouseDown={() => handleSelect(item)}>
              {item.name} ({item.size})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
