import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Gastos Mensais</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="vendas" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="gastos" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default SalesChart;