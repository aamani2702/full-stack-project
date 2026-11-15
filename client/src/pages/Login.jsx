import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Field from '../components/Field';
import { validateAll, validateEmail, validateRequired } from '../utils/validate';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validateAll(values, { email: validateEmail, password: validateRequired('Password') });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setServerError('');
    try {
      await login(values.email, values.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <form className="card auth__card" onSubmit={onSubmit} noValidate>
        <h1>Welcome back</h1>
        <p className="muted">Log in to share posts in the journal.</p>
        {serverError && <p className="alert alert--error" role="alert">{serverError}</p>}
        <Field label="Email" name="email" type="email" value={values.email} onChange={onChange} error={errors.email} autoComplete="email" />
        <Field label="Password" name="password" type="password" value={values.password} onChange={onChange} error={errors.password} autoComplete="current-password" />
        <button className="btn btn--block btn--lg" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        <p className="auth__alt">New here? <Link to="/register">Create an account</Link></p>
        <div className="demo-box">
          <strong>Demo accounts</strong>
          <button type="button" className="link-btn" onClick={() => setValues({ email: 'demo@bloom.com', password: 'Demo@1234' })}>Use user demo</button>
          <button type="button" className="link-btn" onClick={() => setValues({ email: 'admin@bloom.com', password: 'Admin@123' })}>Use admin demo</button>
        </div>
      </form>
    </div>
  );
}
