import React from 'react';
import { SpinnerDefault } from './components/ui/spinners';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Default Spinner</h1>
      <div className="flex items-center justify-center h-20 w-20 border rounded-lg">
        <SpinnerDefault />
      </div>
    </div>
  );
}

export default App;