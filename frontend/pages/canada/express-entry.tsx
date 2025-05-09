import React from 'react';
import Head from 'next/head';
import { MainLayout } from '../../components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dropdown } from '../../components/ui/dropdown';
import { Alert } from '../../components/ui/alert';

export default function ExpressEntryPage() {
  return (
    <>
      <Head>
        <title>Express Entry | ThinkForward AI</title>
        <meta name="description" content="Calculate your Express Entry points and determine your eligibility for Canadian immigration programs." />
      </Head>
      
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Express Entry</h1>
          <p className="text-dark-gray">
            Use our Express Entry tools to calculate your Comprehensive Ranking System (CRS) score,
            check your eligibility for Canadian immigration programs, and create your Express Entry profile.
          </p>
        </div>
        
        <Alert 
          variant="info" 
          title="Latest Express Entry Draw"
          className="mb-6"
        >
          The latest Express Entry draw was on May 8, 2025 with a CRS cutoff score of 491 points.
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-dark-gray mb-4">
                Determine if you&apos;re eligible for Express Entry immigration programs based on your qualifications.
              </p>
              <Button variant="primary" className="w-full">
                Check Eligibility
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Points Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-dark-gray mb-4">
                Calculate your Comprehensive Ranking System (CRS) score for Express Entry.
              </p>
              <Button variant="primary" className="w-full">
                Calculate Points
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-dark-gray mb-4">
                Create and manage your Express Entry profile with AI assistance.
              </p>
              <Button variant="primary" className="w-full">
                Create Profile
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick CRS Estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-dark-gray mb-6">
              Get a quick estimate of your CRS score by providing some basic information.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Dropdown
                label="Age"
                options={[
                  { value: "18-19", label: "18-19 years" },
                  { value: "20-29", label: "20-29 years" },
                  { value: "30-39", label: "30-39 years" },
                  { value: "40-44", label: "40-44 years" },
                  { value: "45+", label: "45+ years" }
                ]}
              />
              
              <Dropdown
                label="Education"
                options={[
                  { value: "secondary", label: "Secondary school" },
                  { value: "one-year", label: "One-year degree/diploma" },
                  { value: "two-year", label: "Two-year degree/diploma" },
                  { value: "bachelors", label: "Bachelor's degree" },
                  { value: "masters", label: "Master's degree" },
                  { value: "doctoral", label: "Doctoral degree" }
                ]}
              />
              
              <Dropdown
                label="First Language Proficiency"
                options={[
                  { value: "clb4", label: "CLB 4" },
                  { value: "clb5", label: "CLB 5" },
                  { value: "clb6", label: "CLB 6" },
                  { value: "clb7", label: "CLB 7" },
                  { value: "clb8", label: "CLB 8" },
                  { value: "clb9", label: "CLB 9" },
                  { value: "clb10+", label: "CLB 10+" }
                ]}
              />
              
              <Dropdown
                label="Canadian Work Experience"
                options={[
                  { value: "none", label: "None" },
                  { value: "1-year", label: "1 year" },
                  { value: "2-years", label: "2 years" },
                  { value: "3-years", label: "3 years" },
                  { value: "4-years", label: "4 years" },
                  { value: "5-years+", label: "5+ years" }
                ]}
              />
            </div>
            
            <div className="flex justify-end">
              <Button variant="primary">
                Calculate Estimate
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Express Entry Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Official Resources</h3>
                <ul className="list-disc list-inside text-dark-gray space-y-1">
                  <li>IRCC Express Entry Page</li>
                  <li>Eligibility Criteria</li>
                  <li>Document Checklist</li>
                  <li>Processing Times</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">ThinkForward AI Guides</h3>
                <ul className="list-disc list-inside text-dark-gray space-y-1">
                  <li>Express Entry Complete Guide</li>
                  <li>CRS Score Optimization Tips</li>
                  <li>Provincial Nominee Programs</li>
                  <li>Post-ITA Document Preparation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    </>
  );
}
