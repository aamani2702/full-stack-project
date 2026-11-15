import { useEffect, useState } from 'react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';

const CATEGORIES = ['All', 'Indoor', 'Succulent', 'Flowering', 'Herb', 'Accessory'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('loading'); // loading | ready | error

  // Re-fetch (debounced for typing) whenever a filter changes
  useEffect(() => {
    setStatus('loading');
    const t = setTimeout(() => {
      const params = new URLSearchParams({ category, sort, q });
      api
        .get(`/products?${params}`)
        .then((d) => { setProducts(d); setStatus('ready'); })
        .catch(() => setStatus('error'));
    }, 250);
    return () => clearTimeout(t);
  }, [category, sort, q]);

  return (
    <div className="container section">
      <h1 className="page-title">Shop</h1>
      <p className="muted">Find the perfect plant for your light, space and lifestyle.</p>

      <div className="toolbar">
        <input type="search" placeholder="Search plants…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="newest">Newest</option>
          <option value="rating">Top rated</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
        </select>
      </div>

      <div className="chips">
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip ${c === category ? 'chip--on' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {status === 'error' && <p className="alert alert--error">Could not load products. Is the API running?</p>}
      {status === 'loading' && <Skeleton count={8} />}
      {status === 'ready' && products.length === 0 && <p className="empty">No plants match your search.</p>}
      {status === 'ready' && <div className="grid grid--4">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>}
    </div>
  );
}
