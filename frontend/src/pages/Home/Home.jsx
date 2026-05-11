import { useState } from 'react';
import Layout from '../components/Layout';
import styles from "./Home.module.css"

export default function Home() {
  const [query, setQuery] = useState('');
  const [itemFound, setItemFound] = useState(false);

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
          <img src="/assets/search.svg"/>
        </div>

      </div>
    </Layout>
  );
}
