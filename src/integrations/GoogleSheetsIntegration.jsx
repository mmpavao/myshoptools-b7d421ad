import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const GoogleSheetsIntegration = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [spreadsheets, setSpreadsheets] = useState([]);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Sheets Integration</CardTitle>
        <CardDescription>Connect and view your Google Sheets</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsIntegration;