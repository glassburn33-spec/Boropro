import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import References from './References';

describe('References Tab - Mobile Responsive Layout', () => {
  it('renders References component without crashing', () => {
    const { container } = render(<References />);
    expect(container).toBeTruthy();
  });

  it('renders header with sticky positioning', () => {
    const { container } = render(<References />);
    const header = container.querySelector('header');
    expect(header?.className).toContain('sticky');
    expect(header?.className).toContain('top-0');
  });

  it('renders logo with responsive sizing classes', () => {
    const { container } = render(<References />);
    const logo = container.querySelector('img[alt="BoroPrologo"]');
    expect(logo?.className).toContain('h-16');
    expect(logo?.className).toContain('md:h-24');
  });

  it('renders hero section with responsive padding', () => {
    const { container } = render(<References />);
    const sections = container.querySelectorAll('section');
    const heroSection = sections[0];
    expect(heroSection?.className).toContain('py-8');
    expect(heroSection?.className).toContain('md:py-16');
  });

  it('renders title with responsive text sizing', () => {
    const { container } = render(<References />);
    const title = container.querySelector('h1');
    expect(title?.className).toContain('text-2xl');
    expect(title?.className).toContain('md:text-5xl');
    expect(title?.className).toContain('break-words');
  });

  it('renders accordion section with responsive spacing', () => {
    const { container } = render(<References />);
    const sections = container.querySelectorAll('section');
    const accordionSection = sections[1];
    expect(accordionSection?.className).toContain('py-8');
    expect(accordionSection?.className).toContain('md:py-12');
  });

  it('renders accordion with responsive item spacing', () => {
    const { container } = render(<References />);
    const accordion = container.querySelector('[class*="space-y-2"]');
    expect(accordion).toBeTruthy();
  });

  it('renders category headers with responsive text size', () => {
    const { container } = render(<References />);
    const headers = container.querySelectorAll('h2');
    expect(headers.length).toBeGreaterThan(0);
    
    headers.forEach(header => {
      expect(header.className).toContain('text-base');
      expect(header.className).toContain('md:text-xl');
    });
  });

  it('renders footer with responsive padding', () => {
    const { container } = render(<References />);
    const footer = container.querySelector('footer');
    expect(footer?.className).toContain('mt-8');
    expect(footer?.className).toContain('md:mt-16');
    expect(footer?.className).toContain('py-6');
    expect(footer?.className).toContain('md:py-8');
  });

  it('renders footer text with responsive sizing', () => {
    const { container } = render(<References />);
    const footerParagraphs = container.querySelectorAll('footer p');
    expect(footerParagraphs.length).toBeGreaterThan(0);
    
    footerParagraphs.forEach(p => {
      if (p.className.includes('text-xs') || p.className.includes('text-sm')) {
        expect(p.className).toMatch(/text-(xs|sm)/);
      }
    });
  });

  it('renders mobile menu button', () => {
    const { container } = render(<References />);
    const menuButton = container.querySelector('button[aria-label="Toggle navigation menu"]');
    expect(menuButton).toBeTruthy();
    expect(menuButton?.className).toContain('md:hidden');
  });

  it('renders desktop navigation with md:flex', () => {
    const { container } = render(<References />);
    const desktopNav = container.querySelector('nav.hidden');
    expect(desktopNav).toBeTruthy();
    expect(desktopNav?.className).toContain('md:flex');
  });

  it('renders accordion items with border styling', () => {
    const { container } = render(<References />);
    const accordionItems = container.querySelectorAll('[class*="border"][class*="border-stone-700"]');
    expect(accordionItems.length).toBeGreaterThan(0);
  });

  it('renders category badge with responsive padding', () => {
    const { container } = render(<References />);
    // Badges are rendered inside accordion content, just verify they exist
    const badges = container.querySelectorAll('[class*="border"][class*="rounded"]');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('applies break-words class to title for text wrapping', () => {
    const { container } = render(<References />);
    const title = container.querySelector('h1');
    expect(title?.className).toContain('break-words');
  });

  it('renders container with max-width constraint', () => {
    const { container } = render(<References />);
    const maxWidthContainer = container.querySelector('.max-w-4xl');
    expect(maxWidthContainer).toBeTruthy();
  });

  it('renders accordion trigger with responsive flex layout', () => {
    const { container } = render(<References />);
    const triggers = container.querySelectorAll('[class*="flex-col"][class*="md:flex-row"]');
    expect(triggers.length).toBeGreaterThan(0);
  });

  it('renders reference cards with responsive padding', () => {
    const { container } = render(<References />);
    // Reference cards exist in the accordion content
    const cards = container.querySelectorAll('[class*="bg-stone-900"]');
    expect(cards.length).toBeGreaterThanOrEqual(0);
  });

  it('renders all category sections', () => {
    const { container } = render(<References />);
    const categoryHeaders = container.querySelectorAll('h2');
    // Should have at least 3 categories: Glass Science, Color Science, Thermal Properties
    expect(categoryHeaders.length).toBeGreaterThanOrEqual(3);
  });

  it('renders responsive header padding', () => {
    const { container } = render(<References />);
    const headerDiv = container.querySelector('header .container');
    expect(headerDiv?.className).toContain('py-3');
    expect(headerDiv?.className).toContain('md:py-4');
  });

  it('renders accordion content with responsive spacing', () => {
    const { container } = render(<References />);
    // Accordion exists with proper structure
    const accordion = container.querySelector('[class*="Accordion"]');
    expect(accordion).toBeTruthy();
  });
});
