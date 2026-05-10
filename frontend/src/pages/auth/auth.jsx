import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./auth.module.css";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirm("");
    setError("");
    setSuccess("");
  };

  const switchTab = (t) => {
    setTab(t);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (tab === "register" && password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const endpoint = tab === "login" ? "login" : "register";
      const res = await fetch(`${API}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || `${tab === "login" ? "Login" : "Registration"} failed`
        );

      if (tab === "login") {
        const token = data.data.token;
        localStorage.setItem("token", token);
        const payload = JSON.parse(atob(token.split(".")[1]));
        initCart(payload.id);
        navigate("/pricing");
      } else {
        setSuccess("Account created");
        switchTab("login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isLogin = tab === "login";

  return (
    <div className="app-shell">
      <div className={styles.container}>

        <div className={styles.logo}>
          <img src="/assets/TextLogo.svg" alt="Stocker" />
        </div>
        <p className={styles.tagline}>your smart warehouse app</p>

        <div className={styles.tabGroup}>
          {['login', 'register'].map(t => (
            <button
              key={t}
              type="button"
              className={`${styles.tabBtn} ${tab === t ? styles.active : ''}`}
              onClick={() => switchTab(t)}
            >
              {t === 'login' ? 'Log In' : 'Register'}
            </button>
          ))}
        </div>

        {error   && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="form-input-wrap">
              <img src="/assets/mail.svg" alt="" />
              <input type="email" placeholder="name@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrap">
              <img src="/assets/lock.svg" alt="" />
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
              <img src="/assets/eye.svg" alt="toggle" style={{ cursor: 'pointer', opacity: 1 }}
                onClick={() => setShowPassword(v => !v)} />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="form-input-wrap">
                <img src="/assets/lock.svg" alt="" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••••"
                  value={confirm} onChange={e => setConfirm(e.target.value)} required />
              </div>
            </div>
          )}

          {isLogin && (
            <div className={styles.forgotWrap}>
              <span className="form-label">Remember me</span>
              <span className={styles.forgotLink}>Forgot password</span>
            </div>
          )}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading
              ? isLogin ? 'Logging in…' : 'Creating account…'
              : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {isLogin && (
          <>
            <div className={styles.divider}>Or</div>
            <button type="button" className={styles.socialBtn}>
              <img src="/assets/google.svg" alt="Google" />
              Sign in with Google
            </button>
            <button type="button" className={styles.socialBtn}>
              <img src="/assets/facebook.svg" alt="Facebook" />
              Sign in with Facebook
            </button>
          </>
        )}
      </div>
    </div>
  );
}