// Reusable labelled input / textarea / select with inline error message (Props demo).
export default function Field({ label, name, value, onChange, error, as = 'input', options, ...rest }) {
  const id = `f-${name}`;
  const common = { id, name, value, onChange, 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-err` : undefined, ...rest };
  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {as === 'textarea' && <textarea rows={5} {...common} />}
      {as === 'select' && (
        <select {...common}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {as === 'input' && <input {...common} />}
      {error && <p className="field__error" id={`${id}-err`}>{error}</p>}
    </div>
  );
}
