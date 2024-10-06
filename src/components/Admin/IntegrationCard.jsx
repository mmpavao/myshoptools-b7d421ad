import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const IntegrationCard = ({ name, category, description, pricing, icon, onIntegrate }) => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <CardDescription className="text-sm text-gray-500">{category}</CardDescription>
        </div>
        <img src={icon} alt={name} className="w-12 h-12" />
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm mb-4">{description}</p>
      <p className="text-sm font-semibold">{pricing}</p>
    </CardContent>
    <div className="p-4 mt-auto">
      <Button className="w-full" onClick={onIntegrate}>Integrate</Button>
    </div>
  </Card>
);

export default IntegrationCard;