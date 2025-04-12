
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStores } from '@/contexts/StoreContext';

// Simple admin check - in a real app, you would check this from an auth context
// For now, we'll mock this since we don't have real authentication
const isAdmin = () => {
  // Mock - in a real app, this would come from your auth context
  return localStorage.getItem('is_admin') === 'true';
};

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const location = useLocation();
  const { stores } = useStores();
  
  if (!isAdmin()) {
    return <Navigate to="/pagina-inicial" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
