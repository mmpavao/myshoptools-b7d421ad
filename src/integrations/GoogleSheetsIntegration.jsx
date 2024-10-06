import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const GoogleSheetsIntegration = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const handleLoginSuccess = (credentialResponse) => {
    setAccessToken(credentialResponse.access_token);
  };

  const handleLoginFailure = () => {
    console.error('Google login failed');
  };

  useEffect(() => {
    if (accessToken) {
      fetchSpreadsheets();
    }
  }, [accessToken]);

  const fetchSpreadsheets = async () => {
    try {
      const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      setSpreadsheets(data.files || []);
    } catch (error) {
      console.error('Error fetching spreadsheets:', error);
    }
  };

  const handleSaveCredentials = () => {
    console.log('Credenciais salvas:', { apiKey, clientId, clientSecret });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Google Sheets Integration</DialogTitle>
        <DialogDescription>
          Connect and view your Google Sheets
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="apiKey" className="text-right">
            API Key
          </Label>
          <Input
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="clientId" className="text-right">
            Client ID
          </Label>
          <Input
            id="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="clientSecret" className="text-right">
            Client Secret
          </Label>
          <Input
            id="clientSecret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <Button onClick={handleSaveCredentials} className="mb-4">Save Credentials</Button>

      {!accessToken ? (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
          useOneTap
        />
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Spreadsheets:</h3>
          {spreadsheets.length > 0 ? (
            <ul className="list-disc pl-5">
              {spreadsheets.map((sheet) => (
                <li key={sheet.id}>{sheet.name}</li>
              ))}
            </ul>
          ) : (
            <p>No spreadsheets found.</p>
          )}
          <Button onClick={fetchSpreadsheets} className="mt-4">Refresh Spreadsheets</Button>
        </div>
      )}
    </>
  );
};

export default GoogleSheetsIntegration;