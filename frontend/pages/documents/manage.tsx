import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Alert } from '../../components/ui/alert';
import { EmptyState } from '../../components/ui/empty-state';
import { LoadingState } from '../../components/ui/loading-state';
import { useDocumentStore, Document } from '../../lib/store/zustand/useDocumentStore';
import { useAuthStore } from '../../lib/store/zustand/useAuthStore';
import { useDeleteDocument, useUpdateDocument } from '../../lib/api/services/document';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
    },
  };
};

const DocumentManagePage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const { documents, categories, removeDocument, updateDocument } = useDocumentStore();
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const deleteDocumentMutation = useDeleteDocument(user?.id || '');
  const updateDocumentMutation = useUpdateDocument(user?.id || '', '');
  
  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);
  
  const handleUploadMore = () => {
    router.push('/documents/upload');
  };
  
  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm(String(t('documents.manage.confirmDelete')))) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      removeDocument(documentId);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateStatus = async (documentId: string, status: Document['status']) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateDocument(documentId, { status });
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? t(`documents.categories.${category.id}`) : categoryId;
  };
  
  const getStatusBadgeVariant = (status: Document['status']) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'processing': return 'info';
      default: return 'warning';
    }
  };
  
  return (
    <DashboardLayout>
      <PageHeader 
        title={t('documents.manage.title')}
        description={t('documents.manage.description')}
        actions={
          <Button onClick={handleUploadMore}>
            {t('documents.manage.uploadMore')}
          </Button>
        }
      />
      
      <SectionContainer>
        <div className="mb-6 flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === 'all' ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            {t('documents.manage.allDocuments')}
          </Button>
          
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {t(`documents.categories.${category.id}`)}
              {category.required && (
                <Badge variant="destructive" className="ml-2">
                  {t('documents.required')}
                </Badge>
              )}
            </Button>
          ))}
        </div>
        
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        {isLoading ? (
          <LoadingState title={t('documents.manage.loading')} />
        ) : filteredDocuments.length === 0 ? (
          <EmptyState
            title={t('documents.manage.noDocuments')}
            description={t('documents.manage.uploadPrompt')}
            action={
              <Button onClick={handleUploadMore}>
                {t('documents.manage.uploadNow')}
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map(doc => (
              <Card key={doc.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-start mb-4 md:mb-0">
                    <div className="w-12 h-12 flex-shrink-0 mr-3 bg-gray-100 rounded flex items-center justify-center">
                      {doc.thumbnailUrl ? (
                        <img 
                          src={doc.thumbnailUrl} 
                          alt={doc.name} 
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6 text-gray-400" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-sm text-gray-500">
                        {(doc.size / 1024).toFixed(1)} KB • {getCategoryName(doc.category)}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge variant={getStatusBadgeVariant(doc.status)}>
                          {t(`documents.status.${doc.status}`)}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {doc.url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        {t('documents.manage.view')}
                      </Button>
                    )}
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      {t('documents.manage.delete')}
                    </Button>
                    
                    {doc.status === 'pending' && (
                      <>
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleUpdateStatus(doc.id, 'approved')}
                        >
                          {t('documents.manage.approve')}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleUpdateStatus(doc.id, 'rejected')}
                        >
                          {t('documents.manage.reject')}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </SectionContainer>
    </DashboardLayout>
  );
};

export default DocumentManagePage;
