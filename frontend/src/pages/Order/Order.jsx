import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/ProductCard/ProductCard";
import Search from "../../components/Search/Search";
import styles from './order.module.css'

const ALL_ITEMS = [
  { id: 1, name: 'Coca Cola',      size: '0.5 l'  },
  { id: 2, name: 'Sprite',         size: '0.5 l'  },
  { id: 3, name: 'Fanta',          size: '0.5 l'  },
  { id: 4, name: 'Espresso beans', size: '0.5 kg' },
  { id: 5, name: 'Milk',           size: '1 l'    },
];

const USUAL_PURCHASES = [
  { id: 1, name: 'Coca Cola', sub: '8 x 330 ml' },
  { id: 2, name: 'Sprite',    sub: '10 x 330 ml' },
  { id: 3, name: 'Fanta',     sub: '8 x 330 ml' },
];

export default function Order() {
  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.pageTitle}>order more items</p>

        <p className={styles.searchLabel}>search</p>
        <Search items={ALL_ITEMS} placeholder="Coca Cola (0.5 l)" onSelect={() => {}} />

        <p className={styles.usualTitle}>your usual purchases</p>

        <div className={styles.itemList}>
          {USUAL_PURCHASES.map(item => (
            <ProductCard
              key={item.id}
              name={item.name}
              sub={item.sub}
              image={item.image}
              onAdd={() => {}}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}