import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
const INITIAL = { firstName: "", lastName: "", email: "", password: "" };

export function useAuth() {
  const navigate = useNavigate();
  const [fields, setFields] = useState(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const reset = () => {
    setFields(INITIAL);
    setError("");
  };

  const submit = async (isRegister) => {
    setError("");
    setLoading(true);
    try {
      const endpoint = isRegister ? "register" : "login";
      const body = isRegister
        ? fields
        : { email: fields.email, password: fields.password };

      const res = await fetch(`${API}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || (isRegister ? "Registration failed" : "Login failed")
        );

      if (isRegister) {
        reset();
        return { ok: true, registered: true };
      } else {
        const token = data.data?.accessToken ?? data.data?.token;
        localStorage.setItem("token", token);

        try {
          const whRes = await fetch(`${API}/warehouses`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const whJson = await whRes.json();
          const warehouses = Array.isArray(whJson.data)
            ? whJson.data
            : (whJson.data?.warehouses ?? []);
          if (warehouses.length > 0) {
            localStorage.setItem("warehouseId", String(warehouses[0].id));
          } else {
            localStorage.setItem("warehouseId", "1");
          }
        } catch {
          localStorage.setItem("warehouseId", "1");
        }

        navigate("/home");
        return { ok: true };
      }
    } catch (err) {
      setError(err.message);
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  return { fields, set, reset, error, loading, submit };
}
