import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export function useProductActions(selectedItem, setSelectedItem) {
  const [saving, setSaving] = useState(false);
  const [transferring, setTransferring] = useState(false);

  const handleTransfer = async () => {
    if (!selectedItem) return;
    setTransferring(true);
    try {
      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defaultProductId: selectedItem.defaultProductId,
          customName: selectedItem.name,
        }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setSelectedItem((prev) => ({ ...prev, id: json.data?.id ?? json.id }));
    } catch {
      alert("Failed to transfer to storage.");
    } finally {
      setTransferring(false);
    }
  };

  const handleSetQuantity = async (values) => {
    const quantity = Number(values.quantity);
    if (!selectedItem?.id)
      return { ok: false, error: "Transfer to storage first." };
    if (isNaN(quantity) || quantity < 0)
      return { ok: false, error: "Enter a valid quantity." };
    setSaving(true);
    try {
      const res = await fetch(`${API}/products/${selectedItem.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error();
      return { ok: true };
    } catch {
      return { ok: false, error: "Failed to update quantity." };
    } finally {
      setSaving(false);
    }
  };

  return { handleTransfer, handleSetQuantity, saving, transferring };
}
