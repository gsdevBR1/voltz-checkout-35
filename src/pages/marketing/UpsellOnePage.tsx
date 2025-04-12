import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, CalendarIcon, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from 'date-fns/locale';
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import PaginationControl from '@/components/marketing/PaginationControl';

interface Upsell {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  startDate: Date;
  endDate: Date;
  product: string;
  discount: number;
}

const data: Upsell[] = [
  {
    id: "728ed52f",
    name: "Black Friday Upsell",
    status: "active",
    startDate: new Date("2023-11-24"),
    endDate: new Date("2023-11-25"),
    product: "Product A",
    discount: 10,
  },
  {
    id: "39cd7cb0",
    name: "Cyber Monday Offer",
    status: "inactive",
    startDate: new Date("2023-11-27"),
    endDate: new Date("2023-11-28"),
    product: "Product B",
    discount: 15,
  },
  {
    id: "0c1a1f69",
    name: "Christmas Sale",
    status: "active",
    startDate: new Date("2023-12-24"),
    endDate: new Date("2023-12-26"),
    product: "Product C",
    discount: 20,
  },
  {
    id: "4b8e5a2d",
    name: "New Year Discount",
    status: "inactive",
    startDate: new Date("2023-12-31"),
    endDate: new Date("2024-01-01"),
    product: "Product D",
    discount: 25,
  },
  {
    id: "9e5f2b1c",
    name: "Valentine's Day Special",
    status: "active",
    startDate: new Date("2024-02-14"),
    endDate: new Date("2024-02-15"),
    product: "Product E",
    discount: 30,
  },
  {
    id: "6a2b9c8f",
    name: "Easter Promotion",
    status: "inactive",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-04-02"),
    product: "Product F",
    discount: 35,
  },
  {
    id: "1d9c6a5e",
    name: "Summer Sale",
    status: "active",
    startDate: new Date("2024-06-21"),
    endDate: new Date("2024-06-22"),
    product: "Product G",
    discount: 40,
  },
  {
    id: "8f6e3a2b",
    name: "Back to School Offer",
    status: "inactive",
    startDate: new Date("2024-08-01"),
    endDate: new Date("2024-08-02"),
    product: "Product H",
    discount: 45,
  },
  {
    id: "5c3b0d9a",
    name: "Halloween Discount",
    status: "active",
    startDate: new Date("2024-10-31"),
    endDate: new Date("2024-11-01"),
    product: "Product I",
    discount: 50,
  },
  {
    id: "2a0b7e6d",
    name: "Thanksgiving Sale",
    status: "inactive",
    startDate: new Date("2024-11-28"),
    endDate: new Date("2024-11-29"),
    product: "Product J",
    discount: 55,
  },
]

const UpsellOnePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("all");
  const [upsells, setUpsells] = useState<Upsell[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { toast } = useToast()

  const filteredUpsells = upsells.filter((upsell) => {
    const searchMatch = upsell.name.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === "all" || upsell.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const handleDelete = (id: string) => {
    setUpsells(upsells.filter((upsell) => upsell.id !== id));
    toast({
      title: "Upsell deletado.",
      description: "Este upsell foi removido da sua lista.",
    })
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUpsells = filteredUpsells.slice(startIndex, endIndex);

  return (
    <DashboardLayout>
      <div className="container py-10">
        <div className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>Upsell One Click</CardTitle>
            <CardDescription>
              Crie ofertas de upsell para aumentar suas vendas.
            </CardDescription>
          </CardHeader>
          <Button asChild>
            <Link to="/marketing/upsell/criar">
              <Plus className="mr-2 h-4 w-4" />
              Criar Upsell
            </Link>
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

        <Card>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUpsells.map((upsell) => (
                  <TableRow key={upsell.id}>
                    <TableCell className="font-medium">{upsell.name}</TableCell>
                    <TableCell>
                      <Badge variant={upsell.status === "active" ? "default" : "secondary"}>
                        {upsell.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(upsell.startDate, "dd/MM/yyyy", { locale: ptBR })} - {format(upsell.endDate, "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{upsell.product}</TableCell>
                    <TableCell>{upsell.discount}%</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/marketing/upsell/editar/${upsell.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-destructive focus:bg-destructive/20">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Deletar
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação irá deletar o upsell permanentemente.
                                  Você tem certeza que gostaria de continuar?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(upsell.id)}>Deletar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {currentUpsells.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhum upsell encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
        <PaginationControl
          currentPage={currentPage}
          totalItems={filteredUpsells.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </DashboardLayout>
  );
};

export default UpsellOnePage;
