
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStores } from '@/contexts/StoreContext';
import { toast } from '@/hooks/use-toast';

// Admin check - in a real app, this would be connected to an auth context
const isAdmin = () => {
  // In a production environment, this would be verified through JWT tokens or a secure auth mechanism
  return localStorage.getItem('is_admin') === 'true';
};

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const location = useLocation();
  const { stores } = useStores();
  
  useEffect(() => {
    if (isAdmin()) {
      console.log("Admin authentication successful");
    } else {
      console.log("Admin authentication failed - redirecting to login");
    }
  }, []);
  
  if (!isAdmin()) {
    toast({
      title: "Acesso restrito",
      description: "Você não tem permissão para acessar a área administrativa.",
      variant: "destructive"
    });
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
