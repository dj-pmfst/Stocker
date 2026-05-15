import { useState, useEffect } from "react";
import styles from "./editmodal.module.css";

const STORAGE_ZONES = ["A", "B", "C"];

export default function EditModal({
  open,
  onClose,
  onSave,
  title,
  fields,
  saving,
}) {
  const [values, setValues] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      const init = {};
      fields.forEach((f) => {
        init[f.key] = f.value ?? "";
      });
      setValues(init);
      setError("");
    }
  }, [open, fields]);

  if (!open) return null;

  const handleSave = async () => {
    setError("");
    const result = await onSave(values);
    if (result?.ok === false) {
      setError(result.error ?? "Something went wrong.");
    } else {
      onClose();
    }
  };

  const renderField = (f) => {
    if (f.key === "storage_zone") {
      return (
        <select
          className={styles.input}
          value={values[f.key] ?? ""}
          onChange={(e) =>
            setValues((v) => ({ ...v, [f.key]: e.target.value }))
          }
          disabled={saving}>
          <option value="">Select zone…</option>
          {STORAGE_ZONES.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      );
    }

    if (f.key === "shelf_number") {
      return (
        <input
          className={styles.input}
          type="number"
          min={1}
          value={values[f.key] ?? ""}
          onChange={(e) =>
            setValues((v) => ({ ...v, [f.key]: e.target.value }))
          }
          disabled={saving}
        />
      );
    }

    return (
      <input
        className={styles.input}
        type={f.type ?? "text"}
        value={values[f.key] ?? ""}
        onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
        disabled={saving}
      />
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.title}>{title}</p>
        {fields.map((f) => (
          <div key={f.key} className={styles.fieldWrap}>
            <label className={styles.label}>{f.label}</label>
            {renderField(f)}
          </div>
        ))}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className={styles.save}
            onClick={handleSave}
            disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
