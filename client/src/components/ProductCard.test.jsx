import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import ProductCard from './ProductCard';

const product = { _id: '1', name: 'Monstera', price: 34, category: 'Indoor', image: 'x.jpg', rating: 4.9, stock: 3 };
const wrap = (p) =>
  render(
    <MemoryRouter><ToastProvider><CartProvider><ProductCard product={p} /></CartProvider></ToastProvider></MemoryRouter>
  );

describe('ProductCard', () => {
  it('shows name, price and an enabled add button', () => {
    wrap(product);
    expect(screen.getByText('Monstera')).toBeInTheDocument();
    expect(screen.getByText('$34.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();
  });

  it('disables the button when sold out', () => {
    wrap({ ...product, stock: 0 });
    expect(screen.getByRole('button', { name: 'Sold out' })).toBeDisabled();
  });

  it('warns about low stock', () => {
    wrap(product);
    expect(screen.getByText('Only 3 left')).toBeInTheDocument();
  });
});
