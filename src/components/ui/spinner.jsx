import React from 'react';

const spinnerStyles = {
  default: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900",
  dots: "flex space-x-1",
  bars: "flex space-x-1",
  circle: "animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500",
  pulse: "animate-pulse bg-blue-500 rounded-full h-8 w-8"
};

const Dot = () => (
  <div className="bg-gray-900 h-2 w-2 rounded-full animate-bounce"></div>
);

const Bar = () => (
  <div className="bg-gray-900 h-8 w-1 animate-pulse"></div>
);

export const Spinner = ({ type = 'default' }) => {
  switch (type) {
    case 'dots':
      return (
        <div className={spinnerStyles.dots}>
          <Dot />
          <Dot />
          <Dot />
        </div>
      );
    case 'bars':
      return (
        <div className={spinnerStyles.bars}>
          <Bar />
          <Bar />
          <Bar />
        </div>
      );
    case 'circle':
      return <div className={spinnerStyles.circle}></div>;
    case 'pulse':
      return <div className={spinnerStyles.pulse}></div>;
    default:
      return <div className={spinnerStyles.default}></div>;
  }
};

export const SpinnerShowcase = () => (
  <div className="flex flex-col items-center space-y-8 p-8">
    <h2 className="text-2xl font-bold mb-4">Escolha um modelo de carregamento:</h2>
    {Object.keys(spinnerStyles).map((type) => (
      <div key={type} className="flex flex-col items-center">
        <p className="mb-2 font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
        <Spinner type={type} />
      </div>
    ))}
  </div>
);