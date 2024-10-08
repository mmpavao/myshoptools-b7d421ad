import React from 'react';

const QRCodeFicticio = () => {
  return (
    <div className="w-48 h-48 bg-white p-4">
      <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-1">
        {[...Array(25)].map((_, index) => (
          <div key={index} className={`bg-black ${index % 7 === 0 ? 'rounded-full' : ''}`}></div>
        ))}
      </div>
    </div>
  );
};

export default QRCodeFicticio;