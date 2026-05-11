import { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import styles from './Home.module.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const itemFound = query.toLowerCase().includes('coca');

  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.sectionLabel}>ADD ITEMS</p>

        <div className="search-bar" style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Coca Cola (0.33 l)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <img src="/assets/search.svg" />
        </div>

        {itemFound ? (
          <>
            <div className={styles.foundBanner}>
              <p className={styles.foundTitle}>THE ITEM HAS<br />BEEN MADE!</p>
              <img src="/assets/wand.svg"/>
            </div>

            <div className={`product-card ${styles.cardWrap}`}>
              <img src="/assets/cola.png" />
              <div className="product-info">
                <p className="product-name">Coca Cola</p>
                <p className="product-sub">330 ml</p>
              </div>
              <button className="add-btn">
                <img src="/assets/plus.svg" />
              </button>
            </div>

            <div className={styles.foundActions}>
              <button className="btn-primary">ADD QUANTITY</button>
              <button className="btn-outline">TRANSFER TO STORAGE</button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <img src="/assets/storage.png" />
            <p className={styles.emptyTitle}>ADD NEW ITEMS<br />TO YOUR STORAGE</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
