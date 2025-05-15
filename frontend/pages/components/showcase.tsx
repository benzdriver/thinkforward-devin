import React from 'react';
import Head from 'next/head';

import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Checkbox } from '../../components/ui/checkbox';
import { Radio } from '../../components/ui/radio';
import { Textarea } from '../../components/ui/textarea';
import { Toggle } from '../../components/ui/toggle';
import { Avatar } from '../../components/ui/avatar';
import { Alert } from '../../components/ui/alert';

import { SectionContainer } from '../../components/layout/section-container';
import { PageHeader } from '../../components/layout/page-header';

import { EmptyState } from '../../components/ui/empty-state';
import { ErrorState } from '../../components/ui/error-state';
import { LoadingState } from '../../components/ui/loading-state';

const ComponentShowcase: React.FC = () => {
  return (
    <>
      <Head>
        <title>Component Showcase | ThinkForward AI</title>
        <meta name="description" content="A showcase of all UI components" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: 'white', padding: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Component Showcase</h1>
        <p style={{ marginBottom: '24px' }}>This page demonstrates all UI components working without CSS.</p>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Button Component</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button variant="primary" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px' }}>Primary Button</Button>
            <Button variant="secondary" style={{ backgroundColor: '#e5e7eb', color: '#374151', padding: '8px 16px', borderRadius: '4px' }}>Secondary Button</Button>
            <Button variant="outline" style={{ border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '4px' }}>Outline Button</Button>
            <Button variant="ghost" style={{ padding: '8px 16px', borderRadius: '4px' }}>Ghost Button</Button>
            <Button variant="link" style={{ padding: '8px 16px', color: '#3b82f6', textDecoration: 'underline' }}>Link Button</Button>
            <Button variant="destructive" style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '4px' }}>Destructive Button</Button>
          </div>
          
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button size="xs" style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px', backgroundColor: '#3b82f6', color: 'white' }}>Extra Small</Button>
            <Button size="sm" style={{ padding: '6px 12px', fontSize: '14px', borderRadius: '4px', backgroundColor: '#3b82f6', color: 'white' }}>Small</Button>
            <Button size="md" style={{ padding: '8px 16px', fontSize: '16px', borderRadius: '4px', backgroundColor: '#3b82f6', color: 'white' }}>Medium</Button>
            <Button size="lg" style={{ padding: '10px 20px', fontSize: '18px', borderRadius: '4px', backgroundColor: '#3b82f6', color: 'white' }}>Large</Button>
            <Button size="xl" style={{ padding: '12px 24px', fontSize: '20px', borderRadius: '4px', backgroundColor: '#3b82f6', color: 'white' }}>Extra Large</Button>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <Button fullWidth={true} style={{ width: '100%', padding: '8px 16px', borderRadius: '4px', backgroundColor: '#3b82f6', color: 'white' }}>Full Width Button</Button>
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Card Component</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Card style={{ width: '300px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
              <CardHeader style={{ marginBottom: '12px' }}>
                <CardTitle style={{ fontSize: '18px', fontWeight: 'bold' }}>Default Card</CardTitle>
              </CardHeader>
              <CardContent style={{ marginBottom: '12px' }}>
                <p>This is a default card with header, content, and footer.</p>
              </CardContent>
              <CardFooter style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px' }}>Action</Button>
              </CardFooter>
            </Card>
            
            <Card variant="feature" style={{ width: '300px', border: '1px solid #dbeafe', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
              <CardHeader style={{ marginBottom: '12px' }}>
                <CardTitle style={{ fontSize: '18px', fontWeight: 'bold' }}>Feature Card</CardTitle>
              </CardHeader>
              <CardContent style={{ marginBottom: '12px' }}>
                <p>This is a feature card with a different style.</p>
              </CardContent>
              <CardFooter style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px' }}>Action</Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Input Component</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <Input 
              label="Default Input" 
              placeholder="Enter text here" 
              style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%' }}
            />
            
            <Input 
              label="Input with Helper Text" 
              placeholder="Enter text here" 
              helperText="This is some helpful text"
              style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%' }}
            />
            
            <Input 
              label="Input with Error" 
              placeholder="Enter text here" 
              error="This field is required"
              style={{ padding: '8px 12px', border: '1px solid #ef4444', borderRadius: '4px', width: '100%' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Badge Component</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Badge style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}>Default</Badge>
            <Badge variant="primary" style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', backgroundColor: '#dbeafe', color: '#2563eb', border: '1px solid #bfdbfe' }}>Primary</Badge>
            <Badge variant="secondary" style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb' }}>Secondary</Badge>
            <Badge variant="success" style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', backgroundColor: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}>Success</Badge>
            <Badge variant="warning" style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' }}>Warning</Badge>
            <Badge variant="destructive" style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' }}>Destructive</Badge>
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Progress Component</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <div>
              <p style={{ marginBottom: '8px', fontSize: '14px' }}>25% Progress</p>
              <div style={{ height: '8px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                <Progress value={25} style={{ height: '100%', width: '25%', backgroundColor: '#3b82f6', borderRadius: '9999px' }} />
              </div>
            </div>
            <div>
              <p style={{ marginBottom: '8px', fontSize: '14px' }}>50% Progress</p>
              <div style={{ height: '8px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                <Progress value={50} style={{ height: '100%', width: '50%', backgroundColor: '#3b82f6', borderRadius: '9999px' }} />
              </div>
            </div>
            <div>
              <p style={{ marginBottom: '8px', fontSize: '14px' }}>75% Progress</p>
              <div style={{ height: '8px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                <Progress value={75} style={{ height: '100%', width: '75%', backgroundColor: '#3b82f6', borderRadius: '9999px' }} />
              </div>
            </div>
            <div>
              <p style={{ marginBottom: '8px', fontSize: '14px' }}>100% Progress</p>
              <div style={{ height: '8px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                <Progress value={100} style={{ height: '100%', width: '100%', backgroundColor: '#3b82f6', borderRadius: '9999px' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Form Components</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <div>
              <p style={{ marginBottom: '8px', fontSize: '14px' }}>Checkbox</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Checkbox id="terms" style={{ width: '16px', height: '16px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                <label htmlFor="terms" style={{ fontSize: '14px' }}>I agree to the terms and conditions</label>
              </div>
            </div>
            
            <div>
              <p style={{ marginBottom: '8px', fontSize: '14px' }}>Radio Buttons</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio id="option1" name="options" style={{ width: '16px', height: '16px', border: '1px solid #d1d5db', borderRadius: '50%' }} />
                  <label htmlFor="option1" style={{ fontSize: '14px' }}>Option 1</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio id="option2" name="options" style={{ width: '16px', height: '16px', border: '1px solid #d1d5db', borderRadius: '50%' }} />
                  <label htmlFor="option2" style={{ fontSize: '14px' }}>Option 2</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio id="option3" name="options" style={{ width: '16px', height: '16px', border: '1px solid #d1d5db', borderRadius: '50%' }} />
                  <label htmlFor="option3" style={{ fontSize: '14px' }}>Option 3</label>
                </div>
              </div>
            </div>
            
            <div>
              <p style={{ marginBottom: '8px', fontSize: '14px' }}>Textarea</p>
              <Textarea 
                placeholder="Enter your message here" 
                rows={4}
                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', minHeight: '80px' }}
              />
            </div>
            
            <div>
              <p style={{ marginBottom: '8px', fontSize: '14px' }}>Toggle</p>
              <Toggle style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '9999px', fontSize: '14px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}>Dark Mode</Toggle>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Avatar Component</h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Avatar style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
              <span>JD</span>
            </Avatar>
            <Avatar style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
              <span>AB</span>
            </Avatar>
            <Avatar style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
              <span>XY</span>
            </Avatar>
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Alert Component</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Alert style={{ padding: '12px 16px', borderRadius: '4px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '14px', color: '#374151' }}>This is a default alert</p>
            </Alert>
            <Alert variant="info" style={{ padding: '12px 16px', borderRadius: '4px', backgroundColor: '#dbeafe', border: '1px solid #bfdbfe' }}>
              <p style={{ fontSize: '14px', color: '#1e40af' }}>This is an info alert</p>
            </Alert>
            <Alert variant="success" style={{ padding: '12px 16px', borderRadius: '4px', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0' }}>
              <p style={{ fontSize: '14px', color: '#166534' }}>This is a success alert</p>
            </Alert>
            <Alert variant="warning" style={{ padding: '12px 16px', borderRadius: '4px', backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
              <p style={{ fontSize: '14px', color: '#92400e' }}>This is a warning alert</p>
            </Alert>
            <Alert variant="error" style={{ padding: '12px 16px', borderRadius: '4px', backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}>
              <p style={{ fontSize: '14px', color: '#b91c1c' }}>This is an error alert</p>
            </Alert>
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>State Components</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Card style={{ width: '300px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
              <EmptyState
                title="No items found"
                description="Try adjusting your search or filter to find what you're looking for."
                action={<Button style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px' }}>Add Item</Button>}
                variant="subtle"
                size="md"
                className="p-6"
              />
            </Card>
            
            <Card style={{ width: '300px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
              <ErrorState
                title="Something went wrong"
                description="We couldn't load the data. Please try again later."
                retryAction={<Button style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px' }}>Retry</Button>}
                variant="subtle"
                size="md"
                className="p-6"
              />
            </Card>
            
            <Card style={{ width: '300px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
              <LoadingState
                title="Loading data"
                description="Please wait while we fetch your information."
                variant="subtle"
                size="md"
                className="p-6"
                showSpinner={true}
              />
            </Card>
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Layout Examples</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Section Container</h3>
              <SectionContainer 
                style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white' }}
                title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Section Title</span>}
                description={<span style={{ fontSize: '14px', color: '#6b7280' }}>This is a section container with a title and description.</span>}
              >
                <p style={{ fontSize: '14px', color: '#374151' }}>This is content inside a section container.</p>
              </SectionContainer>
            </div>
            
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Page Header</h3>
              <PageHeader
                style={{ marginBottom: '16px' }}
                title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>Example Page</span>}
                description={<span style={{ fontSize: '14px', color: '#6b7280' }}>This is an example page header</span>}
                actions={<Button style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px' }}>Action</Button>}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComponentShowcase;
