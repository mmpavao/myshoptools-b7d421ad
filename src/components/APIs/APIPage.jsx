import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const APIPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">APIs MyShopTools</h1>
      
      <Tabs defaultValue="rest" className="w-full">
        <TabsList>
          <TabsTrigger value="rest">REST API</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rest">
          <h2 className="text-2xl font-semibold mb-4">REST API</h2>
          <p className="mb-4">Nossa API REST permite que você integre funcionalidades do MyShopTools em suas aplicações.</p>
          
          <h3 className="text-xl font-semibold mb-2">Endpoints Principais</h3>
          <ul className="list-disc list-inside mb-4">
            <li>GET /api/v1/products - Lista todos os produtos</li>
            <li>POST /api/v1/products - Cria um novo produto</li>
            <li>GET /api/v1/orders - Lista todos os pedidos</li>
            <li>PUT /api/v1/orders/{'{order_id}'} - Atualiza o status de um pedido</li>
            <li>GET /api/v1/customers - Lista todos os clientes</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Autenticação</h3>
          <p>Utilize autenticação Bearer Token para todas as requisições à API.</p>
        </TabsContent>
        
        <TabsContent value="webhooks">
          <h2 className="text-2xl font-semibold mb-4">Webhooks</h2>
          <p className="mb-4">Webhooks permitem que sua aplicação receba atualizações em tempo real sobre eventos no MyShopTools.</p>
          
          <h3 className="text-xl font-semibold mb-2">Eventos Disponíveis</h3>
          <ul className="list-disc list-inside mb-4">
            <li>order.created - Quando um novo pedido é criado</li>
            <li>order.updated - Quando o status de um pedido é atualizado</li>
            <li>product.created - Quando um novo produto é adicionado</li>
            <li>product.updated - Quando um produto é atualizado</li>
            <li>customer.created - Quando um novo cliente se registra</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Configuração</h3>
          <p>Configure os webhooks no painel de desenvolvedor, especificando a URL de callback e os eventos que deseja monitorar.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIPage;