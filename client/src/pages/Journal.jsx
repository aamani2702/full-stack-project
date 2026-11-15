import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import Field from '../components/Field';
import { validateAll, validateRequired } from '../utils/validate';

const empty = { title: '', body: '' };

// Full CRUD on /api/posts
export default function Journal() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [values, setValues] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const load = () =>
    api.get('/posts').then((d) => { setPosts(d); setStatus('ready'); }).catch(() => setStatus('error'));
  useEffect(() => { load(); }, []);

  const onChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const errs = validateAll(values, { title: validateRequired('Title'), body: validateRequired('Story') });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      if (editingId) await api.put(`/posts/${editingId}`, values);
      else await api.post('/posts', values);
      setValues(empty);
      setEditingId(null);
      setMessage('');
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setValues({ title: p.title, body: p.body });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.del(`/posts/${id}`);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const canEdit = (p) => user && (user.role === 'admin' || p.author?._id === user.id);

  return (
    <div className="container section journal">
      <h1 className="page-title">The Journal</h1>
      <p className="muted">Tips, stories and lessons from the Bloom community.</p>

      {user ? (
        <form className="card compose" onSubmit={submit} noValidate>
          <h3>{editingId ? 'Edit your post' : 'Share a story'}</h3>
          {message && <p className="alert alert--error">{message}</p>}
          <Field label="Title" name="title" value={values.title} onChange={onChange} error={errors.title} maxLength={120} />
          <Field label="Your story" name="body" as="textarea" value={values.body} onChange={onChange} error={errors.body} maxLength={4000} />
          <div className="row">
            <button className="btn">{editingId ? 'Save changes' : 'Publish'}</button>
            {editingId && <button type="button" className="btn btn--ghost" onClick={() => { setEditingId(null); setValues(empty); }}>Cancel</button>}
          </div>
        </form>
      ) : (
        <p className="alert">Want to post? <Link to="/login">Log in</Link> or <Link to="/register">sign up</Link>.</p>
      )}

      {status === 'loading' && <p className="muted">Loading…</p>}
      {status === 'error' && <p className="alert alert--error">Could not load posts.</p>}
      <div className="posts">
        {posts.map((p) => (
          <article key={p._id} className="card post">
            <h2>{p.title}</h2>
            <p className="post__meta">
              By {p.author?.name || 'Unknown'} · {new Date(p.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
            <p>{p.body}</p>
            {canEdit(p) && (
              <div className="row">
                <button className="link-btn" onClick={() => startEdit(p)}>Edit</button>
                <button className="link-btn link-btn--danger" onClick={() => remove(p._id)}>Delete</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
