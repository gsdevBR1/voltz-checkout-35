
export interface CurrencySettings {
  detectCountryViaIp: boolean;
  convertCurrencyAutomatically: boolean;
  translateLanguageAutomatically: boolean;
  showConversionNotice: boolean;
  fixedCurrency: string;
  fixedLanguage: string;
  supportsMultipleCurrencies?: boolean;
  updatedAt?: string;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
}

export interface SupportedCurrency {
  code: string;
  name: string;
  symbol: string;
  decimalDigits: number;
  countries: string[];
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export interface CountryInfo {
  countryCode: string;
  countryName: string;
  currency: string;
  languages: string[];
  continent: string;
}
