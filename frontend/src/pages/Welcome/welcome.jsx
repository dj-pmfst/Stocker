import styles from "./welcome.module.css";
import { useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/home'), 2800)
    return () => clearTimeout(t)
  }, [navigate])
  const cartRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const cart = cartRef.current;
    const logo = logoRef.current;

    const handleAnimationEnd = () => {
      cart.style.display = "none";
      logo.style.visibility = "visible";
      logo.style.opacity = "1";
    };

    cart.addEventListener("animationend", handleAnimationEnd);
    return () => cart.removeEventListener("animationend", handleAnimationEnd);
  }, []);

  return (
    <div className={styles.welcome}>
      <img
        ref={cartRef}
        className={styles["logo-cart"]}
        src="/assets//cart-logo.svg"
      />
      <img ref={logoRef} className={styles.logo} src="/assets//Logo.svg" />
    </div>
  );
}
