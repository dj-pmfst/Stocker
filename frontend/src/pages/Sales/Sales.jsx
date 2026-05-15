import { React, useState } from "react";
import { BAR_DATA, PERIODS } from "src/constants/salesItems";
import Layout from "src/components/Layout/Layout";
import styles from "./sales.module.css";

function DotsButton() {
  return (
    <button className={styles.dotsBtn} aria-label="More options">
      <span /><span /><span />
    </button>
  );
}

function StatCard({ label, value, change, direction }) {
  const isUp = direction === "up";
  return (
    <div className={styles.statCard}>
      <div className={styles.statCardTop}>
        <span className={styles.statLabel}>{label}</span>
        <DotsButton />
      </div>
      <div className={styles.statCardBot}>
        <span className={styles.statValue}>{value}</span>
        <span className={`${styles.badge} ${isUp ? styles.badgeUp : styles.badgeDown}`}>
          <i className={`ti ${isUp ? "ti-arrow-up" : "ti-arrow-down"}`} aria-hidden="true" />
          {change}
        </span>
      </div>
    </div>
  );
}

function SalesChart({ activePeriod, onPeriodChange }) {
  return (
    <div className={styles.salesReportCard}>
      <div className={styles.reportTitle}>Sales Report</div>
      <div className={styles.periodTabs}>
        {PERIODS.map((p) => (
          <button
            key={p}
            className={`${styles.periodTab} ${activePeriod === p ? styles.periodTabActive : ""}`}
            onClick={() => onPeriodChange(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <div className={styles.chartArea}>
        {BAR_DATA.map((b, i) => (
          <div key={b.lbl} className={styles.barWrap}>
            <div
              className={`${styles.bar} ${i === BAR_DATA.length - 1 ? styles.barHighlight : ""}`}
              style={{ height: b.h }}
            />
            <div className={styles.barLbl}>{b.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Sales() {
  const [activePeriod, setActivePeriod] = useState("All");

  return (
    <Layout>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Sales Overview</div>
        <div className={styles.sectionSub}>Your brief overview of your sales.</div>
      </div>

      <div className={styles.actionRow}>
        <button className={styles.exportBtn}>
          <i className="ti ti-cloud-upload" aria-hidden="true" />
          Export
        </button>
      </div>

      <div className={styles.statCards}>
        <StatCard label="Today's Revenue" value="1,648" change="168%" direction="up" />
        <StatCard label="Total Orders" value="19" change="22.1%" direction="up" />
        <StatCard label="Avg Revenue" value="$872" change="19%" direction="down" />
      </div>

      <SalesChart activePeriod={activePeriod} onPeriodChange={setActivePeriod} />
    </Layout>
  );
}