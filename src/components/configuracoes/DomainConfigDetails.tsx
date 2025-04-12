
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, RefreshCw, CheckCircle2, XCircle, Lock, AlertTriangle, Copy, HelpCircle } from 'lucide-react';
import { Domain, DomainVerification } from '@/types/domain';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface DomainConfigDetailsProps {
  domain: Domain;
  onVerifyDNS: () => void;
  onSubdomainChange: (type: 'checkout' | 'secure' | 'pay' | 'seguro') => void;
  onBack: () => void;
}

export const DomainConfigDetails: React.FC<DomainConfigDetailsProps> = ({
  domain,
  onVerifyDNS,
  onSubdomainChange,
  onBack
}) => {
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'checkout' | 'secure' | 'pay' | 'seguro'>(domain.type);

  // Mock data for DNS verification details
  const dnsVerificationDetails: DomainVerification = {
    type: 'CNAME',
    name: selectedType,
    value: 'dominio.voltzcheckout.com',
    isVerified: domain.dnsVerified || false
  };

  const handleCopyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copiado!",
      description: "Valor copiado para área de transferência",
    });
  };

  const handleVerifyDNS = async () => {
    setVerifying(true);
    // Simulate API call
    setTimeout(() => {
      onVerifyDNS();
      setVerifying(false);
      toast({
        title: "Verificação concluída",
        description: "A configuração de DNS foi verificada",
      });
    }, 2000);
  };

  const handleTypeChange = (value: 'checkout' | 'secure' | 'pay' | 'seguro') => {
    setSelectedType(value);
    onSubdomainChange(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Domínio: {domain.name}</CardTitle>
        <CardDescription>
          Para ativar seu checkout, você precisa apontar seu domínio com os dados abaixo via CNAME
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-muted">
          <InfoIcon className="h-4 w-4 mr-2" />
          <AlertDescription>
            Configure estes registros no painel de DNS do seu provedor de domínio. A propagação pode levar até 48 horas.
          </AlertDescription>
        </Alert>

        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TIPO</TableHead>
                <TableHead>NOME</TableHead>
                <TableHead>VALOR</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>SSL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="flex items-center">
                    <span>{dnsVerificationDetails.type}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">Configure um registro CNAME no seu provedor de DNS</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select value={selectedType} onValueChange={handleTypeChange}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkout">checkout</SelectItem>
                        <SelectItem value="secure">secure</SelectItem>
                        <SelectItem value="pay">pay</SelectItem>
                        <SelectItem value="seguro">seguro</SelectItem>
                      </SelectContent>
                    </Select>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">Este será o prefixo do seu subdomínio (ex: {selectedType}.{domain.name})</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm">{dnsVerificationDetails.value}</code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleCopyValue(dnsVerificationDetails.value)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">Este é o valor que você deve configurar no registro CNAME</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>
                  {dnsVerificationDetails.isVerified ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      <span>Ativo</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <XCircle className="w-4 h-4 mr-1" />
                      <span>Pendente</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {domain.sslStatus === 'active' ? (
                    <div className="flex items-center text-green-600">
                      <Lock className="w-4 h-4 mr-1" />
                      <span>Ativado</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span>Não configurado</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={handleVerifyDNS} disabled={verifying}>
            {verifying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Verificar configuração
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
