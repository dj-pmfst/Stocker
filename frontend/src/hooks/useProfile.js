import { useState, useEffect, useCallback } from "react";
const API = import.meta.env.VITE_API_URL;

function authHeaders(token, json = false) {
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  };
}

export function useProfile() {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("employees") ?? "[]");
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API}/api/users/me`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((json) => setUser(json.data))
      .finally(() => setLoading(false));
  }, [token]);

  const updateUserField = useCallback(
    async (fields) => {
      setSaving(true);
      try {
        const res = await fetch(`${API}/api/users/me`, {
          method: "PUT",
          headers: authHeaders(token, true),
          body: JSON.stringify(fields),
        });
        const json = await res.json();
        if (json.data) setUser(json.data);
        return { ok: res.ok, data: json.data, error: json.error };
      } finally {
        setSaving(false);
      }
    },
    [token]
  );

  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!token) return;
    const warehouseId = localStorage.getItem("warehouseId");
    if (!warehouseId) return;
    fetch(`${API}/api/warehouses/${warehouseId}/members`, {
      headers: authHeaders(token),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!json) return;
        const members = json.data ?? json;
        const me = members.find(
          (m) => m.userId === user?.id || m.user?.email === user?.email
        );
        if (me) setRole(me.role);
      })
      .catch(() => {});
  }, [token, user]);

  const addEmployee = useCallback(({ name, email }) => {
    const newEmp = { id: Date.now(), name, email };
    setEmployees((prev) => {
      const updated = [...prev, newEmp];
      localStorage.setItem("employees", JSON.stringify(updated));
      return updated;
    });
    return { ok: true };
  }, []);

  const updateEmployee = useCallback((id, fields) => {
    setEmployees((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...fields } : e));
      localStorage.setItem("employees", JSON.stringify(updated));
      return updated;
    });
    return { ok: true };
  }, []);

  return {
    user,
    employees,
    loading,
    saving,
    role,
    updateUserField,
    addEmployee,
    updateEmployee,
  };
}
