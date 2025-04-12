
interface GeoIPResponse {
  ip: string;
  country_code: string;
  country_name: string;
  currency: {
    code: string;
    symbol: string;
  };
  languages: {
    code: string;
    name: string;
  }[];
  // Additional fields would be available from the actual API
}

// Cache for GeoIP lookups to reduce API calls
const geoipCache = new Map<string, GeoIPResponse & { timestamp: number }>();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const detectClientCountry = async (): Promise<GeoIPResponse | null> => {
  try {
    // Check if we have a cached result from this session
    const cachedIp = sessionStorage.getItem('client_ip');
    if (cachedIp) {
      const cachedResult = geoipCache.get(cachedIp);
      // Use cache if it exists and hasn't expired
      if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_EXPIRY) {
        return cachedResult;
      }
    }

    // In a real app, you'd call a proper GeoIP API
    // Using a free service like https://ipapi.co/json/ or https://ipinfo.io/
    // For demonstration, we'll use a mock endpoint
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('Failed to fetch IP');
    
    const { ip } = await response.json();
    
    // Now get location data for this IP
    // In a real app, you would use an API key for authentication
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!geoResponse.ok) throw new Error('Failed to fetch geolocation data');
    
    const geoData = await geoResponse.json();
    
    // Format the response to match our interface
    const result: GeoIPResponse = {
      ip: geoData.ip,
      country_code: geoData.country_code,
      country_name: geoData.country_name,
      currency: {
        code: geoData.currency,
        symbol: geoData.currency_symbol || '',
      },
      languages: geoData.languages?.split(',').map((lang: string) => {
        const [code, name] = lang.split(',');
        return { code, name: name || code };
      }) || [],
    };
    
    // Cache the result
    sessionStorage.setItem('client_ip', ip);
    geoipCache.set(ip, { ...result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error('Error detecting client country:', error);
    return null;
  }
};

// Map country codes to currency and language defaults
export const getCountryDefaults = (countryCode: string): { 
  currency: string; 
  language: string; 
} => {
  const defaults: Record<string, { currency: string; language: string }> = {
    US: { currency: 'USD', language: 'en-US' },
    GB: { currency: 'GBP', language: 'en-GB' },
    CA: { currency: 'CAD', language: 'en-CA' },
    AU: { currency: 'AUD', language: 'en-AU' },
    DE: { currency: 'EUR', language: 'de-DE' },
    FR: { currency: 'EUR', language: 'fr-FR' },
    ES: { currency: 'EUR', language: 'es-ES' },
    IT: { currency: 'EUR', language: 'it-IT' },
    JP: { currency: 'JPY', language: 'ja-JP' },
    CN: { currency: 'CNY', language: 'zh-CN' },
    BR: { currency: 'BRL', language: 'pt-BR' },
    MX: { currency: 'MXN', language: 'es-MX' },
    AR: { currency: 'ARS', language: 'es-AR' },
    CL: { currency: 'CLP', language: 'es-CL' },
    // Add more countries as needed
  };
  
  return defaults[countryCode] || { currency: 'BRL', language: 'pt-BR' };
};
