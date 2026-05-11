import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

const HomeIcon = ({ active }) => (
  <img src="/assets/home.svg"/>
);
const StorageIcon = ({ active }) => (
  <img src="/assets/storage.svg"/>
);
const OrderIcon = ({ active }) => (
  <img src="/assets/cart.svg"/>
);
const ProfileIcon = ({ active }) => (
  <img src="/assets/profile.svg"/>
);

const NAV_ITEMS = [
  { label: 'Home',    Icon: HomeIcon,    route: '/home' },
  { label: 'Storage', Icon: StorageIcon, route: '/storage' },
  { label: 'Order',   Icon: OrderIcon,   route: '/order' },
  { label: 'Profile', Icon: ProfileIcon, route: '/profile' },
];

//prebacit isto u konstante myb

//moran dodat i uppeercase efekt umisto da je tekst auto caps 

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      <header className={styles.topbar}>
        <div className={styles.topbarLogo}>
          <div className={styles.topbarLogoIcon}>
            <img src="/assets/logo.svg" alt="stocker logo"/>
            STOCKER 
          </div>
        </div>
      </header>

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
