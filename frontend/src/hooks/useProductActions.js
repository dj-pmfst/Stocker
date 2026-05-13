import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export function useProductActions(selectedItem, setSelectedItem) {
  const [saving, setSaving] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleTransfer = async (values) => {
    if (!selectedItem) return { ok: false, error: "No item selected." };

    const quantity = Number(values.quantity);
    const minimum = values.minimumQuantity
      ? Number(values.minimumQuantity)
      : undefined;

    if (values.quantity === "" || isNaN(quantity) || quantity < 0)
      return { ok: false, error: "Enter a valid quantity (0 or more)." };
    if (minimum !== undefined && (isNaN(minimum) || minimum < 0))
      return { ok: false, error: "Minimum quantity must be 0 or more." };
    if (minimum !== undefined && minimum > quantity)
      return {
        ok: false,
        error: "Minimum quantity can't exceed initial quantity.",
      };

    setTransferring(true);

    try {
      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defaultProductId: selectedItem.defaultProductId,
          customName: selectedItem.name,
          minimumQuantity: values.minimumQuantity
            ? Number(values.minimumQuantity)
            : undefined,
        }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const id = json.data?.id ?? json.id;

      if (values.quantity && Number(values.quantity) > 0) {
        await fetch(`${API}/products/${id}/stock`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: Number(values.quantity) }),
        });
      }

      setSelectedItem((prev) => ({ ...prev, id }));
      return { ok: true };
    } catch {
      return { ok: false, error: "Failed to transfer to storage." };
    } finally {
      setTransferring(false);
    }
  };

  const handleSetQuantity = async (values) => {
    const quantity = Number(values.quantity);
    if (values.quantity === "")
      return { ok: false, error: "Enter a quantity." };
    if (isNaN(quantity) || quantity < 1)
      return { ok: false, error: "Quantity must be 1 or more." };
    if (!selectedItem?.id)
      return { ok: false, error: "Transfer to storage first." };

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

  const handleUpdateStock = async (values) => {
    const quantity = Number(values.quantity);
    if (values.quantity === "") return { ok: false, error: "Enter a quantity." };
    if (isNaN(quantity) || quantity < 0) return { ok: false, error: "Quantity must be 0 or more." };
    if (!editingProduct?.id) return { ok: false, error: "No product selected." };

    setSaving(true);
    try {
      const res = await fetch(`${API}/products/${editingProduct.id}/stock`, {
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

  return {
    handleTransfer,
    handleSetQuantity,
    handleUpdateStock,
    editingProduct,
    setEditingProduct,
    saving,
    transferring,
  };
}
