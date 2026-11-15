import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  const links = [
    ['/shop', 'Shop'],
    ['/journal', 'Journal'],
    ['/explore', 'Explore'],
    ['/about', 'About'],
    ['/contact', 'Contact'],
  ];

  return (
    <header className="header">
      <div className="announce">🌱 Free shipping on orders over $50 · Healthy plants guaranteed</div>
      <div className="container header__inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand__mark">🌿</span> Bloom <span className="brand__amp">&amp;</span> Co.
        </Link>

        <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>

        <nav className={`nav ${open ? 'nav--open' : ''}`}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={close} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink>
          )}
          <div className="nav__actions">
            <Link to="/cart" className="cart-link" onClick={close} aria-label={`Cart, ${count} items`}>
              🛍 Cart{count > 0 && <span className="badge">{count}</span>}
            </Link>
            {user ? (
              <>
                <span className="hello">Hi, {user.name.split(' ')[0]}</span>
                <button className="btn btn--ghost btn--sm" onClick={() => { logout(); close(); navigate('/'); }}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost btn--sm" onClick={close}>Log in</Link>
                <Link to="/register" className="btn btn--sm" onClick={close}>Sign up</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
