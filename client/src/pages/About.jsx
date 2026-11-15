const team = [
  ['🌳', 'Our roots', 'Bloom & Co. started on a sunny balcony with three cuttings and a lot of curiosity.'],
  ['🤝', 'Our promise', 'Healthy plants or your money back. We stand behind every leaf we ship.'],
  ['♻️', 'Our planet', 'Plastic-free packaging, peat-free soil and reusable terracotta wherever we can.'],
];

export default function About() {
  return (
    <div className="container section">
      <h1 className="page-title">About Bloom &amp; Co.</h1>
      <p className="lead">We believe every home is better with something alive in it. We grow, curate and deliver plants that are easy to love, and share the know-how to keep them thriving.</p>
      <div className="grid grid--3">
        {team.map(([i, t, p]) => (
          <div key={t} className="card feature feature--card"><div className="feature__icon">{i}</div><h3>{t}</h3><p>{p}</p></div>
        ))}
      </div>
      <h2 className="mt">Tech behind this site</h2>
      <p className="muted">React · React Router · Node.js · Express · MongoDB · JWT · bcrypt</p>
    </div>
  );
}
