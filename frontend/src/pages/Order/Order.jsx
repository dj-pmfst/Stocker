import Layout from "../../components/Layout/Layout";
import styles from './order.module.css'

const USUAL_PURCHASES = [
  { id: 1, name: 'Coca Cola', pack: '8 x 330 ml' },
  { id: 2, name: 'Sprite',    pack: '10 x 330 ml' },
  { id: 3, name: 'Fanta',     pack: '8 x 330 ml' },
];

export default function Order() {
  return (
    <Layout>
      <div className={styles.container}>
        
      </div>
    </Layout>
  );
}
