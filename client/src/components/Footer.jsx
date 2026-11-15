import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <div className="brand brand--light">🌿 Bloom &amp; Co.</div>
          <p>Healthy plants, beautiful planters and honest care advice, delivered to your door.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/shop">Shop plants</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/explore">Explore</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Account</Link>
        </div>
        <div>
          <h4>Visit</h4>
          <p>12 Greenhouse Lane<br />Hyderabad, India<br />hello@bloomandco.example</p>
        </div>
      </div>
      <div className="footer__bottom">© {new Date().getFullYear()} Bloom &amp; Co. A full stack learning project.</div>
    </footer>
  );
}
