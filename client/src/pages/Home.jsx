import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import Reveal from '../components/Reveal';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validate';

const steps = [
  ['🌱', 'Hand-picked', 'Every plant is chosen and inspected by our growers.'],
  ['📦', 'Safe delivery', 'Packed with care so it arrives happy and healthy.'],
  ['💧', 'Care guidance', 'Simple plant-care tips from our community journal.'],
];

const categories = [
  ['Indoor', '🪴', 'Statement foliage', 'photo-1545239705-1564e58b9e4a'],
  ['Succulent', '🌵', 'Low-fuss beauties', 'photo-1509423350716-97f9360b4e09'],
  ['Flowering', '🌸', 'Blooms all year', 'photo-1566836610593-62a64888a216'],
  ['Herb', '🌿', 'For your kitchen', 'photo-1618375569909-3c8616cf7733'],
];

const reviews = [
  ['Aisha K.', 'My monstera arrived perfectly packed and has already put out two new leaves. Gorgeous!', 5],
  ['Rahul M.', 'The journal tips saved my snake plant. Great shop, even better community.', 5],
  ['Priya S.', 'Fast delivery, healthy plants and a lovely terracotta set. Will order again.', 4],
];

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const toast = useToast();

  useEffect(() => {
    api.get('/products?sort=rating').then((d) => setFeatured(d.slice(0, 4))).catch(() => setFeatured([]));
  }, []);

  const subscribe = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    setEmailErr(err);
    if (!err) { toast('You are subscribed. Welcome to Bloom!', '💌'); setEmail(''); }
  };

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="eyebrow">New season arrivals</span>
            <h1>Bring a little <em>green</em> into every room.</h1>
            <p>Healthy houseplants, handsome planters and honest care advice, delivered right to your door.</p>
            <div className="hero__cta">
              <Link to="/shop" className="btn btn--lg">Shop plants</Link>
              <Link to="/journal" className="btn btn--ghost btn--lg">Read the journal</Link>
            </div>
            <ul className="stats">
              <li><strong>14+</strong> varieties</li>
              <li><strong>4.7★</strong> average rating</li>
              <li><strong>Free</strong> care guides</li>
            </ul>
          </div>
          <div className="hero__art">
            <div className="blob" />
            <img src="https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=75" alt="Lush houseplants by a window" />
            <div className="float float--a"><span>🚚</span><div><strong>Free delivery</strong><small>orders over $50</small></div></div>
            <div className="float float--b"><span>⭐</span><div><strong>4.9 rating</strong><small>2,000+ happy growers</small></div></div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>🌿 Peat-free soil &nbsp;·&nbsp; ♻️ Plastic-free packaging &nbsp;·&nbsp; 💚 30-day plant guarantee &nbsp;·&nbsp; 🚚 Fast delivery &nbsp;·&nbsp; 🌸 Hand-picked by growers &nbsp;·&nbsp;</span>
          ))}
        </div>
      </div>

      <section className="container section">
        <Reveal>
          <div className="section__head"><h2>Shop by category</h2><Link to="/shop">All plants →</Link></div>
        </Reveal>
        <div className="grid grid--4">
          {categories.map(([name, icon, sub, photo], i) => (
            <Reveal key={name} delay={i * 80}>
              <Link to="/shop" className="tile" style={{ backgroundImage: `linear-gradient(to top, rgba(18,48,31,.85), rgba(18,48,31,.05) 65%), url(https://images.unsplash.com/${photo}?auto=format&fit=crop&w=600&q=70)` }}>
                <span className="tile__icon">{icon}</span>
                <strong>{name}</strong>
                <small>{sub}</small>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section section--tight">
        <Reveal>
          <div className="section__head"><h2>Customer favourites</h2><Link to="/shop">View all →</Link></div>
        </Reveal>
        {featured === null && <Skeleton count={4} />}
        {featured && featured.length === 0 && <p className="muted">Start the API server to see plants here.</p>}
        {featured && featured.length > 0 && (
          <div className="grid grid--4">
            {featured.map((p, i) => <Reveal key={p._id} delay={i * 70}><ProductCard product={p} /></Reveal>)}
          </div>
        )}
      </section>

      <section className="band">
        <div className="container grid grid--3">
          {steps.map(([icon, title, text], i) => (
            <Reveal key={title} delay={i * 100}>
              <div className="feature"><div className="feature__icon">{icon}</div><h3>{title}</h3><p>{text}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section">
        <Reveal><h2 className="center">Loved by plant parents</h2></Reveal>
        <div className="grid grid--3 mt-sm">
          {reviews.map(([name, text, stars], i) => (
            <Reveal key={name} delay={i * 100}>
              <figure className="card review">
                <div className="review__stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
                <blockquote>“{text}”</blockquote>
                <figcaption><span className="avatar">{name[0]}</span>{name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section">
        <Reveal>
          <div className="newsletter">
            <div>
              <h2>Get 10% off your first order</h2>
              <p>Plant-care tips and new arrivals, once a month. No spam.</p>
            </div>
            <form onSubmit={subscribe} noValidate>
              <div className="newsletter__row">
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
                <button className="btn btn--light">Subscribe</button>
              </div>
              {emailErr && <p className="newsletter__err">{emailErr}</p>}
            </form>
          </div>
        </Reveal>
      </section>
    </>
  );
}
