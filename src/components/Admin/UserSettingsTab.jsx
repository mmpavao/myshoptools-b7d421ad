import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const UserSettingsTab = ({ userData, isMasterAdmin, onChange }) => (
  <Card>
    <CardHeader>
      <CardTitle>Configurações do Usuário</CardTitle>
      <CardDescription>Gerenciar função e status do usuário</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <span>Função do Usuário</span>
        <Select 
          onValueChange={(value) => onChange('role', value)} 
          value={userData.role || 'Vendedor'}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={userData.role || 'Selecione uma função'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Vendedor">Vendedor</SelectItem>
            <SelectItem value="Fornecedor">Fornecedor</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            {isMasterAdmin && <SelectItem value="Master">Master</SelectItem>}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <span>Status da Conta</span>
        <Switch
          checked={userData.status === 'Active'}
          onCheckedChange={(checked) => onChange('status', checked ? 'Active' : 'Inactive')}
        />
      </div>
    </CardContent>
  </Card>
);

export default UserSettingsTab;