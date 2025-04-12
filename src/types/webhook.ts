
export type WebhookEvent = 
  | 'cart.abandoned'
  | 'order.created'
  | 'order.updated'
  | 'order.status_updated'
  | 'order.approved'
  | 'order.rejected';

export interface Webhook {
  id: string;
  name: string;
  url: string;
  token: string;
  events: WebhookEvent[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  timestamp: string;
  status: number;
  duration: number;
  event: WebhookEvent;
  payload: string;
  response?: string;
  headers?: Record<string, string>;
  retried?: boolean;
}

export interface WebhookLogFilters {
  startDate?: Date;
  endDate?: Date;
  status?: number | null;
  event?: WebhookEvent | null;
  page: number;
  perPage: number;
}
