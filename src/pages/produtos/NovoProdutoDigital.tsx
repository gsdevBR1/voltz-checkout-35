
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { FileText } from 'lucide-react';
import { ProductFormData } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome do produto deve ter pelo menos 3 caracteres.',
  }),
  price: z.coerce.number().min(1, {
    message: 'O preço deve ser maior que zero.',
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.',
  }),
  status: z.enum(['active', 'inactive']),
  imageUrl: z.string().optional(),
  downloadUrl: z.string().optional(),
});

const NovoProdutoDigital: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      status: 'active',
      imageUrl: '',
      downloadUrl: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Convert price to cents for storage
    const productData: ProductFormData = {
      ...values,
      type: 'digital',
      price: Math.round(values.price * 100),
    };
    
    console.log('Form submitted:', productData);
    
    toast({
      title: 'Produto digital criado com sucesso!',
      description: `${values.name} foi adicionado ao seu catálogo.`,
    });
    
    // In a real app, we would save this to a database
    navigate('/produtos');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Novo Produto Digital
          </h1>
          <p className="text-muted-foreground">
            Preencha as informações para criar um novo produto digital.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Defina o nome, preço e descrição do seu produto digital.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: E-book: Guia de Marketing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" placeholder="0,00" {...field} />
                      </FormControl>
                      <FormDescription>
                        Digite o valor sem o símbolo R$.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva seu produto digital em detalhes..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conteúdo Digital</CardTitle>
                <CardDescription>
                  Configure o link para download ou acesso ao conteúdo digital.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="downloadUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de Download</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/download" {...field} />
                      </FormControl>
                      <FormDescription>
                        Link para o arquivo digital ou área de membros.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Produto Ativo</FormLabel>
                          <FormDescription>
                            Produtos inativos não ficam visíveis para os clientes.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === 'active'}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? 'active' : 'inactive');
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imagem do Produto</CardTitle>
                <CardDescription>
                  Adicione uma imagem para seu produto digital.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Informe a URL de uma imagem já hospedada na internet.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/produtos')}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar Produto</Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default NovoProdutoDigital;
