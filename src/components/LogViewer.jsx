import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

const LogViewer = ({ isMasterUser }) => {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleLog = (event) => {
      const { detail } = event;
      setLogs((prevLogs) => [...prevLogs, { ...detail, timestamp: new Date() }]);
    };

    window.addEventListener('appLog', handleLog);

    return () => {
      window.removeEventListener('appLog', handleLog);
    };
  }, []);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (!isMasterUser) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 p-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Log Viewer</h3>
        <Button variant="ghost" size="sm" onClick={toggleExpand}>
          {isExpanded ? <ChevronDown /> : <ChevronUp />}
        </Button>
      </div>
      {isExpanded && (
        <ScrollArea className="h-48">
          {logs.map((log, index) => (
            <div key={index} className={`mb-1 p-1 rounded ${log.type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
              <span className="text-xs text-gray-500">[{log.timestamp.toLocaleTimeString()}]</span>{' '}
              <span className="font-medium">{log.message}</span>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

export default LogViewer;