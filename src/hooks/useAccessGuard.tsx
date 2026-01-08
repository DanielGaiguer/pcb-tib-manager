import { useEffect, useState } from 'react';
import { canAccess } from '../storage/canAccess';

const THIRTY_MINUTES = 30 * 60 * 1000;
const ACCESS_KEY = 'accessedAt';

export function useAccessGuard() {
  const [isLogged, setIsLogged] = useState(() => canAccess());
  const [middleware, setMiddleware] = useState(() => !canAccess());

  useEffect(() => {
    const timestampString = localStorage.getItem(ACCESS_KEY);
    if (!timestampString) return;

    const lastAccess = JSON.parse(timestampString);
    const elapsed = Date.now() - lastAccess;
    const remaining = THIRTY_MINUTES - elapsed;

    // 🔴 NÃO setar estado aqui
    if (remaining <= 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsLogged(false);
      setMiddleware(true);
    }, remaining);

    return () => clearTimeout(timeout);
  }, []);

  return {
    isLogged,
    setIsLogged,
    middleware,
    setMiddleware,
  };
}
