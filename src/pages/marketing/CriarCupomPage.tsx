import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { 
  Tag, 
  Percent, 
  DollarSign, 
  Calendar, 
  Users, 
  Package, 
  Check, 
  X, 
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import MarketingLayout from '@/components/marketing/MarketingLayout';

// Define schema for form validation
const cupomSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  codigo: z.string()
    .min(3, { message: 'Código deve ter pelo menos 3 caracteres' })
    .refine(value => /^[A-Za-z0-9]+$/.test(value), {
      message: 'Código deve conter apenas letras e números, sem espaços'
    }),
  tipoDesconto: z.enum(['valor', 'porcentagem']),
  valorDesconto: z.number()
    .nonnegative({ message: 'Valor não pode ser negativo' })
    .or(z.nan().transform(() => 0)), // Handle NaN as 0
  ativo: z.boolean().default(true),
  limiteUsoCliente: z.boolean().default(false),
  limiteTotalUsos: z.number()
    .int({ message: 'Deve ser um número inteiro' })
    .nonnegative({ message: 'Valor não pode ser negativo' })
    .nullable()
    .optional(),
  valorMinimoPedido: z.number()
    .nonnegative({ message: 'Valor não pode ser negativo' })
    .nullable()
    .optional(),
  produtosEspecificos: z.array(z.string()).optional(),
  dataInicio: z.date(),
  dataTermino: z.date().nullable().optional(),
});

type CupomFormValues = z.infer<typeof cupomSchema>;

const produtos = [
  { id: '1', nome: 'Curso Completo de Marketing Digital' },
  { id: '2', nome: 'E-book: 50 Dicas de SEO' },
  { id: '3', nome: 'Mentoria em Vendas Online' },
  { id: '4', nome: 'Template de Página de Vendas' },
  { id: '5', nome: 'Plugin Premium para WordPress' },
];

const CriarCupomPage = () => {
  const navigate = useNavigate();
  
  const form = useForm<CupomFormValues>({
    resolver: zodResolver(cupomSchema),
    defaultValues: {
      nome: '',
      codigo: '',
      tipoDesconto: 'porcentagem',
      valorDesconto: 0,
      ativo: true,
      limiteUsoCliente: false,
      limiteTotalUsos: null,
      valorMinimoPedido: null,
      produtosEspecificos: [],
      dataInicio: new Date(),
      dataTermino: null,
    },
  });
  
  const handleSubmit = (values: CupomFormValues) => {
    console.log('Cupom criado:', values);
    toast.success('Cupom criado com sucesso!');
    navigate('/marketing/cupons');
  };
  
  const tipoDesconto = form.watch('tipoDesconto');

  return (
    <MarketingLayout 
      title="Criar Novo Cupom" 
      description="Configure as informações do cupom de desconto para suas vendas."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Seção 1: Informações do Cupom */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Informações do Cupom
              </CardTitle>
              <CardDescription>
                Configure as informações básicas do cupom de desconto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name field - keep existing code */}
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Cupom*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Black Friday 2025" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome interno para identificação do cupom
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Code field - keep existing code */}
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código do Cupom*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: BLACKFRIDAY25" 
                          {...field} 
                          value={field.value?.toUpperCase()}
                        />
                      </FormControl>
                      <FormDescription>
                        Código que o cliente usará no checkout
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Discount type - keep existing code */}
                <FormField
                  control={form.control}
                  name="tipoDesconto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Desconto*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de desconto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="valor">
                            <span className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Valor fixo (R$)
                            </span>
                          </SelectItem>
                          <SelectItem value="porcentagem">
                            <span className="flex items-center gap-2">
                              <Percent className="h-4 w-4" />
                              Porcentagem (%)
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Escolha como o desconto será aplicado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* UPDATED: Discount value with currency formatting */}
                <FormField
                  control={form.control}
                  name="valorDesconto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Desconto*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          {tipoDesconto === 'valor' ? (
                            <Controller
                              name="valorDesconto"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <CurrencyInput
                                  value={field.value}
                                  onChange={field.onChange}
                                  error={!!fieldState.error}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                />
                              )}
                            />
                          ) : (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Percent className="h-4 w-4 text-gray-500" />
                              </div>
                              <Input
                                type="number"
                                placeholder="10"
                                className="pl-10 text-right"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        {tipoDesconto === 'valor' 
                          ? 'Valor fixo a ser descontado do pedido' 
                          : 'Porcentagem a ser descontada do pedido (0-100)'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Seção 2: Regras de Uso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Regras de Uso
              </CardTitle>
              <CardDescription>
                Configure como o cupom pode ser utilizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Active toggle - keep existing code */}
              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Cupom Ativo</FormLabel>
                      <FormDescription>
                        Define se o cupom está disponível para uso
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Client usage limit toggle - keep existing code */}
              <FormField
                control={form.control}
                name="limiteUsoCliente"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Limitar Uso por Cliente</FormLabel>
                      <FormDescription>
                        Evita uso múltiplo por um mesmo e-mail
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total usage limit - keep existing code */}
                <FormField
                  control={form.control}
                  name="limiteTotalUsos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limitar Total de Usos</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 100"
                          className="text-right"
                          {...field}
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => {
                            const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Limite máximo de vezes que o cupom pode ser usado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* UPDATED: Minimum order value with currency formatting */}
                <FormField
                  control={form.control}
                  name="valorMinimoPedido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Mínimo do Pedido</FormLabel>
                      <FormControl>
                        <Controller
                          name="valorMinimoPedido"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              error={!!fieldState.error}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          )}
                        />
                      </FormControl>
                      <FormDescription>
                        Valor mínimo do pedido para aplicar o cupom
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Products selection - keep existing code */}
              <FormField
                control={form.control}
                name="produtosEspecificos"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Produtos Específicos</FormLabel>
                      <FormDescription>
                        Aplica o cupom apenas aos produtos selecionados
                      </FormDescription>
                    </div>
                    <div className="max-h-60 overflow-auto border rounded-md p-4 space-y-2">
                      {produtos.map((produto) => (
                        <FormField
                          key={produto.id}
                          control={form.control}
                          name="produtosEspecificos"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={produto.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(produto.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), produto.id]
                                        : (field.value || []).filter(
                                            (value) => value !== produto.id
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {produto.nome}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Seção 3: Validade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Validade
              </CardTitle>
              <CardDescription>
                Configure o período de validade do cupom
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start date - keep existing code */}
                <FormField
                  control={form.control}
                  name="dataInicio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Início da Validade*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Data a partir da qual o cupom estará válido
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* End date - keep existing code */}
                <FormField
                  control={form.control}
                  name="dataTermino"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Término da Validade</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Sem data de expiração</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-2 border-b">
                            <Button 
                              variant="ghost" 
                              className="text-xs w-full justify-start"
                              onClick={() => {
                                field.onChange(null);
                                document.body.click(); // Close the popover
                              }}
                            >
                              <X className="mr-2 h-3 w-3" />
                              Remover data
                            </Button>
                          </div>
                          <CalendarComponent
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < form.getValues('dataInicio')}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Data após a qual o cupom não será mais válido (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Rodapé com Ações */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/marketing/cupons')}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit">
              <Check className="mr-2 h-4 w-4" />
              Salvar Cupom
            </Button>
          </div>
        </form>
      </Form>
    </MarketingLayout>
  );
};

export default CriarCupomPage;
