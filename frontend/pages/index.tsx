import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import TestComponent from '../components/TestComponent';
import Navbar from '../components/layout/Navbar';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

const HomePage: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <>
      <Head>
        <title>ThinkForward AI | Immigration Assistant</title>
        <meta name="description" content="ThinkForward AI Application" />
      </Head>
      
      <Navbar />
      
      {/* Remove test component */}
      
      <div className="bg-gradient">
        <div className="container py-16">
          <div className="text-center mb-12">
            <h1>
              Transforming Immigration Consulting with AI
            </h1>
            <p>
              We're on a mission to make immigration processes more accessible, efficient, and successful for everyone.
            </p>
            <div className="mt-8 flex flex-col flex-row justify-center gap-4">
              <Link href="/dashboard">
                <button className="btn btn-primary">
                  Dashboard
                </button>
              </Link>
              <Link href="/about">
                <button className="btn btn-secondary">
                  Learn More About Our Services
                </button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-3 mb-12">
            <div className="card">
              <h3>
                Trust & Transparency
              </h3>
              <p>
                We believe in building trust through transparent processes, clear communication, and honest guidance at every step of the immigration journey.
              </p>
            </div>
            <div className="card">
              <h3>
                Innovation & Accessibility
              </h3>
              <p>
                We're committed to leveraging technology to make immigration services more accessible, affordable, and efficient for everyone.
              </p>
            </div>
            <div className="card">
              <h3>
                Human-Centered Approach
              </h3>
              <p>
                While we embrace AI, we never lose sight of the human element. Our technology enhances rather than replaces the personal touch of expert consultants.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <h2>
              Ready to Start Your Immigration Journey?
            </h2>
            <p className="mb-8">
              Schedule a consultation with one of our immigration experts and discover how ThinkForward AI can help you achieve your immigration goals.
            </p>
            <Link href="/assessment/start">
              <button className="btn btn-primary">
                Schedule a Consultation
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
