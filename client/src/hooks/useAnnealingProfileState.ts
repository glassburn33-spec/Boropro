import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';

interface StageInputs {
  stage1: {
    startTemp: number;
    targetTemp: number;
    duration: number;
  };
  stage2: {
    holdTemp: number;
    duration: number;
  };
  stage3: {
    startTemp: number;
    endTemp: number;
    duration: number;
  };
  stage4: {
    startTemp: number;
    endTemp: number;
    duration: number;
  };
}

interface ReferenceLines {
  annealingPoint: number;
  strainPoint: number;
}

const STORAGE_KEY = 'boro_annealing_profile_state';
const USER_SESSION_KEY = 'boro_last_user_id';

const DEFAULT_INPUTS: StageInputs = {
  stage1: { startTemp: 20, targetTemp: 620, duration: 30 },
  stage2: { holdTemp: 620, duration: 20 },
  stage3: { startTemp: 620, endTemp: 480, duration: 60 },
  stage4: { startTemp: 480, endTemp: 20, duration: 45 },
};

const DEFAULT_REFERENCE_LINES: ReferenceLines = {
  annealingPoint: 565,
  strainPoint: 510,
};

interface StoredState {
  inputs: StageInputs;
  referenceLines: ReferenceLines;
  notes: string;
  userId: string;
}

export function useAnnealingProfileState() {
  const { user } = useAuth();
  const [inputs, setInputs] = useState<StageInputs>(DEFAULT_INPUTS);
  const [referenceLines, setReferenceLines] = useState<ReferenceLines>(DEFAULT_REFERENCE_LINES);
  const [notes, setNotes] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from localStorage on mount and when user changes
  useEffect(() => {
    const currentUserId = user?.id;
    const lastUserId = localStorage.getItem(USER_SESSION_KEY);

    // If user changed (logged in/out), reset to defaults
    if (currentUserId && lastUserId && currentUserId !== lastUserId) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(USER_SESSION_KEY, currentUserId);
      setInputs(DEFAULT_INPUTS);
      setReferenceLines(DEFAULT_REFERENCE_LINES);
      setNotes('');
      setIsHydrated(true);
      return;
    }

    // If this is a new session, store the user ID
    if (currentUserId && !lastUserId) {
      localStorage.setItem(USER_SESSION_KEY, currentUserId);
    }

    // Load saved state from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredState = JSON.parse(stored);
        setInputs(parsed.inputs || DEFAULT_INPUTS);
        setReferenceLines(parsed.referenceLines || DEFAULT_REFERENCE_LINES);
        setNotes(parsed.notes || '');
      }
    } catch (error) {
      console.error('Failed to load annealing profile state:', error);
    }

    setIsHydrated(true);
  }, [user?.id]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;

    try {
      const state: StoredState = {
        inputs,
        referenceLines,
        notes,
        userId: user?.id || '',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save annealing profile state:', error);
    }
  }, [inputs, referenceLines, notes, isHydrated, user?.id]);

  return {
    inputs,
    setInputs,
    referenceLines,
    setReferenceLines,
    notes,
    setNotes,
    isHydrated,
  };
}
