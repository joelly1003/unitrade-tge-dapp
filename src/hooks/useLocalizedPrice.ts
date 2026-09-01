import { useState, useEffect } from 'react';

// Using CoinGecko's simple price API
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,eur,gbp,jpy,cny,inr,ngn';

export type SupportedCurrency = 'usd' | 'eur' | 'gbp' | 'jpy' | 'cny' | 'inr' | 'ngn';

const currencySymbols: Record<SupportedCurrency, string> = {
  usd: '$',
  eur: '€',
  gbp: '£',
  jpy: '¥',
  cny: '¥',
  inr: '₹',
  ngn: '₦',
};

export function useLocalizedPrice(ethAmount: number, targetCurrency: SupportedCurrency) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(COINGECKO_API);
        const data = await response.json();
        setRates(data.ethereum);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    // Refresh every 60 seconds
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const rate = rates[targetCurrency] || 0;
  const fiatValue = ethAmount * rate;
  
  const formattedFiat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: targetCurrency.toUpperCase(),
  }).format(fiatValue);

  return {
    fiatValue,
    formattedFiat,
    symbol: currencySymbols[targetCurrency],
    loading,
  };
}
