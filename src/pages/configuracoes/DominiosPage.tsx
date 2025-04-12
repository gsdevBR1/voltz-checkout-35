
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { AddDomainModal } from '@/components/configuracoes/AddDomainModal';
import { Domain } from '@/types/domain';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const mockDomains: Domain[] = [
  {
    id: '1',
    name: 'checkout.minhaloja.com',
    type: 'checkout',
    status: 'active',
    createdAt: '2023-10-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'secure.minhaloja.com',
    type: 'secure',
    status: 'pending',
    createdAt: '2023-10-20T14:45:00Z',
  },
];

const DominiosPage: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddDomain = (data: { name: string; type: 'checkout' | 'secure' | 'pay' | 'seguro' }) => {
    const newDomain: Domain = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      type: data.type,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setDomains([...domains, newDomain]);
    setIsAddModalOpen(false);
    
    toast({
      title: "Domínio adicionado",
      description: "O domínio está em processo de configuração e verificação.",
    });
  };

  const getStatusBadge = (status: Domain['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Ativo
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-800 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 dark:text-yellow-400 dark:border-yellow-400 dark:bg-yellow-900/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Falha
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Domínios</h1>
            <p className="text-muted-foreground">Gerencie os domínios conectados ao seu checkout</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Domínio
          </Button>
        </div>

        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do domínio</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum domínio configurado ainda
                  </TableCell>
                </TableRow>
              ) : (
                domains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{domain.type}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(domain.status)}</TableCell>
                    <TableCell>{new Date(domain.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-right">
                      {domain.status === 'active' && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Visitar</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddDomainModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddDomain} 
      />
    </DashboardLayout>
  );
};

export default DominiosPage;
