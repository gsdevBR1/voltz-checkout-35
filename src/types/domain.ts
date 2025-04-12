
export interface Domain {
  id: string;
  name: string;
  type: 'checkout' | 'secure' | 'pay' | 'seguro';
  status: 'active' | 'pending' | 'failed';
  createdAt: string;
  dnsVerified?: boolean;
  sslStatus?: 'active' | 'pending' | 'failed';
}

export interface DomainVerification {
  type: 'CNAME';
  name: string;
  value: string;
  isVerified: boolean;
}
