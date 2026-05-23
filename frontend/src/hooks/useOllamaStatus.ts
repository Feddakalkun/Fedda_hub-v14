import { useState, useEffect } from 'react';
import { BACKEND_API } from '../config/api';

const LOCAL_BACKEND_URL = 'http://127.0.0.1:8000';

export const useOllamaStatus = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            let timer: number | undefined;
            try {
                const controller = new AbortController();
                timer = window.setTimeout(() => controller.abort(), 1400);
                const health = await fetch(`${LOCAL_BACKEND_URL}/health`, {
                    method: 'GET',
                    cache: 'no-store',
                    signal: controller.signal,
                });
                if (!health.ok) {
                    setIsConnected(false);
                    return;
                }

                const response = await fetch(`${LOCAL_BACKEND_URL}${BACKEND_API.ENDPOINTS.OLLAMA_MODELS}`, {
                    method: 'GET',
                    cache: 'no-store',
                    signal: controller.signal,
                });
                if (!response.ok) {
                    setIsConnected(false);
                    return;
                }
                const data = await response.json();
                setIsConnected(Boolean(data?.success && data?.ollama_online));
            } catch {
                setIsConnected(false);
            } finally {
                if (timer) window.clearTimeout(timer);
                setIsLoading(false);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 10000); // Check every 10s

        return () => clearInterval(interval);
    }, []);

    return { isConnected, isLoading };
};
