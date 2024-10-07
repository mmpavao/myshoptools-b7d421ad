import React, { useState } from 'react';
import SpinnerShowcase from './components/SpinnerShowcase';
import * as Spinners from './components/ui/spinners';

function App() {
  const [selectedSpinner, setSelectedSpinner] = useState('SpinnerDefault');

  const handleSpinnerSelect = (spinnerName) => {
    setSelectedSpinner(spinnerName);
  };

  const SelectedSpinner = Spinners[selectedSpinner];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Spinner Showcase</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Selected Spinner</h2>
        <div className="flex items-center justify-center h-20 w-20 border rounded-lg">
          <SelectedSpinner />
        </div>
        <p className="mt-2">Current selection: {selectedSpinner}</p>
      </div>
      <h2 className="text-xl font-semibold mb-4">Choose a Spinner</h2>
      <SpinnerShowcase onSelect={handleSpinnerSelect} />
    </div>
  );
}

export default App;