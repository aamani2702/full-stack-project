import { validateEmail, validatePassword, validateAll, validateName } from './validate';

describe('validators', () => {
  it('accepts and rejects emails', () => {
    expect(validateEmail('a@b.co')).toBe('');
    expect(validateEmail('nope')).not.toBe('');
  });

  it('enforces password strength', () => {
    expect(validatePassword('short')).toMatch(/8 characters/);
    expect(validatePassword('alllowercase1')).toMatch(/upper case/);
    expect(validatePassword('Strong@123')).toBe('');
  });

  it('validateAll returns only failing fields', () => {
    const errors = validateAll({ name: 'A', email: 'a@b.co' }, { name: validateName, email: validateEmail });
    expect(Object.keys(errors)).toEqual(['name']);
  });
});
