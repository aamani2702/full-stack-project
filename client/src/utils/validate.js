// Form validation helpers (Module 5) - each returns an error string or ''.
export const validateName = (v) => (v.trim().length >= 2 ? '' : 'Name must be at least 2 characters.');

export const validateEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.';

export const validatePassword = (v) => {
  if (v.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(v) || !/[a-z]/.test(v) || !/\d/.test(v)) return 'Use upper case, lower case and a number.';
  return '';
};

export const validateRequired = (label) => (v) => (String(v).trim() ? '' : `${label} is required.`);

export const validatePrice = (v) => (Number(v) > 0 ? '' : 'Price must be greater than 0.');

// Runs a map of { field: validatorFn } over values; returns { field: error } with only failing fields.
export function validateAll(values, rules) {
  const errors = {};
  for (const [field, fn] of Object.entries(rules)) {
    const msg = fn(values[field] ?? '');
    if (msg) errors[field] = msg;
  }
  return errors;
}
