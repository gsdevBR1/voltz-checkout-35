
interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

// Cache exchange rates for 1 hour
let exchangeRatesCache: ExchangeRates | null = null;
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

export const fetchExchangeRates = async (baseCurrency = 'BRL'): Promise<ExchangeRates> => {
  try {
    // Check if we have cached rates that aren't expired
    if (
      exchangeRatesCache && 
      exchangeRatesCache.base === baseCurrency && 
      (Date.now() - exchangeRatesCache.timestamp) < CACHE_EXPIRY
    ) {
      return exchangeRatesCache;
    }

    // In a production environment, you would use a real API with an API key
    // For example: https://api.exchangeratesapi.io/latest?base=BRL
    // For demonstration, we'll use mock data
    
    // Simulating API response latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock exchange rates (these would come from a real API)
    const mockRates: Record<string, number> = {
      BRL: 1.0,
      USD: 0.2,
      EUR: 0.18,
      GBP: 0.16,
      ARS: 181.5,
      CLP: 189.5,
      MXN: 3.5,
      CAD: 0.27,
      AUD: 0.3,
      JPY: 31.5,
    };
    
    const rates: ExchangeRates = {
      base: baseCurrency,
      rates: mockRates,
      timestamp: Date.now()
    };
    
    // Update the cache
    exchangeRatesCache = rates;
    
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // If there's an error, return a fallback with just the base currency
    return {
      base: baseCurrency,
      rates: { [baseCurrency]: 1.0 },
      timestamp: Date.now()
    };
  }
};

export const convertCurrency = async (
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): Promise<number> => {
  // If currencies are the same, no conversion needed
  if (fromCurrency === toCurrency) return amount;

  try {
    // Get exchange rates with the source currency as base
    const rates = await fetchExchangeRates(fromCurrency);
    
    // If we don't have a rate for the target currency, try fetching with the target as base
    if (!rates.rates[toCurrency]) {
      const inverseRates = await fetchExchangeRates(toCurrency);
      // Calculate the conversion rate as 1 / inverse rate
      if (inverseRates.rates[fromCurrency]) {
        return amount / inverseRates.rates[fromCurrency];
      }
      throw new Error(`No exchange rate found for ${fromCurrency} to ${toCurrency}`);
    }
    
    // Apply the conversion
    return amount * rates.rates[toCurrency];
  } catch (error) {
    console.error('Error converting currency:', error);
    // Return the original amount if conversion fails
    return amount;
  }
};

// Format currency based on locale
export const formatCurrency = (amount: number, currencyCode: string, locale = 'pt-BR'): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    // Fallback to a simple format
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};
