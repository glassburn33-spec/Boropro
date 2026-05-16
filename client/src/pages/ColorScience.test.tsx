import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ColorScienceTab from './ColorScience';

describe('ColorScience Mobile Responsive Layout', () => {
  it('renders the Color Science page', () => {
    const { container } = render(<ColorScienceTab />);
    expect(container).toBeTruthy();
  });

  it('renders main content area with responsive padding', () => {
    const { container } = render(<ColorScienceTab />);
    const main = container.querySelector('main');
    expect(main).toBeTruthy();
    expect(main?.className).toContain('px-3');
    expect(main?.className).toContain('md:px-4');
  });

  it('renders Color Science heading', () => {
    render(<ColorScienceTab />);
    const heading = screen.getByText(/Color Science/i);
    expect(heading).toBeTruthy();
  });

  it('renders heading with responsive text sizes', () => {
    render(<ColorScienceTab />);
    const heading = screen.getByText(/Color Science/i);
    expect(heading.className).toContain('text-2xl');
    expect(heading.className).toContain('md:text-4xl');
  });

  it('renders heading with break-words class for mobile', () => {
    render(<ColorScienceTab />);
    const heading = screen.getByText(/Color Science/i);
    expect(heading.className).toContain('break-words');
  });

  it('renders Metal Ion Color Reference section', () => {
    render(<ColorScienceTab />);
    const text = screen.getByText(/systematic catalog/i);
    expect(text).toBeTruthy();
  });

  it('renders Nickel coordination section', () => {
    render(<ColorScienceTab />);
    const text = screen.getByText(/Peculiar Sites, Peculiar Colors/i);
    expect(text).toBeTruthy();
  });

  it('renders images with proper alt text', () => {
    render(<ColorScienceTab />);
    const images = screen.getAllByAltText(/Color Reference|Coordination Spectra/i);
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders color coordination information', () => {
    render(<ColorScienceTab />);
    expect(screen.getByText(/Four-coordinate/i)).toBeTruthy();
    expect(screen.getByText(/Five-coordinate/i)).toBeTruthy();
    expect(screen.getByText(/Six-coordinate/i)).toBeTruthy();
  });

  it('renders Nickel Coordination Spectra section', () => {
    render(<ColorScienceTab />);
    const text = screen.getByText(/Nickel Coordination Spectra in Borosilicate Glass/i);
    expect(text).toBeTruthy();
  });

  it('renders all color descriptions', () => {
    render(<ColorScienceTab />);
    expect(screen.getByText(/indigo coloration/i)).toBeTruthy();
    expect(screen.getByText(/brown coloration/i)).toBeTruthy();
    expect(screen.getByText(/green coloration/i)).toBeTruthy();
  });

  it('renders navigation menu button', () => {
    render(<ColorScienceTab />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders header with navigation links', () => {
    render(<ColorScienceTab />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders responsive text content with break-words', () => {
    render(<ColorScienceTab />);
    const text = screen.getByText(/Coordination Geometry as the Primary Determinant/i);
    expect(text.className).toContain('break-words');
  });

  it('renders content boxes with responsive padding', () => {
    const { container } = render(<ColorScienceTab />);
    const boxes = container.querySelectorAll('[class*="p-3"][class*="md:p-6"]');
    expect(boxes.length).toBeGreaterThan(0);
  });

  it('renders images with responsive container padding', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('img[alt*="Reference"], img[alt*="Spectra"]');
    expect(imageContainers.length).toBeGreaterThan(0);
  });

  it('renders section with responsive spacing', () => {
    const { container } = render(<ColorScienceTab />);
    const sections = container.querySelectorAll('[class*="space-y-3"][class*="md:space-y-4"]');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('renders color swatches with responsive gap', () => {
    render(<ColorScienceTab />);
    const text = screen.getByText(/Four-coordinate/i);
    const container = text.closest('div');
    expect(container?.className).toContain('gap-2');
    expect(container?.className).toContain('md:gap-4');
  });

  it('renders all accordion items', () => {
    render(<ColorScienceTab />);
    expect(screen.getByText(/Metal Ion Color Reference/i)).toBeTruthy();
    expect(screen.getByText(/Peculiar Sites, Peculiar Colors/i)).toBeTruthy();
  });


});
