import Layout from "src/components/Layout/Layout";
import ProductCard from "src/components/ProductCard/ProductCard";
import EditModal from "src/components/EditModal/EditModal";
import { useStorage } from "src/hooks/useStorage";
import { useProductActions } from "src/hooks/useProductActions";
import { QUANTITY_FIELDS } from "src/constants/productFields";
import styles from "./storage.module.css";

export default function Storage() {
  const { storageData, loading, refetch } = useStorage();
  const { handleUpdateStock, editingProduct, setEditingProduct, saving } =
    useProductActions();

  const handleSaveAndRefresh = async (values) => {
    const result = await handleUpdateStock(values);
    if (result.ok) {
      setEditingProduct(null);
      await refetch();
    }
    return result;
  };

  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.pageTitle}>your storage</p>

        {loading ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              marginTop: 40,
            }}>
            Loading…
          </p>
        ) : storageData.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              marginTop: 40,
            }}>
            No products in storage yet.
          </p>
        ) : (
          storageData.map((section, i) => (
            <div key={i} className={styles.section}>
              <p className={styles.shelfZone}>Zone {section.zone}</p>
              {section.shelves.map((s, j) => (
                <div key={j}>
                  <p className={styles.shelfName}>Shelf {s.shelf}</p>
                  <div className={styles.itemList}>
                    {s.items.map((item) => (
                      <ProductCard
                        key={item.id}
                        name={item.name}
                        sub={`${item.sub} · ${item.remaining} remaining`}
                        warning={item.warning}
                        onEdit={() => setEditingProduct(item)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <EditModal
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveAndRefresh}
        title="update quantity"
        fields={QUANTITY_FIELDS}
        saving={saving}
      />
    </Layout>
  );
}
