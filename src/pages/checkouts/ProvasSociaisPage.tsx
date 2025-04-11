
import React, { useState } from 'react';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

interface ProvasSociais {
  id: string;
  nome: string;
  mensagem: string;
  produto: string;
  foto?: string;
  ativo: boolean;
}

const ProvasSociaisPage = () => {
  const [provas, setProvas] = useState<ProvasSociais[]>([
    {
      id: "1",
      nome: "João Silva",
      mensagem: "Acabou de comprar o Produto A. Adorei a qualidade!",
      produto: "produto-a",
      ativo: true
    },
    {
      id: "2",
      nome: "Maria Oliveira",
      mensagem: "Comprou há 2 minutos. Super recomendo!",
      produto: "produto-b",
      foto: "/placeholder.svg",
      ativo: false
    }
  ]);
  
  const [novaProva, setNovaProva] = useState<Omit<ProvasSociais, 'id' | 'ativo'>>({
    nome: '',
    mensagem: '',
    produto: '',
    foto: undefined
  });

  // Mockup de produtos da loja
  const produtos = [
    { id: "produto-a", nome: "Produto A" },
    { id: "produto-b", nome: "Produto B" },
    { id: "produto-c", nome: "Produto C" }
  ];
  
  const handleSwitchChange = (id: string, checked: boolean) => {
    setProvas(provas.map(prova => 
      prova.id === id ? { ...prova, ativo: checked } : prova
    ));
  };

  const handleAddProva = () => {
    if (!novaProva.nome || !novaProva.mensagem || !novaProva.produto) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = (provas.length + 1).toString();
    setProvas([...provas, { 
      ...novaProva, 
      id: newId,
      ativo: true 
    }]);
    
    // Reset form
    setNovaProva({
      nome: '',
      mensagem: '',
      produto: '',
      foto: undefined
    });
    
    toast({
      title: "Prova social adicionada",
      description: "A nova prova social foi adicionada com sucesso."
    });
  };

  return (
    <CheckoutLayout 
      title="Provas Sociais" 
      description="Adicione provas sociais que serão exibidas durante o checkout para aumentar a confiança dos clientes."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Prova Social</CardTitle>
            <CardDescription>
              Crie notificações de compras para exibir no checkout e aumentar a confiança.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Cliente *</Label>
              <Input 
                id="nome" 
                value={novaProva.nome}
                onChange={(e) => setNovaProva({...novaProva, nome: e.target.value})}
                placeholder="Ex: João Silva" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="foto">Foto (Opcional)</Label>
              <Input 
                id="foto" 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  // In a real implementation, you'd handle file upload here
                  setNovaProva({...novaProva, foto: e.target.value})
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem *</Label>
              <Textarea 
                id="mensagem" 
                value={novaProva.mensagem}
                onChange={(e) => setNovaProva({...novaProva, mensagem: e.target.value})}
                placeholder="Ex: Acabou de comprar..." 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="produto">Produto Vinculado *</Label>
              <Select 
                value={novaProva.produto}
                onValueChange={(value) => setNovaProva({...novaProva, produto: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map(produto => (
                    <SelectItem key={produto.id} value={produto.id}>{produto.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddProva} className="w-full">Adicionar Prova Social</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Provas Sociais Cadastradas</CardTitle>
            <CardDescription>
              Gerencie as provas sociais que aparecerão no checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {provas.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma prova social cadastrada ainda.
              </p>
            ) : (
              provas.map(prova => (
                <div key={prova.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex gap-3">
                    <Avatar>
                      {prova.foto ? (
                        <AvatarImage src={prova.foto} alt={prova.nome} />
                      ) : (
                        <AvatarFallback>{prova.nome.slice(0, 2).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{prova.nome}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{prova.mensagem}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Produto: {produtos.find(p => p.id === prova.produto)?.nome}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Switch 
                      checked={prova.ativo} 
                      onCheckedChange={(checked) => handleSwitchChange(prova.id, checked)} 
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preview de Prova Social</CardTitle>
          <CardDescription>
            Visualize como a prova social aparecerá no checkout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs mx-auto">
            <div className="bg-background border rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">João Silva</p>
                  <p className="text-sm text-muted-foreground">Acabou de comprar Produto A. Adorei a qualidade!</p>
                  <p className="text-xs text-muted-foreground mt-1">Há 2 minutos</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CheckoutLayout>
  );
};

export default ProvasSociaisPage;
