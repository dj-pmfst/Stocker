import styles from "./error.module.css";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <Link to="/home" className={styles.homeButton}>
        x
      </Link>
      <div className={styles.notice}>
        <div className={styles.noticeContent}>
          <p>404</p>
          <img src="/assets/computer.png" alt="computer"/>
          <span>Oops. Looks like <br/> you got lost.</span>
        </div>
      </div>
    </div>
  );
}
