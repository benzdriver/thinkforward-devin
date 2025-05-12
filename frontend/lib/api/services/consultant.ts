import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { Consultant, MatchResult, Booking, ConsultantFilters, MatchPreferences } from '../../store/zustand/useConsultantStore';

export const useGetConsultants = (filters?: ConsultantFilters) => {
  return useQuery({
    queryKey: ['consultants', filters],
    queryFn: async () => {
      const response = await apiClient.get<Consultant[]>('/consultants', { params: filters });
      return response.data;
    },
  });
};

export const useMatchConsultants = (userId: string, preferences?: MatchPreferences) => {
  return useQuery({
    queryKey: ['consultants', 'match', userId, preferences],
    queryFn: async () => {
      const response = await apiClient.post<MatchResult[]>(`/consultants/match`, {
        userId,
        preferences,
      });
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useGetConsultant = (consultantId: string) => {
  return useQuery({
    queryKey: ['consultants', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<Consultant>(`/consultants/${consultantId}`);
      return response.data;
    },
    enabled: !!consultantId,
  });
};

export const useGetConsultantAvailability = (consultantId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['consultants', consultantId, 'availability', startDate, endDate],
    queryFn: async () => {
      const response = await apiClient.get<Consultant['availability']>(`/consultants/${consultantId}/availability`, {
        params: { startDate, endDate },
      });
      return response.data;
    },
    enabled: !!consultantId && !!startDate && !!endDate,
  });
};

export const useGetConsultantReviews = (consultantId: string) => {
  return useQuery({
    queryKey: ['consultants', consultantId, 'reviews'],
    queryFn: async () => {
      const response = await apiClient.get<Consultant['reviews']>(`/consultants/${consultantId}/reviews`);
      return response.data;
    },
    enabled: !!consultantId,
  });
};

export const useGetBookings = (userId: string) => {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: async () => {
      const response = await apiClient.get<Booking[]>(`/bookings`, {
        params: { userId },
      });
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useCreateBooking = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
      const response = await apiClient.post<Booking>(`/bookings`, {
        ...bookingData,
        userId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', userId] });
    },
  });
};

export const useGetBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ['bookings', 'detail', bookingId],
    queryFn: async () => {
      const response = await apiClient.get<Booking>(`/bookings/${bookingId}`);
      return response.data;
    },
    enabled: !!bookingId,
  });
};

export const useUpdateBooking = (bookingId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<Booking>) => {
      const response = await apiClient.put<Booking>(`/bookings/${bookingId}`, updates);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', data.userId] });
    },
  });
};

export const useCancelBooking = (bookingId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<Booking>(`/bookings/${bookingId}/cancel`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', data.userId] });
    },
  });
};

