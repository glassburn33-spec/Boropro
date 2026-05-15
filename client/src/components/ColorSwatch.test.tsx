import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ColorSwatch, ColorSwatchRow, InlineColorSwatch } from './ColorSwatch';

describe('ColorSwatch Component', () => {
  it('renders a color swatch with correct background color', () => {
    const { container } = render(
      <ColorSwatch color="#FF0000" name="Red" />
    );
    const swatch = container.querySelector('div[style*="background"]');
    expect(swatch).toBeTruthy();
  });

  it('displays color name label by default', () => {
    render(<ColorSwatch color="#FF0000" name="Red" />);
    expect(screen.getByText('Red')).toBeTruthy();
  });

  it('hides label when showLabel is false', () => {
    render(<ColorSwatch color="#FF0000" name="Red" showLabel={false} />);
    expect(screen.queryByText('Red')).toBeFalsy();
  });

  it('renders correct size classes for small swatch', () => {
    const { container } = render(
      <ColorSwatch color="#FF0000" name="Red" size="sm" />
    );
    const swatch = container.querySelector('.w-10');
    expect(swatch).toBeTruthy();
  });

  it('renders correct size classes for medium swatch', () => {
    const { container } = render(
      <ColorSwatch color="#FF0000" name="Red" size="md" />
    );
    const swatch = container.querySelector('.w-16');
    expect(swatch).toBeTruthy();
  });

  it('renders correct size classes for large swatch', () => {
    const { container } = render(
      <ColorSwatch color="#FF0000" name="Red" size="lg" />
    );
    const swatch = container.querySelector('.w-20');
    expect(swatch).toBeTruthy();
  });

  it('has correct title attribute for accessibility', () => {
    const { container } = render(
      <ColorSwatch color="#FF0000" name="Red" />
    );
    const swatch = container.querySelector('[title]');
    expect(swatch?.getAttribute('title')).toContain('Red');
    expect(swatch?.getAttribute('title')).toContain('#FF0000');
  });
});

describe('ColorSwatchRow Component', () => {
  it('renders multiple color swatches', () => {
    const colors = [
      { color: '#FF0000', name: 'Red' },
      { color: '#00FF00', name: 'Green' },
      { color: '#0000FF', name: 'Blue' },
    ];
    render(<ColorSwatchRow colors={colors} />);
    
    expect(screen.getByText('Red')).toBeTruthy();
    expect(screen.getByText('Green')).toBeTruthy();
    expect(screen.getByText('Blue')).toBeTruthy();
  });

  it('hides labels when showLabels is false', () => {
    const colors = [
      { color: '#FF0000', name: 'Red' },
      { color: '#00FF00', name: 'Green' },
    ];
    render(<ColorSwatchRow colors={colors} showLabels={false} />);
    
    expect(screen.queryByText('Red')).toBeFalsy();
    expect(screen.queryByText('Green')).toBeFalsy();
  });

  it('renders with correct size', () => {
    const colors = [{ color: '#FF0000', name: 'Red' }];
    const { container } = render(
      <ColorSwatchRow colors={colors} size="lg" />
    );
    
    const swatch = container.querySelector('.w-20');
    expect(swatch).toBeTruthy();
  });

  it('handles empty color array', () => {
    const { container } = render(<ColorSwatchRow colors={[]} />);
    expect(container.querySelector('.flex')).toBeTruthy();
  });
});

describe('InlineColorSwatch Component', () => {
  it('renders inline color swatch', () => {
    const { container } = render(
      <InlineColorSwatch color="#FF0000" name="Red" />
    );
    const swatch = container.querySelector('span[style*="background"]');
    expect(swatch).toBeTruthy();
  });

  it('has correct inline styling', () => {
    const { container } = render(
      <InlineColorSwatch color="#FF0000" name="Red" />
    );
    const swatch = container.querySelector('span');
    expect(swatch?.className).toContain('inline-block');
    expect(swatch?.className).toContain('w-4');
    expect(swatch?.className).toContain('h-4');
  });

  it('has title attribute for accessibility', () => {
    const { container } = render(
      <InlineColorSwatch color="#FF0000" name="Red" />
    );
    const swatch = container.querySelector('[title]');
    expect(swatch?.getAttribute('title')).toBe('Red');
  });

  it('supports various color formats', () => {
    const colors = ['#FF0000', 'rgb(255, 0, 0)', 'red'];
    
    colors.forEach((color) => {
      const { container } = render(
        <InlineColorSwatch color={color} name="Test" />
      );
      const swatch = container.querySelector('span[style*="background"]');
      expect(swatch).toBeTruthy();
    });
  });
});
