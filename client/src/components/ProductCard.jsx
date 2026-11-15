import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const money = (n) => `$${Number(n).toFixed(2)}`;

const loadWish = () => {
  try { return JSON.parse(localStorage.getItem('bloom_wish')) || []; } catch { return []; }
};

// Props: product (object) - image, rating, price, wishlist heart and add-to-cart
export default function ProductCard({ product }) {
  const { add } = useCart();
  const toast = useToast();
  const [wished, setWished] = useState(() => loadWish().includes(product._id));
  const out = product.stock === 0;

  const toggleWish = () => {
    const list = loadWish();
    const next = wished ? list.filter((id) => id !== product._id) : [...list, product._id];
    localStorage.setItem('bloom_wish', JSON.stringify(next));
    setWished(!wished);
    toast(wished ? 'Removed from wishlist' : 'Saved to wishlist', wished ? '♡' : '♥');
  };

  return (
    <article className="card product">
      <div className="product__img">
        <Link to={`/shop/${product._id}`} aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        <span className="tag">{product.category}</span>
        <button className={`heart ${wished ? 'heart--on' : ''}`} onClick={toggleWish} aria-label="Toggle wishlist" aria-pressed={wished}>
          {wished ? '♥' : '♡'}
        </button>
        {product.stock > 0 && product.stock < 10 && <span className="low">Only {product.stock} left</span>}
      </div>
      <div className="product__body">
        <h3><Link to={`/shop/${product._id}`}>{product.name}</Link></h3>
        <div className="rating" aria-label={`Rated ${product.rating} out of 5`}>★ {product.rating.toFixed(1)}</div>
        <div className="product__foot">
          <strong>{money(product.price)}</strong>
          <button className="btn btn--sm" disabled={out} onClick={() => { add(product); toast(`${product.name} added to cart`, '🛍'); }}>
            {out ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}
