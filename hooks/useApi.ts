import { useState, useEffect, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Updated hook to accept an API function and its arguments
export const useApi = <T, P extends any[]>(
  apiCall: (...args: P) => Promise<T>,
  ...args: P
) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Use JSON.stringify to create a stable dependency for the callback
  const argsJson = JSON.stringify(args);

  const fetchData = useCallback(async () => {
    // Prevent fetching if essential args are missing (e.g., outletId is null)
    if (args.some(arg => arg === null || arg === undefined)) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    try {
      const data = await apiCall(...args);
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err as Error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiCall, argsJson]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
};
