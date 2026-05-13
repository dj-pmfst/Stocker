import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/ProductCard/ProductCard";
import EditModal from "../../components/EditModal/EditModal";
import { useProductActions } from "../../hooks/useProductActions";
import { QUANTITY_FIELDS } from "../../constants/productFields";
import styles from "./scan.module.css";

const CameraIcon = () => <img src="/assets/camera.svg" />;

const SCAN_RESULTS = [
  { id: 1, name: "Coca Cola", size: "330 ml", qty: 8 },
  { id: 2, name: "Sprite", size: "330 ml", qty: 7 },
  { id: 3, name: "Fanta", size: "330 ml", qty: 4 },
  { id: 4, name: "Milk", size: "500 ml", qty: 2 },
];

const PulsatingLoader = () => (
  <img src="/assets/pulse.svg" className={styles.pulseLoader} />
);

function ScanCamera({ onScan }) {
  return (
    <>
      <div className={styles.cameraIconWrap}>
        <CameraIcon />
      </div>
      <div className={styles.viewfinder} onClick={onScan}>
        <p className={styles.viewfinderHint}>
          Tap to scan
          <br />
          (camera feed here)
        </p>
        <div className={styles.corners}>
          <div className={`${styles.corner} ${styles.cornerTl}`} />
          <div className={`${styles.corner} ${styles.cornerTr}`} />
          <div className={`${styles.corner} ${styles.cornerBl}`} />
          <div className={`${styles.corner} ${styles.cornerBr}`} />
        </div>
      </div>
      <div className={styles.qrHint}>
        <img src="/assets/scan.png" />
        <p className={styles.qrText}>
          please scan
          <br />
          the qr code
        </p>
      </div>
    </>
  );
}

function ScanLoading() {
  return (
    <div className={styles.loadingFullscreen}>
      <PulsatingLoader />
      <p className={styles.loadingText}>
        please wait
        <br />
        applying results
      </p>
    </div>
  );
}

function ScanFeedback({ onApply, onEdit }) {
  return (
    <>
      <div className={styles.cameraIconWrap}>
        <CameraIcon />
      </div>
      <p className={styles.itemsUsedLabel}>items used this day:</p>
      <div className={styles.feedbackList}>
        {SCAN_RESULTS.map((item) => (
          <ProductCard
            key={item.id}
            name={item.name}
            sub={`${item.size} · ${item.qty} remaining`}
            image={item.image}
            onEdit={() => onEdit(item)}
          />
        ))}
        <div className={styles.orderBtnWrap}>
          <button
            className="btn-primary"
            style={{ width: "100%" }}
            onClick={onApply}>
            apply
          </button>
        </div>
      </div>
    </>
  );
}

function ScanSuccess() {
  return (
    <div className={styles.successFullscreen}>
      <img src="/assets/sorted.png" className={styles.successIcon} />
      <p className={styles.successText}>
        The items have been
        <br />
        removed from the storage
      </p>
    </div>
  );
}

export default function Scan() {
  const [state, setState] = useState("camera");
  const { handleUpdateStock, editingProduct, setEditingProduct, saving } =
    useProductActions();

  const handleScan = () => setState("feedback");

  const handleApply = () => {
    setState("loading");
    setTimeout(() => setState("success"), 2200);
  };

  return (
    <Layout>
      <div className={styles.container}>
        {state === "camera" && <ScanCamera onScan={handleScan} />}
        {state === "feedback" && (
          <ScanFeedback onApply={handleApply} onEdit={setEditingProduct} />
        )}
        {state === "loading" && <ScanLoading />}
        {state === "success" && <ScanSuccess />}
      </div>

      <EditModal
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleUpdateStock}
        title="update quantity"
        fields={QUANTITY_FIELDS}
        saving={saving}
      />
    </Layout>
  );
}
