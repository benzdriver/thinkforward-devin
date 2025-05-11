import React, { useState, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Card } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { FileUpload } from '../../components/form/file-upload';
import { Alert } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { LoadingState } from '../../components/ui/loading-state';
import { EmptyState } from '../../components/ui/empty-state';
import { useDocumentStore, DocumentCategory } from '../../lib/store/zustand/useDocumentStore';
import { useUploadDocument } from '../../lib/api/services/document';
import { useAuthStore } from '../../lib/store/zustand/useAuthStore';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
    },
  };
};

const DocumentUploadPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const { categories, documents, addDocument } = useDocumentStore();
  const [activeTab, setActiveTab] = useState(categories[0]?.id || 'identity');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const uploadMutation = useUploadDocument(user?.id || '');
  
  const handleUpload = useCallback(async (files: File | File[] | null) => {
    if (!files) return;
    
    const fileArray = Array.isArray(files) ? files : [files];
    if (fileArray.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const activeCategory = categories.find(cat => cat.id === activeTab);
      
      if (!activeCategory) {
        throw new Error(String(t('documents.errors.categoryNotFound')));
      }
      
      const existingDocs = documents.filter(doc => doc.category === activeCategory.id);
      if (activeCategory.maxFiles && existingDocs.length + fileArray.length > activeCategory.maxFiles) {
        throw new Error(String(t('documents.errors.tooManyFiles', { max: activeCategory.maxFiles })));
      }
      
      if (activeCategory.acceptedFileTypes) {
        const invalidFiles = fileArray.filter((file: File) => {
          const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
          return !activeCategory.acceptedFileTypes?.includes(extension);
        });
        
        if (invalidFiles.length > 0) {
          throw new Error(String(t('documents.errors.invalidFileType', { 
            types: activeCategory.acceptedFileTypes.join(', ') 
          })));
        }
      }
      
      for (const file of fileArray) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        addDocument({
          name: file.name,
          type: file.type,
          size: file.size,
          category: activeCategory.id,
          url: URL.createObjectURL(file),
          thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        });
      }
      
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsUploading(false);
    }
  }, [activeTab, categories, documents, addDocument, t, uploadMutation]);
  
  const handleManageDocuments = () => {
    router.push('/documents/manage');
  };
  
  const activeCategory = categories.find(cat => cat.id === activeTab);
  const categoryDocuments = documents.filter(doc => doc.category === activeTab);
  
  return (
    <DashboardLayout>
      <PageHeader 
        title={t('documents.upload.title')}
        description={t('documents.upload.description')}
        actions={
          <Button onClick={handleManageDocuments}>
            {t('documents.upload.manageDocuments')}
          </Button>
        }
      />
      
      <SectionContainer>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 flex flex-wrap">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="mr-2 mb-2">
                {t(`documents.categories.${category.id}`)}
                {category.required && (
                  <Badge variant="destructive" className="ml-2">
                    {t('documents.required')}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    {t(`documents.categories.${category.id}`)}
                  </h3>
                  <p className="text-gray-600">
                    {category.description || t(`documents.categoryDescriptions.${category.id}`)}
                  </p>
                  {category.acceptedFileTypes && (
                    <p className="text-sm text-gray-500 mt-1">
                      {t('documents.acceptedTypes')}: {category.acceptedFileTypes.join(', ')}
                    </p>
                  )}
                  {category.maxFiles && (
                    <p className="text-sm text-gray-500">
                      {t('documents.maxFiles')}: {category.maxFiles}
                    </p>
                  )}
                </div>
                
                {uploadError && (
                  <Alert variant="error" className="mb-4">
                    {uploadError}
                  </Alert>
                )}
                
                <FileUpload
                  onChange={handleUpload}
                  disabled={isUploading}
                  accept={category.acceptedFileTypes?.join(',')}
                  maxFiles={category.maxFiles}
                  className="mb-6"
                  label={t('documents.upload.selectFiles')}
                  description={t('documents.upload.dragAndDrop')}
                />
                
                <div className="mt-8">
                  <h4 className="text-md font-medium mb-4">
                    {t('documents.uploadedFiles')}
                  </h4>
                  
                  {isUploading ? (
                    <LoadingState title={t('documents.uploading')} />
                  ) : categoryDocuments.length === 0 ? (
                    <EmptyState
                      title={t('documents.noDocuments')}
                      description={t('documents.uploadPrompt')}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryDocuments.map((doc) => (
                        <Card key={doc.id} className="p-4 flex items-start">
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
                          <div className="flex-grow min-w-0">
                            <p className="font-medium text-sm truncate" title={doc.name}>
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(doc.size / 1024).toFixed(1)} KB
                            </p>
                            <Badge className="mt-1" variant={
                              doc.status === 'approved' ? 'success' : 
                              doc.status === 'rejected' ? 'destructive' : 
                              'warning'
                            }>
                              {t(`documents.status.${doc.status}`)}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </SectionContainer>
    </DashboardLayout>
  );
};

export default DocumentUploadPage;
