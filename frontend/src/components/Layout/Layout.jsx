import { useLocation } from 'react-router-dom'
import { Navbar } from '../Navbar/Navbar'
import styles from './Layout.module.css'

const HAS_NAVBAR = ['/home', '/search', '/cart', '/profile', '/favourites', '/checkout', '/products', '/notifications']

export function Layout({ children }) {
  const { pathname } = useLocation()
  const showNavbar = HAS_NAVBAR.some(path => pathname.startsWith(path))

  return (
    <div className={styles.container}>
      <main className={showNavbar ? styles.withNavbar : ''}>
        {children}
      </main>
      {showNavbar && <Navbar />}
    </div>
  )
}