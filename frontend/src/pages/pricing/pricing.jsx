import { useState } from "react";
import styles from "./pricing.module.css";

const PLANS = [
  { id: "monthly", label: "1 Month", price: "$19.99", per: "/month" },
  { id: "yearly", label: "1 Year", price: "$199.99", per: "/year" },
  { id: "biannual", label: "6 Months", price: "$109.99", per: "/month" },
];

//prebacit ovo u konstante folder??

export default function Pricing({ onClose, onSelect }) {
  const [selected, setSelected] = useState("yearly");

  const handleStart = () => {
    onSelect?.(selected);
    onClose?.();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <div>
          <div className={styles.headerLogo}>
            <img src="/assets/TextLogoWhite.svg" />
          </div>
          <p className={styles.headerTagline}>your smart warehouse app</p>
        </div>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close">
          ✕
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.trialRow}>
          <span className={styles.trialTitle}>7 DAY FREE TRIAL</span>
          <span className={styles.trialIcon}>
            <img src="/assets/gem.svg" />
          </span>
        </div>

        <div className={styles.plans}>
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              className={`${styles.planOption} ${
                selected === plan.id ? styles.selected : ""
              }`}
              onClick={() => setSelected(plan.id)}>
              <div className={styles.planLeft}>
                <span className={styles.planPeriod}>{plan.label}</span>
                <span className={styles.planPrice}>
                  <strong>{plan.price}</strong>
                  {plan.per}
                </span>
              </div>
              <div
                className={`${styles.radio} ${
                  selected === plan.id ? styles.checked : ""
                }`}>
                {selected === plan.id && <div className={styles.radioDot} />}
              </div>
            </button>
          ))}

        </div>
          <button className={styles.ctaBtn} onClick={handleStart}>
            Start my free trial
          </button>
        <p className={styles.cancelNote}>Cancel anytime</p>
      </div>
    </div>
  );
}
