import { useCallback, useState } from 'react';
import { ApiError } from '../services/api';

interface AsyncActionState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Wraps an imperative API call (e.g. "submit this form") with loading and
 * error state, so pages don't each re-implement the same try/catch/finally.
 */
export function useAsyncAction<Args extends unknown[], T>(
  action: (...args: Args) => Promise<T>,
) {
  const [state, setState] = useState<AsyncActionState<T>>({ data: null, loading: false, error: null });

  const run = useCallback(
    async (...args: Args) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await action(...args);
        setState({ data, loading: false, error: null });
        return data;
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
        setState({ data: null, loading: false, error: message });
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { ...state, run };
}
