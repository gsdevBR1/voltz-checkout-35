
export interface Domain {
  id: string;
  name: string;
  type: 'checkout' | 'secure' | 'pay' | 'seguro';
  status: 'active' | 'pending' | 'failed';
  createdAt: string;
  dnsVerified?: boolean;
  sslStatus?: 'active' | 'pending' | 'failed';
  lastChecked?: string;
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
