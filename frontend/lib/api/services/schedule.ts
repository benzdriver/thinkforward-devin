import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { 
  ScheduleEvent, 
  WorkingHours, 
  AppointmentRequest, 
  ScheduleStats 
} from '../../store/zustand/useScheduleStore';

/**
 * 获取日程事件
 * @param consultantId 顾问ID
 * @param startDate 开始日期（YYYY-MM-DD）
 * @param endDate 结束日期（YYYY-MM-DD）
 */
export const useScheduleEvents = (
  consultantId: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: ['scheduleEvents', consultantId, startDate, endDate],
    queryFn: async () => {
      const response = await apiClient.get<{
        events: ScheduleEvent[];
      }>(`/api/consultant/${consultantId}/schedule/events`, {
        params: { startDate, endDate },
      });
      return response.data.events;
    },
    enabled: !!consultantId && !!startDate && !!endDate,
  });
};

/**
 * 获取工作时间
 * @param consultantId 顾问ID
 */
export const useWorkingHours = (consultantId: string) => {
  return useQuery({
    queryKey: ['workingHours', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<WorkingHours>(
        `/api/consultant/${consultantId}/schedule/working-hours`
      );
      return response.data;
    },
    enabled: !!consultantId,
  });
};

/**
 * 获取预约请求
 * @param consultantId 顾问ID
 */
export const useAppointmentRequests = (consultantId: string) => {
  return useQuery({
    queryKey: ['appointmentRequests', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<{
        requests: AppointmentRequest[];
      }>(`/api/consultant/${consultantId}/schedule/appointment-requests`);
      return response.data.requests;
    },
    enabled: !!consultantId,
  });
};

/**
 * 获取日程统计
 * @param consultantId 顾问ID
 */
export const useScheduleStats = (consultantId: string) => {
  return useQuery({
    queryKey: ['scheduleStats', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<ScheduleStats>(
        `/api/consultant/${consultantId}/schedule/stats`
      );
      return response.data;
    },
    enabled: !!consultantId,
  });
};

/**
 * 创建日程事件
 */
export const useCreateEvent = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      eventData,
    }: {
      consultantId: string;
      eventData: Omit<ScheduleEvent, 'id' | 'consultantId' | 'createdAt' | 'updatedAt'>;
    }) => {
      const response = await apiClient.post<ScheduleEvent>(
        `/api/consultant/${consultantId}/schedule/events`,
        eventData
      );
      return response.data;
    },
  });
};

/**
 * 更新日程事件
 */
export const useUpdateEvent = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      eventId,
      updates,
    }: {
      consultantId: string;
      eventId: string;
      updates: Partial<ScheduleEvent>;
    }) => {
      const response = await apiClient.patch<ScheduleEvent>(
        `/api/consultant/${consultantId}/schedule/events/${eventId}`,
        updates
      );
      return response.data;
    },
  });
};

/**
 * 删除日程事件
 */
export const useDeleteEvent = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      eventId,
    }: {
      consultantId: string;
      eventId: string;
    }) => {
      await apiClient.delete(
        `/api/consultant/${consultantId}/schedule/events/${eventId}`
      );
      return eventId;
    },
  });
};

/**
 * 更新工作时间
 */
export const useUpdateWorkingHours = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      workingHours,
    }: {
      consultantId: string;
      workingHours: Partial<WorkingHours>;
    }) => {
      const response = await apiClient.patch<WorkingHours>(
        `/api/consultant/${consultantId}/schedule/working-hours`,
        workingHours
      );
      return response.data;
    },
  });
};

/**
 * 处理预约请求
 * @param action 操作类型：接受、拒绝或重新安排
 */
export const useHandleAppointmentRequest = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      requestId,
      action,
      selectedTime,
    }: {
      consultantId: string;
      requestId: string;
      action: 'accept' | 'reject' | 'reschedule';
      selectedTime?: {
        startTime: string;
        endTime: string;
      };
    }) => {
      const response = await apiClient.post<AppointmentRequest>(
        `/api/consultant/${consultantId}/schedule/appointment-requests/${requestId}/${action}`,
        { selectedTime }
      );
      return response.data;
    },
  });
};

/**
 * 获取可用时间段
 */
export const useAvailableTimeSlots = (
  consultantId: string,
  date: string
) => {
  return useQuery({
    queryKey: ['availableTimeSlots', consultantId, date],
    queryFn: async () => {
      const response = await apiClient.get<{
        slots: {
          start: string;
          end: string;
        }[];
      }>(`/api/consultant/${consultantId}/schedule/available-slots`, {
        params: { date },
      });
      return response.data.slots;
    },
    enabled: !!consultantId && !!date,
  });
};

/**
 * 阻塞时间段
 */
export const useBlockTimeSlot = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      blockData,
    }: {
      consultantId: string;
      blockData: {
        startTime: string;
        endTime: string;
        title: string;
        description?: string;
        recurrence?: ScheduleEvent['recurrence'];
      };
    }) => {
      const response = await apiClient.post<ScheduleEvent>(
        `/api/consultant/${consultantId}/schedule/block-time`,
        blockData
      );
      return response.data;
    },
  });
};

/**
 * 获取日程事件详情
 */
export const useScheduleEventDetails = (
  consultantId: string,
  eventId: string
) => {
  return useQuery({
    queryKey: ['scheduleEventDetails', consultantId, eventId],
    queryFn: async () => {
      const response = await apiClient.get<ScheduleEvent>(
        `/api/consultant/${consultantId}/schedule/events/${eventId}`
      );
      return response.data;
    },
    enabled: !!consultantId && !!eventId,
  });
};

/**
 * 添加事件提醒
 */
export const useAddEventReminder = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      eventId,
      reminderData,
    }: {
      consultantId: string;
      eventId: string;
      reminderData: {
        time: number;
        type: 'email' | 'notification' | 'sms';
      };
    }) => {
      const response = await apiClient.post<{
        id: string;
        time: number;
        type: 'email' | 'notification' | 'sms';
        sent: boolean;
      }>(
        `/api/consultant/${consultantId}/schedule/events/${eventId}/reminders`,
        reminderData
      );
      return response.data;
    },
  });
};

/**
 * 删除事件提醒
 */
export const useDeleteEventReminder = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      eventId,
      reminderId,
    }: {
      consultantId: string;
      eventId: string;
      reminderId: string;
    }) => {
      await apiClient.delete(
        `/api/consultant/${consultantId}/schedule/events/${eventId}/reminders/${reminderId}`
      );
      return reminderId;
    },
  });
};
