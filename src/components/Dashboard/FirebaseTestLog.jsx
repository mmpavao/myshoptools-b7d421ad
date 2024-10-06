import React from 'react';

const FirebaseTestLog = ({ logs }) => {
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Log de Testes do Firebase</h3>
      {logs.map((log, index) => (
        <div key={index} className={`mb-2 ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          <span className="font-medium">{log.step}:</span> {log.message}
        </div>
      ))}
    </div>
  );
};

export default FirebaseTestLog;