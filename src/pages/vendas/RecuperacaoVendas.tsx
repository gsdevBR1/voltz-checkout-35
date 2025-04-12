import React, { useState } from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  MessageSquare, 
  MessageCircle, 
  Plus, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Link as LinkIcon, 
  Tag
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RecoverySettings, RecoveryTrigger, TRIGGER_EVENTS, DELAY_OPTIONS } from "@/types/recovery";
import RecoveryStats from "@/components/vendas/RecoveryStats";
import RecoveryTriggerForm from "@/components/vendas/RecoveryTriggerForm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const initialSettings: RecoverySettings = {
  email: {
    enabled: true,
    delayMinutes: 30,
    subject: "Esqueceu algo no carrinho?",
    body: "Olá {nome},\n\nNotamos que você deixou alguns itens no seu carrinho. Que tal finalizar sua compra agora?\n\nAcesse o link: {link}\n\nAtenciosamente,\nEquipe de Suporte",
    fromEmail: "",
    triggers: [
      {
        id: "1",
        event: "cart_abandoned",
        delay: "15min",
        active: true,
        message: "Olá {nome}, notamos que você deixou alguns produtos no carrinho.\n\nClique aqui para finalizar sua compra com segurança: {link_checkout}\n\nSe tiver dúvidas, fale com a gente! 💬",
        subject: "Esqueceu algo no carrinho?"
      },
      {
        id: "2",
        event: "boleto_pending",
        delay: "30min",
        active: true,
        message: "{nome}, seu boleto está pronto para pagamento.\n\nValor: {valor}\nVencimento: {data_vencimento}\n\nReabra o link aqui: {link_checkout}",
        subject: "Seu boleto está pronto para pagamento"
      }
    ],
  },
  sms: {
    enabled: true,
    delayMinutes: 15,
    message: "Olá {nome}, você deixou itens no carrinho. Finalize sua compra: {link}",
    provider: "Gateway nativo VOLTZ",
    triggers: [
      {
        id: "1",
        event: "cart_abandoned",
        delay: "10min",
        active: true,
        message: "Olá {nome}, você deixou itens no carrinho. Finalize sua compra: {link_checkout}"
      }
    ],
  },
  whatsapp: {
    enabled: false,
  },
};

