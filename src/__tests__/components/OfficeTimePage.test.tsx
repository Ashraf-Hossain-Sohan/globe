import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OfficeTimePage from '../../components/OfficeTimePage';

// Mock matchMedia for components like Recharts that might need it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for Recharts
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('OfficeTimePage Component', () => {
  
  it('renders without crashing', async () => {
    let container;
    await act(async () => {
      const result = render(<OfficeTimePage />);
      container = result.container;
    });
    expect(container).toBeInTheDocument();
  });

  it('matches the snapshot', async () => {
    let container;
    await act(async () => {
      const result = render(<OfficeTimePage />);
      container = result.container;
    });
    expect(container).toMatchSnapshot();
  });

  it('has a valid React element type', async () => {
    expect(typeof OfficeTimePage).toBe('function');
  });

  it('handles mocked dependencies correctly', async () => {
    let container;
    await act(async () => {
      const result = render(<OfficeTimePage />);
      container = result.container;
    });
    expect(container).not.toBeNull();
  });

  it('completes the initial render cycle successfully', async () => {
    let root;
    await act(async () => {
      const result = render(<OfficeTimePage />);
      root = result.baseElement;
    });
    expect(root).toBeTruthy();
  });
});
