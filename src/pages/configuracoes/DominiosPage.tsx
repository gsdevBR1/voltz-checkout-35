
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, AlertTriangle, CheckCircle2, History, Edit, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { AddDomainModal } from '@/components/configuracoes/AddDomainModal';
import { Domain, DomainValidationResult, DomainHistoryEvent } from '@/types/domain';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { DomainConfigDetails } from '@/components/configuracoes/DomainConfigDetails';
import { EditDomainModal } from '@/components/configuracoes/EditDomainModal';
import { DeleteDomainDialog } from '@/components/configuracoes/DeleteDomainDialog';
import { DomainHistoryDrawer } from '@/components/configuracoes/DomainHistoryDrawer';

// Updated mock domains with history and inUse data
const mockDomains: Domain[] = [
  {
    id: '1',
    name: 'minhaloja.com',
    type: 'checkout',
    status: 'active',
    createdAt: '2023-10-15T10:30:00Z',
    dnsVerified: true,
    sslStatus: 'active',
    lastChecked: '2023-10-15T14:30:00Z',
    inUse: 3,
    history: [
      {
        id: '1a',
        type: 'added',
        timestamp: '2023-10-15T10:30:00Z'
      },
      {
        id: '1b',
        type: 'dns_verified',
        timestamp: '2023-10-15T11:15:00Z'
      },
      {
        id: '1c',
        type: 'ssl_issued',
        timestamp: '2023-10-15T14:30:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'outraloja.com',
    type: 'secure',
    status: 'pending',
    createdAt: '2023-10-20T14:45:00Z',
    dnsVerified: false,
    sslStatus: 'pending',
    inUse: 0,
    history: [
      {
        id: '2a',
        type: 'added',
        timestamp: '2023-10-20T14:45:00Z'
      }
    ]
  },
];

const DominiosPage: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [editDomain, setEditDomain] = useState<Domain | null>(null);
  const [deleteDomain, setDeleteDomain] = useState<Domain | null>(null);
  const [historyDomain, setHistoryDomain] = useState<Domain | null>(null);
  const { toast } = useToast();

  const handleAddDomain = (data: { name: string }) => {
    const newDomain: Domain = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      type: 'checkout',
      status: 'pending',
      createdAt: new Date().toISOString(),
      dnsVerified: false,
      sslStatus: 'pending',
      inUse: 0,
      history: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'added',
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Add the domain to the list
    setDomains([...domains, newDomain]);
    setIsAddModalOpen(false);
    
    // Directly go to the domain configuration page
    setSelectedDomain(newDomain);
    
    toast({
      title: "Domínio adicionado",
      description: "Configure os registros DNS para ativar seu domínio",
    });
  };

  const handleVerifyDNS = (validationResult: DomainValidationResult) => {
    if (!selectedDomain) return;
    
    // Create new history events based on validation results
    const newHistoryEvents: DomainHistoryEvent[] = [];
    
    if (validationResult.dnsVerified && !selectedDomain.dnsVerified) {
      newHistoryEvents.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'dns_verified',
        timestamp: validationResult.lastChecked
      });
    }
    
    if (validationResult.sslActive && selectedDomain.sslStatus !== 'active') {
      newHistoryEvents.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'ssl_issued',
        timestamp: validationResult.lastChecked
      });
    }
    
    if (!validationResult.dnsVerified && selectedDomain.dnsVerified) {
      newHistoryEvents.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'validation_failed',
        timestamp: validationResult.lastChecked,
        details: 'Validação de DNS falhou'
      });
    }
    
    // Update the selected domain with verification status and new history events
    const updatedDomain: Domain = {
      ...selectedDomain,
      dnsVerified: validationResult.dnsVerified,
      sslStatus: validationResult.sslActive ? 'active' : 'pending',
      status: validationResult.dnsVerified && validationResult.sslActive ? 'active' : 'pending',
      lastChecked: validationResult.lastChecked,
      history: [
        ...(selectedDomain.history || []),
        ...newHistoryEvents
      ]
    };
    
    // Update the domain in the list
    setDomains(domains.map(domain => 
      domain.id === selectedDomain.id ? updatedDomain : domain
    ));
    
    // Update the selected domain
    setSelectedDomain(updatedDomain);
  };

  const handleSubdomainChange = (type: 'checkout' | 'secure' | 'pay' | 'seguro') => {
    if (!selectedDomain) return;
    
    // Create a history event for the name change
    const historyEvent: DomainHistoryEvent = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'name_changed',
      timestamp: new Date().toISOString(),
      details: `Tipo alterado de ${selectedDomain.type} para ${type}`
    };
    
    // Update the selected domain with the new subdomain type
    const updatedDomain: Domain = {
      ...selectedDomain,
      type,
      history: [
        ...(selectedDomain.history || []),
        historyEvent
      ]
    };
    
    // Update the domain in the list
    setDomains(domains.map(domain => 
      domain.id === selectedDomain.id ? updatedDomain : domain
    ));
    
    // Update the selected domain
    setSelectedDomain(updatedDomain);
    
    toast({
      title: "Tipo atualizado",
      description: `O tipo do subdomínio foi alterado para ${type}`,
    });
  };

  const handleEditDomain = (domain: Domain) => {
    setEditDomain(domain);
  };

  const handleEditDomainSubmit = (type: 'checkout' | 'secure' | 'pay' | 'seguro') => {
    if (!editDomain) return;
    
    // Only proceed if the type is actually changing
    if (editDomain.type === type) {
      setEditDomain(null);
      return;
    }
    
    // Create a history event for the name change
    const historyEvent: DomainHistoryEvent = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'name_changed',
      timestamp: new Date().toISOString(),
      details: `Tipo alterado de ${editDomain.type} para ${type}`
    };
    
    // Update the domain
    const updatedDomain: Domain = {
      ...editDomain,
      type,
      history: [
        ...(editDomain.history || []),
        historyEvent
      ]
    };
    
    // Update domains list
    setDomains(domains.map(domain => 
      domain.id === editDomain.id ? updatedDomain : domain
    ));
    
    // Update selected domain if it's the one being edited
    if (selectedDomain && selectedDomain.id === editDomain.id) {
      setSelectedDomain(updatedDomain);
    }
    
    setEditDomain(null);
    
    toast({
      title: "Domínio atualizado",
      description: `O tipo do subdomínio foi alterado para ${type}`,
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteDomain) return;
    
    // Remove the domain
    setDomains(domains.filter(domain => domain.id !== deleteDomain.id));
    
    // Clear selected domain if it was deleted
    if (selectedDomain && selectedDomain.id === deleteDomain.id) {
      setSelectedDomain(null);
    }
    
    setDeleteDomain(null);
    
    toast({
      title: "Domínio removido",
      description: `O domínio foi removido com sucesso`,
    });
  };

  const handleViewHistory = (domain: Domain) => {
    setHistoryDomain(domain);
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

  const handleConfigureDomain = (domain: Domain) => {
    setSelectedDomain(domain);
  };

  const handleVisitDomain = (domain: Domain) => {
    const url = `https://${domain.type}.${domain.name}`;
    window.open(url, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {selectedDomain ? (
          <DomainConfigDetails 
            domain={selectedDomain}
            onVerifyDNS={handleVerifyDNS}
            onSubdomainChange={handleSubdomainChange}
            onBack={() => setSelectedDomain(null)}
          />
        ) : (
          <>
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
                    <TableHead>DNS Verificado</TableHead>
                    <TableHead>SSL</TableHead>
                    <TableHead>Em uso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                        <TableCell>
                          {domain.dnsVerified ? (
                            <Badge className="bg-green-100 text-green-800">Verificado</Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-800 border-yellow-300 bg-yellow-50">Pendente</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {domain.sslStatus === 'active' ? (
                            <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-800 border-yellow-300 bg-yellow-50">Pendente</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {domain.inUse ? (
                            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400">
                              {domain.inUse} {domain.inUse === 1 ? 'checkout' : 'checkouts'}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Não utilizado</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleConfigureDomain(domain)}
                            >
                              Configurar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditDomain(domain)}
                              disabled={domain.status === 'pending' && !domain.dnsVerified}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => setDeleteDomain(domain)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remover</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewHistory(domain)}
                            >
                              <History className="h-4 w-4" />
                              <span className="sr-only">Histórico</span>
                            </Button>
                            {domain.status === 'active' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleVisitDomain(domain)}
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Visitar</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        <AddDomainModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddDomain} 
        />

        {editDomain && (
          <EditDomainModal
            domain={editDomain}
            otherDomains={domains.filter(d => d.id !== editDomain.id)}
            isOpen={!!editDomain}
            onClose={() => setEditDomain(null)}
            onSubmit={handleEditDomainSubmit}
          />
        )}

        {deleteDomain && (
          <DeleteDomainDialog
            domain={deleteDomain}
            isOpen={!!deleteDomain}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteDomain(null)}
          />
        )}

        {historyDomain && (
          <DomainHistoryDrawer
            domain={historyDomain}
            open={!!historyDomain}
            onClose={() => setHistoryDomain(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DominiosPage;
