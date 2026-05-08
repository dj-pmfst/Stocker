import { NavLink } from "react-router-dom"
import styles from './Navbar.module.css'

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/home" end className={({ isActive }) => isActive ? styles.active : ''}>
        <img src="/assets//home.svg"/>
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => isActive ? styles.active : ''}>
        <img src="/assets//search.svg"/>
      </NavLink>
      <NavLink to="/favourites" className={({ isActive }) => isActive ? styles.active : ''}>
        <img src="/assets//heart.svg"/>
      </NavLink>
      <NavLink to="/cart" className={({ isActive }) => isActive ? styles.active : ''}>
        <img src="/assets//bag.svg"/>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : ''}>
        <img src="/assets//profile.svg"/>
      </NavLink>
    </nav>
  )
}