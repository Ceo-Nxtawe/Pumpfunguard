import { useCallback, useEffect, useState } from 'react';

export function useLocation() {
  const [path, setPath] = useState(window.location.pathname);
  
  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('locationchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('locationchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((newPath: string) => {
    window.history.pushState({}, '', newPath);
    window.dispatchEvent(new CustomEvent('locationchange'));
  }, []);

  const isAdmin = path.startsWith('/admin');

  return { path, isAdmin, navigate };
}