import { useEffect, useState } from 'react';
import { api } from '../api';
import Field from '../components/Field';
import { money } from '../components/ProductCard';
import { validateAll, validateRequired, validatePrice } from '../utils/validate';

const CATS = ['Indoor', 'Succulent', 'Flowering', 'Herb', 'Accessory'];
const blank = { name: '', description: '', price: '', category: 'Indoor', image: '', stock: 10 };

// Admin-only product CRUD
export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [values, setValues] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = () => api.get('/products').then(setProducts).catch((e) => setMessage({ type: 'error', text: e.message }));
  useEffect(() => { load(); }, []);

  const onChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const errs = validateAll(values, {
      name: validateRequired('Name'),
      description: validateRequired('Description'),
      price: validatePrice,
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const payload = { ...values, price: Number(values.price), stock: Number(values.stock) };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      setMessage({ type: 'ok', text: editingId ? 'Product updated.' : 'Product added.' });
      setValues(blank);
      setEditingId(null);
      load();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const edit = (p) => {
    setEditingId(p._id);
    setValues({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await api.del(`/products/${p._id}`);
      setMessage({ type: 'ok', text: 'Product deleted.' });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="container section">
      <h1 className="page-title">Admin dashboard</h1>
      <div className="stat-row">
        <div className="card stat"><span>Products</span><strong>{products.length}</strong></div>
        <div className="card stat"><span>Units in stock</span><strong>{products.reduce((n, p) => n + p.stock, 0)}</strong></div>
        <div className="card stat"><span>Inventory value</span><strong>{money(products.reduce((n, p) => n + p.stock * p.price, 0))}</strong></div>
      </div>

      <form className="card compose" onSubmit={submit} noValidate>
        <h3>{editingId ? 'Edit product' : 'Add a product'}</h3>
        {message.text && <p className={`alert ${message.type === 'error' ? 'alert--error' : 'alert--ok'}`}>{message.text}</p>}
        <div className="form-grid">
          <Field label="Name" name="name" value={values.name} onChange={onChange} error={errors.name} />
          <Field label="Category" name="category" as="select" options={CATS} value={values.category} onChange={onChange} />
          <Field label="Price ($)" name="price" type="number" min="0" step="0.01" value={values.price} onChange={onChange} error={errors.price} />
          <Field label="Stock" name="stock" type="number" min="0" value={values.stock} onChange={onChange} />
        </div>
        <Field label="Image URL" name="image" value={values.image} onChange={onChange} placeholder="https://…" />
        <Field label="Description" name="description" as="textarea" value={values.description} onChange={onChange} error={errors.description} />
        <div className="row">
          <button className="btn">{editingId ? 'Save changes' : 'Add product'}</button>
          {editingId && <button type="button" className="btn btn--ghost" onClick={() => { setEditingId(null); setValues(blank); }}>Cancel</button>}
        </div>
      </form>

      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th /></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><div className="cell-product"><img src={p.image} alt="" />{p.name}</div></td>
                <td>{p.category}</td>
                <td>{money(p.price)}</td>
                <td>{p.stock}</td>
                <td className="actions">
                  <button className="link-btn" onClick={() => edit(p)}>Edit</button>
                  <button className="link-btn link-btn--danger" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
