import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Search from "../../components/Search/Search";
import New from "../../components/New/New";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Home.module.css";

const ALL_ITEMS = [
  { id: 1, name: "Coca Cola", size: "0.33 l" },
  { id: 2, name: "Fanta", size: "0.33 l" },
  { id: 3, name: "Sprite", size: "0.33 l" },
  { id: 4, name: "Espresso beans", size: "0.5 kg" },
  { id: 5, name: "Milk", size: "1 l" },
  { id: 6, name: "Matcha", size: "1 kg" },
];

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.sectionLabel}>ADD ITEMS</p>

        <Search
          items={ALL_ITEMS}
          placeholder="Coca Cola (0.33 l)"
          onSelect={setSelectedItem}
        />

        {selectedItem ? (
          <>
            <div className={styles.foundBanner}>
              <p className={styles.foundTitle}>
                THE ITEM HAS
                <br />
                BEEN MADE!
              </p>
              <img src="/assets/wand.svg" />
            </div>

            <div className={styles.cardWrap}>
              <ProductCard
                name={selectedItem.name}
                sub={selectedItem.size}
                image={selectedItem.image}
                onAdd={() => {}}
              />
            </div>

            <div className={styles.foundActions}>
              <button className="btn-primary">ADD QUANTITY</button>
              <button className="btn-outline">TRANSFER TO STORAGE</button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <img src="/assets/storage.png" />
            <p className={styles.emptyTitle}>
              add new items
              <br />
              to your storage
            </p>
            <button className="btn-primary" onClick={() => setShowWhatsNew(true)}>WHAT'S NEW?</button>
          </div>
        )}
      </div>
      {showWhatsNew && <New onClose={() => setShowWhatsNew(false)} />}
    </Layout>
  );
}
