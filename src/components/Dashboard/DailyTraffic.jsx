import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DailyTraffic = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Tráfego Diário</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold mb-2">{data.total} Visitantes</div>
      <div className="text-sm text-green-500 mb-4">+{data.crescimento}%</div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data.porHora}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hora" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visitantes" name="Visitantes" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default DailyTraffic;