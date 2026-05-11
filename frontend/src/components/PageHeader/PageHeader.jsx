import { useState } from "react";
import styles from "./PageHeader.module.css";
import Notifications from "../notifications/notifications";

export function PageHeader() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/assets/logo.svg" />
        </div>
        <p className={styles.title}>stocker</p>
        <button className={styles.notifBtn} onClick={() => setNotifOpen(true)}>
          <img src="/assets/Notification.svg" />
        </button>
      </header>

      <Notifications open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}