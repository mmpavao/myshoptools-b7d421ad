import { Cpu, ShoppingCart, BarChart3, Users, MessageSquare, CreditCard } from "lucide-react";

export const integrations = [
  {
    name: "OpenAI GPT-4",
    category: "Artificial Intelligence",
    description: "Integrate advanced AI language models into your application.",
    pricing: "$0.03 per 1K tokens",
    icon: Cpu
  },
  {
    name: "Mercado Livre",
    category: "E-commerce",
    description: "Integrate with Latin America's leading e-commerce platform.",
    pricing: "Free API access, commission on sales",
    icon: ShoppingCart
  },
  {
    name: "Shopee",
    category: "E-commerce",
    description: "Connect with one of Southeast Asia's largest online shopping platforms.",
    pricing: "Free API access, commission on sales",
    icon: ShoppingCart
  },
  {
    name: "Bling ERP",
    category: "ERP",
    description: "Integrate with Bling ERP for streamlined business operations.",
    pricing: "Varies based on plan",
    icon: BarChart3
  },
  {
    name: "Bitrix24",
    category: "CRM",
    description: "Integrate with Bitrix24 for comprehensive business management.",
    pricing: "Free plan available, paid plans start at $39/month",
    icon: Users
  },
  {
    name: "HubSpot",
    category: "CRM",
    description: "Connect with HubSpot's powerful CRM and marketing tools.",
    pricing: "Free plan available, paid plans vary",
    icon: MessageSquare
  },
  {
    name: "Stripe",
    category: "Payment",
    description: "Integrate Stripe for secure and flexible payment processing.",
    pricing: "Per-transaction fees apply",
    icon: CreditCard
  },
];