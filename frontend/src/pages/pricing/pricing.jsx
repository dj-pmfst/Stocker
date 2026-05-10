import { useState } from 'react';
import styles from './pricing.module.css';

const PLANS = [
  { id: 'monthly', label: '1 Month',  price: '$19.99', per: '/month' },
  { id: 'yearly',  label: '1 Year',   price: '$199.99', per: '/year' },
  { id: 'biannual',label: '6 Months', price: '$109.99', per: '/month' },
];

export default function PricingModal({ onClose, onSelect }) {
  const [selected, setSelected] = useState('yearly');

  const handleStart = () => {
    onSelect?.(selected);
    onClose?.();
  };

  return (
    <div className={styles.overlay}>

        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

      <div className={styles.card}>
        <div className={styles.trialRow}>
          <span className={styles.trialTitle}>7 DAY FREE TRIAL</span>
        </div>

        <div className={styles.plans}>

        </div>

        <button className={styles.ctaBtn} onClick={handleStart}>
          Start my free trial
        </button>
        <p className={styles.cancelNote}>Cancel anytime</p>
      </div>
    </div>
  );
}
