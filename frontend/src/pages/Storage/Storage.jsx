import Layout from "../../components/Layout/Layout";
import styles from "./storage.module.css";

const PlusIcon = () => <img src="/assets/plus.svg" />;

const STORAGE_DATA = [
  {
    zone: "Zone A",
    shelf: "Shelf 1",
    items: [
      {
        id: 1,
        name: "Coca Cola",
        size: "330 ml",
        remaining: 46,
        warning: false,
      },
      { id: 2, name: "Sprite", size: "330 ml", remaining: 53, warning: false },
      { id: 3, name: "Fanta", size: "330 ml", remaining: 4, warning: true },
    ],
  },
  {
    zone: "Zone B",
    shelf: "Shelf 2",
    items: [
      {
        id: 4,
        name: "Espresso beans",
        size: "0.5 kg",
        remaining: 24,
        warning: false,
      },
    ],
  },
];

export default function Storage() {
  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.pageTitle}>YOUR STORAGE</p>

        {STORAGE_DATA.map((section, i) => (
          <div key={i} className={styles.section}>
            <p className={styles.shelfZone}>{section.zone}</p>
            <p className={styles.shelfName}>{section.shelf}</p>
            <div className={styles.itemList}>
              {section.items.map((item) => (
                <div key={item.id} className="product-card">
                  {/* <div className="product-img-placeholder">Img</div> ovo triba ubacit */}
                  <div className="product-info">
                    <p className="product-name">{item.name}</p>
                    <p className="product-sub">{item.size}</p>
                    <p
                      className={`product-sub${
                        item.warning ? " warning" : ""
                      }`}>
                      {item.remaining} pieces remaining
                      {item.warning && " — Warning, order more!"}
                    </p>
                  </div>
                  <button className="add-btn">
                    <PlusIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
