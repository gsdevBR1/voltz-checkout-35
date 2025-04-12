
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Mail, MessageSquare, Send, MessageCircle } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { RecoverySettings, RecoveryTrigger } from "@/types/recovery";
import RecoveryStats from "@/components/vendas/RecoveryStats";
import RecoveryTriggersList from "@/components/vendas/RecoveryTriggersList";

const initialSettings: RecoverySettings = {
  email: {
    enabled: false,
    delayMinutes: 30,
    subject: "Esqueceu algo no carrinho?",
    body: "Olá {nome},\n\nNotamos que você deixou alguns itens no seu carrinho. Que tal finalizar sua compra agora?\n\nAcesse o link: {link}\n\nAtenciosamente,\nEquipe de Suporte",
    fromEmail: "",
    triggers: [],
  },
  sms: {
    enabled: false,
    delayMinutes: 15,
    message: "Olá {nome}, você deixou itens no carrinho. Finalize sua compra: {link}",
    provider: "Gateway nativo VOLTZ",
    triggers: [],
  },
  whatsapp: {
    enabled: false,
  },
};

const formSchema = z.object({
  email: z.object({
    enabled: z.boolean(),
    delayMinutes: z.number().min(1, "O tempo deve ser maior que 1 minuto").max(1440, "O tempo não pode exceder 24 horas"),
    subject: z.string().min(1, "O assunto é obrigatório"),
    body: z.string().min(1, "O corpo do email é obrigatório"),
    fromEmail: z.string().email("Email inválido").or(z.string().length(0)),
    triggers: z.array(z.any()),
  }),
  sms: z.object({
    enabled: z.boolean(),
    delayMinutes: z.number().min(1, "O tempo deve ser maior que 1 minuto").max(1440, "O tempo não pode exceder 24 horas"),
    message: z.string().max(160, "A mensagem não pode exceder 160 caracteres"),
    provider: z.string(),
    triggers: z.array(z.any()),
  }),
  whatsapp: z.object({
    enabled: z.boolean(),
  }),
});

