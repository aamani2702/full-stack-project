import { useState } from 'react';
import Field from '../components/Field';
import { validateAll, validateName, validateEmail, validateRequired } from '../utils/validate';

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', topic: 'General', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const onChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const errs = validateAll(values, { name: validateName, email: validateEmail, message: validateRequired('Message') });
    setErrors(errs);
    if (!Object.keys(errs).length) setSent(true); // demo: no email backend
  };

  return (
    <div className="container section contact">
      <div>
        <h1 className="page-title">Get in touch</h1>
        <p className="lead">Questions about a plant, an order or a collaboration? We reply within one working day.</p>
        <ul className="contact__list">
          <li>📍 12 Greenhouse Lane, Hyderabad</li>
          <li>✉️ hello@bloomandco.example</li>
          <li>🕘 Mon-Sat, 9am - 6pm</li>
        </ul>
      </div>
      {sent ? (
        <div className="card auth__card center-note"><h2>Message sent ✓</h2><p className="muted">Thanks {values.name.split(' ')[0]}, we will be in touch soon.</p></div>
      ) : (
        <form className="card auth__card" onSubmit={submit} noValidate>
          <Field label="Name" name="name" value={values.name} onChange={onChange} error={errors.name} />
          <Field label="Email" name="email" type="email" value={values.email} onChange={onChange} error={errors.email} />
          <Field label="Topic" name="topic" as="select" options={['General', 'Order help', 'Plant care', 'Wholesale']} value={values.topic} onChange={onChange} />
          <Field label="Message" name="message" as="textarea" value={values.message} onChange={onChange} error={errors.message} />
          <button className="btn btn--block btn--lg">Send message</button>
        </form>
      )}
    </div>
  );
}
