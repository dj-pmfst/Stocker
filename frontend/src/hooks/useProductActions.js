import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

function authHeaders(json = false) {
  const token = localStorage.getItem("token");
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  };
}

function getWarehouseId() {
  return localStorage.getItem("warehouseId");
}

export function useProductActions(selectedItem, setSelectedItem) {
  const [saving, setSaving] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleTransfer = async (values) => {
    if (!selectedItem) return { ok: false, error: "No item selected." };

    const quantity = Number(values.quantity);
    const minimum = values.minimumQuantity ? Number(values.minimumQuantity) : undefined;

    if (values.quantity === "" || isNaN(quantity) || quantity < 0)
      return { ok: false, error: "Enter a valid quantity (0 or more)." };
    if (minimum !== undefined && (isNaN(minimum) || minimum < 0))
      return { ok: false, error: "Minimum quantity must be 0 or more." };
    if (minimum !== undefined && minimum > quantity)
      return { ok: false, error: "Minimum quantity can't exceed initial quantity." };

    const warehouseId = getWarehouseId();
    if (!warehouseId) return { ok: false, error: "No warehouse selected." };

    setTransferring(true);
    try {
      // 1. If no defaultProductId, create a default product first
      let defaultProductId = selectedItem.defaultProductId;
      if (!defaultProductId) {
        const dpRes = await fetch(`${API}/default-products`, {
          method: "POST",
          headers: authHeaders(true),
          body: JSON.stringify({
            name: selectedItem.name,
            unitOfMeasure: "PCS",
          }),
        });
        if (!dpRes.ok) {
          const err = await dpRes.json().catch(() => ({}));
          throw new Error(err.message || "Failed to create catalog entry.");
        }
        const dpJson = await dpRes.json();
        defaultProductId = dpJson.data?.id ?? dpJson.id;
      }

      // 2. Create the product in the warehouse
      const res = await fetch(`${API}/warehouses/${warehouseId}/products`, {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify({
          defaultProductId,
          customName: selectedItem.name,
          minimumQuantity: minimum,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create product.");
      }
      const json = await res.json();
      const id = json.data?.id ?? json.id;

      // 3. Set initial stock if quantity > 0
      if (quantity > 0) {
        await fetch(`${API}/warehouses/${warehouseId}/products/${id}/stock`, {
          method: "PUT",
          headers: authHeaders(true),
          body: JSON.stringify({ quantity }),
        });
      }

      setSelectedItem((prev) => ({ ...prev, id }));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || "Failed to transfer to storage." };
    } finally {
      setTransferring(false);
    }
  };

  const handleSetQuantity = async (values) => {
    const quantity = Number(values.quantity);
    if (values.quantity === "") return { ok: false, error: "Enter a quantity." };
    if (isNaN(quantity) || quantity < 1) return { ok: false, error: "Quantity must be 1 or more." };
    if (!selectedItem?.id) return { ok: false, error: "Transfer to storage first." };

    const warehouseId = getWarehouseId();
    if (!warehouseId) return { ok: false, error: "No warehouse selected." };

    setSaving(true);
    try {
      const res = await fetch(`${API}/warehouses/${warehouseId}/products/${selectedItem.id}/stock`, {
        method: "PUT",
        headers: authHeaders(true),
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

    const warehouseId = getWarehouseId();
    if (!warehouseId) return { ok: false, error: "No warehouse selected." };

    setSaving(true);
    try {
      const res = await fetch(`${API}/warehouses/${warehouseId}/products/${editingProduct.id}/stock`, {
        method: "PUT",
        headers: authHeaders(true),
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