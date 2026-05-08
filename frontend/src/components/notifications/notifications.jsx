import styles from "./notifications.module.css";

export default function Notifications({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <span className={styles.title}>Notifikacije</span>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            Prazno ☹
          </p>
          <img src="/assets//IkonaNotifikacije.svg" />
        </div>
      </div>
    </>
  );
}
