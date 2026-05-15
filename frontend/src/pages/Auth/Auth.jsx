import { useState } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import PasswordInput from 'src/components/PasswordInput/PasswordInput';
import styles from './auth.module.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const { fields, set, reset, error, loading, submit } = useAuth();

  const switchMode = (register) => { reset(); setIsRegister(register); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submit(isRegister);
    if (result?.registered) setIsRegister(false);
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
                    value={fields.firstName}
                    onChange={set('firstName')}
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
                    value={fields.lastName}
                    onChange={set('lastName')}
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
                  value={fields.email}
                  onChange={set('email')}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <PasswordInput value={fields.password} onChange={set('password')} />
            </div>

            <button className={styles.registerBtn} type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className={styles.switchRow}>
            Already have an account?{' '}
            <span className={styles.switchLink} onClick={() => switchMode(false)}>Login</span>
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
                value={fields.email}
                onChange={set('email')}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <PasswordInput value={fields.password} onChange={set('password')} />
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <div className={styles.divider}>Or</div>
        <button className={styles.registerBtn} onClick={() => switchMode(true)}>
          Register
        </button>
      </div>
    </div>
  );
}