const RecuperacaoVendas: React.FC = () => {
  const [settings, setSettings] = useState<RecoverySettings>(initialSettings);
  const [activeTab, setActiveTab] = useState("configuracao");
  const [channelTab, setChannelTab] = useState("email");

  const form = useForm<RecoverySettings>({
    resolver: zodResolver(formSchema),
    defaultValues: initialSettings,
  });

  const onSubmit = (values: RecoverySettings) => {
    setSettings(values);
    toast({
      title: "Configurações salvas",
      description: "As configurações de recuperação de vendas foram atualizadas com sucesso.",
      variant: "default",
    });
  };

  const handleSimulateEmail = () => {
    toast({
      title: "Email de teste enviado",
      description: "Um email de teste foi enviado para sua caixa de entrada.",
      variant: "default",
    });
  };

  const handleSimulateSMS = () => {
    toast({
      title: "SMS de teste enviado",
      description: "Um SMS de teste foi enviado para seu número de telefone.",
      variant: "default",
    });
  };

  const handleSaveTrigger = (trigger: RecoveryTrigger) => {
    // Create a copy of the current settings
    const newSettings = { ...settings };
    
    // Check if this trigger already exists (editing scenario)
    const triggerIndex = channelTab === 'email' 
      ? newSettings.email.triggers.findIndex(t => t.id === trigger.id)
      : newSettings.sms.triggers.findIndex(t => t.id === trigger.id);
    
    if (triggerIndex !== -1) {
      // Update existing trigger
      if (channelTab === 'email') {
        newSettings.email.triggers[triggerIndex] = trigger;
      } else {
        newSettings.sms.triggers[triggerIndex] = trigger;
      }
    } else {
      // Add new trigger
      if (channelTab === 'email') {
        newSettings.email.triggers.push(trigger);
      } else {
        newSettings.sms.triggers.push(trigger);
      }
    }
    
    // Update settings
    setSettings(newSettings);
    form.setValue(channelTab === 'email' ? 'email.triggers' : 'sms.triggers', 
                 channelTab === 'email' ? newSettings.email.triggers : newSettings.sms.triggers);
    
    toast({
      title: "Automação salva",
      description: "A automação foi configurada com sucesso.",
    });
  };

  const handleDeleteTrigger = (id: string) => {
    // Create a copy of the current settings
    const newSettings = { ...settings };
    
    // Filter out the trigger with the specified id
    if (channelTab === 'email') {
      newSettings.email.triggers = newSettings.email.triggers.filter(t => t.id !== id);
      form.setValue('email.triggers', newSettings.email.triggers);
    } else {
      newSettings.sms.triggers = newSettings.sms.triggers.filter(t => t.id !== id);
      form.setValue('sms.triggers', newSettings.sms.triggers);
    }
    
    // Update settings
    setSettings(newSettings);
    
    toast({
      title: "Automação removida",
      description: "A automação foi removida com sucesso.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recuperação de Vendas</h1>
          <p className="text-muted-foreground mt-2">
            Configure estratégias automáticas para recuperar vendas perdidas. Envie mensagens personalizadas para clientes que abandonaram o checkout, via SMS, Email e, em breve, WhatsApp.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="configuracao">Configuração</TabsTrigger>
            <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configuracao">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={channelTab} onValueChange={setChannelTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> SMS
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp" className="flex items-center gap-2" disabled>
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                      <Badge variant="outline" className="ml-1 py-0 h-5">Em breve</Badge>
                    </TabsTrigger>
                  </TabsList>

                  {/* Email Tab */}
                  <TabsContent value="email">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Configuração de Email</span>
                          <FormField
                            control={form.control}
                            name="email.enabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg space-y-0">
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                    <FormLabel className="text-sm">
                                      {field.value ? "Ativado" : "Desativado"}
                                    </FormLabel>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </CardTitle>
                        <CardDescription>
                          Configure o envio automático de emails para recuperar carrinhos abandonados.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="email.fromEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email do remetente</FormLabel>
                              <FormControl>
                                <input
                                  type="email"
                                  placeholder="suporte@sualoja.com"
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                  disabled={!form.watch("email.enabled")}
                                />
                              </FormControl>
                              <FormDescription>
                                Email que aparecerá como remetente da mensagem.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <RecoveryTriggersList 
                          type="email"
                          triggers={settings.email.triggers}
                          onSave={handleSaveTrigger}
                          onDelete={handleDeleteTrigger}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-5">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Emails são enviados através da plataforma Voltz
                        </div>
                        <Button 
                          variant="outline" 
                          type="button"
                          onClick={handleSimulateEmail}
                          disabled={!form.watch("email.enabled")}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar teste
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  {/* SMS Tab */}
                  <TabsContent value="sms">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Configuração de SMS</span>
                          <FormField
                            control={form.control}
                            name="sms.enabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg space-y-0">
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                    <FormLabel className="text-sm">
                                      {field.value ? "Ativado" : "Desativado"}
                                    </FormLabel>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </CardTitle>
                        <CardDescription>
                          Configure o envio automático de SMS para recuperar carrinhos abandonados.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="sms.provider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Provedor SMS</FormLabel>
                              <FormControl>
                                <input
                                  type="text"
                                  value={field.value}
                                  disabled={true}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                              </FormControl>
                              <FormDescription>
                                O Gateway nativo VOLTZ é utilizado para envio de SMS.
                              </FormDescription>
                            </FormItem>
                          )}
                        />

                        <RecoveryTriggersList 
                          type="sms"
                          triggers={settings.sms.triggers}
                          onSave={handleSaveTrigger}
                          onDelete={handleDeleteTrigger}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-5">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Cobrança por SMS enviado
                        </div>
                        <Button 
                          variant="outline" 
                          type="button" 
                          onClick={handleSimulateSMS}
                          disabled={!form.watch("sms.enabled")}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar teste
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  {/* WhatsApp Tab */}
                  <TabsContent value="whatsapp">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Configuração de WhatsApp</span>
                          <Badge className="bg-pending text-pending-foreground">Em breve</Badge>
                        </CardTitle>
                        <CardDescription>
                          Você poderá ativar automações por WhatsApp nos próximos dias.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="min-h-[300px] flex flex-col items-center justify-center text-center p-10">
                        <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Recurso em desenvolvimento</h3>
                        <p className="text-muted-foreground max-w-md">
                          Estamos trabalhando para disponibilizar a recuperação de carrinhos abandonados via WhatsApp. 
                          Em breve você poderá configurar mensagens automáticas para este canal.
                        </p>
                      </CardContent>
                      <CardFooter className="justify-center border-t pt-5">
                        <Button variant="outline" disabled>
                          Entrar na lista de espera
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end">
                  <Button type="submit">Salvar configurações</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="estatisticas">
            <RecoveryStats />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RecuperacaoVendas;
