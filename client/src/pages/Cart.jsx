import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { money } from '../components/ProductCard';

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const [done, setDone] = useState(false);

  if (done)
    return (
      <div className="container section center-note">
        <h1>🎉 Thank you!</h1>
        <p>Your demo order has been placed. (No payment was taken - this is a learning project.)</p>
        <Link to="/shop" className="btn">Keep shopping</Link>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="container section center-note">
        <h1>Your cart is empty</h1>
        <p className="muted">Plants are waiting for a new home.</p>
        <Link to="/shop" className="btn">Browse plants</Link>
      </div>
    );

  return (
    <div className="container section">
      <h1 className="page-title">Your cart</h1>
      <div className="cart">
        <ul className="cart__list">
          {items.map((i) => (
            <li key={i.id} className="cart__row">
              <img src={i.image} alt="" />
              <div className="cart__info"><strong>{i.name}</strong><span>{money(i.price)}</span></div>
              <div className="qty">
                <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease">−</button>
                <span>{i.qty}</span>
                <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase">+</button>
              </div>
              <strong className="cart__line">{money(i.price * i.qty)}</strong>
              <button className="link-btn" onClick={() => remove(i.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <aside className="summary card">
          <h3>Order summary</h3>
          <div className="summary__row"><span>Subtotal</span><span>{money(total)}</span></div>
          <div className="summary__row"><span>Shipping</span><span>{total > 50 ? 'Free' : money(4.99)}</span></div>
          <div className="summary__row summary__total"><span>Total</span><span>{money(total + (total > 50 ? 0 : 4.99))}</span></div>
          <button className="btn btn--lg btn--block" onClick={() => { clear(); setDone(true); }}>Checkout</button>
        </aside>
      </div>
    </div>
  );
}
