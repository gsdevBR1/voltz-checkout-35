
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { ArrowRight, Clock, CreditCard, QrCode, CheckCircle, X } from 'lucide-react';

// Mock data - in a real implementation, this would come from your API/database
const mockUpsellData = {
  id: '1',
  title: '🎁 Oferta exclusiva para completar seu pedido!',
  description: `
    <p>Parabéns pela sua compra! Como cliente especial, você tem acesso a esta oferta por tempo limitado.</p>
    <ul>
      <li>✅ Método de pagamento já configurado</li>
      <li>✅ Entrega junto com seu pedido principal</li>
      <li>✅ Desconto exclusivo de 30%</li>
    </ul>
    <p>Esta oferta é válida apenas agora, após sua compra!</p>
  `,
  productImage: 'https://placehold.co/1000x1000',
  productName: 'Kit de Extensão Premium',
  originalPrice: 197.0,
  discountPrice: 97.0,
  countdown: true, // Whether to show countdown timer
  countdownMinutes: 15, // How many minutes for countdown
  paymentMethod: 'card', // 'card' or 'pix'
  buttonText: 'Sim, quero adicionar!',
  declineText: 'Não, obrigado',
  redirectUrl: 'https://voltz.checkout/obrigado',
  showOriginalPrice: true,
  layout: 'vertical', // 'vertical' or 'carousel'
  theme: {
    background: '#ffffff',
    text: '#333333',
    button: '#2BBA00',
    buttonText: '#ffffff',
  }
};

const UpsellDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(mockUpsellData.countdownMinutes * 60);
  const [upsellData, setUpsellData] = useState(mockUpsellData);
  
  // In a real implementation, fetch upsell data based on ID
  useEffect(() => {
    // Simulating API fetch
    const fetchUpsellData = async () => {
      // In a real app, this would be an API call like:
      // const response = await fetch(`/api/upsells/${id}`);
      // const data = await response.json();
      // setUpsellData(data);
      
      // For demo, we're just using the mock data
      setUpsellData(mockUpsellData);
    };
    
    fetchUpsellData();
  }, [id]);
  
  // Countdown effect
  useEffect(() => {
    if (!upsellData.countdown) return;
    
    const timer = setInterval(() => {
      setCountdown(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [upsellData.countdown]);
  
  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleAccept = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call your payment processing API
      // Example: await processPayment(upsellData.id, upsellData.paymentMethod);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Produto adicionado com sucesso!", {
        description: "O item foi adicionado ao seu pedido.",
      });
      
      // Log conversion
      console.log('Upsell accepted:', upsellData.id);
      
      // Redirect after success
      setTimeout(() => {
        window.location.href = upsellData.redirectUrl;
      }, 1000);
    } catch (error) {
      toast.error("Erro ao processar pagamento", {
        description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
      });
      console.error('Payment error:', error);
      setLoading(false);
    }
  };
  
  const handleDecline = () => {
    // Log decline
    console.log('Upsell declined:', upsellData.id);
    
    // Redirect to thank you page
    window.location.href = upsellData.redirectUrl;
  };
  
  const getPaymentText = () => {
    if (upsellData.paymentMethod === 'card') {
      return "Este valor será cobrado automaticamente no mesmo cartão de crédito da sua compra anterior.";
    } else if (upsellData.paymentMethod === 'pix') {
      return "Clique para gerar o PIX automaticamente com os dados do seu pedido.";
    }
    return "";
  };
  
  // Apply custom theme styles
  const themeStyles = {
    backgroundColor: upsellData.theme.background,
    color: upsellData.theme.text,
  };
  
  const buttonStyles = {
    backgroundColor: upsellData.theme.button,
    color: upsellData.theme.buttonText,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4" style={themeStyles}>
      <Card className="w-full max-w-4xl shadow-lg overflow-hidden border-0">
        <CardContent className="p-0">
          <div className={`flex ${upsellData.layout === 'vertical' ? 'flex-col md:flex-row' : 'flex-col'}`}>
            {/* Product Image */}
            <div className={`${upsellData.layout === 'vertical' ? 'md:w-1/2' : 'w-full'} bg-gray-50 flex items-center justify-center p-6`}>
              <img 
                src={upsellData.productImage} 
                alt={upsellData.productName}
                className="w-full max-w-md rounded-lg object-contain"
                style={{ maxHeight: '400px' }}
              />
            </div>
            
            {/* Offer Content */}
            <div className={`${upsellData.layout === 'vertical' ? 'md:w-1/2' : 'w-full'} p-6 md:p-8 space-y-6`}>
              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: upsellData.theme.text }}>
                {upsellData.title}
              </h1>
              
              {/* Countdown timer if enabled */}
              {upsellData.countdown && countdown > 0 && (
                <div className="flex items-center text-amber-600 font-semibold">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>Esta oferta expira em: {formatCountdown()}</span>
                </div>
              )}
              
              {/* Description */}
              <div 
                className="prose prose-sm max-w-none"
                style={{ color: upsellData.theme.text }}
                dangerouslySetInnerHTML={{ __html: upsellData.description }}
              />
              
              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold" style={{ color: upsellData.theme.text }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(upsellData.discountPrice)}
                </span>
                
                {upsellData.showOriginalPrice && (
                  <span className="text-xl line-through text-gray-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(upsellData.originalPrice)}
                  </span>
                )}
              </div>
              
              {/* Payment method indicator */}
              <div className="flex items-center text-sm text-gray-600 gap-2">
                {upsellData.paymentMethod === 'card' ? (
                  <CreditCard className="h-4 w-4" />
                ) : (
                  <QrCode className="h-4 w-4" />
                )}
                <span>{getPaymentText()}</span>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full h-14 text-lg font-medium"
                  style={buttonStyles}
                  onClick={handleAccept}
                  disabled={loading}
                >
                  {loading ? 'Processando...' : upsellData.buttonText}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-500"
                  onClick={handleDecline}
                >
                  {upsellData.declineText}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpsellDisplay;
