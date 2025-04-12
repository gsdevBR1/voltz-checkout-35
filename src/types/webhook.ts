
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
}
