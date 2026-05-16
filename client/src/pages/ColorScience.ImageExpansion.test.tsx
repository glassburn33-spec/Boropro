import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorScienceTab from './ColorScience';

describe('ColorScience Image Expansion Feature', () => {
  it('renders images with cursor-pointer class for mobile interaction', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="cursor-pointer"]');
    expect(imageContainers.length).toBeGreaterThan(0);
  });

  it('renders ZoomIn icon on image containers', () => {
    render(<ColorScienceTab />);
    const svgs = screen.getAllByRole('img', { hidden: true });
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders Metal Ion Color Reference image', () => {
    render(<ColorScienceTab />);
    const image = screen.getByAltText(/Metal Ion Color Reference/i);
    expect(image).toBeTruthy();
  });

  it('renders Nickel Coordination Spectra image', () => {
    render(<ColorScienceTab />);
    const image = screen.getByAltText(/Nickel Coordination Spectra/i);
    expect(image).toBeTruthy();
  });

  it('image containers have group-hover classes for visual feedback', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="group"]');
    expect(imageContainers.length).toBeGreaterThan(0);
  });

  it('renders close button in modal when image is expanded', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="cursor-pointer"]');
    
    if (imageContainers.length > 0) {
      const firstImage = imageContainers[0] as HTMLElement;
      fireEvent.click(firstImage);
      
      const closeButton = screen.getByLabelText(/Close image/i);
      expect(closeButton).toBeTruthy();
    }
  });

  it('modal has dark overlay background', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="cursor-pointer"]');
    
    if (imageContainers.length > 0) {
      const firstImage = imageContainers[0] as HTMLElement;
      fireEvent.click(firstImage);
      
      const modal = container.querySelector('[class*="fixed"]');
      expect(modal?.className).toContain('bg-black');
    }
  });

  it('modal image container has max dimensions for responsive display', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="cursor-pointer"]');
    
    if (imageContainers.length > 0) {
      const firstImage = imageContainers[0] as HTMLElement;
      fireEvent.click(firstImage);
      
      const modalContent = container.querySelector('[class*="max-w-4xl"]');
      expect(modalContent).toBeTruthy();
    }
  });

  it('renders images with proper object-contain for aspect ratio preservation', () => {
    render(<ColorScienceTab />);
    const images = screen.getAllByAltText(/Color Reference|Coordination Spectra/i);
    
    images.forEach((img) => {
      expect(img.className).toContain('object-contain');
    });
  });

  it('renders image containers with relative positioning for overlay', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="relative"]');
    expect(imageContainers.length).toBeGreaterThan(0);
  });

  it('renders hover overlay with opacity transition', () => {
    const { container } = render(<ColorScienceTab />);
    const overlays = container.querySelectorAll('[class*="opacity-0"][class*="group-hover"]');
    expect(overlays.length).toBeGreaterThan(0);
  });

  it('renders images with transition-opacity for smooth hover effect', () => {
    render(<ColorScienceTab />);
    const images = screen.getAllByAltText(/Color Reference|Coordination Spectra/i);
    
    images.forEach((img) => {
      expect(img.className).toContain('transition-opacity');
    });
  });

  it('renders close button with proper accessibility label', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="cursor-pointer"]');
    
    if (imageContainers.length > 0) {
      const firstImage = imageContainers[0] as HTMLElement;
      fireEvent.click(firstImage);
      
      const closeButton = container.querySelector('[aria-label="Close image"]');
      expect(closeButton).toBeTruthy();
    }
  });

  it('renders image containers with proper padding', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="p-2"][class*="md:p-4"]');
    expect(imageContainers.length).toBeGreaterThan(0);
  });

  it('renders images with responsive container styling', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="rounded-lg"][class*="border"]');
    expect(imageContainers.length).toBeGreaterThan(0);
  });

  it('renders modal with fixed positioning for full-screen coverage', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="cursor-pointer"]');
    
    if (imageContainers.length > 0) {
      const firstImage = imageContainers[0] as HTMLElement;
      fireEvent.click(firstImage);
      
      const modal = container.querySelector('[class*="fixed"][class*="inset-0"]');
      expect(modal).toBeTruthy();
    }
  });

  it('renders modal with high z-index for overlay', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="cursor-pointer"]');
    
    if (imageContainers.length > 0) {
      const firstImage = imageContainers[0] as HTMLElement;
      fireEvent.click(firstImage);
      
      const modal = container.querySelector('[class*="z-50"]');
      expect(modal).toBeTruthy();
    }
  });

  it('renders close button with hover styling', () => {
    const { container } = render(<ColorScienceTab />);
    const imageContainers = container.querySelectorAll('[class*="cursor-pointer"]');
    
    if (imageContainers.length > 0) {
      const firstImage = imageContainers[0] as HTMLElement;
      fireEvent.click(firstImage);
      
      const closeButton = container.querySelector('[aria-label="Close image"]');
      expect(closeButton?.className).toContain('hover:');
    }
  });
});
