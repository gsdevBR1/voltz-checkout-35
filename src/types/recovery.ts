
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
