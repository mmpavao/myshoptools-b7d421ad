import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const SecuritySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança da Conta</CardTitle>
        <CardDescription>Gerencie a segurança da sua conta.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Senha Atual</Label>
          <Input id="current-password" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Nova Senha</Label>
          <Input id="new-password" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
          <Input id="confirm-password" type="password" />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="two-factor" />
          <Label htmlFor="two-factor">Ativar Autenticação de Dois Fatores</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Atualizar Senha</Button>
      </CardFooter>
    </Card>
  );
};