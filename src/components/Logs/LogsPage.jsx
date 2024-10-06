import React, { useState } from 'react';
import { Button } from '../ui/button';
import { testFirebaseOperations } from '../../firebase/firebaseOperations';
import FirebaseTestLog from '../Dashboard/FirebaseTestLog';
import ImageUpload from '../Dashboard/ImageUpload';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);

  const handleTestFirebase = async () => {
    setIsTestingFirebase(true);
    setLogs([]);
    await testFirebaseOperations((log) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    });
    setIsTestingFirebase(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Logs e Testes</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Testes do Firebase</h2>
        <Button onClick={handleTestFirebase} disabled={isTestingFirebase}>
          {isTestingFirebase ? 'Executando Testes...' : 'Executar Testes do Firebase'}
        </Button>
        {logs.length > 0 && <FirebaseTestLog logs={logs} />}
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Upload de Imagens</h2>
        <ImageUpload />
      </div>
    </div>
  );
};

export default LogsPage;