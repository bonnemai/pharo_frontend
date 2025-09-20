import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { useDarkMode } from './useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  it('defaults to light mode and toggles state with persistence', async () => {
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDarkMode).toBe(false);

    act(() => {
      result.current.toggleDarkMode();
    });

    await waitFor(() => expect(result.current.isDarkMode).toBe(true));
    await waitFor(() => expect(localStorage.getItem('dark-mode')).toBe('true'));
    await waitFor(() => expect(document.body.classList.contains('dark-mode')).toBe(true));
  });

  it('uses stored preference on initial load', async () => {
    localStorage.setItem('dark-mode', 'true');

    const { result } = renderHook(() => useDarkMode());

    await waitFor(() => expect(result.current.isDarkMode).toBe(true));
    await waitFor(() => expect(document.body.classList.contains('dark-mode')).toBe(true));
  });
});
