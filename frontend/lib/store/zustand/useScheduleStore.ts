import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ScheduleEvent {
  id: string;
  consultantId: string;
  title: string;
  description?: string;
  startTime: string; // ISO日期时间格式
  endTime: string; // ISO日期时间格式
  type: 'appointment' | 'block' | 'break' | 'meeting' | 'other';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  clientId?: string;
  clientName?: string;
  clientAvatar?: string;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  notes?: string;
  color?: string;
  recurrence?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
    daysOfWeek?: number[]; // 0-6, 0表示周日
    dayOfMonth?: number;
    monthOfYear?: number;
    count?: number;
  };
  reminders: {
    id: string;
    time: number; // 提前多少分钟
    type: 'email' | 'notification' | 'sms';
    sent: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkingHours {
  consultantId: string;
  weekdays: {
    [key: string]: { // 'monday', 'tuesday', 等
      isWorking: boolean;
      slots: {
        start: string; // 24小时制，如 "09:00"
        end: string; // 24小时制，如 "17:00"
      }[];
    };
  };
  exceptions: {
    date: string; // YYYY-MM-DD
    isWorking: boolean;
    slots?: {
      start: string;
      end: string;
    }[];
    note?: string;
  }[];
  timezone: string;
  updatedAt: string;
}

export interface AppointmentRequest {
  id: string;
  consultantId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  proposedTimes: {
    startTime: string;
    endTime: string;
  }[];
  purpose: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'rescheduled';
  selectedTime?: {
    startTime: string;
    endTime: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleStats {
  totalAppointments: number;
  upcomingAppointments: number;
  todayAppointments: number;
  weeklyAppointments: number;
  monthlyAppointments: number;
  appointmentsByType: {
    type: string;
    count: number;
  }[];
  appointmentsByStatus: {
    status: string;
    count: number;
  }[];
  busyHours: {
    hour: number;
    count: number;
  }[];
  busyDays: {
    day: number;
    count: number;
  }[];
}

interface ScheduleState {
  events: ScheduleEvent[];
  workingHours: WorkingHours | null;
  appointmentRequests: AppointmentRequest[];
  stats: ScheduleStats | null;
  selectedDate: Date;
  selectedEvent: ScheduleEvent | null;
  viewMode: 'month' | 'week' | 'day' | 'agenda';
  isLoading: {
    events: boolean;
    workingHours: boolean;
    appointmentRequests: boolean;
    stats: boolean;
  };
  error: {
    events: string | null;
    workingHours: string | null;
    appointmentRequests: string | null;
    stats: string | null;
  };
  
  setEvents: (events: ScheduleEvent[]) => void;
  setWorkingHours: (workingHours: WorkingHours) => void;
  setAppointmentRequests: (requests: AppointmentRequest[]) => void;
  setStats: (stats: ScheduleStats) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedEvent: (event: ScheduleEvent | null) => void;
  setViewMode: (mode: 'month' | 'week' | 'day' | 'agenda') => void;
  setLoading: (key: keyof ScheduleState['isLoading'], isLoading: boolean) => void;
  setError: (key: keyof ScheduleState['error'], error: string | null) => void;
  
  addEvent: (event: ScheduleEvent) => void;
  updateEvent: (eventId: string, updates: Partial<ScheduleEvent>) => void;
  removeEvent: (eventId: string) => void;
  updateWorkingHours: (updates: Partial<WorkingHours>) => void;
  updateAppointmentRequest: (requestId: string, updates: Partial<AppointmentRequest>) => void;
  resetState: () => void;
}

const initialState = {
  events: [],
  workingHours: null,
  appointmentRequests: [],
  stats: null,
  selectedDate: new Date(),
  selectedEvent: null,
  viewMode: 'month' as const,
  isLoading: {
    events: false,
    workingHours: false,
    appointmentRequests: false,
    stats: false,
  },
  error: {
    events: null,
    workingHours: null,
    appointmentRequests: null,
    stats: null,
  },
};

export const useScheduleStore = create<ScheduleState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setEvents: (events) => set({ events }),
        
        setWorkingHours: (workingHours) => set({ workingHours }),
        
        setAppointmentRequests: (appointmentRequests) => set({ appointmentRequests }),
        
        setStats: (stats) => set({ stats }),
        
        setSelectedDate: (selectedDate) => set({ selectedDate }),
        
        setSelectedEvent: (selectedEvent) => set({ selectedEvent }),
        
        setViewMode: (viewMode) => set({ viewMode }),
        
        setLoading: (key, isLoading) => set((state) => ({
          isLoading: {
            ...state.isLoading,
            [key]: isLoading,
          },
        })),
        
        setError: (key, error) => set((state) => ({
          error: {
            ...state.error,
            [key]: error,
          },
        })),
        
        addEvent: (event) => set((state) => ({
          events: [...state.events, event],
        })),
        
        updateEvent: (eventId, updates) => set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId ? { ...event, ...updates } : event
          ),
        })),
        
        removeEvent: (eventId) => set((state) => ({
          events: state.events.filter((event) => event.id !== eventId),
        })),
        
        updateWorkingHours: (updates) => set((state) => ({
          workingHours: state.workingHours
            ? { ...state.workingHours, ...updates }
            : null,
        })),
        
        updateAppointmentRequest: (requestId, updates) => set((state) => ({
          appointmentRequests: state.appointmentRequests.map((request) =>
            request.id === requestId ? { ...request, ...updates } : request
          ),
        })),
        
        resetState: () => set(initialState),
      }),
      {
        name: 'schedule-storage',
        partialize: (state) => ({
          selectedDate: state.selectedDate,
          viewMode: state.viewMode,
        }),
      }
    )
  )
);
