import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from '../Auth/AuthProvider';
import firebaseOperations from '../../firebase/firebaseOperations';

const StripeIntegration = () => {
  const [publishableKey, setPublishableKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isTestMode, setIsTestMode] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStripeKeys();
  }, [user]);

  const fetchStripeKeys = async () => {
    try {
      const keys = await firebaseOperations.getStripeKeys(user.uid);
      if (keys) {
        setPublishableKey(keys.publishableKey || '');
        setSecretKey(keys.secretKey || '');
        setIsTestMode(keys.isTestMode !== false);
      }
    } catch (error) {
      console.error('Error fetching Stripe keys:', error);
      toast.error('Failed to load Stripe configuration');
    }
  };

  const handleSave = async () => {
    try {
      await firebaseOperations.saveStripeKeys(user.uid, {
        publishableKey,
        secretKey,
        isTestMode
      });
      toast.success('Stripe configuration saved successfully');
    } catch (error) {
      console.error('Error saving Stripe keys:', error);
      toast.error('Failed to save Stripe configuration');
    }
  };

  const testConnection = async () => {
    try {
      const result = await firebaseOperations.testStripeConnection(user.uid);
      if (result.success) {
        toast.success('Stripe connection test successful');
      } else {
        toast.error(`Stripe connection test failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error testing Stripe connection:', error);
      toast.error('Failed to test Stripe connection');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stripe Integration</CardTitle>
        <CardDescription>Configure your Stripe API keys for payment processing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="publishableKey">Publishable Key</Label>
          <Input
            id="publishableKey"
            value={publishableKey}
            onChange={(e) => setPublishableKey(e.target.value)}
            placeholder="pk_test_..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secretKey">Secret Key</Label>
          <Input
            id="secretKey"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="sk_test_..."
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="testMode"
            checked={isTestMode}
            onChange={(e) => setIsTestMode(e.target.checked)}
          />
          <Label htmlFor="testMode">Test Mode</Label>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSave}>Save Configuration</Button>
          <Button variant="outline" onClick={testConnection}>Test Connection</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeIntegration;