import { useEffect, useState } from "react";
import styles from "./notifications.module.css";

export default function Notifications({ open, onClose }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimating(true);
    } else if (visible) {
      setAnimating(false);
      const t = setTimeout(() => setVisible(false), 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <>
      <div
        className={`${styles.overlay} ${animating ? styles.overlayIn : styles.overlayOut}`}
        onClick={onClose}
      />
      <div className={`${styles.drawer} ${animating ? styles.drawerIn : styles.drawerOut}`}>
        <img src="/assets/spider.svg" className={styles.spiderWeb} />

        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>
            <img src="/assets/close.svg" />
          </button>
        </div>

        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No new notifications yet.</p>
          <p className={styles.emptySubtitle}>Come back later!</p>
        </div>

        <div className={styles.footer}>
          <img src="/assets/Notification.svg" className={styles.bellIcon} />
        </div>
      </div>
    </>
  );
}