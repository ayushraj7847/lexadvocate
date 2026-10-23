import { useState, useCallback } from 'react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { onSuccess, onError, loadingMsg } = options;
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'An error occurred';
      setError(message);
      if (onError) onError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};

export default useApi;
