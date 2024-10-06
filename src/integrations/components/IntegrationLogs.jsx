import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const IntegrationLogs = ({ logs }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Integration Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-60 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className={`mb-2 ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : 'text-gray-700'}`}>
              <span className="font-semibold">[{log.timestamp.toLocaleTimeString()}]</span> {log.message}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationLogs;