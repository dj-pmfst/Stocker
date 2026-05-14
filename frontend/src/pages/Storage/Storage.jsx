import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/ProductCard/ProductCard";
import EditModal from "../../components/EditModal/EditModal";
import { useStorage } from "../../hooks/useStorage";
import { useProductActions } from "../../hooks/useProductActions";
import { QUANTITY_FIELDS } from "../../constants/productFields";
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
              <p className={styles.shelfName}>Shelf {section.shelf}</p>
              <div className={styles.itemList}>
                {section.items.map((item) => (
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
