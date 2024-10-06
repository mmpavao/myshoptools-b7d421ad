import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const NotificationPreferences = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>Gerencie como você recebe notificações.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Notificações por E-mail</Label>
          <Switch id="email-notifications" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications">Notificações Push</Label>
          <Switch id="push-notifications" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="sms-notifications">Notificações por SMS</Label>
          <Switch id="sms-notifications" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Salvar Preferências</Button>
      </CardFooter>
    </Card>
  );
};