const RecuperacaoVendas: React.FC = () => {
  const [settings, setSettings] = useState<RecoverySettings>(initialSettings);
  const [activeTab, setActiveTab] = useState("automacoes");
  const [isAddingTrigger, setIsAddingTrigger] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<{trigger: RecoveryTrigger, channel: 'email' | 'sms'} | null>(null);
  const [triggerToDelete, setTriggerToDelete] = useState<{id: string, channel: 'email' | 'sms'} | null>(null);
  const [newTriggerChannel, setNewTriggerChannel] = useState<'email' | 'sms'>('email');

  const handleSaveTrigger = (trigger: RecoveryTrigger, channel: 'email' | 'sms') => {
    const newSettings = { ...settings };
    
    const triggerIndex = channel === 'email' 
      ? newSettings.email.triggers.findIndex(t => t.id === trigger.id)
      : newSettings.sms.triggers.findIndex(t => t.id === trigger.id);
    
    if (triggerIndex !== -1) {
      if (channel === 'email') {
        newSettings.email.triggers[triggerIndex] = trigger;
      } else {
        newSettings.sms.triggers[triggerIndex] = trigger;
      }
    } else {
      if (channel === 'email') {
        newSettings.email.triggers.push(trigger);
      } else {
        newSettings.sms.triggers.push(trigger);
      }
    }
    
    setSettings(newSettings);
    
    setIsAddingTrigger(false);
    setEditingTrigger(null);
    
    toast({
      title: "Automação salva",
      description: "A automação foi configurada com sucesso.",
    });
  };

  const handleDeleteTrigger = () => {
    if (!triggerToDelete) return;
    
    const newSettings = { ...settings };
    
    if (triggerToDelete.channel === 'email') {
      newSettings.email.triggers = newSettings.email.triggers.filter(t => t.id !== triggerToDelete.id);
    } else {
      newSettings.sms.triggers = newSettings.sms.triggers.filter(t => t.id !== triggerToDelete.id);
    }
    
    setSettings(newSettings);
    
    setTriggerToDelete(null);
    
    toast({
      title: "Automação removida",
      description: "A automação foi removida com sucesso.",
    });
  };

  const handleEditTrigger = (trigger: RecoveryTrigger, channel: 'email' | 'sms') => {
    setEditingTrigger({ trigger, channel });
  };

  const countVariablesInMessage = (message: string) => {
    const variablePattern = /{[^}]+}/g;
    const matches = message.match(variablePattern);
    return matches ? matches.length : 0;
  };

  const countLinksInMessage = (message: string) => {
    const linkPattern = /{link[^}]*}/g;
    const matches = message.match(linkPattern);
    return matches ? matches.length : 0;
  };

  const startNewAutomation = (channel: 'email' | 'sms') => {
    setNewTriggerChannel(channel);
    setIsAddingTrigger(true);
  };

  if (isAddingTrigger || editingTrigger) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isAddingTrigger ? "Nova Automação" : "Editar Automação"}
              </h1>
              <p className="text-muted-foreground mt-2">
                Configure quando e como suas mensagens serão enviadas automaticamente.
              </p>
            </div>
            <Button variant="outline" onClick={() => {
              setIsAddingTrigger(false);
              setEditingTrigger(null);
            }}>
              Voltar
            </Button>
          </div>
          
          <RecoveryTriggerForm
            type={editingTrigger ? editingTrigger.channel : newTriggerChannel}
            existingTrigger={editingTrigger ? editingTrigger.trigger : undefined}
            onSave={(trigger) => handleSaveTrigger(
              trigger, 
              editingTrigger ? editingTrigger.channel : newTriggerChannel
            )}
            onCancel={() => {
              setIsAddingTrigger(false);
              setEditingTrigger(null);
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recuperação de Vendas</h1>
            <p className="text-muted-foreground mt-2">
              Automatize a comunicação com seus clientes para recuperar vendas abandonadas ou notificar eventos importantes.
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar nova automação
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => startNewAutomation('email')} className="flex items-center cursor-pointer">
                <Mail className="h-4 w-4 mr-2 text-blue-500" />
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => startNewAutomation('sms')} className="flex items-center cursor-pointer">
                <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                SMS
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="automacoes">Automações</TabsTrigger>
            <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="automacoes" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email
                  <Badge variant="outline" className="ml-2">
                    {settings.email.triggers.length} automações
                  </Badge>
                </h2>
                <Button variant="outline" size="sm" onClick={() => startNewAutomation('email')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar email
                </Button>
              </div>

              {settings.email.triggers.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                  {settings.email.triggers.map((trigger) => (
                    <Card key={trigger.id} className="overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="pb-2 bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="mr-2">
                              <Mail className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <CardTitle className="text-base">
                                {TRIGGER_EVENTS[trigger.event]}
                              </CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Enviar após: {DELAY_OPTIONS[trigger.delay as keyof typeof DELAY_OPTIONS] || trigger.delay}
                              </CardDescription>
                            </div>
                          </div>
                          {trigger.active ? (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Ativa
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              <XCircle className="h-3.5 w-3.5 mr-1" /> Inativa
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium text-sm">{trigger.subject}</div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {trigger.message}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {countLinksInMessage(trigger.message) > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <LinkIcon className="h-3 w-3 mr-1" />
                                {countLinksInMessage(trigger.message)} {countLinksInMessage(trigger.message) === 1 ? 'link' : 'links'}
                              </Badge>
                            )}
                            {countVariablesInMessage(trigger.message) > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {countVariablesInMessage(trigger.message)} {countVariablesInMessage(trigger.message) === 1 ? 'variável' : 'variáveis'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2 pt-0 pb-4 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => handleEditTrigger(trigger, 'email')}
                        >
                          <Edit className="h-3.5 w-3.5 mr-2" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setTriggerToDelete({ id: trigger.id, channel: 'email' })}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Remover
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-muted p-3 mb-3">
                      <Mail className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Nenhuma automação de email</h3>
                    <p className="text-muted-foreground text-center mb-4 max-w-md">
                      Você ainda não criou nenhuma automação de email. 
                      Clique no botão acima para começar.
                    </p>
                    <Button onClick={() => startNewAutomation('email')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar primeira automação
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  SMS
                  <Badge variant="outline" className="ml-2">
                    {settings.sms.triggers.length} automações
                  </Badge>
                </h2>
                <Button variant="outline" size="sm" onClick={() => startNewAutomation('sms')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar SMS
                </Button>
              </div>

              {settings.sms.triggers.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                  {settings.sms.triggers.map((trigger) => (
                    <Card key={trigger.id} className="overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="pb-2 bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="mr-2">
                              <MessageSquare className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                              <CardTitle className="text-base">
                                {TRIGGER_EVENTS[trigger.event]}
                              </CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Enviar após: {DELAY_OPTIONS[trigger.delay as keyof typeof DELAY_OPTIONS] || trigger.delay}
                              </CardDescription>
                            </div>
                          </div>
                          {trigger.active ? (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Ativa
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              <XCircle className="h-3.5 w-3.5 mr-1" /> Inativa
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {trigger.message}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {countLinksInMessage(trigger.message) > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <LinkIcon className="h-3 w-3 mr-1" />
                                {countLinksInMessage(trigger.message)} {countLinksInMessage(trigger.message) === 1 ? 'link' : 'links'}
                              </Badge>
                            )}
                            {countVariablesInMessage(trigger.message) > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {countVariablesInMessage(trigger.message)} {countVariablesInMessage(trigger.message) === 1 ? 'variável' : 'variáveis'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2 pt-0 pb-4 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => handleEditTrigger(trigger, 'sms')}
                        >
                          <Edit className="h-3.5 w-3.5 mr-2" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setTriggerToDelete({ id: trigger.id, channel: 'sms' })}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Remover
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-muted p-3 mb-3">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Nenhuma automação de SMS</h3>
                    <p className="text-muted-foreground text-center mb-4 max-w-md">
                      Você ainda não criou nenhuma automação de SMS. 
                      Clique no botão acima para começar.
                    </p>
                    <Button onClick={() => startNewAutomation('sms')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar primeira automação
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                  <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                    Em breve
                  </Badge>
                </h2>
                <Button variant="outline" size="sm" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar WhatsApp
                </Button>
              </div>

              <Card className="border-dashed opacity-70">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <MessageCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">WhatsApp em breve</h3>
                  <p className="text-muted-foreground text-center mb-4 max-w-md">
                    Estamos trabalhando para disponibilizar a recuperação de carrinhos abandonados via WhatsApp. 
                    Em breve você poderá configurar mensagens automáticas para este canal.
                  </p>
                  <Button variant="outline" disabled>
                    Entrar na lista de espera
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="estatisticas">
            <RecoveryStats />
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={triggerToDelete !== null} onOpenChange={(open) => !open && setTriggerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir automação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta automação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTrigger} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default RecuperacaoVendas;
