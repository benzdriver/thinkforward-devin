import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { MainLayout } from '../components/layout/main-layout';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

const ContactPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitError(t('contact.errorMessage') || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <Head>
        <title>{t('contact.title') || 'Contact Us'} | ThinkForward AI</title>
        <meta name="description" content={t('contact.metaDescription') || 'Contact ThinkForward AI for immigration assistance and consultation.'} />
      </Head>
      
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('contact.heroTitle') || 'Contact Us'}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">{t('contact.heroSubtitle') || 'We\'re here to help with your immigration journey. Reach out to us with any questions.'}</p>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-primary-900">{t('contact.getInTouch') || 'Get in Touch'}</h2>
                <p className="text-neutral-700 mb-8">{t('contact.getInTouchDescription') || 'Have questions about immigration? Our team is ready to assist you with personalized guidance.'}</p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-900 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-primary-900 mb-1">{t('contact.phoneTitle') || 'Phone'}</h3>
                      <p className="text-neutral-700">{t('contact.phoneNumber') || '+1 (123) 456-7890'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-900 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-primary-900 mb-1">{t('contact.emailTitle') || 'Email'}</h3>
                      <p className="text-neutral-700">{t('contact.emailAddress') || 'info@thinkforward.ai'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-900 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-primary-900 mb-1">{t('contact.addressTitle') || 'Address'}</h3>
                      <p className="text-neutral-700">{t('contact.address') || '123 Immigration Street, Suite 456, Toronto, ON M5V 2K7, Canada'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-primary-900">{t('contact.sendMessage') || 'Send a Message'}</h2>
                
                {submitSuccess ? (
                  <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
                    <p className="font-medium">{t('contact.successTitle') || 'Message Sent!'}</p>
                    <p>{t('contact.successMessage') || 'Thank you for contacting us. We will get back to you shortly.'}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError && (
                      <div className="bg-red-50 text-red-700 p-4 rounded-md">
                        <p className="font-medium">{t('contact.errorTitle') || 'Error'}</p>
                        <p>{submitError}</p>
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                        {t('contact.name') || 'Name'}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        {t('contact.email') || 'Email'}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                        {t('contact.subject') || 'Subject'}
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">{t('contact.selectSubject') || 'Select a subject'}</option>
                        <option value="general">{t('contact.subjectGeneral') || 'General Inquiry'}</option>
                        <option value="support">{t('contact.subjectSupport') || 'Support'}</option>
                        <option value="billing">{t('contact.subjectBilling') || 'Billing'}</option>
                        <option value="partnership">{t('contact.subjectPartnership') || 'Partnership'}</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                        {t('contact.message') || 'Message'}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (t('contact.sending') || 'Sending...') : (t('contact.send') || 'Send Message')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-primary-900 text-center">{t('contact.findUs') || 'Find Us'}</h2>
          <div className="h-96 bg-neutral-200 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-neutral-500">
              {t('contact.mapPlaceholder') || 'Map will be displayed here'}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;
