import { useState } from 'react';

export default function PasswordInput({ value, onChange, placeholder = '••••••••••' }) {
  const [show, setShow] = useState(false);
  return (
    <div className="form-input-wrap">
      <img src="/assets/lock.svg" alt="" />
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <img
        src="/assets/eye.svg"
        alt="toggle"
        style={{ cursor: 'pointer', opacity: 1 }}
        onClick={() => setShow((v) => !v)}
      />
    </div>
  );
}