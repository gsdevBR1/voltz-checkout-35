
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, MoreHorizontal, CheckSquare, 
  XSquare, Filter, Search, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { useToast } from '@/hooks/use-toast';

// Define a type for the upsell offers
type UpsellOffer = {
  id: string;
  name: string;
  mainProducts: string[];
  upsellProduct: string;
  price: number;
  isActive: boolean;
  conversions: number;
  createdAt: string;
};

const UpsellOnePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // States for UI management
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [mainProductFilter, setMainProductFilter] = useState<string>("");
  const [upsellProductFilter, setUpsellProductFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isQuickEditDialogOpen, setIsQuickEditDialogOpen] = useState(false);
  const [isApplyMoreProductsDialogOpen, setIsApplyMoreProductsDialogOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<UpsellOffer | null>(null);
  
  // Sample data for upsell offers
  const upsellOffers: UpsellOffer[] = [
    {
      id: "1",
      name: "Oferta Especial – Kit 3 Sabonetes",
      mainProducts: ["Camiseta Premium", "Calça Jeans Slim"],
      upsellProduct: "Kit Skin Care",
      price: 29.90,
      isActive: true,
      conversions: 124,
      createdAt: "2024-02-15",
    },
    {
      id: "2",
      name: "Frete Grátis - Adicione mais um item",
      mainProducts: ["Tênis Esportivo"],
      upsellProduct: "Camiseta Premium",
      price: 59.90,
      isActive: true,
      conversions: 87,
      createdAt: "2024-03-01",
    },
    {
      id: "3",
      name: "Combo Especial - Economize 30%",
      mainProducts: ["Tênis Esportivo", "Mochila Escolar", "Fones de Ouvido Bluetooth"],
      upsellProduct: "Meias Esportivas",
      price: 19.90,
      isActive: false,
      conversions: 43,
      createdAt: "2024-03-10",
    }
  ];

  // Sample data for products (for filters and dialogs)
  const allProducts = [
    "Camiseta Premium",
    "Calça Jeans Slim",
    "Tênis Esportivo",
    "Mochila Escolar",
    "Kit Skin Care",
    "Fones de Ouvido Bluetooth",
    "Meias Esportivas",
    "Relógio Digital",
    "Boné Casual"
  ];

  // Handler for selecting/deselecting all offers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(upsellOffers.map(offer => offer.id));
    }
    setSelectAll(!selectAll);
  };

  // Handler for selecting/deselecting a single offer
  const handleSelectOffer = (offerId: string) => {
    if (selectedOffers.includes(offerId)) {
      setSelectedOffers(selectedOffers.filter(id => id !== offerId));
      setSelectAll(false);
    } else {
      setSelectedOffers([...selectedOffers, offerId]);
      if (selectedOffers.length + 1 === upsellOffers.length) {
        setSelectAll(true);
      }
    }
  };

  // Handler for toggling offer status
  const handleToggleStatus = (offerId: string) => {
    // This would update the status in a real implementation
    toast({
      title: "Status alterado",
      description: "O status da oferta foi alterado com sucesso.",
    });
  };

  // Handler for bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedOffers.length === 0) {
      toast({
        title: "Nenhuma oferta selecionada",
        description: "Selecione pelo menos uma oferta para realizar esta ação.",
        variant: "destructive",
      });
      return;
    }

    switch (action) {
      case "activate":
        toast({
          title: "Ofertas ativadas",
          description: `${selectedOffers.length} ofertas foram ativadas com sucesso.`,
        });
        break;
      case "deactivate":
        toast({
          title: "Ofertas desativadas",
          description: `${selectedOffers.length} ofertas foram desativadas com sucesso.`,
        });
        break;
      case "delete":
        setIsBulkDeleteDialogOpen(true);
        break;
      case "applyMore":
        setIsApplyMoreProductsDialogOpen(true);
        break;
      default:
        break;
    }
  };

  // Handler for editing an offer
  const handleEditOffer = (offer: UpsellOffer) => {
    setCurrentOffer(offer);
    setIsQuickEditDialogOpen(true);
  };

  // Handler for deleting an offer
  const handleDeleteOffer = (offer: UpsellOffer) => {
    setCurrentOffer(offer);
    setIsDeleteDialogOpen(true);
  };

  // Handler for applying an offer to more products
  const handleApplyToMoreProducts = (offer: UpsellOffer) => {
    setCurrentOffer(offer);
    setIsApplyMoreProductsDialogOpen(true);
  };

  // Handler for confirming deletion
  const confirmDelete = () => {
    toast({
      title: "Oferta excluída",
      description: `A oferta "${currentOffer?.name}" foi excluída com sucesso.`,
    });
    setIsDeleteDialogOpen(false);
  };

  // Handler for confirming bulk deletion
  const confirmBulkDelete = () => {
    toast({
      title: "Ofertas excluídas",
      description: `${selectedOffers.length} ofertas foram excluídas com sucesso.`,
    });
    setIsBulkDeleteDialogOpen(false);
    setSelectedOffers([]);
    setSelectAll(false);
  };

  // Action buttons for header
  const actions = (
    <Button onClick={() => navigate("/marketing/upsell/criar")}>
      <Plus className="mr-2 h-4 w-4" />
      Novo Upsell
    </Button>
  );

  // Filter offers based on selected filters and search query
  const filteredOffers = upsellOffers.filter(offer => {
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && offer.isActive) || 
      (statusFilter === "inactive" && !offer.isActive);

    const matchesMainProduct = 
      !mainProductFilter || 
      offer.mainProducts.includes(mainProductFilter);

    const matchesUpsellProduct = 
      !upsellProductFilter || 
      offer.upsellProduct === upsellProductFilter;

    const matchesSearch = 
      !searchQuery || 
      offer.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesMainProduct && matchesUpsellProduct && matchesSearch;
  });

  // Items per page for pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOffers = filteredOffers.slice(startIndex, endIndex);

  return (
    <MarketingLayout 
      title="Upsell One Click" 
      description="Configure ofertas especiais que serão exibidas após a compra dos produtos principais."
      actions={actions}
    >
      <div className="space-y-6">
        {/* Filters section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Produto Principal</label>
                <Select value={mainProductFilter} onValueChange={setMainProductFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os produtos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os produtos</SelectItem>
                    {allProducts.map(product => (
                      <SelectItem key={product} value={product}>{product}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Produto de Upsell</label>
                <Select value={upsellProductFilter} onValueChange={setUpsellProductFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os produtos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os produtos</SelectItem>
                    {allProducts.map(product => (
                      <SelectItem key={product} value={product}>{product}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por nome..."
                    className="w-full pl-8 py-2 border rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedOffers.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <span className="text-sm font-medium">{selectedOffers.length} selecionados</span>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("activate")}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Ativar
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("deactivate")}>
              <XSquare className="mr-2 h-4 w-4" />
              Desativar
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("applyMore")}>
              <Plus className="mr-2 h-4 w-4" />
              Aplicar a mais produtos
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("delete")}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        )}

        {/* Upsell Offers Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectAll} 
                    onCheckedChange={handleSelectAll} 
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Produtos Principais</TableHead>
                <TableHead>Produto de Upsell</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Conversões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOffers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    <p className="text-muted-foreground">Nenhuma oferta encontrada</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate("/marketing/upsell/criar")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Primeiro Upsell
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                currentOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedOffers.includes(offer.id)} 
                        onCheckedChange={() => handleSelectOffer(offer.id)}
                        aria-label={`Selecionar ${offer.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{offer.name}</TableCell>
                    <TableCell>
                      {offer.mainProducts.slice(0, 2).join(", ")}
                      {offer.mainProducts.length > 2 && 
                        ` + ${offer.mainProducts.length - 2}`}
                    </TableCell>
                    <TableCell>{offer.upsellProduct}</TableCell>
                    <TableCell>R$ {offer.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={offer.isActive ? "default" : "outline"}
                        className={offer.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {offer.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{offer.conversions}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleToggleStatus(offer.id)}
                        >
                          {offer.isActive ? "Desativar" : "Ativar"}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditOffer(offer)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleApplyToMoreProducts(offer)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Aplicar a mais produtos
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteOffer(offer)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir a oferta "{currentOffer?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão em massa</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir {selectedOffers.length} ofertas? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Edit Dialog */}
      <Dialog open={isQuickEditDialogOpen} onOpenChange={setIsQuickEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edição Rápida</DialogTitle>
            <DialogDescription>
              Atualize os principais campos da oferta "{currentOffer?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium col-span-1">
                Nome
              </label>
              <input
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={currentOffer?.name}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium col-span-1">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={currentOffer?.price}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium col-span-1">
                Status
              </label>
              <Select defaultValue={currentOffer?.isActive ? "active" : "inactive"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuickEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={() => {
              toast({
                title: "Alterações salvas",
                description: "As alterações foram salvas com sucesso.",
              });
              setIsQuickEditDialogOpen(false);
            }}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply to More Products Dialog */}
      <Dialog open={isApplyMoreProductsDialogOpen} onOpenChange={setIsApplyMoreProductsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aplicar a Mais Produtos</DialogTitle>
            <DialogDescription>
              Selecione produtos adicionais para aplicar a oferta "{currentOffer?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[300px] overflow-y-auto">
            {allProducts
              .filter(product => !currentOffer?.mainProducts.includes(product))
              .map(product => (
                <div key={product} className="flex items-center space-x-2">
                  <Checkbox id={`product-${product}`} />
                  <label
                    htmlFor={`product-${product}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {product}
                  </label>
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyMoreProductsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={() => {
              toast({
                title: "Produtos adicionados",
                description: "A oferta foi aplicada aos produtos selecionados.",
              });
              setIsApplyMoreProductsDialogOpen(false);
            }}>
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MarketingLayout>
  );
};

export default UpsellOnePage;
