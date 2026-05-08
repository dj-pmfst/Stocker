import { useState } from "react";
import styles from "./PageHeader.module.css";
import Notifications from "src/components/notifications/notifications";

export function PageHeader() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/assets//logo.svg" />
        </div>
        <button className={styles.notifBtn} onClick={() => setNotifOpen(true)}>
          <img src="/assets//notification.svg" />
        </button>
      </header>

      <Notifications open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}