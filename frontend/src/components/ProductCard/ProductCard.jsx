import styles from "./productcard.module.css";

const PlusIcon = () => <img src="/assets/plus.svg" />;
const EditIcon = () => <img src="/assets/pencil.svg" />;

const API = import.meta.env.VITE_API_URL;

export default function ProductCard({
  name,
  sub,
  warning,
  image,
  onAdd,
  onEdit,
}) {
  const imgSrc = image
  ? image.startsWith('http') ? image : `${API}/${image}`
  : null;
  return (
    <div className={styles.card}>
      {imgSrc ? (
        <img src={imgSrc} alt={name} className={styles.img} />
      ) : (
        <div className={styles.imgPlaceholder}>Img</div>
      )}

      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        {sub && <p className={styles.sub}>{sub}</p>}
        {warning && <p className={styles.warning}>{warning}</p>}
      </div>

      {onAdd && (
        <button className={styles.addBtn} onClick={onAdd} aria-label="Add">
          <PlusIcon />
        </button>
      )}
      {onEdit && (
        <button className={styles.editBtn} onClick={onEdit} aria-label="Edit">
          <EditIcon />
        </button>
      )}
    </div>
  );
}
