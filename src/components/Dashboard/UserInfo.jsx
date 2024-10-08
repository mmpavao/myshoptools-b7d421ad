import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const UserInfo = ({ user }) => (
  <Card>
    <CardHeader>
      <CardTitle>Informações do Usuário</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
      <p className="mb-2"><strong>ID:</strong> {user?.uid}</p>
    </CardContent>
  </Card>
);

export default UserInfo;