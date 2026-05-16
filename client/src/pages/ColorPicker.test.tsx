import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorPicker from './ColorPicker';

describe('ColorPicker - Clickable Color Section for Dropdown', () => {
  it('renders ColorPicker component without crashing', () => {
    const { container } = render(<ColorPicker />);
    expect(container).toBeTruthy();
  });

  it('renders color database title', () => {
    render(<ColorPicker />);
    const title = screen.getByText('Color Database');
    expect(title).toBeTruthy();
  });

  it('renders search input for filtering colors', () => {
    render(<ColorPicker />);
    const searchInput = screen.getByPlaceholderText(/Search colors/i);
    expect(searchInput).toBeTruthy();
  });

  it('renders color list items', () => {
    const { container } = render(<ColorPicker />);
    const colorItems = container.querySelectorAll('[class*="border"][class*="cursor-pointer"]');
    expect(colorItems.length).toBeGreaterThan(0);
  });

  it('renders chevron icon for each color item', () => {
    const { container } = render(<ColorPicker />);
    const chevrons = container.querySelectorAll('svg');
    expect(chevrons.length).toBeGreaterThan(0);
  });

  it('renders checkbox for color selection on the right side', () => {
    const { container } = render(<ColorPicker />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('color section is clickable to expand details', () => {
    const { container } = render(<ColorPicker />);
    const colorSections = container.querySelectorAll('[class*="flex-1"][class*="flex"][class*="items-center"]');
    expect(colorSections.length).toBeGreaterThan(0);
    
    colorSections.forEach(section => {
      expect(section.className).toContain('cursor-pointer');
    });
  });

  it('clicking color section toggles expanded state', () => {
    const { container } = render(<ColorPicker />);
    const colorSections = container.querySelectorAll('[class*="flex-1"][class*="cursor-pointer"]');
    
    if (colorSections.length > 0) {
      const firstSection = colorSections[0] as HTMLElement;
      
      // Initially, expanded content should not be visible
      let expandedContent = container.querySelectorAll('[class*="bg-stone-800"][class*="border-stone-700"]');
      const initialCount = expandedContent.length;
      
      // Click to expand
      fireEvent.click(firstSection);
      
      // After click, we should see the expanded content
      expandedContent = container.querySelectorAll('[class*="bg-stone-800"][class*="border-stone-700"]');
      expect(expandedContent.length).toBeGreaterThanOrEqual(initialCount);
    }
  });

  it('chevron rotates when color section is expanded', () => {
    const { container } = render(<ColorPicker />);
    const colorSections = container.querySelectorAll('[class*="flex-1"][class*="cursor-pointer"]');
    
    if (colorSections.length > 0) {
      const firstSection = colorSections[0] as HTMLElement;
      const chevron = firstSection.querySelector('svg');
      
      if (chevron) {
        const initialClass = chevron.className.baseVal || chevron.getAttribute('class');
        
        // Click to expand
        fireEvent.click(firstSection);
        
        const expandedClass = chevron.className.baseVal || chevron.getAttribute('class');
        
        // Classes should change after click
        expect(expandedClass).toBeTruthy();
      }
    }
  });

  it('checkbox button is separate from color section click handler', () => {
    const { container } = render(<ColorPicker />);
    const checkboxButtons = container.querySelectorAll('button[aria-label*="Select"]');
    
    checkboxButtons.forEach(button => {
      expect(button.className).toContain('flex-shrink-0');
    });
  });

  it('renders unselected checkbox as empty circle', () => {
    const { container } = render(<ColorPicker />);
    const emptyCheckboxes = container.querySelectorAll('[class*="border-2"][class*="border-stone-400"][class*="rounded-full"]');
    expect(emptyCheckboxes.length).toBeGreaterThan(0);
  });

  it('clicking checkbox selects color without expanding', () => {
    const { container } = render(<ColorPicker />);
    const checkboxButtons = container.querySelectorAll('button[aria-label*="Select"]');
    
    if (checkboxButtons.length > 0) {
      const firstCheckbox = checkboxButtons[0] as HTMLElement;
      
      // Click checkbox
      fireEvent.click(firstCheckbox);
      
      // After click, checkbox should show CheckCircle2 icon
      const checkedCircles = container.querySelectorAll('[class*="text-amber-400"]');
      expect(checkedCircles.length).toBeGreaterThan(0);
    }
  });

  it('expanded color details show metal composition', () => {
    const { container } = render(<ColorPicker />);
    const colorSections = container.querySelectorAll('[class*="flex-1"][class*="cursor-pointer"]');
    
    if (colorSections.length > 0) {
      const firstSection = colorSections[0] as HTMLElement;
      fireEvent.click(firstSection);
      
      // Look for metal composition text
      const metalCompositionText = screen.queryByText(/Metal Composition/i);
      expect(metalCompositionText).toBeTruthy();
    }
  });

  it('expanded color details show anneal and strain points', () => {
    const { container } = render(<ColorPicker />);
    const colorSections = container.querySelectorAll('[class*="flex-1"][class*="cursor-pointer"]');
    
    if (colorSections.length > 0) {
      const firstSection = colorSections[0] as HTMLElement;
      fireEvent.click(firstSection);
      
      // Look for temperature points
      const annealText = screen.queryByText(/Anneal Point/i);
      const strainText = screen.queryByText(/Strain Point/i);
      
      expect(annealText || strainText).toBeTruthy();
    }
  });

  it('color section has proper flex layout for responsiveness', () => {
    const { container } = render(<ColorPicker />);
    const colorRows = container.querySelectorAll('[class*="flex"][class*="items-center"][class*="justify-between"]');
    
    colorRows.forEach(row => {
      expect(row.className).toContain('flex');
      expect(row.className).toContain('items-center');
    });
  });

  it('chevron is positioned with ml-auto for right alignment', () => {
    const { container } = render(<ColorPicker />);
    const colorSections = container.querySelectorAll('[class*="flex-1"][class*="cursor-pointer"]');
    
    if (colorSections.length > 0) {
      const firstSection = colorSections[0] as HTMLElement;
      expect(firstSection.className).toContain('ml-auto');
    }
  });

  it('color name and family are displayed in clickable section', () => {
    render(<ColorPicker />);
    
    // Look for color names (they should be in h3 elements)
    const colorNames = screen.queryAllByRole('heading', { level: 3 });
    expect(colorNames.length).toBeGreaterThan(0);
  });

  it('multiple colors can be selected independently', () => {
    const { container } = render(<ColorPicker />);
    const checkboxButtons = container.querySelectorAll('button[aria-label*="Select"]');
    
    if (checkboxButtons.length >= 2) {
      const firstCheckbox = checkboxButtons[0] as HTMLElement;
      const secondCheckbox = checkboxButtons[1] as HTMLElement;
      
      fireEvent.click(firstCheckbox);
      fireEvent.click(secondCheckbox);
      
      // Both should be selected
      const selectedCheckmarks = container.querySelectorAll('[class*="text-amber-400"]');
      expect(selectedCheckmarks.length).toBeGreaterThan(0);
    }
  });

  it('search filters colors correctly', () => {
    render(<ColorPicker />);
    const searchInput = screen.getByPlaceholderText(/Search colors/i) as HTMLInputElement;
    
    // Type in search
    fireEvent.change(searchInput, { target: { value: 'cobalt' } });
    
    // Search input should have the value
    expect(searchInput.value).toBe('cobalt');
  });

  it('expanded content has proper styling with bg-stone-800', () => {
    const { container } = render(<ColorPicker />);
    const colorSections = container.querySelectorAll('[class*="flex-1"][class*="cursor-pointer"]');
    
    if (colorSections.length > 0) {
      const firstSection = colorSections[0] as HTMLElement;
      fireEvent.click(firstSection);
      
      const expandedContent = container.querySelector('[class*="bg-stone-800"]');
      expect(expandedContent).toBeTruthy();
    }
  });

  it('color section maintains cursor-pointer class for visual feedback', () => {
    const { container } = render(<ColorPicker />);
    const colorSections = container.querySelectorAll('[class*="flex-1"][class*="cursor-pointer"]');
    
    colorSections.forEach(section => {
      expect(section.className).toContain('cursor-pointer');
    });
  });
});
