
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Loader2,
  ChevronsUpDown,
  Check,
  Info,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Card validation schema
const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .min(16, 'Número de cartão inválido')
    .max(19, 'Número de cartão inválido')
    .regex(/^[0-9\s]+$/, 'Somente números são permitidos'),
  cardholderName: z
    .string()
    .min(3, 'Nome muito curto')
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, 'Apenas letras são permitidas'),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Data inválida (MM/AA)'),
  cvv: z
    .string()
    .min(3, 'CVV inválido')
    .max(4, 'CVV inválido')
    .regex(/^[0-9]+$/, 'Somente números são permitidos'),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
});

interface CreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCard?: {
    last4: string;
    brand: string;
  } | null;
}

const CreditCardModal: React.FC<CreditCardModalProps> = ({ 
  isOpen, 
  onClose, 
  existingCard 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof creditCardSchema>>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
      cpf: '',
    },
  });

  // Detect card type based on number
  const detectCardType = (number: string) => {
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]/;
    const amexRegex = /^3[47]/;
    const eloRegex = /^(401178|401179|438935|457631|457632|504175|506699|509048|509067|509049|509069|509050|509074|509068|509040|509045|509051|509046|509066|509047|509042|509052|509043|509064|509040|36297|5067)/;
    
    // Cleanup the number (remove spaces)
    const cleanNumber = number.replace(/\s+/g, '');
    
    if (visaRegex.test(cleanNumber)) return 'Visa';
    if (mastercardRegex.test(cleanNumber)) return 'Mastercard';
    if (amexRegex.test(cleanNumber)) return 'American Express';
    if (eloRegex.test(cleanNumber)) return 'Elo';
    return '';
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date with slash
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  // Format CPF with dots and dash
  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, '');
    
    if (v.length <= 3) {
      return v;
    } else if (v.length <= 6) {
      return `${v.substring(0, 3)}.${v.substring(3)}`;
    } else if (v.length <= 9) {
      return `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6)}`;
    } else {
      return `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6, 9)}-${v.substring(9, 11)}`;
    }
  };

  const onSubmit = async (data: z.infer<typeof creditCardSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Here you would implement the actual tokenization with your payment gateway
      // This is just a mock implementation for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Card data to be tokenized:', data);
      
      // Success message
      toast({
        title: "Cartão atualizado",
        description: "Seu cartão foi salvo com sucesso!",
        variant: "default",
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving card:', error);
      toast({
        title: "Erro ao salvar cartão",
        description: "Ocorreu um erro ao processar seu cartão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any,
    formatter?: (value: string) => string
  ) => {
    const value = e.target.value;
    const formattedValue = formatter ? formatter(value) : value;
    field.onChange(formattedValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {existingCard ? 'Alterar cartão de crédito' : 'Adicionar cartão de crédito'}
          </DialogTitle>
          <DialogDescription>
            {existingCard 
              ? 'Atualize as informações do seu cartão de crédito para a cobrança do ciclo.' 
              : 'Adicione um cartão de crédito para a cobrança automática do ciclo.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {existingCard && (
              <div className="bg-slate-50 p-3 rounded-md mb-4">
                <p className="text-sm text-slate-600">Cartão atual:</p>
                <div className="flex items-center mt-1">
                  <CreditCard className="h-4 w-4 mr-2 text-slate-600" />
                  <span className="font-medium">
                    {existingCard.brand} •••• {existingCard.last4}
                  </span>
                </div>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do cartão</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="0000 0000 0000 0000"
                        {...field}
                        value={field.value}
                        onChange={(e) => handleInputChange(e, field, formatCardNumber)}
                        maxLength={19}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    {field.value && detectCardType(field.value) && (
                      <div className="absolute right-3 top-2.5">
                        <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded">
                          {detectCardType(field.value)}
                        </span>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardholderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome impresso no cartão</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome completo do titular"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM/AA"
                        {...field}
                        onChange={(e) => handleInputChange(e, field, formatExpiryDate)}
                        maxLength={5}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>CVV</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 p-0">
                              <Info className="h-3.5 w-3.5" />
                              <span className="sr-only">Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              O código de segurança (CVV) é um código de 3 ou 4 dígitos 
                              encontrado no verso do seu cartão.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="123"
                        {...field}
                        maxLength={4}
                        type="password"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF do titular</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      {...field}
                      onChange={(e) => handleInputChange(e, field, formatCPF)}
                      maxLength={14}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando
                  </>
                ) : (
                  <>
                    Salvar cartão
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreditCardModal;
