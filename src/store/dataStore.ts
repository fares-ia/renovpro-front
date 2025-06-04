interface Service {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
}

interface Realization {
  _id: string;
  title: string;
  description: string;
  images: string[];
  city: string;
  date: string;
}

interface Review {
  _id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Partner {
  id: string;
  name: string;
  contact: string;
  description: string;
}

interface Quote {
  id: string;
  name: string;
  email: string;
  address: string;
  workType: string;
  propertyType: string;
  budget?: string;
  startDate: string;
  description: string;
  createdAt: string;
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
}

interface FullQuote {
  id?: string;
  clientInfo: {
    type: 'particulier' | 'professionnel';
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    companyName?: string;
    siret?: string;
  };
  quoteInfo: {
    number: string;
    emissionDate: string;
    validityDate: string;
    workAddress: string;
    workCity: string;
    workPostalCode: string;
    sameAsClientAddress: boolean;
  };
  prestations: Array<{
    category: string;
    description: string;
    technicalDetails: string;
    quantity: number;
    unit: string;
    unitPriceHT: number;
    tvaRate: number;
    isFree: boolean;
  }>;
  createdAt?: string;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected';
}

// Configuration de l'URL du backend (facile à modifier pour la prod)
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Utilitaires pour récupérer le token
function getToken() {
  return localStorage.getItem('renovpro_token');
}

// Méthode générique d'appel API
async function callAPI<T>(endpoint: string, options: RequestInit = {}, auth = false): Promise<T> {
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options.headers) {
    headers = { ...headers, ...(options.headers as Record<string, string>) };
  }
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BACKEND_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) throw await res.json();
  return await res.json();
}

class DataStore {
  // Services
  async getServices(): Promise<Service[]> {
    return callAPI<Service[]>('/api/services');
  }
  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    return callAPI<Service>('/api/services', { method: 'POST', body: JSON.stringify(service) }, true);
  }
  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    return callAPI<Service>(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(service) }, true);
  }
  async deleteService(id: string): Promise<{ message: string }> {
    return callAPI<{ message: string }>(`/api/services/${id}`, { method: 'DELETE' }, true);
  }

  // Réalisations
  async getRealizations(): Promise<Realization[]> {
    return callAPI<Realization[]>('/api/realizations');
  }
  async createRealization(realization: Omit<Realization, '_id'>): Promise<Realization> {
    return callAPI<Realization>('/api/realizations', { method: 'POST', body: JSON.stringify(realization) }, true);
  }
  async updateRealization(id: string, realization: Partial<Realization>): Promise<Realization> {
    return callAPI<Realization>(`/api/realizations/${id}`, { method: 'PUT', body: JSON.stringify(realization) }, true);
  }
  async deleteRealization(id: string): Promise<{ message: string }> {
    return callAPI<{ message: string }>(`/api/realizations/${id}`, { method: 'DELETE' }, true);
  }

  // Avis
  async getReviews(): Promise<Review[]> {
    return callAPI<Review[]>('/api/reviews');
  }
  async createReview(review: Omit<Review, '_id'>): Promise<Review> {
    return callAPI<Review>('/api/reviews', { method: 'POST', body: JSON.stringify(review) }, true);
  }
  async updateReview(id: string, review: Partial<Review>): Promise<Review> {
    return callAPI<Review>(`/api/reviews/${id}`, { method: 'PUT', body: JSON.stringify(review) }, true);
  }
  async deleteReview(id: string): Promise<{ message: string }> {
    return callAPI<{ message: string }>(`/api/reviews/${id}`, { method: 'DELETE' }, true);
  }

  // Partenaires
  async getPartners(): Promise<Partner[]> {
    return callAPI<Partner[]>('/api/partners');
  }
  async createPartner(partner: Omit<Partner, 'id'>): Promise<Partner> {
    return callAPI<Partner>('/api/partners', { method: 'POST', body: JSON.stringify(partner) }, true);
  }
  async updatePartner(id: string, partner: Partial<Partner>): Promise<Partner> {
    return callAPI<Partner>(`/api/partners/${id}`, { method: 'PUT', body: JSON.stringify(partner) }, true);
  }
  async deletePartner(id: string): Promise<{ message: string }> {
    return callAPI<{ message: string }>(`/api/partners/${id}`, { method: 'DELETE' }, true);
  }

  // Devis simples
  async getQuotes(): Promise<Quote[]> {
    return callAPI<Quote[]>('/api/quotes', {}, true);
  }
  async createQuote(quote: Omit<Quote, 'id' | 'createdAt' | 'status'>): Promise<Quote> {
    return callAPI<Quote>('/api/quotes', { method: 'POST', body: JSON.stringify(quote) });
  }
  async updateQuoteStatus(id: string, status: string): Promise<Quote> {
    return callAPI<Quote>(`/api/quotes/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, true);
  }

  // Devis détaillés
  async getFullQuotes(): Promise<FullQuote[]> {
    return callAPI<FullQuote[]>('/api/full-quotes', {}, true);
  }
  async createFullQuote(fullQuote: Omit<FullQuote, 'id'>): Promise<FullQuote> {
    return callAPI<FullQuote>('/api/full-quotes', { method: 'POST', body: JSON.stringify(fullQuote) }, true);
  }
  async updateFullQuoteStatus(id: string, status: string): Promise<FullQuote> {
    return callAPI<FullQuote>(`/api/full-quotes/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, true);
  }
  async deleteFullQuote(id: string): Promise<{ message: string }> {
    return callAPI<{ message: string }>(`/api/full-quotes/${id}`, { method: 'DELETE' }, true);
  }
  async downloadFullQuotePDF(id: string): Promise<Blob> {
    const token = getToken();
    const res = await fetch(`${BACKEND_URL}/api/full-quotes/${id}/pdf`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    if (!res.ok) throw await res.json();
    return await res.blob();
  }
  async sendFullQuoteEmail(id: string, email?: string, message?: string): Promise<{ message: string, sent: boolean }> {
    return callAPI<{ message: string, sent: boolean }>(`/api/full-quotes/${id}/send-email`, {
      method: 'POST',
      body: JSON.stringify({ email, message }),
      headers: { 'Content-Type': 'application/json' },
    }, true);
  }

  // Catégories
  async getCategories(): Promise<string[]> {
    return callAPI<string[]>('/api/categories');
  }
  async createCategory(name: string): Promise<{ name: string, created: boolean }> {
    return callAPI<{ name: string, created: boolean }>('/api/categories', { method: 'POST', body: JSON.stringify({ name }) }, true);
  }

  // Dashboard
  async getDashboardStats(): Promise<any> {
    return callAPI<any>('/api/dashboard/stats', {}, true);
  }

  // Upload
  async uploadFile(file: File): Promise<{ url: string, filename: string }> {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BACKEND_URL}/api/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw await res.json();
    return await res.json();
  }
  async deleteFile(filename: string): Promise<{ message: string }> {
    return callAPI<{ message: string }>(`/api/upload/${filename}`, { method: 'DELETE' }, true);
  }
}

export const dataStore = new DataStore();
export type { Service, Realization, Review, Partner, Quote, FullQuote };
