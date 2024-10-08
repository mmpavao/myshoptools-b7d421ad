import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({ title, value, icon: Icon }) => (
  <Card>
    <CardContent className="flex flex-row items-center justify-between p-6">
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </CardContent>
  </Card>
);

export default StatCard;