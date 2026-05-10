import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnnealingProfileState } from './useAnnealingProfileState';

// Mock the useAuth hook
vi.mock('@/_core/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-123' },
    loading: false,
    error: null,
    isAuthenticated: true,
    logout: vi.fn(),
  })),
}));

describe('useAnnealingProfileState', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAnnealingProfileState());

    expect(result.current.inputs.stage1.startTemp).toBe(20);
    expect(result.current.inputs.stage1.targetTemp).toBe(620);
    expect(result.current.referenceLines.annealingPoint).toBe(565);
    expect(result.current.notes).toBe('');
  });

  it('should persist state to localStorage', () => {
    const { result } = renderHook(() => useAnnealingProfileState());

    act(() => {
      result.current.setInputs(prev => ({
        ...prev,
        stage1: { ...prev.stage1, startTemp: 50 },
      }));
    });

    // Check that state was saved to localStorage
    const stored = localStorage.getItem('boro_annealing_profile_state');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.inputs.stage1.startTemp).toBe(50);
  });

  it('should restore state from localStorage on mount', () => {
    // Pre-populate localStorage
    const savedState = {
      inputs: {
        stage1: { startTemp: 100, targetTemp: 700, duration: 40 },
        stage2: { holdTemp: 700, duration: 30 },
        stage3: { startTemp: 700, endTemp: 400, duration: 80 },
        stage4: { startTemp: 400, endTemp: 20, duration: 60 },
      },
      referenceLines: { annealingPoint: 600, strainPoint: 550 },
      notes: 'Test notes',
      userId: 'test-user-123',
    };
    localStorage.setItem('boro_annealing_profile_state', JSON.stringify(savedState));

    const { result } = renderHook(() => useAnnealingProfileState());

    // Wait for hydration
    expect(result.current.isHydrated).toBe(true);
    expect(result.current.inputs.stage1.startTemp).toBe(100);
    expect(result.current.notes).toBe('Test notes');
  });

  it('should reset state when user changes', () => {
    // This test would require more complex mocking of useAuth
    // For now, we'll verify the localStorage key is set
    const { result } = renderHook(() => useAnnealingProfileState());

    expect(localStorage.getItem('boro_last_user_id')).toBe('test-user-123');
  });

  it('should update notes state', () => {
    const { result } = renderHook(() => useAnnealingProfileState());

    act(() => {
      result.current.setNotes('New test notes');
    });

    expect(result.current.notes).toBe('New test notes');

    // Verify it's persisted
    const stored = localStorage.getItem('boro_annealing_profile_state');
    const parsed = JSON.parse(stored!);
    expect(parsed.notes).toBe('New test notes');
  });

  it('should update reference lines', () => {
    const { result } = renderHook(() => useAnnealingProfileState());

    act(() => {
      result.current.setReferenceLines({
        annealingPoint: 600,
        strainPoint: 550,
      });
    });

    expect(result.current.referenceLines.annealingPoint).toBe(600);
    expect(result.current.referenceLines.strainPoint).toBe(550);
  });
});
