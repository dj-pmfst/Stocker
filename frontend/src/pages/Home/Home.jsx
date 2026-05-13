import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Search from "../../components/Search/Search";
import New from "../../components/New/New";
import ProductCard from "../../components/ProductCard/ProductCard";
import EditModal from "../../components/EditModal/EditModal";
import styles from "./home.module.css";

const ALL_ITEMS = [
  { id: 1, name: "Coca Cola", size: "0.33 l" },
  { id: 2, name: "Fanta", size: "0.33 l" },
  { id: 3, name: "Sprite", size: "0.33 l" },
  { id: 4, name: "Espresso beans", size: "0.5 kg" },
  { id: 5, name: "Milk", size: "1 l" },
  { id: 6, name: "Matcha", size: "1 kg" },
];

const CREATE_FIELDS = [
  { key: "name", label: "Product name", type: "text" },
  { key: "size", label: "Size / unit", type: "text" },
  { key: "category", label: "Category", type: "text" },
];

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = async (values) => {
    setSaving(true);
    try {
      console.log("create product", values);
      await new Promise((r) => setTimeout(r, 600)); //stavit loader
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Failed to create product." };
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.sectionLabel}>add items</p>

        <Search
          items={ALL_ITEMS}
          placeholder="Coca Cola (0.33 l)"
          onSelect={setSelectedItem}
        />

        {selectedItem ? (
          <>
            <div className={styles.foundBanner}>
              <p className={styles.foundTitle}>
                the item has
                <br />
                been made!
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
              <button className="btn-primary">add quantity</button>
              <button className="btn-outline">transfer to storage</button>
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
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              create product
            </button>
          </div>
        )}
      </div>
      
      <div className={styles.whatsNewRow}>
          <button className={styles.whatsNew} onClick={() => setShowWhatsNew(true)}>
            see what's new
          </button>
      </div>

      {showWhatsNew && <New onClose={() => setShowWhatsNew(false)} />}

      <EditModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={handleCreate}
        title="create product"
        fields={CREATE_FIELDS}
        saving={saving}
      />
    </Layout>
  );
}
