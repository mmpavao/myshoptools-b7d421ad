import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const APIKeyManager = ({ apiKey, onApiKeyChange, onTestConnection, connectionStatus, errorDetails }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>OpenAI API Key</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Enter your OpenAI API Key"
          />
          <Button onClick={onTestConnection}>Test Connection</Button>
        </div>
        <p className={`mt-2 ${
          connectionStatus === 'Connected' ? 'text-green-500' : 
          connectionStatus === 'Authentication failed' || connectionStatus === 'Access forbidden' ? 'text-red-500' :
          'text-yellow-500'
        } font-semibold`}>
          Connection status: {connectionStatus}
        </p>
        {errorDetails && (
          <p className="mt-2 text-sm text-red-500">
            {errorDetails}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default APIKeyManager;