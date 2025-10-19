import { useState, useEffect } from 'react';
import { createInstance, initSDK, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle';

export function useZamaInstance() {
  const [instance, setInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeZama = async () => {
    if (isLoading || isInitialized) return;

    try {
      setIsLoading(true);
      setError(null);

      await initSDK();

      const config = {
        ...SepoliaConfig,
        network: (window as any).ethereum
      };

      const zamaInstance = await createInstance(config);
      setInstance(zamaInstance);
      setIsInitialized(true);

    } catch (err) {
      console.error('Failed to initialize Zama instance:', err);
      setError('Failed to initialize encryption service');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeZama();
  }, []);

  return {
    instance,
    isLoading,
    error,
    isInitialized,
    initializeZama
  };
}
