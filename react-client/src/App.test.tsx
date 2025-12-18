import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App shell', () => {
  it('renders the Jakarta EE Demo header', () => {
    render(<App />);
    expect(screen.getByText('Jakarta EE Demo')).toBeInTheDocument();
  });
});
