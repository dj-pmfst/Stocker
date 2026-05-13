import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/ProductCard/ProductCard";
import EditModal from "../../components/EditModal/EditModal";
import { useProductActions } from "../../hooks/useProductActions";
import { QUANTITY_FIELDS } from "../../constants/productFields";
import styles from "./storage.module.css";

const STORAGE_DATA = [
  {
    zone: "Zone A",
    shelf: "Shelf 1",
    items: [
      { id: 1, name: "Coca Cola", sub: "330 ml", remaining: 46 },
      { id: 2, name: "Sprite", sub: "330 ml", remaining: 53 },
      {
        id: 3,
        name: "Fanta",
        sub: "330 ml",
        remaining: 4,
        warning: "Warning, order more!",
      },
    ],
  },
  {
    zone: "Zone A",
    shelf: "Shelf 2",
    items: [{ id: 4, name: "Espresso beans", sub: "0.5 kg", remaining: 24 }],
  },
];

export default function Storage() {
  const { handleUpdateStock, editingProduct, setEditingProduct, saving } =
    useProductActions();

  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.pageTitle}>your storage</p>

        {STORAGE_DATA.map((section, i) => (
          <div key={i} className={styles.section}>
            <p className={styles.shelfZone}>{section.zone}</p>
            <p className={styles.shelfName}>{section.shelf}</p>
            <div className={styles.itemList}>
              {section.items.map((item) => (
                <ProductCard
                  key={item.id}
                  name={item.name}
                  sub={`${item.sub} · ${item.remaining} remaining`}
                  warning={item.warning}
                  image={item.image}
                  onEdit={() => setEditingProduct(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <EditModal
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleUpdateStock}
        title="update quantity"
        fields={QUANTITY_FIELDS}
        saving={saving}
      />
    </Layout>
  );
}
