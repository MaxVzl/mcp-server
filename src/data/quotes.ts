export interface Quote {
  id: string;
  customer: string;
  amount: number;
}

// Collection privée pour éviter les modifications directes
let quotes: Quote[] = [];

// Fonctions pour manipuler la collection
export function getAllQuotes(): Quote[] {
  return [...quotes]; // Retourne une copie pour éviter les modifications directes
}

export function getQuoteById(id: string): Quote | undefined {
  return quotes.find(quote => quote.id === id);
}

export function addQuote(quote: Omit<Quote, 'id'>): Quote {
  const newQuote: Quote = {
    id: Math.random().toString(36).substr(2, 9), // Génère un ID unique
    ...quote
  };
  quotes.push(newQuote);
  return newQuote;
}

export function updateQuote(id: string, updates: Partial<Omit<Quote, 'id'>>): Quote | null {
  const index = quotes.findIndex(quote => quote.id === id);
  if (index === -1) {
    return null;
  }
  
  quotes[index] = { ...quotes[index], ...updates };
  return quotes[index];
}

export function deleteQuote(id: string): boolean {
  const index = quotes.findIndex(quote => quote.id === id);
  if (index === -1) {
    return false;
  }
  
  quotes.splice(index, 1);
  return true;
}