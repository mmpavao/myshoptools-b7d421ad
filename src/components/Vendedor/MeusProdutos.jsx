import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const MeusProdutos = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Produtos</h1>
      <p>Você ainda não importou nenhum produto para sua loja.</p>
      <Link to="/vitrine">
        <Button>Ir para a Vitrine</Button>
      </Link>
    </div>
  );
};

export default MeusProdutos;