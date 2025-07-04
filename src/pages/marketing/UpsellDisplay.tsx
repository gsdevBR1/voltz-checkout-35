
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { ArrowRight, Clock, CreditCard, QrCode, CheckCircle, X, Badge, AlertTriangle } from 'lucide-react';

// Default template for One Click Upsells
const defaultUpsellTemplate = {
  title: '🎁 Oferta exclusiva só para agora!',
  description: 'Adicione este produto ao seu pedido com desconto especial. Sem preencher nada de novo!',
  productImage: 'https://placehold.co/1000x1000',
  productName: 'Kit de Extensão Premium',
  originalPrice: 197.0,
  discountPrice: 97.0,
  countdown: true,
  countdownMinutes: 15,
  paymentMethod: 'card',
  buttonText: 'Sim, quero adicionar!',
  declineText: 'Não, obrigado',
  redirectUrl: 'https://voltz.checkout/obrigado',
  redirectType: 'url',
  redirectUpsellId: '',
  fallbackRedirectUrl: 'https://voltz.checkout/obrigado',
  hasDownsell: false,
  downsellProductId: '',
  downsellProductName: '',
  downsellPrice: 0,
  downsellImage: '',
  downsellDescription: '',
  downsellRedirectType: 'url',
  downsellRedirectUpsellId: '',
  downsellRedirectUrl: 'https://voltz.checkout/obrigado',
  showOriginalPrice: true,
  showScarcityBadge: true,
  scarcityText: 'Restam poucas unidades!',
  layout: 'vertical',
  theme: {
    background: '#F3F4F8',
    cardBackground: '#FFFFFF',
    title: '#222222',
    text: '#555555',
    button: '#2BBA00',
    buttonText: '#FFFFFF',
    border: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    font: 'Arial, sans-serif',
  }
};

// Default template for Downsell pages
const defaultDownsellTemplate = {
  title: '⚠️ Espera um pouco… antes de ir embora!',
  description: 'Temos uma última oferta especial que pode fazer toda a diferença.',
  productImage: 'https://placehold.co/1000x1000',
  productName: 'Oferta de última chance!',
  originalPrice: 89.0,
  discountPrice: 37.0,
  countdown: true,
  countdownMinutes: 15,
  paymentMethod: 'card',
  buttonText: 'Sim, quero aproveitar essa chance!',
  declineText: 'Não, obrigado',
  redirectUrl: 'https://voltz.checkout/obrigado',
  redirectType: 'url',
  redirectUpsellId: '',
  fallbackRedirectUrl: 'https://voltz.checkout/obrigado',
  // These properties are required by the upsellData type
  hasDownsell: false,
  downsellProductId: '',
  downsellProductName: '',
  downsellPrice: 0,
  downsellImage: '',
  downsellDescription: '',
  downsellRedirectType: 'url',
  downsellRedirectUpsellId: '',
  downsellRedirectUrl: 'https://voltz.checkout/obrigado',
  showOriginalPrice: true,
  showScarcityBadge: true,
  scarcityText: 'Restam apenas 9 unidades!',
  layout: 'vertical',
  theme: {
    background: '#F3F4F8',
    cardBackground: '#FFFFFF',
    title: '#222222',
    text: '#555555',
    button: '#2BBA00',
    buttonText: '#FFFFFF',
    border: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    font: 'Arial, sans-serif',
  }
};

// Mock data for available upsells (for redirection)
const mockUpsells = [
  {
    id: 'ups_1',
    name: 'Upsell Premium: Curso Avançado',
    active: true,
    path: '/marketing/upsell/ups_1/display'
  },
  {
    id: 'ups_2',
    name: 'Upsell Básico: E-book Complementar',
    active: false,
    path: '/marketing/upsell/ups_2/display'
  },
  {
    id: 'ups_3',
    name: 'Oferta Especial: Mentoria',
    active: true,
    path: '/marketing/upsell/ups_3/display'
  },
];

// Mock downsells for demonstration
const mockDownsells = [
  {
    id: 'down_1',
    upsellId: 'ups_1',
    name: 'Downsell do Curso Avançado: E-book Básico',
    active: true,
    productName: 'E-book Introdução à Fotografia',
    price: 47.0,
    description: 'Não quer o curso completo? Este e-book contém o básico para você começar!',
    imageUrl: 'https://placehold.co/1000x1000/dc2626/ffffff?text=E-book',
    path: '/marketing/upsell/ups_1/downsell'
  },
  {
    id: 'down_2',
    upsellId: 'ups_3',
    name: 'Downsell da Mentoria: Consulta Express',
    active: true,
    productName: 'Consulta Express (15 minutos)',
    price: 29.90,
    description: 'Tire suas dúvidas principais em uma consulta rápida de 15 minutos.',
    imageUrl: 'https://placehold.co/1000x1000/8b5cf6/ffffff?text=Consulta',
    path: '/marketing/upsell/ups_3/downsell'
  }
];

