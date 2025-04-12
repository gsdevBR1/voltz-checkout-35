
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PaginationControl from '@/components/marketing/PaginationControl';
import MarketingCard from '@/components/marketing/MarketingCard';
import MarketingEmptyState from '@/components/marketing/MarketingEmptyState';

interface Upsell {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  startDate: Date;
  endDate: Date;
  product: string;
  discount: number;
  image?: string;
  appliedToProducts: string[];
}

const mockUpsells: Upsell[] = [
  {
    id: "728ed52f",
    name: "Black Friday Upsell",
    status: "active",
    startDate: new Date("2023-11-24"),
    endDate: new Date("2023-11-25"),
    product: "Product A",
    discount: 10,
    appliedToProducts: ["Product X", "Product Y", "Product Z"]
  },
  {
    id: "39cd7cb0",
    name: "Cyber Monday Offer",
    status: "inactive",
    startDate: new Date("2023-11-27"),
    endDate: new Date("2023-11-28"),
    product: "Product B",
    discount: 15,
    appliedToProducts: ["Product X"]
  },
  {
    id: "0c1a1f69",
    name: "Christmas Sale",
    status: "active",
    startDate: new Date("2023-12-24"),
    endDate: new Date("2023-12-26"),
    product: "Product C",
    discount: 20,
    appliedToProducts: ["Product Y", "Product Z"]
  },
  {
    id: "4b8e5a2d",
    name: "New Year Discount",
    status: "inactive",
    startDate: new Date("2023-12-31"),
    endDate: new Date("2024-01-01"),
    product: "Product D",
    discount: 25,
    appliedToProducts: ["Product X", "Product Z"]
  },
  {
    id: "9e5f2b1c",
    name: "Valentine's Day Special",
    status: "active",
    startDate: new Date("2024-02-14"),
    endDate: new Date("2024-02-15"),
    product: "Product E",
    discount: 30,
    appliedToProducts: ["Product X"]
  },
];

const UpsellOnePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("all");
  const [upsells, setUpsells] = useState<Upsell[]>(mockUpsells);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    setUpsells(upsells.filter((upsell) => upsell.id !== id));
    toast.success("Upsell excluído com sucesso!");
  };
  
  const handleDuplicate = (id: string) => {
    const originalUpsell = upsells.find(u => u.id === id);
    if (originalUpsell) {
      const newUpsell = {
        ...originalUpsell,
        id: `duplicate-${id}-${Date.now()}`,
        name: `${originalUpsell.name} (Cópia)`,
      };
      setUpsells([...upsells, newUpsell]);
      toast.success("Upsell duplicado com sucesso!");
    }
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setUpsells(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: active ? 'active' : 'inactive' } : item
      )
    );
    toast.success(`Upsell ${active ? 'ativado' : 'desativado'} com sucesso!`);
  };

  const filteredUpsells = upsells.filter((upsell) => {
    const searchMatch = upsell.name.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === "all" || upsell.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUpsells = filteredUpsells.slice(startIndex, endIndex);

  return (
    <MarketingLayout
      title="Upsell One Click"
      description="Crie ofertas de upsell para aumentar suas vendas."
      actions={
        <Button asChild>
          <Link to="/marketing/upsell/criar">
            <Plus className="mr-2 h-4 w-4" />
            Criar Upsell
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="search"
            placeholder="Buscar upsells..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "active" | "inactive" | "all")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {currentUpsells.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentUpsells.map((upsell) => (
                <MarketingCard
                  key={upsell.id}
                  id={upsell.id}
                  title={upsell.name}
                  type="upsell"
                  active={upsell.status === 'active'}
                  productName={upsell.product}
                  appliedToCount={upsell.appliedToProducts.length}
                  appliedToProducts={upsell.appliedToProducts}
                  editPath={`/marketing/upsell/editar/${upsell.id}`}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  stats={{
                    conversionRate: upsell.discount,
                  }}
                />
              ))}
              
              {/* Add New Upsell Card */}
              <Card 
                className="border-dashed flex items-center justify-center h-[270px] cursor-pointer hover:bg-accent/30 transition-all duration-200" 
                onClick={() => navigate("/marketing/upsell/criar")}
              >
                <div className="text-center">
                  <div className="mx-auto bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Adicionar novo Upsell</h3>
                  <p className="text-sm text-muted-foreground max-w-[180px]">
                    Crie uma nova oferta para após a compra
                  </p>
                </div>
              </Card>
            </div>
            
            <PaginationControl
              currentPage={currentPage}
              totalItems={filteredUpsells.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <MarketingEmptyState
            title="Nenhum Upsell encontrado"
            description={search || statusFilter !== "all" 
              ? "Nenhum upsell corresponde aos seus critérios de busca. Tente alterar seus filtros."
              : "Você ainda não criou nenhum upsell. Crie agora para aumentar o valor dos seus pedidos."}
            createPath="/marketing/upsell/criar"
            createLabel="Criar Primeiro Upsell"
          />
        )}
      </div>
    </MarketingLayout>
  );
};

export default UpsellOnePage;
