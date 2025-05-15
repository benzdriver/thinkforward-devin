import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { DashboardLayout } from '../../../components/layout/dashboard-layout';
import { PageHeader } from '../../../components/layout/page-header';
import { SectionContainer } from '../../../components/layout/section-container';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Alert } from '../../../components/ui/alert';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select } from '../../../components/ui/select';
import { EmptyState } from '../../../components/ui/empty-state';
import { LoadingState } from '../../../components/ui/loading-state';
import { useAuthStore } from '../../../lib/store/zustand/useAuthStore';
import { useConsultantStore, Booking } from '../../../lib/store/zustand/useConsultantStore';
import { 
  useGetConsultant, 
  useGetConsultantAvailability, 
  useCreateBooking,
  mockConsultants
} from '../../../lib/api/services/consultant';

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
      consultantId: params?.id || '',
    },
  };
};

interface ConsultantBookingPageProps {
  consultantId: string;
}

const ConsultantBookingPage: React.FC<ConsultantBookingPageProps> = ({ consultantId }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    consultants,
    setConsultants,
    addBooking,
    isLoading,
    error,
    setLoading,
    setError
  } = useConsultantStore();
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [bookingType, setBookingType] = useState<'video' | 'phone' | 'in-person'>('video');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const consultantQuery = useGetConsultant(consultantId);
  const availabilityQuery = useGetConsultantAvailability(
    consultantId, 
    new Date().toISOString().split('T')[0], 
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const createBookingMutation = useCreateBooking(user?.id || '');
  
  useEffect(() => {
    if (consultantQuery.isLoading) {
      setLoading(true);
    } else if (consultantQuery.isError) {
      setError(consultantQuery.error instanceof Error ? consultantQuery.error.message : '获取顾问详情失败');
      if (consultants.length === 0) {
        setConsultants(mockConsultants);
      }
      setLoading(false);
    } else if (consultantQuery.data) {
      if (consultants.findIndex(c => c.id === consultantId) === -1) {
        setConsultants([...consultants, consultantQuery.data]);
      }
      setLoading(false);
    } else {
      if (consultants.length === 0) {
        setConsultants(mockConsultants);
      }
      setLoading(false);
    }
  }, [consultantQuery.isLoading, consultantQuery.isError, consultantQuery.data]);
  
  const consultant = consultants.find(c => c.id === consultantId);
  
  const availableDates = consultant?.availability.map(a => a.date) || [];
  
  const availableSlots = selectedDate 
    ? consultant?.availability.find(a => a.date === selectedDate)?.slots.filter(slot => !slot.isBooked) || []
    : [];
  
  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    setSelectedSlot(null);
  };
  
  const handleSlotSelect = (start: string, end: string) => {
    setSelectedSlot({ start, end });
  };
  
  const handleSubmit = async () => {
    if (!user?.id) {
      setError('用户未登录');
      return;
    }
    
    if (!consultant) {
      setError('顾问信息不存在');
      return;
    }
    
    if (!selectedDate || !selectedSlot) {
      setError('请选择预约时间');
      return;
    }
    
    if (!topic) {
      setError('请输入咨询主题');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newBooking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.id,
        consultantId,
        date: selectedDate,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        type: bookingType,
        status: 'pending',
        topic,
        questions: questions || undefined,
        paymentStatus: 'pending',
        paymentAmount: consultant.price.hourly,
        paymentCurrency: consultant.price.currency,
      };
      
      const result = await createBookingMutation.mutateAsync(newBooking);
      
      addBooking(result);
      setBookingSuccess(true);
      
      setTimeout(() => {
        router.push('/bookings');
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : '创建预约失败');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatTimeSlot = (start: string, end: string) => {
    return `${start} - ${end}`;
  };
  
  if (bookingSuccess) {
    return (
      <DashboardLayout>
        <SectionContainer>
          <Card className="p-8 text-center">
            <div className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-success-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('consultants.booking.success')}</h2>
            <p className="text-gray-600 mb-6">{t('consultants.booking.successMessage')}</p>
            <p className="text-sm text-gray-500">{t('consultants.booking.redirecting')}</p>
          </Card>
        </SectionContainer>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <PageHeader 
        title={t('consultants.book.title')}
        description={t('consultants.book.description')}
      />
      
      <SectionContainer>
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        {isLoading ? (
          <LoadingState title={t('consultants.book.loading')} />
        ) : !consultant ? (
          <EmptyState
            title={t('consultants.book.notFound')}
            description={t('consultants.book.notFoundDescription')}
            action={
              <Button onClick={() => router.push('/consultants/match')}>
                {t('consultants.book.backToList')}
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">{t('consultants.book.selectDateTime')}</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    {t('consultants.book.date')}
                  </label>
                  <Select
                    value={selectedDate}
                    onChange={handleDateChange}
                    options={[
                      { value: '', label: t('consultants.book.selectDate') },
                      ...availableDates.map(date => ({ 
                        value: date, 
                        label: new Date(date).toLocaleDateString('zh-CN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric', 
                          weekday: 'long' 
                        }) 
                      }))
                    ]}
                  />
                </div>
                
                {selectedDate && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">{t('consultants.book.availableSlots')}</h3>
                    {availableSlots.length === 0 ? (
                      <p className="text-gray-500">{t('consultants.book.noSlots')}</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableSlots.map((slot, index) => (
                          <div
                            key={index}
                            className={`p-2 border rounded-md text-center cursor-pointer transition-colors ${
                              selectedSlot && selectedSlot.start === slot.start
                                ? 'bg-primary-50 border-primary-300 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleSlotSelect(slot.start, slot.end)}
                          >
                            {formatTimeSlot(slot.start, slot.end)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <h2 className="text-xl font-medium mb-4">{t('consultants.book.consultationType')}</h2>
                
                <div className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        bookingType === 'video'
                          ? 'bg-primary-50 border-primary-300'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBookingType('video')}
                    >
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                        <span className="font-medium">{t('consultants.book.videoCall')}</span>
                      </div>
                      <p className="text-sm text-gray-500">{t('consultants.book.videoCallDescription')}</p>
                    </div>
                    
                    <div
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        bookingType === 'phone'
                          ? 'bg-primary-50 border-primary-300'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBookingType('phone')}
                    >
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="font-medium">{t('consultants.book.phoneCall')}</span>
                      </div>
                      <p className="text-sm text-gray-500">{t('consultants.book.phoneCallDescription')}</p>
                    </div>
                    
                    <div
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        bookingType === 'in-person'
                          ? 'bg-primary-50 border-primary-300'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBookingType('in-person')}
                    >
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{t('consultants.book.inPerson')}</span>
                      </div>
                      <p className="text-sm text-gray-500">{t('consultants.book.inPersonDescription')}</p>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-medium mb-4">{t('consultants.book.consultationDetails')}</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {t('consultants.book.topic')} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('consultants.book.topicPlaceholder') as string}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    {t('consultants.book.questions')}
                  </label>
                  <Textarea
                    value={questions}
                    onChange={(e) => setQuestions(e.target.value)}
                    placeholder={t('consultants.book.questionsPlaceholder') as string}
                    rows={4}
                  />
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedDate || !selectedSlot || !topic}
                  className="w-full"
                >
                  {isSubmitting ? t('consultants.book.submitting') : t('consultants.book.submit')}
                </Button>
              </Card>
            </div>
            
            <div>
              <Card className="p-6 sticky top-6">
                <div className="flex items-start mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 mr-4">
                    {consultant.avatar ? (
                      <img 
                        src={consultant.avatar} 
                        alt={consultant.name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center bg-primary-100 text-primary-700 text-xl font-bold">
                        {consultant.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-medium">{consultant.name}</h2>
                    <p className="text-gray-600">{consultant.title}</p>
                    
                    <div className="flex items-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm">{consultant.rating} ({consultant.reviewCount})</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {consultant.specialties.map(specialty => (
                      <Badge key={specialty} variant="outline">
                        {t(`consultants.specialties.${specialty}`)}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {consultant.languages.map(language => (
                      <Badge key={language} variant="secondary">
                        {t(`consultants.languages.${language}`)}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-b py-4 my-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{t('consultants.book.hourlyRate')}</span>
                    <span className="font-medium">{consultant.price.hourly} {consultant.price.currency}</span>
                  </div>
                  
                  {selectedSlot && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('consultants.book.duration')}</span>
                      <span className="font-medium">1 {t('consultants.book.hour')}</span>
                    </div>
                  )}
                </div>
                
                {selectedDate && selectedSlot && (
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <h3 className="font-medium mb-2">{t('consultants.book.bookingSummary')}</h3>
                    
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="text-gray-600">{t('consultants.book.date')}</span>
                      <span>{new Date(selectedDate).toLocaleDateString('zh-CN')}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="text-gray-600">{t('consultants.book.time')}</span>
                      <span>{formatTimeSlot(selectedSlot.start, selectedSlot.end)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="text-gray-600">{t('consultants.book.type')}</span>
                      <span>{t(`consultants.book.${bookingType}`)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm font-medium mt-2 pt-2 border-t">
                      <span>{t('consultants.book.total')}</span>
                      <span>{consultant.price.hourly} {consultant.price.currency}</span>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  {t('consultants.book.cancellationPolicy')}
                </div>
              </Card>
            </div>
          </div>
        )}
      </SectionContainer>
    </DashboardLayout>
  );
};

export default ConsultantBookingPage;
