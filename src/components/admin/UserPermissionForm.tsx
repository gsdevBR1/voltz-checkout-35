import React, { useState } from 'react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  Store, 
  Users, 
  FileText, 
  Settings, 
  DollarSign, 
  BarChart3, 
  Bell,
  Tag
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { PermissionBadge } from './PermissionBadge';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';

export type PermissionProfile = 'admin_global' | 'financeiro' | 'suporte' | 'leitura' | 'personalizado';

interface PermissionModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  permissions: {
    view: boolean;
    edit: boolean;
  };
}

interface UserPermissionFormProps {
  defaultProfile?: PermissionProfile;
  defaultModules?: PermissionModule[];
  onPermissionChange?: (profile: PermissionProfile, modules: PermissionModule[]) => void;
  userId?: string;
  userName?: string;
}

export const UserPermissionForm: React.FC<UserPermissionFormProps> = ({
  defaultProfile = 'leitura',
  defaultModules,
  onPermissionChange,
  userId,
  userName
}) => {
  const [profile, setProfile] = useState<PermissionProfile>(defaultProfile);
  
  // Define all available modules
  const allModules: PermissionModule[] = [
    {
      id: 'dashboard',
      name: 'Dashboard Geral',
      description: 'Visão geral da plataforma e métricas',
      icon: <BarChart3 className="h-4 w-4" />,
      permissions: { view: true, edit: false }
    },
    {
      id: 'lojas',
      name: 'Lojas',
      description: 'Visualizar, editar e suspender lojas',
      icon: <Store className="h-4 w-4" />,
      permissions: { view: true, edit: false }
    },
    {
      id: 'usuarios',
      name: 'Usuários',
      description: 'Gerenciar usuários da plataforma',
      icon: <Users className="h-4 w-4" />,
      permissions: { view: true, edit: false }
    },
    {
      id: 'financeiro',
      name: 'Financeiro Global',
      description: 'Extrato, ciclos e cobranças',
      icon: <DollarSign className="h-4 w-4" />,
      permissions: { view: true, edit: false }
    },
    {
      id: 'reembolsos',
      name: 'Reembolsos & Estornos',
      description: 'Gerenciar reembolsos e estornos',
      icon: <Tag className="h-4 w-4" />,
      permissions: { view: true, edit: false }
    },
    {
      id: 'logs',
      name: 'Logs & Auditoria',
      description: 'Acompanhar atividades no sistema',
      icon: <FileText className="h-4 w-4" />,
      permissions: { view: true, edit: false }
    },
    {
      id: 'configuracoes',
      name: 'Configurações Globais',
      description: 'Configurações gerais da plataforma',
      icon: <Settings className="h-4 w-4" />,
      permissions: { view: true, edit: false }
    },
    {
      id: 'relatorios',
      name: 'Relatórios & Exportações',
      description: 'Gerar e exportar relatórios',
      icon: <BarChart3 className="h-4 w-4" />,
      permissions: { view: true, edit: false }
    },
    {
      id: 'planos',
      name: 'Controle de Planos',
      description: 'Gerenciar planos e assinaturas',
      icon: <Tag className="h-4 w-4" />,
      permissions: { view: true, edit: false }
    },
    {
      id: 'notificacoes',
      name: 'Notificações & Alertas',
      description: 'Gerenciar notificações do sistema',
      icon: <Bell className="h-4 w-4" />,
      permissions: { view: true, edit: false }
    }
  ];

  // Init modules based on default or all modules
  const [modules, setModules] = useState<PermissionModule[]>(
    defaultModules || allModules.map(m => ({ ...m }))
  );

  // Handle profile change
  const handleProfileChange = (newProfile: PermissionProfile) => {
    setProfile(newProfile);
    
    // Update module permissions based on profile
    let updatedModules = [...allModules.map(m => ({ ...m }))];
    
    switch (newProfile) {
      case 'admin_global':
        updatedModules = updatedModules.map(m => ({
          ...m,
          permissions: { view: true, edit: true }
        }));
        break;
      case 'financeiro':
        updatedModules = updatedModules.map(m => ({
          ...m,
          permissions: {
            view: ['financeiro', 'reembolsos', 'planos'].includes(m.id),
            edit: ['financeiro', 'reembolsos', 'planos'].includes(m.id)
          }
        }));
        break;
      case 'suporte':
        updatedModules = updatedModules.map(m => ({
          ...m,
          permissions: {
            view: ['usuarios', 'lojas', 'logs'].includes(m.id),
            edit: ['usuarios', 'lojas'].includes(m.id)
          }
        }));
        break;
      case 'leitura':
        updatedModules = updatedModules.map(m => ({
          ...m,
          permissions: { view: true, edit: false }
        }));
        break;
      case 'personalizado':
        // Keep current permissions
        break;
    }
    
    setModules(updatedModules);
    
    if (onPermissionChange) {
      onPermissionChange(newProfile, updatedModules);
    }
  };

  // Handle module permission change
  const handleModulePermissionChange = (moduleId: string, permType: 'view' | 'edit', value: boolean) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        // If edit is being checked, also check view
        if (permType === 'edit' && value) {
          return {
            ...module,
            permissions: { view: true, edit: value }
          };
        }
        // If view is being unchecked, also uncheck edit
        if (permType === 'view' && !value) {
          return {
            ...module,
            permissions: { view: value, edit: false }
          };
        }
        
        return {
          ...module,
          permissions: {
            ...module.permissions,
            [permType]: value
          }
        };
      }
      return module;
    });
    
    setModules(updatedModules);
    
    if (onPermissionChange) {
      onPermissionChange(profile, updatedModules);
    }
  };

  // Profiles with descriptions for the dropdown
  const profiles = [
    {
      value: 'admin_global',
      label: 'Admin Global',
      description: 'Acesso total a todos os módulos do Admin',
      icon: <ShieldAlert className="h-4 w-4" />
    },
    {
      value: 'financeiro',
      label: 'Financeiro',
      description: 'Acesso somente às seções: Financeiro Global, Ciclos, Cobranças, Reembolsos',
      icon: <ShieldCheck className="h-4 w-4" />
    },
    {
      value: 'suporte',
      label: 'Suporte',
      description: 'Acesso somente às seções: Usuários, Lojas, Logs e Visualização de Vendas',
      icon: <ShieldCheck className="h-4 w-4" />
    },
    {
      value: 'leitura',
      label: 'Leitura',
      description: 'Pode visualizar todos os dados, mas não pode editar ou executar ações',
      icon: <Eye className="h-4 w-4" />
    },
    {
      value: 'personalizado',
      label: 'Personalizado',
      description: 'Marcar manualmente permissões por módulo',
      icon: <Shield className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-6">
      {userName && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white mb-1">Permissões para {userName}</h3>
          <p className="text-sm text-gray-400">Configure o nível de acesso deste usuário no painel administrativo.</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-1.5 block">Perfil de Acesso</label>
          <Select 
            value={profile} 
            onValueChange={(value) => handleProfileChange(value as PermissionProfile)}
          >
            <SelectTrigger className="bg-[#262626] border-white/5 w-full">
              <SelectValue placeholder="Selecione um perfil de acesso" />
            </SelectTrigger>
            <SelectContent className="bg-[#262626] border-white/5">
              {profiles.map((profileOption) => (
                <SelectItem 
                  key={profileOption.value} 
                  value={profileOption.value}
                  className="py-2.5 focus:bg-[#333] focus:text-white"
                >
                  <div className="flex items-center gap-2">
                    {profileOption.icon}
                    <div>
                      <div className="font-medium">{profileOption.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{profileOption.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {profile === 'personalizado' && (
          <div className="border border-white/5 rounded-md p-4 bg-[#1A1A1A] mt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              Permissões personalizadas por módulo
            </h4>
            
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="p-3 border border-white/5 rounded-md bg-[#262626]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {module.icon}
                      <div>
                        <div className="font-medium text-white">{module.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{module.description}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`${module.id}-view`} 
                        checked={module.permissions.view}
                        onCheckedChange={(checked) => 
                          handleModulePermissionChange(module.id, 'view', checked as boolean)
                        }
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <label
                        htmlFor={`${module.id}-view`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        Visualizar
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`${module.id}-edit`} 
                        checked={module.permissions.edit}
                        onCheckedChange={(checked) => 
                          handleModulePermissionChange(module.id, 'edit', checked as boolean)
                        }
                        disabled={!module.permissions.view}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <label
                        htmlFor={`${module.id}-edit`}
                        className={cn(
                          "text-sm font-medium leading-none cursor-pointer",
                          !module.permissions.view && "text-gray-500 cursor-not-allowed"
                        )}
                      >
                        Editar/Executar
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
