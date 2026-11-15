import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container section center-note">
      <h1>404 🥀</h1>
      <p className="muted">This page has wilted away.</p>
      <Link to="/" className="btn">Back home</Link>
    </div>
  );
}
