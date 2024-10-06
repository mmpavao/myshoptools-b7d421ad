import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const APIKeyManager = ({ apiKey, onApiKeyChange, onTestConnection, connectionStatus }) => {
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
        {connectionStatus === 'Access forbidden' && (
          <p className="mt-2 text-sm text-red-500">
            Your OpenAI account may not have access to the Assistants API. 
            Please check your account settings and ensure you have the necessary permissions.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default APIKeyManager;