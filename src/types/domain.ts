
export interface Domain {
  id: string;
  name: string;
  type: 'checkout' | 'secure' | 'pay' | 'seguro';
  status: 'active' | 'pending' | 'failed';
  createdAt: string;
  dnsVerified?: boolean;
  sslStatus?: 'active' | 'pending' | 'failed';
  lastChecked?: string;
  history?: DomainHistoryEvent[];
  inUse?: number; // Number of checkouts using this domain
}

export interface DomainVerification {
  type: 'CNAME';
  name: string;
  value: string;
  isVerified: boolean;
}

export interface DomainValidationResult {
  dnsVerified: boolean;
  sslActive: boolean;
  lastChecked: string;
}

export interface DomainHistoryEvent {
  id: string;
  type: 'added' | 'dns_verified' | 'ssl_issued' | 'name_changed' | 'validation_failed';
  timestamp: string;
  details?: string;
}
