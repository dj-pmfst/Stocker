import { useEffect, useRef, useState } from "react";
import styles from "./animation.module.css";

export default function WelcomeAnimation({
  onComplete,
  appName = "Stocker",
  logo,
}) {
  const rippleRef = useRef(null);
  const logoWrapRef = useRef(null);
  const appNameRef = useRef(null);
  const splashRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const ripple = rippleRef.current;
    const appNameEl = appNameRef.current;

    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    function animate(duration, onProgress, onDone, ease = easeInOut) {
      const start = performance.now();
      function step(now) {
        const raw = Math.min((now - start) / duration, 1);
        onProgress(ease(raw));
        if (raw < 1) requestAnimationFrame(step);
        else if (onDone) onDone();
      }
      requestAnimationFrame(step);
    }

    const W = window.innerWidth;
    const H = window.innerHeight;
    const maxDim = Math.sqrt(W * W + H * H);
    const logoIconW = 60;

    const t1 = setTimeout(() => {
      animate(
        1200,
        (e) => {
          ripple.style.transform = `translate(-50%, -50%) scale(${e * (maxDim / 80) * 2.2})`;
        },
        () => {
          const t2 = setTimeout(() => {
            animate(
              900,
              (e) => {
                appNameEl.style.maxWidth = `${e * 400}px`;
                appNameEl.style.opacity = Math.min(e * 2, 1).toFixed(3);
                appNameEl.style.paddingLeft = `${e * 20}px`;
              },
              () => {
                const t3 = setTimeout(() => {
                  setDone(true);
                  if (onComplete) onComplete();
                }, 350);
                return () => clearTimeout(t3);
              },
              easeOut
            );
          }, 80);
        }
      );
    }, 600);

    return () => clearTimeout(t1);
  }, [onComplete]);

  if (done) return null;

  const defaultLogo = <img src="/assets/logo.svg" />;

  return (
    <div className={styles.splash} ref={splashRef} aria-label="Loading">
      <div className={styles.ripple} ref={rippleRef} />

      <div className={styles.logoWrap} ref={logoWrapRef}>
        <div className={styles.logoIcon}>{logo ?? defaultLogo}</div>
        <div className={styles.appName} ref={appNameRef}>
          {appName}
        </div>
      </div>
    </div>
  );
}
