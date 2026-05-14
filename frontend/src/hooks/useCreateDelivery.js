const API = import.meta.env.VITE_API_URL;
const WAREHOUSE_ID = 1; // zmnit

export function useCreateDelivery() {
  const createDelivery = async ({
    productId,
    quantity,
    shift = "MORNING",
    note,
  }) => {
    if (!productId) return { ok: false, error: "No product selected." };
    if (!quantity || quantity < 1)
      return { ok: false, error: "Enter a valid quantity." };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/warehouses/${WAREHOUSE_ID}/deliveries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shift,
          items: [{ productId, quantity }],
        }),
      });
      if (!res.ok) throw new Error();
      return { ok: true };
    } catch {
      return { ok: false, error: "Failed to create delivery." };
    }
  };

  return { createDelivery };
}
