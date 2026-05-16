import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DragonTearsBar } from './DragonTearsBar';

describe('DragonTearsBar - Mobile Responsive Layout', () => {
  const mockOnInfoClick = () => {};
  const defaultTemperature = 620; // Mid-range temperature for testing

  it('renders component with responsive header layout', () => {
    const { container } = render(
      <DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    
    const header = container.querySelector('.flex.flex-col.md\\:flex-row');
    expect(header).toBeTruthy();
  });

  it('applies responsive padding (p-3 on mobile, md:p-6 on desktop)', () => {
    const { container } = render(
      <DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv?.className).toContain('p-3');
    expect(mainDiv?.className).toContain('md:p-6');
  });

  it('renders responsive text sizes for headers', () => {
    const { container } = render(
      <DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    
    const heading = container.querySelector('.text-base.md\\:text-lg');
    expect(heading).toBeTruthy();
  });

  it('renders atmosphere buttons with shortened labels', () => {
    render(<DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    expect(screen.getByText('Neutral')).toBeTruthy();
    expect(screen.getByText('Slightly Red')).toBeTruthy();
    expect(screen.getByText('Reducing')).toBeTruthy();
  });

  it('applies responsive color bar height (h-10 on mobile, md:h-12)', () => {
    const { container } = render(
      <DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    
    const colorBar = container.querySelector('.w-full.h-10.md\\:h-12');
    expect(colorBar).toBeTruthy();
  });

  it('renders temperature scale with truncate class', () => {
    const { container } = render(
      <DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    
    const tempScale = container.querySelector('.flex.justify-between.text-xs.text-gray-500.mb-4.gap-1');
    expect(tempScale).toBeTruthy();
    
    const spans = tempScale?.querySelectorAll('.truncate');
    expect(spans?.length).toBe(3);
  });

  it('renders responsive grid for current state display', () => {
    const { container } = render(
      <DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    
    const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    expect(grid).toBeTruthy();
  });

  it('applies break-words class to text content for mobile wrapping', () => {
    const { container } = render(
      <DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    
    const textElements = container.querySelectorAll('.break-words');
    expect(textElements.length).toBeGreaterThan(0);
  });

  it('renders info button with flex-shrink-0 for mobile', () => {
    const { container } = render(
      <DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    
    const infoButton = container.querySelector('button.flex-shrink-0');
    expect(infoButton).toBeTruthy();
  });

  it('renders atmosphere selector with flex-wrap for mobile', () => {
    const { container } = render(
      <DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    
    const atmosphereSelector = container.querySelector('.flex.flex-wrap.gap-2.items-center');
    expect(atmosphereSelector).toBeTruthy();
  });

  it('applies responsive padding to state display box', () => {
    const { container } = render(
      <DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    
    const stateBox = container.querySelector('.bg-gray-800\\/50.rounded.p-2.md\\:p-3');
    expect(stateBox).toBeTruthy();
  });

  it('renders min-w-0 on header content for flex constraints', () => {
    const { container } = render(
      <DragonTearsBar onInfoClick={mockOnInfoClick} temperatureC={defaultTemperature} />
    );
    
    const headerContent = container.querySelector('.min-w-0');
    expect(headerContent).toBeTruthy();
  });
});
