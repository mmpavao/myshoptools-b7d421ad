import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UserInfoTab = ({ userData }) => (
  <Card>
    <CardHeader>
      <CardTitle>Informações Pessoais</CardTitle>
      <CardDescription>Detalhes pessoais do usuário</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div><strong>Nome:</strong> {userData.name}</div>
        <div><strong>E-mail:</strong> {userData.email}</div>
        <div><strong>Telefone:</strong> {userData.phone || 'Não fornecido'}</div>
        <div><strong>Endereço:</strong> {userData.address || 'Não fornecido'}</div>
      </div>
    </CardContent>
  </Card>
);

export default UserInfoTab;