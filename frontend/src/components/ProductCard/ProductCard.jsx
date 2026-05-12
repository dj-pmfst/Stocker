import styles from './productcard.module.css';

const PlusIcon = () => (
    <img src="/assets/plus.svg"/>
);

export default function ProductCard({ name, sub, warning, image, onAdd }) {
  return (
    <div className={styles.card}>
      {image
        ? <img src={image} alt={name} className={styles.img} />
        : <div className={styles.imgPlaceholder}>Img</div>
      }

      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        {sub && <p className={styles.sub}>{sub}</p>}
        {warning && <p className={styles.warning}>{warning}</p>}
      </div>

      <button className={styles.addBtn} onClick={onAdd} aria-label="Add">
        <PlusIcon />
      </button>
    </div>
  );
}