
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPermissionForm, PermissionProfile } from './UserPermissionForm';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

interface PermissionControlProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userEmail: string;
  currentPermission: PermissionProfile;
}

export const PermissionControl: React.FC<PermissionControlProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  userEmail,
  currentPermission
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<PermissionProfile>(currentPermission);
  const [selectedModules, setSelectedModules] = useState<any[]>([]);
  
  const handlePermissionChange = (profile: PermissionProfile, modules: any[]) => {
    setSelectedProfile(profile);
    setSelectedModules(modules);
  };
  
  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Log to audit trail
      console.log('Permission change:', {
        userId,
        userName,
        userEmail,
        previousPermission: currentPermission,
        newPermission: selectedProfile,
        modules: selectedModules,
        changedBy: 'admin@voltz.com',
        timestamp: new Date().toISOString()
      });
      
      // Show success message
      toast.success(
        <div className="flex flex-col">
          <span className="font-medium">Permissões atualizadas</span>
          <span className="text-sm text-gray-400 mt-1">
            Nível de acesso alterado para {userName}
          </span>
        </div>,
        {
          icon: <Shield className="h-5 w-5 text-green-500" />,
        }
      );
      
      onClose();
    }, 800);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E1E1E] border-white/5 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Controle de Permissões
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Defina o nível de acesso e permissões específicas para este usuário.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <UserPermissionForm 
            defaultProfile={currentPermission}
            onPermissionChange={handlePermissionChange}
            userId={userId}
            userName={userName}
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-white/10 text-gray-300 hover:bg-[#262626]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Permissões"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
