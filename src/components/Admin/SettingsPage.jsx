import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import SystemSettings from './SystemSettings';
import Integrations from './Integrations';
import Logs from './Logs';
import Billing from './Billing';

const SettingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Adjust as needed

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

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
          </PaginationItem>
          {/* Add pagination numbers here */}
          <PaginationItem>
            <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default SettingsPage;
