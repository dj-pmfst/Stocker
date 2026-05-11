import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './auth.module.css';

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFirstName(''); setLastName('');
    setEmail(''); setPassword('');
    setError('');
  };

  const switchToRegister = () => { resetForm(); setIsRegister(true); };
  const switchToLogin    = () => { resetForm(); setIsRegister(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isRegister ? 'register' : 'login';
      const body = isRegister
        ? { firstName, lastName, email, password }
        : { email, password };

      const res = await fetch(`${API}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || (isRegister ? 'Registration failed' : 'Login failed'));

      if (isRegister) {
        resetForm();
        setIsRegister(false);
      } else {
        const token = data.data.token;
        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        initCart(payload.id);
        navigate('/home');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isRegister) {
    return (
      <div className="app-shell">
        <div className={styles.container}>
        <div className={styles.logo}>
          <img src="/assets/TextLogo.svg" alt="Stocker" />
          <p className={styles.tagline}>your smart warehouse app</p>
        </div> 

          <p className={styles.registerHint}>Please enter your details below to register.</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.nameRow}>
              <div className={`form-group ${styles.nameField}`}>
                <label className="form-label">Name</label>
                <div className={styles.plainInput}>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className={`form-group ${styles.nameField}`}>
                <label className="form-label">Last Name</label>
                <div className={styles.plainInput}>
                  <input
                    type="text"
                    placeholder="Smith"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="form-input-wrap">
                <img src="/assets/mail.svg" alt="" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <img src="/assets/lock.svg" alt="" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <img
                  src="/assets/eye.svg"
                  alt="toggle"
                  style={{ cursor: 'pointer', opacity: 1 }}
                  onClick={() => setShowPassword(v => !v)}
                />
              </div>
            </div>

            <button className={styles.registerBtn} type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className={styles.switchRow}>
            Already have an account?{' '}
            <span className={styles.switchLink} onClick={switchToLogin}>Login</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src="/assets/TextLogo.svg" alt="Stocker" />
          <p className={styles.tagline}>your smart warehouse app</p>
        </div>     

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="form-input-wrap">
              <img src="/assets/mail.svg" alt="" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrap">
              <img src="/assets/lock.svg" alt="" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <img
                src="/assets/eye.svg"
                alt="toggle"
                style={{ cursor: 'pointer', opacity: 1 }}
                onClick={() => setShowPassword(v => !v)}
              />
            </div>
          </div>

          <div className={styles.forgotWrap}>
            <span className={styles.forgotLink}>Forgot password</span>
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Sign In'}
          </button>
        </form>
        <div className={styles.divider}>Or</div>
        <button className={styles.registerBtn} onClick={switchToRegister}>
          Register
        </button>
      </div>
    </div>
  );
}