import styles from "./notifications.module.css";

export default function Notifications({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <span className={styles.title}>Notifications</span>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            No new notifications yet. 
          </p>
          <img src="/assets/Notification.svg" />
        </div>
      </div>
    </>
  );
}
