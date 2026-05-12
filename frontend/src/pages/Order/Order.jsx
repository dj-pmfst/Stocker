import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/ProductCard/ProductCard";
import Search from "../../components/Search/Search";
import { useSearchProducts } from "../../hooks/useSearchProducts";
import styles from './order.module.css';

const USUAL_PURCHASES = [
  { id: 1, name: 'Coca Cola', sub: '8 x 330 ml' },
  { id: 2, name: 'Sprite',    sub: '10 x 330 ml' },
  { id: 3, name: 'Fanta',     sub: '8 x 330 ml' },
];

export default function Order() {
  const [selectedItem, setSelectedItem] = useState(null);
  const { products, loading, search, reset } = useSearchProducts();

  const handleSearch = (query) => {
    if (query.trim()) {
      search(query, 'All');
    } else {
      reset();
      setSelectedItem(null);
    }
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.pageTitle}>order more items</p>

        {/* <p className={styles.searchLabel}>search</p> */}
        <Search
          items={products}
          placeholder="Coca Cola (0.33 l)"
          onSelect={handleSelect}
          onSearch={handleSearch}
          loading={loading}
        />

        {selectedItem ? (
          <>
            <p className={styles.resultTitle}>{selectedItem.name.toUpperCase()}</p>
            <ProductCard
              name={selectedItem.name}
              sub={`8 x ${selectedItem.size}`}
              image={selectedItem.image}
              onAdd={() => {}}
            />
            <div className={styles.orderBtnWrap}>
              <button className="btn-primary" style={{ width: '100%' }}>order</button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.usualTitle}>your usual purchases</p>
            <div className={styles.itemList}>
              {USUAL_PURCHASES.map(item => (
                <ProductCard
                  key={item.id}
                  name={item.name}
                  sub={item.sub}
                  onAdd={() => {}}
                />
              ))}
            </div>
            <div className={styles.orderBtnWrap}>
              <button className="btn-primary" style={{ width: '100%' }}>order</button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}