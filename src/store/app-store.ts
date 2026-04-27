import { create } from 'zustand';

export type AppView =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'need-detail'
  | 'create-need'
  | 'chat-list'
  | 'chat'
  | 'profile'
  | 'edit-profile'
  | 'search'
  | 'professionals'
  | 'pro-profile'
  | 'register-pro'
  // New views
  | 'web-landing'
  | 'products'
  | 'product-detail'
  | 'quotes'
  | 'create-quote'
  | 'quote-detail'
  | 'my-quotes'
  | 'payments'
  | 'payment-detail'
  | 'check-in'
  | 'dispute'
  | 'trust-center';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;  // "client" | "provider"
  avatar?: string;
  bio?: string;
  location?: string;
  neighborhood?: string;
  lat?: number;
  lng?: number;
  province?: string;
  city?: string;
  workZone?: string;
  profession?: string;
  skills?: string;
  experience?: string;
  hourlyRate?: number;
  available?: boolean;
  verified: boolean;
  dniVerified: boolean;
  dniNumber?: string;
  dniPhotoUrl?: string;
  selfieDniUrl?: string;
  ratingAvg: number;
  ratingCount: number;
  completedJobs: number;
  balance?: number;
  createdAt?: string;
};

export type Need = {
  id: string;
  title: string;
  description?: string;
  category: string;
  budget?: number;
  urgent: boolean;
  status: string;
  lat?: number;
  lng?: number;
  location?: string;
  neighborhood?: string;
  distanceKm?: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    ratingAvg: number;
    ratingCount: number;
    verified: boolean;
  };
  _count?: {
    responses: number;
  };
  responses?: Response[];
};

export type Response = {
  id: string;
  message: string;
  needId: string;
  userId: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    ratingAvg: number;
    ratingCount: number;
  };
};

export type ChatThread = {
  id: string;
  needId?: string;
  participant1Id: string;
  participant2Id: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  need?: { id: string; title: string; category: string };
  otherUser: { id: string; name: string; avatar?: string };
  unreadCount?: number;
};

export type Message = {
  id: string;
  content: string;
  threadId: string;
  senderId: string;
  read: boolean;
  createdAt: string;
  sender: { id: string; name: string; avatar?: string };
};

// ====== NEW TYPES ======

export type AffiliateProduct = {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
  source: string;
  category: string;
  brand?: string;
  rating?: number;
  reviewCount: number;
  commission: number;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Quote = {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  needId?: string;
  providerId: string;
  clientId: string;
  validityHours: number;
  includesMaterials: boolean;
  estimatedHours?: number;
  providerMessage?: string;
  clientMessage?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  completedAt?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  provider: { id: string; name: string; avatar?: string; profession?: string; ratingAvg: number; ratingCount: number; dniVerified: boolean };
  client: { id: string; name: string; avatar?: string; ratingAvg: number; ratingCount: number };
  transactions?: Transaction[];
  checkIns?: CheckIn[];
  disputes?: Dispute[];
};

export type Transaction = {
  id: string;
  quoteId: string;
  amount: number;
  currency: string;
  platformFee: number;
  status: string;
  paymentMethod: string;
  paymentRef?: string;
  releasedAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CheckIn = {
  id: string;
  quoteId: string;
  userId: string;
  type: string;
  lat?: number;
  lng?: number;
  address?: string;
  photoUrl?: string;
  notes?: string;
  verified: boolean;
  createdAt: string;
  user: { id: string; name: string; avatar?: string };
};

export type Dispute = {
  id: string;
  quoteId: string;
  filedById: string;
  againstId: string;
  reason: string;
  description: string;
  status: string;
  resolution?: string;
  evidence?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  filedBy: { id: string; name: string; avatar?: string };
  against: { id: string; name: string; avatar?: string };
};

interface AppState {
  // Navigation
  currentView: AppView;
  previousView: AppView | null;
  setView: (view: AppView) => void;
  goBack: () => void;

  // User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Selected need
  selectedNeed: Need | null;
  setSelectedNeed: (need: Need | null) => void;

  // Selected user (for viewing professional profile)
  selectedUserProfile: User | null;
  setSelectedUserProfile: (user: User | null) => void;

  // Chat
  selectedThread: ChatThread | null;
  setSelectedThread: (thread: ChatThread | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Professional search
  professionSearch: string;
  setProfessionSearch: (query: string) => void;

  // Filters
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showUrgentOnly: boolean;
  setShowUrgentOnly: (urgent: boolean) => void;

  // Location filters
  selectedProvince: string;
  setSelectedProvince: (province: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedWorkZone: string;
  setSelectedWorkZone: (zone: string) => void;

  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // ====== NEW STATE ======

  // Product filters
  selectedProductSource: string;
  setSelectedProductSource: (source: string) => void;
  selectedProductCategory: string;
  setSelectedProductCategory: (category: string) => void;
  productSearchQuery: string;
  setProductSearchQuery: (query: string) => void;

  // Selected product
  selectedProduct: AffiliateProduct | null;
  setSelectedProduct: (product: AffiliateProduct | null) => void;

  // Selected quote
  selectedQuote: Quote | null;
  setSelectedQuote: (quote: Quote | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  currentView: 'splash',
  previousView: null,
  setView: (view) => set((state) => ({ currentView: view, previousView: state.currentView })),
  goBack: () => set((state) => ({
    currentView: state.previousView || 'home',
    previousView: null,
  })),

  // User
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  // Selected need
  selectedNeed: null,
  setSelectedNeed: (need) => set({ selectedNeed: need }),

  // Selected user profile
  selectedUserProfile: null,
  setSelectedUserProfile: (user) => set({ selectedUserProfile: user }),

  // Chat
  selectedThread: null,
  setSelectedThread: (thread) => set({ selectedThread: thread }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Professional search
  professionSearch: '',
  setProfessionSearch: (query) => set({ professionSearch: query }),

  // Filters
  selectedCategory: 'all',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  showUrgentOnly: false,
  setShowUrgentOnly: (urgent) => set({ showUrgentOnly: urgent }),

  // Location filters
  selectedProvince: '',
  setSelectedProvince: (province) => set({ selectedProvince: province, selectedCity: '', selectedWorkZone: '' }),
  selectedCity: '',
  setSelectedCity: (city) => set({ selectedCity: city }),
  selectedWorkZone: '',
  setSelectedWorkZone: (zone) => set({ selectedWorkZone: zone }),

  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // ====== NEW STATE ======

  // Product filters
  selectedProductSource: 'all',
  setSelectedProductSource: (source) => set({ selectedProductSource: source }),
  selectedProductCategory: 'all',
  setSelectedProductCategory: (category) => set({ selectedProductCategory: category }),
  productSearchQuery: '',
  setProductSearchQuery: (query) => set({ productSearchQuery: query }),

  // Selected product
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  // Selected quote
  selectedQuote: null,
  setSelectedQuote: (quote) => set({ selectedQuote: quote }),
}));