export const mockConsultants: Consultant[] = [
  {
    id: '1',
    name: '张明',
    avatar: '/images/consultants/consultant1.jpg',
    title: '资深移民顾问',
    company: '环球移民咨询',
    specialties: ['express-entry', 'skilled-worker', 'business-immigration'],
    languages: ['zh', 'en'],
    experience: 8,
    rating: 4.8,
    successRate: 92,
    price: {
      hourly: 150,
      currency: 'CAD',
    },
    availability: [
      {
        date: '2023-06-01',
        slots: [
          { start: '09:00', end: '10:00', isBooked: false },
          { start: '10:00', end: '11:00', isBooked: true },
          { start: '11:00', end: '12:00', isBooked: false },
          { start: '14:00', end: '15:00', isBooked: false },
          { start: '15:00', end: '16:00', isBooked: true },
        ],
      },
      {
        date: '2023-06-02',
        slots: [
          { start: '09:00', end: '10:00', isBooked: true },
          { start: '10:00', end: '11:00', isBooked: false },
          { start: '11:00', end: '12:00', isBooked: false },
          { start: '14:00', end: '15:00', isBooked: false },
          { start: '15:00', end: '16:00', isBooked: false },
        ],
      },
    ],
    bio: '张明是一位拥有8年经验的资深移民顾问，专注于加拿大技术移民和商业移民。他曾帮助超过200个家庭成功移民加拿大，对Express Entry系统和各省提名计划有深入了解。',
    education: [
      {
        institution: '多伦多大学',
        degree: '移民法律硕士',
        year: 2015,
      },
      {
        institution: '北京大学',
        degree: '法学学士',
        year: 2012,
      },
    ],
    certifications: ['ICCRC认证移民顾问', 'CAPIC会员'],
    reviewCount: 87,
    reviews: [
      {
        id: 'r1',
        userId: 'u123',
        userName: '李华',
        rating: 5,
        comment: '张顾问非常专业，帮我解决了很多复杂的移民问题，最终成功获得了PR。',
        date: '2023-05-15',
      },
      {
        id: 'r2',
        userId: 'u124',
        userName: '王强',
        rating: 4,
        comment: '服务很好，回复及时，建议很有价值。',
        date: '2023-05-10',
      },
    ],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '/images/consultants/consultant2.jpg',
    title: '移民律师',
    company: 'Johnson Immigration Law',
    specialties: ['family-sponsorship', 'refugee-claims', 'appeals'],
    languages: ['en', 'fr'],
    experience: 12,
    rating: 4.9,
    successRate: 95,
    price: {
      hourly: 200,
      currency: 'CAD',
    },
    availability: [
      {
        date: '2023-06-01',
        slots: [
          { start: '09:00', end: '10:00', isBooked: true },
          { start: '10:00', end: '11:00', isBooked: true },
          { start: '11:00', end: '12:00', isBooked: false },
          { start: '14:00', end: '15:00', isBooked: false },
          { start: '15:00', end: '16:00', isBooked: false },
        ],
      },
      {
        date: '2023-06-02',
        slots: [
          { start: '09:00', end: '10:00', isBooked: false },
          { start: '10:00', end: '11:00', isBooked: false },
          { start: '11:00', end: '12:00', isBooked: true },
          { start: '14:00', end: '15:00', isBooked: false },
          { start: '15:00', end: '16:00', isBooked: true },
        ],
      },
    ],
    bio: 'Sarah Johnson is a licensed immigration lawyer with over 12 years of experience in Canadian immigration law. She specializes in family sponsorship, refugee claims, and immigration appeals.',
    education: [
      {
        institution: 'McGill University',
        degree: 'Juris Doctor',
        year: 2010,
      },
      {
        institution: 'University of Toronto',
        degree: 'Bachelor of Arts in Political Science',
        year: 2007,
      },
    ],
    certifications: ['Member of the Law Society of Ontario', 'Canadian Bar Association'],
    reviewCount: 124,
    reviews: [
      {
        id: 'r3',
        userId: 'u125',
        userName: 'Michael Chen',
        rating: 5,
        comment: 'Sarah was extremely helpful in navigating the complex family sponsorship process. Highly recommended!',
        date: '2023-05-12',
      },
      {
        id: 'r4',
        userId: 'u126',
        userName: 'Priya Sharma',
        rating: 5,
        comment: 'Professional, knowledgeable, and compassionate. Sarah helped us win our appeal case.',
        date: '2023-05-05',
      },
    ],
  },
  {
    id: '3',
    name: '李伟',
    avatar: '/images/consultants/consultant3.jpg',
    title: '商业移民专家',
    company: '加华移民咨询',
    specialties: ['business-immigration', 'investor-program', 'entrepreneur-program'],
    languages: ['zh', 'en', 'fr'],
    experience: 15,
    rating: 4.7,
    successRate: 90,
    price: {
      hourly: 180,
      currency: 'CAD',
    },
    availability: [
      {
        date: '2023-06-01',
        slots: [
          { start: '09:00', end: '10:00', isBooked: false },
          { start: '10:00', end: '11:00', isBooked: false },
          { start: '11:00', end: '12:00', isBooked: true },
          { start: '14:00', end: '15:00', isBooked: true },
          { start: '15:00', end: '16:00', isBooked: false },
        ],
      },
      {
        date: '2023-06-02',
        slots: [
          { start: '09:00', end: '10:00', isBooked: false },
          { start: '10:00', end: '11:00', isBooked: true },
          { start: '11:00', end: '12:00', isBooked: false },
          { start: '14:00', end: '15:00', isBooked: true },
          { start: '15:00', end: '16:00', isBooked: false },
        ],
      },
    ],
    bio: '李伟专注于商业移民和投资移民领域，拥有15年经验。他精通加拿大各省商业移民项目，包括BC省企业家移民、安大略省企业家计划和魁北克投资移民计划等。',
    education: [
      {
        institution: '蒙特利尔大学',
        degree: '工商管理硕士',
        year: 2008,
      },
      {
        institution: '复旦大学',
        degree: '经济学学士',
        year: 2005,
      },
    ],
    certifications: ['ICCRC认证移民顾问', 'QCIC魁北克移民顾问'],
    reviewCount: 95,
    reviews: [
      {
        id: 'r5',
        userId: 'u127',
        userName: '张三',
        rating: 5,
        comment: '李顾问对商业移民政策非常了解，给了我很多实用的建议，帮助我成功申请了BC省企业家移民。',
        date: '2023-04-28',
      },
      {
        id: 'r6',
        userId: 'u128',
        userName: '赵明',
        rating: 4,
        comment: '专业知识丰富，服务态度好，就是价格稍高。',
        date: '2023-04-20',
      },
    ],
  },
];

