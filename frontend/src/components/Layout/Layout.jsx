import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from 'src/components/PageHeader/PageHeader';
import { NAV_ITEMS } from 'src/constants/navItems';
import styles from './layout.module.css';


export default function Layout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      <PageHeader></PageHeader>

      <main className="page">{children}</main>

      <nav className={styles.bottomNav}>
        {NAV_ITEMS.slice(0, 2).map(({ label, Icon, route }) => (
          <button
            key={label}
            className={`${styles.navItem} ${pathname === route ? styles.active : ''}`}
            onClick={() => navigate(route)}
          >
            <Icon active={pathname === route} />
            <span>{label}</span>
          </button>
        ))}

        <button
          className={`${styles.scanFab} ${pathname === '/scan' ? styles.active : ''}`}
          onClick={() => navigate('/scan')}
        >
          <div className={styles.scanCircle}>
            <img src="/assets/scan.svg" alt="scan icon"/>
            <p>SCAN</p>
          </div>       
        </button>

        {NAV_ITEMS.slice(2).map(({ label, Icon, route }) => (
          <button
            key={label}
            className={`${styles.navItem} ${pathname === route ? styles.active : ''}`}
            onClick={() => navigate(route)}
          >
            <Icon active={pathname === route} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
