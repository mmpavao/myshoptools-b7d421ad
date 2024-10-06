import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const SystemSettings = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Platform Settings</CardTitle>
        <CardDescription>Configure your platform's basic information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="platformName">Platform Name</Label>
          <Input id="platformName" placeholder="MyShopTools" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo">Logo</Label>
          <Input id="logo" type="file" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="favicon">Favicon</Label>
          <Input id="favicon" type="file" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="socialBanner">Social Share Banner</Label>
          <Input id="socialBanner" type="file" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Input id="seoDescription" placeholder="Enter SEO description" />
        </div>
        <div className="space-y-2">
          <Label>Color Scheme</Label>
          {/* Add color palette selection here */}
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  </div>
);

const IntegrationCard = ({ name, icon }) => (
  <Card className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
    <CardHeader>
      <CardTitle className="text-center">{name}</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center">
      <img src={icon} alt={name} className="w-16 h-16" />
    </CardContent>
    <Button className="w-full mt-4">Connect</Button>
  </Card>
);

const Integrations = () => {
  const integrations = [
    { name: "OpenAI", icon: "/icons/openai.png" },
    { name: "TalkMaker Automation", icon: "/icons/talkmaker.png" },
    { name: "Mercado Livre", icon: "/icons/mercadolivre.png" },
    { name: "Shopee", icon: "/icons/shopee.png" },
    { name: "Amazon", icon: "/icons/amazon.png" },
    { name: "Shopify", icon: "/icons/shopify.png" },
    { name: "WooCommerce", icon: "/icons/woocommerce.png" },
    { name: "Bitrix24", icon: "/icons/bitrix24.png" },
    { name: "HubSpot", icon: "/icons/hubspot.png" },
    { name: "Mercado Pago", icon: "/icons/mercadopago.png" },
    { name: "Stripe", icon: "/icons/stripe.png" },
    { name: "PayPal", icon: "/icons/paypal.png" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {integrations.map((integration, index) => (
        <IntegrationCard key={index} {...integration} />
      ))}
    </div>
  );
};

const Logs = () => {
  // Placeholder for logs content
  return <div>Logs content goes here</div>;
};

const Billing = () => {
  // Placeholder for billing content
  return <div>Billing and pricing rules content goes here</div>;
};

const SettingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Adjust as needed

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="system" className="w-full">
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