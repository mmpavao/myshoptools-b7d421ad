import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemSettings from './SystemSettings';
import Integrations from './Integrations';
import Billing from './Billing';
import ChatSettings from './ChatSettings';
import LandPageSettings from './LandPageSettings';

const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'system';

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'system' });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs value={defaultTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="chat">Chat de Suporte</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="landpage">LandPage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
        
        <TabsContent value="chat">
          <ChatSettings />
        </TabsContent>
        
        <TabsContent value="integrations">
          <Integrations />
        </TabsContent>
        
        <TabsContent value="billing">
          <Billing />
        </TabsContent>

        <TabsContent value="landpage">
          <LandPageSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;