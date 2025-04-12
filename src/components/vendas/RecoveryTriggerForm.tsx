
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertCircle, Clipboard, Copy, Eye, Tag, Rocket, Clock, MessageSquare, Mail, Trash, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { 
  RecoveryTrigger, 
  TriggerEvent, 
  TriggerDelay, 
  TRIGGER_EVENTS, 
  DELAY_OPTIONS, 
  DYNAMIC_TAGS, 
  EMAIL_TEMPLATES, 
  SMS_TEMPLATES,
  MessageTemplate
} from "@/types/recovery";

interface RecoveryTriggerFormProps {
  type: 'email' | 'sms';
  existingTrigger?: RecoveryTrigger;
  onSave: (trigger: RecoveryTrigger) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const formSchema = z.object({
  id: z.string(),
  event: z.enum(['cart_abandoned', 'pix_pending', 'boleto_pending', 'payment_approved', 'order_shipped', 'order_delivered'] as const),
  delay: z.string(),
  active: z.boolean(),
  message: z.string().min(1, "O conteúdo da mensagem é obrigatório"),
  subject: z.string().min(1, "O assunto é obrigatório").optional(),
});

const RecoveryTriggerForm: React.FC<RecoveryTriggerFormProps> = ({ 
  type, 
  existingTrigger, 
  onSave, 
  onCancel,
  onDelete 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const isEmailType = type === 'email';
  const templates = isEmailType ? EMAIL_TEMPLATES : SMS_TEMPLATES;
  
  const form = useForm<RecoveryTrigger>({
    resolver: zodResolver(formSchema),
    defaultValues: existingTrigger || {
      id: uuidv4(),
      event: 'cart_abandoned',
      delay: '30min',
      active: true,
      message: '',
      subject: isEmailType ? '' : undefined,
    },
  });

  const watchMessage = form.watch('message');
  const messageCharCount = watchMessage.length;
  const smsLimitExceeded = type === 'sms' && messageCharCount > 160;

  const handleSubmit = (values: RecoveryTrigger) => {
    if (type === 'sms' && values.message.length > 160) {
      toast({
        title: "Limite de caracteres excedido",
        description: "Mensagens SMS não podem ter mais de 160 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    onSave(values);
    toast({
      title: "Automação salva",
      description: "Sua automação foi configurada com sucesso!",
    });
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    if (isEmailType && template.subject) {
      form.setValue('subject', template.subject);
    }
    form.setValue('message', template.content);
    form.setValue('event', template.triggerEvent);
  };

  const insertTag = (tag: string) => {
    const textarea = document.getElementById(isEmailType ? 'email-message' : 'sms-message') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = form.getValues('message');
      const newText = text.substring(0, start) + tag + text.substring(end);
      form.setValue('message', newText);
      
      // Focus the textarea and set the cursor position after the inserted tag
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 50);
    } else {
      // If we can't find the textarea, just append the tag at the end
      const currentText = form.getValues('message');
      form.setValue('message', currentText + tag);
    }
  };

  const handleDuplicate = () => {
    const values = form.getValues();
    const duplicatedTrigger: RecoveryTrigger = {
      ...values,
      id: uuidv4(),
      active: true,
      subject: isEmailType ? `${values.subject} (cópia)` : undefined,
    };
    
    onSave(duplicatedTrigger);
    toast({
      title: "Automação duplicada",
      description: "Uma nova cópia da automação foi criada.",
    });
  };

  const handleDelete = () => {
    if (onDelete && existingTrigger) {
      onDelete(existingTrigger.id);
      toast({
        title: "Automação removida",
        description: "A automação foi removida com sucesso.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Rocket className="h-5 w-5 mr-2" />
                  Configurar Gatilho
                </CardTitle>
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormLabel>Ativo</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <CardDescription>
                Configure quando e como suas mensagens serão enviadas automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="event"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evento disparador</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={(value: TriggerEvent) => field.onChange(value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um evento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(TRIGGER_EVENTS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Escolha o evento que acionará esta automação
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo para envio</FormLabel>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Select 
                          value={field.value} 
                          onValueChange={(value: string) => field.onChange(value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tempo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="instant">Instantâneo</SelectItem>
                            {Object.entries(DELAY_OPTIONS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormDescription>
                        Tempo de espera após o evento para enviar a mensagem
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center">
                    {isEmailType ? (
                      <Mail className="h-5 w-5 mr-2" />
                    ) : (
                      <MessageSquare className="h-5 w-5 mr-2" />
                    )}
                    Mensagem
                  </h3>
                  
                  <div className="flex space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Tag className="h-4 w-4 mr-2" />
                          Inserir tag
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <h4 className="text-sm font-medium mb-2">Tags dinâmicas</h4>
                        <p className="text-xs text-muted-foreground mb-3">
                          Clique em uma tag para inseri-la na mensagem
                        </p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {DYNAMIC_TAGS.map((tagItem) => (
                            <Button 
                              key={tagItem.tag} 
                              variant="outline" 
                              size="sm" 
                              className="justify-start"
                              onClick={() => insertTag(tagItem.tag)}
                            >
                              <code className="mr-2 text-blue-600">{tagItem.tag}</code>
                              <span className="text-xs text-muted-foreground">
                                {tagItem.description}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Clipboard className="h-4 w-4 mr-2" />
                          Templates
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Templates</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {templates.map((template) => (
                          <DropdownMenuItem 
                            key={template.id} 
                            onClick={() => handleTemplateSelect(template)}
                          >
                            {template.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showPreview ? "Editar" : "Visualizar"}
                    </Button>
                  </div>
                </div>

                {isEmailType && (
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Seu assunto aqui..."
                            {...field}
                            disabled={showPreview}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      {showPreview ? (
                        <div className="border rounded-md p-4 min-h-[150px] bg-background">
                          <div className="whitespace-pre-wrap">
                            {field.value}
                          </div>
                        </div>
                      ) : (
                        <FormControl>
                          <Textarea
                            id={isEmailType ? "email-message" : "sms-message"}
                            placeholder="Escreva sua mensagem aqui..."
                            className={`min-h-[150px] ${smsLimitExceeded ? 'border-destructive' : ''}`}
                            {...field}
                          />
                        </FormControl>
                      )}
                      {type === 'sms' && (
                        <div className="flex justify-between">
                          <FormDescription>
                            Use tags como {"{nome}"}, {"{link_checkout}"} para personalizar
                          </FormDescription>
                          <div className={`text-xs ${smsLimitExceeded ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {messageCharCount}/160 caracteres
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-5">
              <div className="flex space-x-2">
                {existingTrigger && onDelete && (
                  <Button 
                    variant="destructive" 
                    type="button"
                    onClick={handleDelete}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                )}
                {existingTrigger && (
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={handleDuplicate}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default RecoveryTriggerForm;
