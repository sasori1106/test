'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import { useAuth } from '../context/AuthContext';

export default function NavigationWrapper({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // List of paths where navigation should NOT be shown
  const noNavigationPaths = ['/signin', '/signup'];
  
  // Check if current path is in the no-navigation list
  const shouldShowNavigation = !noNavigationPaths.includes(pathname);
  
  // Only show navigation if:
  // 1. Current path is not in the no-navigation list, AND
  // 2. User is authenticated OR we're on a public page that should still show navigation
  
  return (
    <>
      {shouldShowNavigation && user && <Navigation />}
      <main>
        {children}
      </main>
    </>
  );
}