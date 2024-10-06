import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MeusProdutos = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Produtos</h1>
      <p>Você ainda não importou nenhum produto para sua loja.</p>
      <Button>Ir para a Vitrine</Button>
    </div>
  );
};

export default MeusProdutos;