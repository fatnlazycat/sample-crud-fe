import axios, { AxiosResponse } from 'axios';
import { useState, useEffect, useCallback } from 'react';

export const useApiCall = (
  url: string, method: 'get' | 'post' | 'patch' | 'delete' = 'get',
): [
    {
      response: AxiosResponse | undefined;
      error: unknown | string | null;
      isLoading: boolean;
    },
    (options?: Record<string, unknown>) => void,
  ] => {
  const [response, setResponse] = useState<AxiosResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | string>();
  const [options, setOptions] = useState({});

  const makeCall = useCallback((fetchOptions: Record<string, any> = {}) => {
    setOptions(fetchOptions);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const fetchData = async (): Promise<void> => {
      try {
        const res = await axios({
          url,
          method,
          ...options,
        });
        setResponse(res);
      } catch (err) {
        console.log('err', err);
        const data = err ?? 'Server error';
        setError(data);
      }
      setIsLoading(false);
    };

    fetchData().then(
      () => {},
      () => {},
    );
  }, [isLoading, options, url, method]);

  return [{ response, error, isLoading }, makeCall];
};
