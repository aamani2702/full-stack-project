import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Field from '../components/Field';
import { validateAll, validateName, validateEmail, validatePassword } from '../utils/validate';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validateAll(values, {
      name: validateName,
      email: validateEmail,
      password: validatePassword,
      confirm: (v) => (v === values.password ? '' : 'Passwords do not match.'),
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setServerError('');
    try {
      await register(values.name, values.email, values.password);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <form className="card auth__card" onSubmit={onSubmit} noValidate>
        <h1>Create your account</h1>
        <p className="muted">Join the Bloom community in under a minute.</p>
        {serverError && <p className="alert alert--error" role="alert">{serverError}</p>}
        <Field label="Full name" name="name" value={values.name} onChange={onChange} error={errors.name} autoComplete="name" />
        <Field label="Email" name="email" type="email" value={values.email} onChange={onChange} error={errors.email} autoComplete="email" />
        <Field label="Password" name="password" type="password" value={values.password} onChange={onChange} error={errors.password} autoComplete="new-password" />
        <Field label="Confirm password" name="confirm" type="password" value={values.confirm} onChange={onChange} error={errors.confirm} autoComplete="new-password" />
        <button className="btn btn--block btn--lg" disabled={busy}>{busy ? 'Creating…' : 'Sign up'}</button>
        <p className="auth__alt">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