// Mock data - in a real implementation, this would come from your API/database
// Merge default template with any saved user preferences
const mockUpsellData = {
  id: '1',
  ...defaultUpsellTemplate,
  hasDownsell: true,
  downsellProductId: 'down_1',
  downsellProductName: 'E-book Introdução à Fotografia',
  downsellPrice: 47.0,
  downsellImage: 'https://placehold.co/1000x1000/dc2626/ffffff?text=E-book',
  downsellDescription: 'Não quer o curso completo? Este e-book contém o básico para você começar!',
};

interface UpsellDisplayProps {
  previewMode?: boolean;
}

const UpsellDisplay: React.FC<UpsellDisplayProps> = ({ previewMode = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(mockUpsellData.countdownMinutes * 60);
  const [upsellData, setUpsellData] = useState(mockUpsellData);
  const [isDownsell, setIsDownsell] = useState(false);
  
  // In a real implementation, fetch upsell data based on ID
  useEffect(() => {
    // Skip API fetch if in preview mode
    if (previewMode) {
      setUpsellData(mockUpsellData);
      return;
    }
    
    // Simulating API fetch
    const fetchUpsellData = async () => {
      // Check if it's a downsell page
      const downsellPath = window.location.pathname.includes('/downsell');
      setIsDownsell(downsellPath);
      
      // In a real app, this would be an API call like:
      // const response = await fetch(`/api/upsells/${id}${downsellPath ? '/downsell' : ''}`);
      // const data = await response.json();
      // setUpsellData({...defaultUpsellTemplate, ...data});
      
      // For demo, we're using mock data
      if (downsellPath && id) {
        // Find the downsell for this upsell ID
        const downsell = mockDownsells.find(d => d.upsellId === id);
        if (downsell) {
          // For downsell pages, use the downsell template with specific product data
          setUpsellData({
            ...mockUpsellData, // Start with all the properties from mockUpsellData
            ...defaultDownsellTemplate, // Override with downsell template properties
            productName: downsell.productName,
            productImage: downsell.imageUrl,
            discountPrice: downsell.price,
            originalPrice: downsell.price * 1.5, // Just for demonstration
            description: downsell.description,
            id: downsell.id,
          });
        }
      } else {
        // Just using the mock data with default template for regular upsells
        setUpsellData(mockUpsellData);
      }
    };
    
    fetchUpsellData();
  }, [id, previewMode]);
  
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
  
  // Handle redirection based on settings
  const handleRedirection = (accepted: boolean) => {
    // If in preview mode, show toast instead of redirecting
    if (previewMode) {
      const actionType = accepted ? 'aceito' : 'recusado';
      toast.info(`Simulação: ${isDownsell ? 'Downsell' : 'Upsell'} ${actionType}`, {
        description: `Em um ambiente real, o cliente seria redirecionado para ${accepted ? 'o próximo destino' : isDownsell ? 'o destino final' : 'o downsell ou destino final'}.`,
      });
      return true;
    }
    
    // Different logic for downsell pages vs regular upsell pages
    if (isDownsell) {
      // Downsell redirection logic
      if (upsellData.downsellRedirectType === 'upsell' && upsellData.downsellRedirectUpsellId) {
        const nextUpsell = mockUpsells.find(u => u.id === upsellData.downsellRedirectUpsellId);
        
        if (nextUpsell && nextUpsell.active) {
          // Redirect to the next upsell
          console.log(`Redirecting to next upsell after downsell: ${nextUpsell.name}`);
          navigate(nextUpsell.path);
          return true;
        } else {
          // Use fallback URL if next upsell is inactive or not found
          console.log(`Next upsell unavailable after downsell, using fallback URL: ${upsellData.fallbackRedirectUrl}`);
          window.location.href = upsellData.fallbackRedirectUrl;
          return true;
        }
      }
      
      // Default behavior for downsell: redirect to the thank you page
      window.location.href = upsellData.downsellRedirectUrl || upsellData.fallbackRedirectUrl;
      return true;
    } else {
      // Regular upsell redirection logic
      // If declined and has downsell, redirect to downsell page
      if (!accepted && upsellData.hasDownsell) {
        // Check if there's an active downsell for this upsell
        const downsell = mockDownsells.find(d => d.upsellId === id);
        
        if (downsell && downsell.active) {
          console.log(`Customer declined upsell, redirecting to downsell: ${downsell.name}`);
          navigate(downsell.path);
          return true;
        }
        // If no downsell found or not active, continue with normal redirection
      }
      
      // Regular upsell redirection
      if (upsellData.redirectType === 'upsell' && upsellData.redirectUpsellId) {
        const nextUpsell = mockUpsells.find(u => u.id === upsellData.redirectUpsellId);
        
        if (nextUpsell && nextUpsell.active) {
          // Redirect to the next upsell
          console.log(`Redirecting to next upsell: ${nextUpsell.name}`);
          navigate(nextUpsell.path);
          return true;
        } else {
          // Use fallback URL if next upsell is inactive or not found
          console.log(`Next upsell unavailable, using fallback URL: ${upsellData.fallbackRedirectUrl}`);
          window.location.href = upsellData.fallbackRedirectUrl;
          return true;
        }
      }
    }
    
    // Default behavior: redirect to the specified URL
    return false;
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
      console.log(`${isDownsell ? 'Downsell' : 'Upsell'} accepted:`, upsellData.id);
      
      // Handle redirection
      const redirected = handleRedirection(true);
      
      // Only perform default redirect if handleRedirection didn't already redirect
      if (!redirected && !previewMode) {
        // Redirect after success
        setTimeout(() => {
          window.location.href = upsellData.redirectUrl;
        }, 1000);
      } else {
        setLoading(false);
      }
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
    console.log(`${isDownsell ? 'Downsell' : 'Upsell'} declined:`, upsellData.id);
    
    // Handle redirection
    const redirected = handleRedirection(false);
    
    // Only perform default redirect if handleRedirection didn't already redirect
    if (!redirected && !previewMode) {
      // Redirect to thank you page
      window.location.href = upsellData.redirectUrl;
    }
  };
  
  const getPaymentText = () => {
    if (upsellData.paymentMethod === 'card') {
      return "Será cobrado automaticamente no mesmo cartão da compra anterior.";
    } else if (upsellData.paymentMethod === 'pix') {
      return "Clique para gerar o PIX automaticamente com os dados do seu pedido.";
    }
    return "";
  };
  
  // Apply custom theme styles
  const pageStyles = {
    backgroundColor: upsellData.theme.background,
  };
  
  const cardStyles = {
    borderRadius: upsellData.theme.border,
    boxShadow: upsellData.theme.boxShadow,
    backgroundColor: upsellData.theme.cardBackground || '#FFFFFF',
  };
  
  const titleStyles = {
    color: upsellData.theme.title,
    fontFamily: upsellData.theme.font,
  };
  
  const textStyles = {
    color: upsellData.theme.text,
    fontFamily: upsellData.theme.font,
  };
  
  const buttonStyles = {
    backgroundColor: upsellData.theme.button,
    color: upsellData.theme.buttonText,
    borderRadius: '9999px', // Pill shape
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4" style={pageStyles}>
      <Card className="w-full max-w-4xl border-0 overflow-hidden" style={cardStyles}>
        <CardContent className="p-0">
          <div className={`flex ${upsellData.layout === 'vertical' ? 'flex-col md:flex-row' : 'flex-col'}`}>
            {/* Product Image */}
            <div className={`${upsellData.layout === 'vertical' ? 'md:w-1/2' : 'w-full'} bg-gray-50 flex items-center justify-center p-6`}>
              <div className="relative">
                <img 
                  src={upsellData.productImage} 
                  alt={upsellData.productName}
                  className="w-full max-w-md rounded-lg object-contain"
                  style={{ maxHeight: '400px' }}
                />
                
                {/* Scarcity Badge */}
                {upsellData.showScarcityBadge && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Badge className="mr-1 h-4 w-4" />
                    {upsellData.scarcityText}
                  </div>
                )}
              </div>
            </div>
            
            {/* Offer Content */}
            <div className={`${upsellData.layout === 'vertical' ? 'md:w-1/2' : 'w-full'} p-6 md:p-8 space-y-6`}>
              {/* Title with alert icon for downsell */}
              <h1 className="text-2xl md:text-3xl font-semibold" style={titleStyles}>
                {isDownsell && (
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                    {upsellData.title}
                  </span>
                )}
                {!isDownsell && upsellData.title}
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
                style={textStyles}
                dangerouslySetInnerHTML={{ __html: upsellData.description }}
              />
              
              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold" style={titleStyles}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(upsellData.discountPrice)}
                </span>
                
                {upsellData.showOriginalPrice && (
                  <span className="text-xl line-through text-gray-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(upsellData.originalPrice)}
                  </span>
                )}
              </div>
              
              {/* Payment method indicator */}
              <div className="flex items-center text-sm text-gray-600 gap-2" style={textStyles}>
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
