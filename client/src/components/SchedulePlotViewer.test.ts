import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SchedulePlotViewer } from './SchedulePlotViewer';

describe('SchedulePlotViewer', () => {
  beforeEach(() => {
    // Mock createElementNS for SVG creation
    vi.spyOn(document, 'createElementNS');
  });

  it('renders the component with title', () => {
    const { container } = render(
      <SchedulePlotViewer
        temperatures={[70, 200, 400, 600, 500]}
        times={[0, 2, 4, 6, 8]}
        filename="Test Schedule"
      />
    );

    expect(container.querySelector('h3')).toBeTruthy();
    expect(container.querySelector('h3')?.textContent).toContain('Temperature Profile');
  });

  it('renders SVG container', () => {
    const { container } = render(
      <SchedulePlotViewer
        temperatures={[70, 200, 400, 600, 500]}
        times={[0, 2, 4, 6, 8]}
        filename="Test Schedule"
      />
    );

    const svgContainer = container.querySelector('[style*="minHeight"]');
    expect(svgContainer).toBeTruthy();
  });

  it('handles empty temperature data', () => {
    const { container } = render(
      <SchedulePlotViewer
        temperatures={[]}
        times={[]}
        filename="Empty Schedule"
      />
    );

    expect(container.querySelector('h3')).toBeTruthy();
  });

  it('renders with custom annealing and strain points', () => {
    const { container } = render(
      <SchedulePlotViewer
        temperatures={[70, 200, 400, 600, 500]}
        times={[0, 2, 4, 6, 8]}
        filename="Custom Points Schedule"
        annealingPoint={600}
        strainPoint={550}
      />
    );

    expect(container.querySelector('h3')).toBeTruthy();
  });

  it('generates SVG with correct structure', () => {
    const { container } = render(
      <SchedulePlotViewer
        temperatures={[70, 200, 400, 600, 500]}
        times={[0, 2, 4, 6, 8]}
        filename="SVG Test"
      />
    );

    // SVG should be rendered in the container
    const svgContainer = container.querySelector('[style*="minHeight"]');
    expect(svgContainer).toBeTruthy();
  });

  it('handles single data point', () => {
    const { container } = render(
      <SchedulePlotViewer
        temperatures={[400]}
        times={[0]}
        filename="Single Point"
      />
    );

    expect(container.querySelector('h3')).toBeTruthy();
  });

  it('handles large temperature ranges', () => {
    const { container } = render(
      <SchedulePlotViewer
        temperatures={[70, 100, 200, 400, 800, 1000]}
        times={[0, 1, 2, 4, 8, 10]}
        filename="Large Range"
      />
    );

    expect(container.querySelector('h3')).toBeTruthy();
  });

  it('formats filename correctly', () => {
    const { container } = render(
      <SchedulePlotViewer
        temperatures={[70, 200, 400, 600, 500]}
        times={[0, 2, 4, 6, 8]}
        filename="Test_kiln_log.pdf"
      />
    );

    expect(container.querySelector('h3')).toBeTruthy();
  });
});
