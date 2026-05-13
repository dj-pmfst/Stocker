import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Search from "../../components/Search/Search";
import New from "../../components/New/New";
import ProductCard from "../../components/ProductCard/ProductCard";
import EditModal from "../../components/EditModal/EditModal";
import { useProducts } from "../../hooks/useProducts";
import { useProductActions } from "../../hooks/useProductActions";
import {
  CREATE_FIELDS,
  TRANSFER_FIELDS,
  QUANTITY_FIELDS,
} from "../../constants/productFields";
import styles from "./home.module.css";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const { products: catalogItems, loading: catalogLoading } = useProducts(
    "All",
    "default-products"
  );

  const { handleTransfer, handleSetQuantity, saving, transferring } =
    useProductActions(selectedItem, setSelectedItem);

  const handleCreate = (values) => {
    setSelectedItem({
      id: null,
      defaultProductId: values.defaultProductId ?? null,
      name: values.name,
      size: values.size,
    });
    return { ok: true };
  };

  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.sectionLabel}>add items</p>

        <Search
          items={catalogItems}
          loading={catalogLoading}
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
                onAdd={null}
              />
            </div>

            <div className={styles.foundActions}>
              <button
                className="btn-primary"
                onClick={() =>
                  selectedItem?.id
                    ? setShowQuantity(true)
                    : setShowTransfer(true)
                }>
                {selectedItem?.id ? "add quantity" : "set quantity & transfer"}
              </button>
              {selectedItem?.id && (
                <button className="btn-outline" disabled>
                  in storage
                </button>
              )}
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

      {!selectedItem && (
        <div className={styles.whatsNewRow}>
          <button
            className={styles.whatsNew}
            onClick={() => setShowWhatsNew(true)}>
            see what's new
          </button>
        </div>
      )}

      {showWhatsNew && <New onClose={() => setShowWhatsNew(false)} />}

      <EditModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={handleCreate}
        title="create product"
        fields={CREATE_FIELDS}
        saving={false}
      />

      <EditModal
        open={showQuantity}
        onClose={() => setShowQuantity(false)}
        onSave={handleSetQuantity}
        title="set quantity"
        fields={QUANTITY_FIELDS}
        saving={saving}
      />

      <EditModal
        open={showTransfer}
        onClose={() => setShowTransfer(false)}
        onSave={handleTransfer}
        title="transfer to storage"
        fields={TRANSFER_FIELDS}
        saving={transferring}
      />
    </Layout>
  );
}