export const mockMatchResults: MatchResult[] = [
  {
    consultantId: '1',
    score: 92,
    matchReasons: [
      {
        factor: 'specialty',
        score: 95,
        description: '该顾问专精于Express Entry，与您的移民需求高度匹配',
      },
      {
        factor: 'language',
        score: 100,
        description: '该顾问精通中文和英文，可以无障碍沟通',
      },
      {
        factor: 'experience',
        score: 85,
        description: '该顾问拥有8年经验，处理过类似您情况的案例',
      },
    ],
  },
  {
    consultantId: '3',
    score: 85,
    matchReasons: [
      {
        factor: 'specialty',
        score: 80,
        description: '该顾问专精于商业移民，与您的部分需求匹配',
      },
      {
        factor: 'language',
        score: 100,
        description: '该顾问精通中文、英文和法语，可以无障碍沟通',
      },
      {
        factor: 'experience',
        score: 90,
        description: '该顾问拥有15年经验，经验丰富',
      },
    ],
  },
  {
    consultantId: '2',
    score: 70,
    matchReasons: [
      {
        factor: 'specialty',
        score: 60,
        description: '该顾问专精于家庭团聚和难民申请，与您的需求部分匹配',
      },
      {
        factor: 'language',
        score: 70,
        description: '该顾问精通英文和法语，可能存在语言障碍',
      },
      {
        factor: 'experience',
        score: 90,
        description: '该顾问拥有12年经验，经验丰富',
      },
    ],
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    userId: 'u123',
    consultantId: '1',
    date: '2023-06-01',
    startTime: '10:00',
    endTime: '11:00',
    type: 'video',
    status: 'confirmed',
    topic: 'Express Entry申请咨询',
    questions: '我的CRS分数是450分，有什么方法可以提高分数？',
    paymentStatus: 'paid',
    paymentAmount: 150,
    paymentCurrency: 'CAD',
    meetingLink: 'https://zoom.us/j/123456789',
    createdAt: '2023-05-20T10:30:00Z',
    updatedAt: '2023-05-20T10:35:00Z',
  },
  {
    id: 'b2',
    userId: 'u123',
    consultantId: '3',
    date: '2023-06-02',
    startTime: '14:00',
    endTime: '15:00',
    type: 'phone',
    status: 'pending',
    topic: '商业移民咨询',
    questions: '我想了解BC省企业家移民的具体要求和流程。',
    paymentStatus: 'pending',
    paymentAmount: 180,
    paymentCurrency: 'CAD',
    createdAt: '2023-05-21T09:15:00Z',
    updatedAt: '2023-05-21T09:15:00Z',
  },
];
