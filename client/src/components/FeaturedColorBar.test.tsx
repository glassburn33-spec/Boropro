import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeaturedColorBar } from './FeaturedColorBar';
import type { FeaturedColor } from '@/data/glassAlchemyColors';

describe('FeaturedColorBar - Mobile Responsive Layout', () => {
  const defaultTemperature = 620; // Mid-range temperature for testing
  
  // Mock FeaturedColor object for testing
  const mockColor: FeaturedColor = {
    name: 'Test Color',
    manufacturer: 'Test Manufacturer',
    description: 'A test glass color',
    workingRange: { min: 500, max: 800 },
    strikeTemp: 650,
    kiln_darkening_start: 300,
    over_work_start: 900,
    tips: ['Tip 1', 'Tip 2'],
    silverEffect: {
      neutral: 'Silver Effect Neutral',
      slightlyReducing: 'Silver Effect Reducing',
      reducing: 'Silver Effect Reducing Strong'
    },
    atmosphereData: {
      neutral: [
        { hue: 'Red', rgb: 'rgb(255, 0, 0)' },
        { hue: 'Orange', rgb: 'rgb(255, 165, 0)' },
        { hue: 'Yellow', rgb: 'rgb(255, 255, 0)' }
      ],
      slightlyReducing: [
        { hue: 'Dark Red', rgb: 'rgb(139, 0, 0)' },
        { hue: 'Dark Orange', rgb: 'rgb(255, 140, 0)' },
        { hue: 'Gold', rgb: 'rgb(255, 215, 0)' }
      ],
      reducing: [
        { hue: 'Maroon', rgb: 'rgb(128, 0, 0)' },
        { hue: 'Brown', rgb: 'rgb(165, 42, 42)' },
        { hue: 'Dark Gold', rgb: 'rgb(184, 134, 11)' }
      ]
    }
  };

  it('renders component with responsive header layout', () => {
    const { container } = render(
      <FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />
    );
    
    const header = container.querySelector('.flex.flex-col.md\\:flex-row');
    expect(header).toBeTruthy();
  });

  it('applies responsive padding (p-3 on mobile, md:p-6 on desktop)', () => {
    const { container } = render(
      <FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />
    );
    
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv?.className).toContain('p-3');
    expect(mainDiv?.className).toContain('md:p-6');
  });

  it('renders responsive text sizes for headers', () => {
    const { container } = render(
      <FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />
    );
    
    const heading = container.querySelector('.text-lg.md\\:text-xl');
    expect(heading).toBeTruthy();
  });

  it('renders atmosphere buttons with shortened labels', () => {
    render(<FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />);
    
    expect(screen.getByText('Neutral')).toBeTruthy();
    expect(screen.getByText('Slightly Red')).toBeTruthy();
    expect(screen.getByText('Reducing')).toBeTruthy();
  });

  it('applies responsive color bar height (h-10 on mobile, md:h-12)', () => {
    const { container } = render(
      <FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />
    );
    
    const colorBar = container.querySelector('.w-full.h-10.md\\:h-12');
    expect(colorBar).toBeTruthy();
  });

  it('renders temperature scale with truncate class', () => {
    const { container } = render(
      <FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />
    );
    
    const tempScale = container.querySelector('.flex.justify-between.text-xs.text-slate-400.px-1.gap-1');
    expect(tempScale).toBeTruthy();
    
    const spans = tempScale?.querySelectorAll('.truncate');
    expect(spans?.length).toBe(3);
  });

  it('renders responsive grid for current color info', () => {
    const { container } = render(
      <FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />
    );
    
    const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    expect(grid).toBeTruthy();
  });

  it('applies break-words class to text content for mobile wrapping', () => {
    const { container } = render(
      <FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />
    );
    
    const textElements = container.querySelectorAll('.break-words');
    expect(textElements.length).toBeGreaterThan(0);
  });

  it('renders info button with flex-shrink-0 for mobile', () => {
    const { container } = render(
      <FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />
    );
    
    const infoButton = container.querySelector('button.flex-shrink-0');
    expect(infoButton).toBeTruthy();
  });

  it('renders atmosphere selector with flex-wrap for mobile', () => {
    const { container } = render(
      <FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />
    );
    
    const atmosphereSelector = container.querySelector('.flex.flex-wrap.gap-2.items-center');
    expect(atmosphereSelector).toBeTruthy();
  });

  it('applies responsive padding to color info box', () => {
    const { container } = render(
      <FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />
    );
    
    const colorBox = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-2.md\\:gap-4.p-2.md\\:p-4');
    expect(colorBox).toBeTruthy();
  });

  it('renders min-w-0 on header content for flex constraints', () => {
    const { container } = render(
      <FeaturedColorBar color={mockColor} temperatureC={defaultTemperature} />
    );
    
    const headerContent = container.querySelector('.min-w-0');
    expect(headerContent).toBeTruthy();
  });

  it('renders caution indicators with shortened text', () => {
    // Create a color that triggers both kiln darkening and over-work zones
    const triggerColor: FeaturedColor = {
      ...mockColor,
      kiln_darkening_start: 700,
      over_work_start: 600
    };
    
    render(<FeaturedColorBar color={triggerColor} temperatureC={defaultTemperature} />);
    
    // Check for shortened text (not full "Kiln darkening zone")
    expect(screen.getByText('⚠️ Kiln darkening')).toBeTruthy();
    expect(screen.getByText('⚠️ Over-work')).toBeTruthy();
  });

  it('renders caution indicators with flex-wrap for mobile', () => {
    const triggerColor: FeaturedColor = {
      ...mockColor,
      kiln_darkening_start: 700,
      over_work_start: 600
    };
    
    const { container } = render(
      <FeaturedColorBar color={triggerColor} temperatureC={defaultTemperature} />
    );
    
    const cautionContainer = container.querySelector('.flex.flex-wrap.gap-2');
    expect(cautionContainer).toBeTruthy();
  });
});
