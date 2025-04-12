
import React, { useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Mail, MessageSquare, Send, Clock, WhatsApp } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";

interface RecoverySettings {
  email: {
    enabled: boolean;
    delayMinutes: number;
    subject: string;
    body: string;
    fromEmail: string;
  };
  sms: {
    enabled: boolean;
    delayMinutes: number;
    message: string;
    provider: string;
  };
  whatsapp: {
    enabled: boolean;
  };
}

const initialSettings: RecoverySettings = {
  email: {
    enabled: false,
    delayMinutes: 30,
    subject: "Esqueceu algo no carrinho?",
    body: "Olá {nome},\n\nNotamos que você deixou alguns itens no seu carrinho. Que tal finalizar sua compra agora?\n\nAcesse o link: {link}\n\nAtenciosamente,\nEquipe de Suporte",
    fromEmail: "",
  },
  sms: {
    enabled: false,
    delayMinutes: 15,
    message: "Olá {nome}, você deixou itens no carrinho. Finalize sua compra: {link}",
    provider: "Gateway nativo VOLTZ",
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
  }),
  sms: z.object({
    enabled: z.boolean(),
    delayMinutes: z.number().min(1, "O tempo deve ser maior que 1 minuto").max(1440, "O tempo não pode exceder 24 horas"),
    message: z.string().max(160, "A mensagem não pode exceder 160 caracteres"),
    provider: z.string(),
  }),
  whatsapp: z.object({
    enabled: z.boolean(),
  }),
});

const RecuperacaoVendas: React.FC = () => {
  const [settings, setSettings] = useState<RecoverySettings>(initialSettings);
  const [activeTab, setActiveTab] = useState("email");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialSettings,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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

  return (
    <DashboardLayout
      title="Recuperação de Vendas"
      description="Configure estratégias automáticas para recuperar vendas perdidas. Envie mensagens personalizadas para clientes que abandonaram o checkout, via SMS, Email e, em breve, WhatsApp."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> SMS
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2" disabled>
                <WhatsApp className="h-4 w-4" /> WhatsApp
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
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email.delayMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo para envio (minutos)</FormLabel>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              disabled={!form.watch("email.enabled")}
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Tempo de espera após o abandono do carrinho para enviar o email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email.fromEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email do remetente</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="suporte@sualoja.com"
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

                  <FormField
                    control={form.control}
                    name="email.subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Esqueceu algo no carrinho?"
                            {...field}
                            disabled={!form.watch("email.enabled")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email.body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corpo do Email</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conteúdo do email..."
                            className="min-h-[150px]"
                            {...field}
                            disabled={!form.watch("email.enabled")}
                          />
                        </FormControl>
                        <FormDescription>
                          Use {"{nome}"}, {"{produto}"}, {"{link}"} como variáveis que serão substituídas automaticamente.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
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
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="sms.delayMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo para envio (minutos)</FormLabel>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              disabled={!form.watch("sms.enabled")}
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Tempo de espera após o abandono do carrinho para enviar o SMS.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sms.message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Olá {nome}, você deixou itens no carrinho. Finalize sua compra: {link}"
                            {...field}
                            disabled={!form.watch("sms.enabled")}
                            className="resize-none"
                          />
                        </FormControl>
                        <FormDescription>
                          Use {"{nome}"} e {"{link}"} como variáveis. Máximo de 160 caracteres.
                          <div className="text-right mt-1">
                            <span className={`text-xs ${field.value.length > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                              {field.value.length}/160
                            </span>
                          </div>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sms.provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provedor SMS</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value}
                            disabled={true}
                          />
                        </FormControl>
                        <FormDescription>
                          O Gateway nativo VOLTZ é utilizado para envio de SMS.
                        </FormDescription>
                      </FormItem>
                    )}
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
                  <WhatsApp className="h-16 w-16 text-muted-foreground mb-4" />
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
    </DashboardLayout>
  );
};

export default RecuperacaoVendas;
