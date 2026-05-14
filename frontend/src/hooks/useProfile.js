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
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API}/users/me`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((json) => setUser(json.data))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API}/employees`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((json) => setEmployees(json.data ?? []))
      .catch(() => {});
  }, [token]);

  const updateUserField = useCallback(
    async (fields) => {
      setSaving(true);
      try {
        const res = await fetch(`${API}/users/me`, {
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

  const addEmployee = useCallback(
    async ({ name, email }) => {
      setSaving(true);
      try {
        const res = await fetch(`${API}/employees`, {
          method: "POST",
          headers: authHeaders(token, true),
          body: JSON.stringify({ name, email }),
        });
        const json = await res.json();
        if (json.data) setEmployees((prev) => [...prev, json.data]);
        return { ok: res.ok, data: json.data, error: json.error };
      } finally {
        setSaving(false);
      }
    },
    [token]
  );

  const updateEmployee = useCallback(
    async (id, fields) => {
      setSaving(true);
      try {
        const res = await fetch(`${API}/employees/${id}`, {
          method: "PUT",
          headers: authHeaders(token, true),
          body: JSON.stringify(fields),
        });
        const json = await res.json();
        if (json.data) {
          setEmployees((prev) =>
            prev.map((e) => (e.id === id ? json.data : e))
          );
        }
        return { ok: res.ok, data: json.data, error: json.error };
      } finally {
        setSaving(false);
      }
    },
    [token]
  );

  return {
    user,
    employees,
    loading,
    saving,
    updateUserField,
    addEmployee,
    updateEmployee,
  };
}
