
export interface RecoverySettings {
  email: {
    enabled: boolean;
    delayMinutes: number;
    subject: string;
    body: string;
    fromEmail: string;
    triggers: RecoveryTrigger[];
  };
  sms: {
    enabled: boolean;
    delayMinutes: number;
    message: string;
    provider: string;
    triggers: RecoveryTrigger[];
  };
  whatsapp: {
    enabled: boolean;
  };
}

export interface RecoveryTrigger {
  id: string;
  event: TriggerEvent;
  delay: string;
  active: boolean;
  message: string;
  subject?: string; // For email only
}

export type TriggerEvent = 
  | 'cart_abandoned' 
  | 'pix_pending' 
  | 'boleto_pending' 
  | 'payment_approved' 
  | 'order_shipped' 
  | 'order_delivered';

export type TriggerDelay = 
  | '5min' | '10min' | '15min' | '20min' | '25min' | '30min' 
  | '35min' | '40min' | '45min' | '50min' | '55min' | '60min'
  | '24h' | '48h' | '72h';

export interface RecoveryStats {
  period: string;
  email: {
    sends: number;
    opens: number;
    clicks: number;
    recovered: number;
    conversionRate: number;
  };
  sms: {
    sends: number;
    delivered: number;
    clicks: number;
    recovered: number;
    conversionRate: number;
  };
  whatsapp: {
    sends: number;
    delivered: number;
    read: number;
    clicked: number;
    recovered: number;
    conversionRate: number;
  };
}

export interface RecoveryLogEntry {
  id: string;
  channel: 'email' | 'sms' | 'whatsapp';
  timestamp: Date;
  customerEmail?: string;
  customerPhone?: string;
  messageContent: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'converted' | 'failed';
  recoveryTime?: Date;
  orderValue?: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  triggerEvent: TriggerEvent;
  subject?: string;
  content: string;
}

export const TRIGGER_EVENTS: Record<TriggerEvent, string> = {
  cart_abandoned: 'Carrinho abandonado',
  pix_pending: 'Pix em aberto',
  boleto_pending: 'Boleto em aberto',
  payment_approved: 'Pagamento aprovado',
  order_shipped: 'Pedido enviado',
  order_delivered: 'Pedido entregue'
};

export const DELAY_OPTIONS: Record<TriggerDelay, string> = {
  '5min': '5 minutos',
  '10min': '10 minutos',
  '15min': '15 minutos',
  '20min': '20 minutos',
  '25min': '25 minutos',
  '30min': '30 minutos',
  '35min': '35 minutos',
  '40min': '40 minutos',
  '45min': '45 minutos',
  '50min': '50 minutos',
  '55min': '55 minutos',
  '60min': '60 minutos',
  '24h': '24 horas',
  '48h': '48 horas',
  '72h': '72 horas'
};

export const DYNAMIC_TAGS = [
  { tag: '{nome}', description: 'Nome do cliente' },
  { tag: '{produto}', description: 'Nome do produto principal' },
  { tag: '{valor}', description: 'Valor total do pedido' },
  { tag: '{link_checkout}', description: 'Link para o checkout' },
  { tag: '{data_entrega}', description: 'Data estimada de entrega' },
  { tag: '{data_vencimento}', description: 'Data de vencimento do boleto/pix' },
  { tag: '{link_rastreamento}', description: 'Link de rastreamento do pedido' }
];

export const EMAIL_TEMPLATES: MessageTemplate[] = [
  {
    id: '1',
    name: 'Recuperação de Carrinho Abandonado',
    type: 'email',
    triggerEvent: 'cart_abandoned',
    subject: 'Esqueceu algo no carrinho?',
    content: `Olá {nome}, notamos que você deixou alguns produtos no carrinho.

Clique aqui para finalizar sua compra com segurança: {link_checkout}

Se tiver dúvidas, fale com a gente! 💬`
  },
  {
    id: '2',
    name: 'Boleto em Aberto',
    type: 'email',
    triggerEvent: 'boleto_pending',
    subject: 'Seu boleto está pronto para pagamento',
    content: `{nome}, seu boleto está pronto para pagamento.

Valor: {valor}
Vencimento: {data_vencimento}

Reabra o link aqui: {link_checkout}`
  },
  {
    id: '3',
    name: 'Pedido Enviado',
    type: 'email',
    triggerEvent: 'order_shipped',
    subject: 'Seu pedido foi enviado!',
    content: `Boa notícia, {nome}! Seu pedido foi enviado 🚚

Acompanhe aqui: {link_rastreamento}

Obrigado por confiar na nossa loja! 💚`
  }
];

export const SMS_TEMPLATES: MessageTemplate[] = [
  {
    id: '1',
    name: 'Recuperação de Carrinho Abandonado',
    type: 'sms',
    triggerEvent: 'cart_abandoned',
    content: `Olá {nome}, você deixou itens no carrinho. Volte e finalize sua compra: {link_checkout}`
  },
  {
    id: '2',
    name: 'Boleto em Aberto',
    type: 'sms',
    triggerEvent: 'boleto_pending',
    content: `{nome}, seu boleto de {valor} vence hoje. Pague aqui: {link_checkout}`
  },
  {
    id: '3',
    name: 'Pedido Enviado',
    type: 'sms',
    triggerEvent: 'order_shipped',
    content: `Seu pedido foi enviado! Acompanhe: {link_rastreamento}`
  }
];
