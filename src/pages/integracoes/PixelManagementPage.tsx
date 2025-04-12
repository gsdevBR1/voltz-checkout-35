import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  AlertCircle, 
  ArrowLeft,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import AddEditPixelDialog from '@/components/integracoes/AddEditPixelDialog';
import DeleteConfirmDialog from '@/components/integracoes/DeleteConfirmDialog';
import { PixelConfig, PixelIntegration } from '@/types/integration';

// Mock data and helper functions (would be replaced with real API calls)
import { pixelsIntegrations } from '@/mock/pixelIntegrations';

const PixelManagementPage: React.FC = () => {
  const { platform } = useParams<{ platform: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [integration, setIntegration] = useState<PixelIntegration | null>(null);
  const [pixels, setPixels] = useState<PixelConfig[]>([]);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentPixel, setCurrentPixel] = useState<PixelConfig | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    const foundIntegration = pixelsIntegrations.find(i => 
      i.platform === platform || i.platform.replace('_', '-') === platform
    );
    
    if (foundIntegration) {
      setIntegration(foundIntegration);
      setPixels(foundIntegration.pixels || []);
    } else {
      navigate('/integracoes/pixels');
      toast({
        title: "Plataforma não encontrada",
        description: "A plataforma especificada não foi encontrada.",
        variant: "destructive",
      });
    }
  }, [platform, navigate, toast]);

  const filteredPixels = pixels.filter(pixel => {
    if (statusFilter === 'all') return true;
    return pixel.status === statusFilter;
  });

  const handleAddPixel = () => {
    setCurrentPixel(null);
    setIsAddEditOpen(true);
  };

  const handleEditPixel = (pixel: PixelConfig) => {
    setCurrentPixel(pixel);
    setIsAddEditOpen(true);
  };

  const handleDeletePixel = (pixel: PixelConfig) => {
    setCurrentPixel(pixel);
    setIsDeleteOpen(true);
  };

  const handleSavePixel = (pixelData: PixelConfig) => {
    if (currentPixel) {
      setPixels(prev => 
        prev.map(p => p.id === pixelData.id ? pixelData : p)
      );
      toast({
        title: "Pixel atualizado",
        description: `O pixel ${pixelData.name} foi atualizado com sucesso.`,
      });
    } else {
      const newPixel = {
        ...pixelData,
        id: `pixel-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPixels(prev => [...prev, newPixel]);
      toast({
        title: "Pixel adicionado",
        description: `O pixel ${pixelData.name} foi adicionado com sucesso.`,
      });
    }
    setIsAddEditOpen(false);
  };

  const handleToggleStatus = (pixel: PixelConfig) => {
    setPixels(prev => 
      prev.map(p => 
        p.id === pixel.id 
          ? { ...p, status: p.status === 'active' ? 'inactive' : 'active', updatedAt: new Date() } 
          : p
      )
    );
    
    toast({
      title: `Pixel ${pixel.status === 'active' ? 'desativado' : 'ativado'}`,
      description: `O pixel ${pixel.name} foi ${pixel.status === 'active' ? 'desativado' : 'ativado'} com sucesso.`,
    });
  };

  const handleConfirmDelete = () => {
    if (!currentPixel) return;
    
    setPixels(prev => prev.filter(p => p.id !== currentPixel.id));
    toast({
      title: "Pixel removido",
      description: `O pixel ${currentPixel.name} foi removido com sucesso.`,
    });
    setIsDeleteOpen(false);
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          <span>Ativo</span>
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="gap-1">
          <XCircle className="h-3 w-3" />
          <span>Inativo</span>
        </Badge>
      );
    }
  };

  if (!integration) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/integracoes/pixels')}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {integration.name} - Gerenciar Pixels
              </h1>
              <p className="text-muted-foreground">
                Adicione, edite ou remova pixels para esta plataforma.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                className="h-9 rounded-md border border-input bg-transparent pl-8 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">Todos os pixels</option>
                <option value="active">Pixels ativos</option>
                <option value="inactive">Pixels inativos</option>
              </select>
            </div>
            
            <Button onClick={handleAddPixel}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Adicionar Pixel</span>
            </Button>
          </div>
        </div>
        
        {filteredPixels.length === 0 ? (
          <Card>
            <CardContent className="pt-6 pb-4">
              <div className="flex flex-col items-center justify-center text-center p-6 gap-2">
                <AlertCircle className="h-12 w-12 text-muted-foreground opacity-40" />
                <CardTitle className="text-xl">Nenhum pixel encontrado</CardTitle>
                <CardDescription>
                  {statusFilter !== 'all' 
                    ? `Não existem pixels com o status "${statusFilter === 'active' ? 'ativo' : 'inativo'}" para esta plataforma.` 
                    : `Você ainda não adicionou pixels para ${integration.name}.`}
                </CardDescription>
                {statusFilter !== 'all' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setStatusFilter('all')}
                    className="mt-2"
                  >
                    Mostrar todos os pixels
                  </Button>
                )}
                {statusFilter === 'all' && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleAddPixel}
                    className="mt-2"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Adicionar primeiro pixel</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>ID do Pixel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPixels.map(pixel => (
                  <TableRow key={pixel.id}>
                    <TableCell className="font-medium">
                      {pixel.name}
                      {pixel.integrationType === 'conversion_api' && (
                        <Badge variant="outline" className="ml-2">API de Conversão</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {pixel.credentials.pixelId || 
                       pixel.credentials.conversionId || 
                       pixel.credentials.measurementId || 
                       pixel.credentials.containerId || 
                       '—'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(pixel.status)}
                    </TableCell>
                    <TableCell>
                      {pixel.updatedAt.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleStatus(pixel)}
                          className={pixel.status === 'active' ? 'text-destructive' : 'text-success'}
                        >
                          {pixel.status === 'active' ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditPixel(pixel)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeletePixel(pixel)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
      
      <AddEditPixelDialog
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSubmit={handleSavePixel}
        pixel={currentPixel}
        platformId={integration.platform}
        isEdit={!!currentPixel}
      />
      
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remover Pixel"
        description={`Tem certeza que deseja remover o pixel "${currentPixel?.name}"? Esta ação não poderá ser desfeita.`}
      />
    </DashboardLayout>
  );
};

export default PixelManagementPage;
