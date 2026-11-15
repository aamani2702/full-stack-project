// Placeholder cards shown while products load.
export default function Skeleton({ count = 4 }) {
  return (
    <div className="grid grid--4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div className="card skel" key={i}>
          <div className="skel__img" />
          <div className="skel__line" />
          <div className="skel__line skel__line--short" />
        </div>
      ))}
    </div>
  );
}
