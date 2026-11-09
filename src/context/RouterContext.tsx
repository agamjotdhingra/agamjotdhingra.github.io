import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function normalizePath(rawPath: string): string {
  const trimmed = rawPath.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (window.location.pathname !== to) {
      window.history.pushState(null, '', to);
      setPath(normalizePath(to));
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

