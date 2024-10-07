import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className={`fixed right-0 top-1/2 transform -translate-y-1/2 transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-10'}`}>
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-10 top-1/2 transform -translate-y-1/2"
        onClick={toggleOpen}
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      <div className={`bg-white border-l border-gray-200 h-96 overflow-hidden transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'}`}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Logs</h3>
          <ScrollArea className="h-80">
            {logs.map((log, index) => (
              <div key={index} className={`mb-1 p-1 text-sm rounded ${log.type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
                <span className="text-xs text-gray-500">[{log.timestamp.toLocaleTimeString()}]</span>{' '}
                <span>{log.message}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;