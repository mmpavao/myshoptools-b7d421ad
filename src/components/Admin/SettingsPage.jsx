import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemSettings from './SystemSettings';
import Integrations from './Integrations';
import Logs from './Logs';
import Billing from './Billing';

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
        
        <TabsContent value="integrations">
          <Integrations />
        </TabsContent>
        
        <TabsContent value="logs">
          <Logs />
        </TabsContent>
        
        <TabsContent value="billing">
          <Billing />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;