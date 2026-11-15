import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { money } from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(setP).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="container section"><p className="alert alert--error">{error}</p><Link to="/shop">← Back to shop</Link></div>;
  if (!p) return <div className="container section"><div className="detail"><div className="skel__img" style={{ borderRadius: 24 }} /><div><div className="skel__line" /><div className="skel__line skel__line--short" /></div></div></div>;

  return (
    <div className="container section">
      <Link to="/shop" className="back">← Back to shop</Link>
      <div className="detail">
        <img src={p.image} alt={p.name} />
        <div>
          <span className="tag tag--static">{p.category}</span>
          <h1>{p.name}</h1>
          <div className="rating">★ {p.rating.toFixed(1)}</div>
          <p className="detail__price">{money(p.price)}</p>
          <p>{p.description}</p>
          <p className={p.stock > 0 ? 'ok' : 'bad'}>{p.stock > 0 ? `In stock (${p.stock} left)` : 'Out of stock'}</p>
          <button
            className="btn btn--lg"
            disabled={p.stock === 0}
            onClick={() => { add(p); setAdded(true); setTimeout(() => setAdded(false), 1800); }}
          >
            {added ? '✓ Added to cart' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
