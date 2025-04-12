
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Domain } from '@/types/domain';
import { AlertTriangle } from 'lucide-react';

interface EditDomainModalProps {
  domain: Domain;
  otherDomains: Domain[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: 'checkout' | 'secure' | 'pay' | 'seguro') => void;
}

export const EditDomainModal: React.FC<EditDomainModalProps> = ({
  domain,
  otherDomains,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedType, setSelectedType] = useState<'checkout' | 'secure' | 'pay' | 'seguro'>(domain.type);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if the selected type conflicts with other domains
  const hasConflict = otherDomains.some(
    (otherDomain) => otherDomain.id !== domain.id && otherDomain.type === selectedType && otherDomain.name === domain.name
  );

  const isDomainPending = domain.status === 'pending' || !domain.dnsVerified;

  const handleSubmit = () => {
    if (hasConflict) return;
    
    setIsSubmitting(true);
    onSubmit(selectedType);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Domínio</DialogTitle>
          <DialogDescription>
            Altere o subdomínio usado para seu checkout.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="domain-type">Tipo de Subdomínio</Label>
            <Select 
              value={selectedType} 
              onValueChange={(value: 'checkout' | 'secure' | 'pay' | 'seguro') => setSelectedType(value)}
              disabled={isDomainPending}
            >
              <SelectTrigger id="domain-type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkout">checkout</SelectItem>
                <SelectItem value="secure">secure</SelectItem>
                <SelectItem value="pay">pay</SelectItem>
                <SelectItem value="seguro">seguro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm">
            URL resultante: <span className="font-semibold">{selectedType}.{domain.name}</span>
          </div>

          {isDomainPending && (
            <div className="flex items-center text-amber-500 text-sm mt-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span>Não é possível editar domínios com propagação pendente</span>
            </div>
          )}

          {hasConflict && (
            <div className="flex items-center text-red-500 text-sm mt-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span>Este subdomínio já está em uso para {domain.name}</span>
            </div>
          )}

          {domain.inUse && domain.inUse > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-2">
              <p className="text-amber-800 dark:text-amber-400 text-sm">
                Este domínio está ativo em {domain.inUse} {domain.inUse === 1 ? 'checkout' : 'checkouts'}.
                Alterá-lo pode afetar seus links ativos.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={domain.type === selectedType || hasConflict || isDomainPending || isSubmitting}
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
