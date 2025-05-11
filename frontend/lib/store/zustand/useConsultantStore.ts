import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ConsultantFilters {
  specialties?: string[];
  languages?: string[];
  minRating?: number;
  minExperience?: number;
  maxPrice?: number;
  availability?: string; // ISO date string
}

export interface MatchPreferences {
  urgency?: 'low' | 'medium' | 'high';
  pricePreference?: 'economy' | 'standard' | 'premium';
  communicationPreference?: 'video' | 'phone' | 'in-person';
  specialtyFocus?: string[];
}

export interface Consultant {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company?: string;
  specialties: string[];
  languages: string[];
  experience: number; // 年数
  rating: number; // 1-5星
  successRate: number; // 百分比
  price: {
    hourly: number;
    currency: string;
  };
  availability: {
    date: string;
    slots: {
      start: string;
      end: string;
      isBooked: boolean;
    }[];
  }[];
  bio: string;
  education: {
    institution: string;
    degree: string;
    year: number;
  }[];
  certifications: string[];
  reviewCount: number;
  reviews: {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface MatchResult {
  consultantId: string;
  score: number; // 匹配分数，0-100
  matchReasons: {
    factor: string;
    score: number;
    description: string;
  }[];
}

export interface Booking {
  id: string;
  userId: string;
  consultantId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  topic: string;
  questions?: string;
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentAmount: number;
  paymentCurrency: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

interface ConsultantState {
  consultants: Consultant[];
  matchResults: MatchResult[];
  selectedConsultantId: string | null;
  filters: ConsultantFilters;
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  
  setConsultants: (consultants: Consultant[]) => void;
  setMatchResults: (results: MatchResult[]) => void;
  selectConsultant: (consultantId: string | null) => void;
  setFilters: (filters: ConsultantFilters) => void;
  setBookings: (bookings: Booking[]) => void;
  setCurrentBooking: (booking: Booking | null) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  cancelBooking: (bookingId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

const initialState = {
  consultants: [],
  matchResults: [],
  selectedConsultantId: null,
  filters: {},
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
};

export const useConsultantStore = create<ConsultantState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setConsultants: (consultants) => set({ consultants }),
        
        setMatchResults: (results) => set({ matchResults: results }),
        
        selectConsultant: (consultantId) => set({ selectedConsultantId: consultantId }),
        
        setFilters: (filters) => set({ filters }),
        
        setBookings: (bookings) => set({ bookings }),
        
        setCurrentBooking: (booking) => set({ currentBooking: booking }),
        
        addBooking: (booking) => set((state) => ({ 
          bookings: [...state.bookings, booking] 
        })),
        
        updateBooking: (bookingId, updates) => set((state) => ({
          bookings: state.bookings.map((booking) => 
            booking.id === bookingId ? { ...booking, ...updates } : booking
          ),
          currentBooking: state.currentBooking?.id === bookingId 
            ? { ...state.currentBooking, ...updates } 
            : state.currentBooking
        })),
        
        cancelBooking: (bookingId) => set((state) => ({
          bookings: state.bookings.map((booking) => 
            booking.id === bookingId 
              ? { ...booking, status: 'cancelled', updatedAt: new Date().toISOString() } 
              : booking
          ),
          currentBooking: state.currentBooking?.id === bookingId 
            ? { ...state.currentBooking, status: 'cancelled', updatedAt: new Date().toISOString() } 
            : state.currentBooking
        })),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        resetState: () => set(initialState),
      }),
      {
        name: 'consultant-storage',
        partialize: (state) => ({
          consultants: state.consultants,
          selectedConsultantId: state.selectedConsultantId,
          filters: state.filters,
          bookings: state.bookings,
        }),
      }
    )
  )
);
