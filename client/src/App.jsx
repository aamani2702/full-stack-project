import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Journal from './pages/Journal';
import Explore from './pages/Explore';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Route guard: redirects to /login when logged out, or home when role is insufficient
function Protected({ children, admin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="center-note">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Protected admin><Dashboard /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
