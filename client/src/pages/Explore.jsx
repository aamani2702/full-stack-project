import { useEffect, useState } from 'react';

// Module 8: fetches EXTERNAL data from the free DummyJSON API (no key needed)
const TOPICS = [
  ['home-decoration', 'Home decor'],
  ['furniture', 'Furniture'],
  ['groceries', 'Groceries'],
  ['kitchen-accessories', 'Kitchen'],
];

export default function Explore() {
  const [topic, setTopic] = useState(TOPICS[0][0]);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetch(`https://dummyjson.com/products/category/${topic}?limit=8&select=title,price,thumbnail,rating,description`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { if (!cancelled) { setItems(d.products); setStatus('ready'); } })
      .catch(() => !cancelled && setStatus('error'));
    return () => { cancelled = true; };
  }, [topic]);

  return (
    <div className="container section">
      <h1 className="page-title">Explore</h1>
      <p className="muted">Styling ideas for your plants, loaded live from the public DummyJSON API.</p>
      <div className="chips">
        {TOPICS.map(([slug, label]) => (
          <button key={slug} className={`chip ${slug === topic ? 'chip--on' : ''}`} onClick={() => setTopic(slug)}>{label}</button>
        ))}
      </div>
      {status === 'loading' && <p className="muted">Loading…</p>}
      {status === 'error' && <p className="alert alert--error">Could not reach DummyJSON. Check your connection.</p>}
      <div className="grid grid--4">
        {status === 'ready' && items.map((p) => (
          <article className="card product" key={p.id}>
            <div className="product__img"><img src={p.thumbnail} alt={p.title} loading="lazy" /></div>
            <div className="product__body">
              <h3>{p.title}</h3>
              <div className="rating">★ {p.rating}</div>
              <div className="product__foot"><strong>${p.price}</strong></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
