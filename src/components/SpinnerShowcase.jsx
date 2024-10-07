import React from 'react';
import * as Spinners from './ui/spinners';

const SpinnerShowcase = ({ onSelect }) => {
  const spinnerComponents = Object.entries(Spinners);

  return (
    <div className="grid grid-cols-5 gap-4">
      {spinnerComponents.map(([name, Spinner]) => (
        <div
          key={name}
          className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(name)}
        >
          <Spinner />
          <span className="mt-2 text-sm text-gray-600">{name.replace('Spinner', '')}</span>
        </div>
      ))}
    </div>
  );
};

export default SpinnerShowcase;