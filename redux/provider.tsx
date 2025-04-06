// redux/provider.tsx
'use client';

import { Provider } from 'react-redux';
import { useRef, useEffect } from 'react';
import { makeStore, AppStore } from './store';
import { fetchCurrentUser } from './features/auth/authSlice';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Try to fetch current user on mount
  useEffect(() => {
    // Try to fetch current user using cookies that are already set
    storeRef.current?.dispatch(fetchCurrentUser());
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}