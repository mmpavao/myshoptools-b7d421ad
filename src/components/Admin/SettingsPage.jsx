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

const IntegrationCard = ({ name, category, description, pricing, icon }) => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <CardDescription className="text-sm text-gray-500">{category}</CardDescription>
        </div>
        <img src={icon} alt={name} className="w-12 h-12" />
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm mb-4">{description}</p>
      <p className="text-sm font-semibold">{pricing}</p>
    </CardContent>
    <div className="p-4 mt-auto">
      <Button className="w-full">Integrate</Button>
    </div>
  </Card>
);

const Integrations = () => {
  const integrations = [
    {
      name: "OpenAI GPT-4",
      category: "Artificial Intelligence",
      description: "Integrate advanced AI language models into your application.",
      pricing: "$0.03 per 1K tokens",
      icon: "/icons/openai.png"
    },
    {
      name: "Stripe Payments",
      category: "Finance",
      description: "Process payments securely and easily in your app.",
      pricing: "2.9% + $0.30 per transaction",
      icon: "/icons/stripe.png"
    },
    {
      name: "Twilio SMS",
      category: "Communication",
      description: "Send and receive SMS messages programmatically.",
      pricing: "$0.0075 per message",
      icon: "/icons/twilio.png"
    },
    {
      name: "Google Maps",
      category: "Geolocation",
      description: "Embed interactive maps and location services.",
      pricing: "$0.007 per request (first 100K free)",
      icon: "/icons/google-maps.png"
    },
    {
      name: "Cloudinary",
      category: "Media",
      description: "Manage and optimize images and videos in the cloud.",
      pricing: "Free tier available, then $0.05 per GB",
      icon: "/icons/cloudinary.png"
    },
    {
      name: "Mailchimp",
      category: "Marketing",
      description: "Automate email marketing campaigns.",
      pricing: "Free up to 2,000 contacts, then from $9.99/month",
      icon: "/icons/mailchimp.png"
    },
    {
      name: "Mercado Livre",
      category: "E-commerce",
      description: "Integrate with Latin America's leading e-commerce platform.",
      pricing: "Free API access, transaction fees apply",
      icon: "/icons/mercado-livre.png"
    },
    {
      name: "Shopee",
      category: "E-commerce",
      description: "Connect with one of Southeast Asia's largest online shopping platforms.",
      pricing: "Free API access, commission on sales",
      icon: "/icons/shopee.png"
    },
    {
      name: "Amazon Marketplace Web Service",
      category: "E-commerce",
      description: "Access Amazon's vast e-commerce ecosystem and services.",
      pricing: "Varies based on services used",
      icon: "/icons/amazon.png"
    },
    {
      name: "Shopify",
      category: "E-commerce",
      description: "Build and integrate with online stores powered by Shopify.",
      pricing: "From $9/month for Shopify app developers",
      icon: "/icons/shopify.png"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
