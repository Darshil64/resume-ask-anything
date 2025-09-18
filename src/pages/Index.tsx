import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { UploadResume } from '@/components/UploadResume';
import { ViewResumes } from '@/components/ViewResumes';
import { Chatbot } from '@/components/Chatbot';

const Index = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadResume />;
      case 'view':
        return <ViewResumes />;
      case 'chat':
        return <Chatbot />;
      default:
        return <UploadResume />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pt-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
