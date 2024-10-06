import React, { useState } from 'react';
import IntegrationCard from './IntegrationCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Integrations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

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
    {
      name: "PagSeguro",
      category: "Finance",
      description: "Brazilian payment gateway for online transactions.",
      pricing: "Varies based on transaction volume",
      icon: "/icons/pagseguro.png"
    },
    {
      name: "dLocal",
      category: "Finance",
      description: "Payment platform for emerging markets.",
      pricing: "Custom pricing based on business needs",
      icon: "/icons/dlocal.png"
    },
    {
      name: "Mercado Pago",
      category: "Finance",
      description: "Payment solution for Latin American markets.",
      pricing: "Varies by country and transaction type",
      icon: "/icons/mercado-pago.png"
    },
    {
      name: "PayPal",
      category: "Finance",
      description: "Global online payment system.",
      pricing: "2.9% + $0.30 per transaction for most US transactions",
      icon: "/icons/paypal.png"
    },
    {
      name: "WooCommerce",
      category: "E-commerce",
      description: "Open-source e-commerce plugin for WordPress.",
      pricing: "Free plugin, additional costs for extensions",
      icon: "/icons/woocommerce.png"
    },
    {
      name: "TalkMaker Automation",
      category: "Automation",
      description: "Create automated workflows for your business processes.",
      pricing: "Starts at $9.99/month",
      icon: "/icons/talkmaker.png"
    },
    {
      name: "Make (Integromat)",
      category: "Automation",
      description: "Visual platform to design, build, and automate workflows.",
      pricing: "Free plan available, paid plans start at $9/month",
      icon: "/icons/make.png"
    },
    {
      name: "n8n",
      category: "Automation",
      description: "Workflow automation tool with a focus on privacy and versatility.",
      pricing: "Open-source (self-hosted) or cloud plans starting at $20/month",
      icon: "/icons/n8n.png"
    },
  ];

  const totalItems = integrations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedIntegrations = integrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Total integrations: {totalItems}</p>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6 per page</SelectItem>
            <SelectItem value="12">12 per page</SelectItem>
            <SelectItem value="24">24 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedIntegrations.map((integration, index) => (
          <IntegrationCard key={index} {...integration} />
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Integrations;