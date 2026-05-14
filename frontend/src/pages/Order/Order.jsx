import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/ProductCard/ProductCard";
import Search from "../../components/Search/Search";
import Loader from "../../components/Loader/Loader";
import EditModal from "../../components/EditModal/EditModal";
import { useSearchProducts } from "../../hooks/useSearchProducts";
import { useDeliveries } from "../../hooks/useDeliveries";
import { useCreateDelivery } from "../../hooks/useCreateDelivery";
import styles from "./order.module.css";

const API = import.meta.env.VITE_API_URL;
const WAREHOUSE_ID = 1; // dfgfhjASDFGH

const ORDER_FIELDS = [
  {
    key: "quantity",
    label: "Quantity",
    type: "number",
    placeholder: "e.g. 50",
  },
];

async function resolveWarehouseProduct(defaultProductId) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/warehouses/${WAREHOUSE_ID}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.find((p) => p.defaultProductId === defaultProductId) ?? null;
  } catch {
    return null;
  }
}

export default function Order() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderModal, setOrderModal] = useState(false);

  const {
    products,
    loading: searchLoading,
    search,
    reset,
  } = useSearchProducts();
  const { usualPurchases, loading: deliveriesLoading } = useDeliveries();
  const { createDelivery } = useCreateDelivery();

  const handleSearch = (query) => {
    if (query.trim()) {
      search(query, "All");
    } else {
      reset();
      setSelectedItem(null);
      setResolveError("");
    }
  };

  const handleSelect = async (catalogItem) => {
    setResolveError("");
    setResolving(true);
    const warehouseProduct = await resolveWarehouseProduct(catalogItem.id);
    setResolving(false);

    if (!warehouseProduct) {
      setResolveError("This product hasn't been added to your warehouse yet.");
      return;
    }

    setSelectedItem({
      id: warehouseProduct.id,
      name: warehouseProduct.customName ?? catalogItem.name,
      sub: catalogItem.size ?? "",
      image: catalogItem.image ?? null,
    });
  };

  const handleSelectUsual = (item) => {
    setResolveError("");
    setSelectedItem(item);
  };

  const handleOrder = async (values) => {
    const quantity = Number(values.quantity);
    if (!quantity || quantity < 1)
      return { ok: false, error: "Enter a valid quantity." };

    setOrdering(true);
    const result = await createDelivery({
      productId: selectedItem.id,
      quantity,
    });
    setOrdering(false);

    if (!result.ok) return { ok: false, error: result.error };

    setOrderModal(false);
    setSelectedItem(null);
    reset();
    return { ok: true };
  };

  if (deliveriesLoading)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.pageTitle}>order more items</p>

        <p className={styles.searchLabel}>search</p>
        <Search
          items={products}
          placeholder="Coca Cola (0.33 l)"
          onSelect={handleSelect}
          onSearch={handleSearch}
          loading={searchLoading || resolving}
        />

        {resolveError && (
          <p style={{ color: "var(--error)", marginTop: 8 }}>{resolveError}</p>
        )}

        {selectedItem ? (
          <>
            <p className={styles.resultTitle}>
              {selectedItem.name.toUpperCase()}
            </p>
            <ProductCard
              name={selectedItem.name}
              sub={selectedItem.sub}
              image={selectedItem.image}
              onAdd={null}
            />
            <div className={styles.orderBtnWrap}>
              <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={() => setOrderModal(true)}>
                order
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.usualTitle}>your usual purchases</p>
            <div className={styles.itemList}>
              {usualPurchases.length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>
                  No delivery history yet.
                </p>
              ) : (
                usualPurchases.map((item) => (
                  <ProductCard
                    key={item.id}
                    name={item.name}
                    sub={item.sub}
                    image={item.image}
                    onAdd={() => handleSelectUsual(item)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      <EditModal
        open={orderModal}
        onClose={() => setOrderModal(false)}
        onSave={handleOrder}
        title="confirm order"
        fields={ORDER_FIELDS}
        saving={ordering}
      />
    </Layout>
  );
}
