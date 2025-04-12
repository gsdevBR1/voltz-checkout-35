
export interface RecoverySettings {
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
