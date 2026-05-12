import styles from "./new.module.css";

const PROMOTIONS = [
  {
    id: 1,
    tag: "NEW",
    title: "Try the new Cedevita lemon grass flavor",
    highlightWord: "Cedevita",
    image: "/assets/cedevita.png",
    bg: "/assets/background.png",
  },
];

export default function New({ onClose }) {
  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.panel}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close">
          <img src="/assets/close.svg" />
        </button>

        <div className={styles.list}>
          {PROMOTIONS.map((promo) => (
            <div key={promo.id} className={styles.card}>
              <div
                className={styles.cardBg}
                style={{ backgroundImage: `url(${promo.bg})` }}>
                <img
                  src={promo.image}
                  alt={promo.title}
                  className={styles.productImg}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              <div className={styles.tag}>NEW</div>

              <p className={styles.caption}>
                {promo.title.split(promo.highlightWord).map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>
                      {part}
                      <span className={styles.highlight}>
                        {promo.highlightWord}
                      </span>
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
