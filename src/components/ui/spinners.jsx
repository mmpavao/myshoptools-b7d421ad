import React from 'react';

export const SpinnerDefault = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
);

export const SpinnerDots = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
    <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
  </div>
);

export const SpinnerBars = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-8 bg-gray-900 animate-pulse"></div>
    <div className="w-2 h-8 bg-gray-900 animate-pulse" style={{animationDelay: '0.1s'}}></div>
    <div className="w-2 h-8 bg-gray-900 animate-pulse" style={{animationDelay: '0.2s'}}></div>
  </div>
);

export const SpinnerCircular = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-900"></div>
);

export const SpinnerPulse = () => (
  <div className="animate-pulse rounded-full h-8 w-8 bg-gray-900"></div>
);

// Novos spinners
export const SpinnerRing = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-900 border-r-gray-900"></div>
);

export const SpinnerDual = () => (
  <div className="relative">
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300"></div>
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-900 border-t-transparent absolute top-0"></div>
  </div>
);

export const SpinnerFlip = () => (
  <div className="w-8 h-8 bg-gray-900 animate-flip"></div>
);

export const SpinnerGrow = () => (
  <div className="w-8 h-8 bg-gray-900 rounded-full animate-grow"></div>
);

export const SpinnerSquare = () => (
  <div className="w-8 h-8 border-4 border-gray-900 animate-rotate"></div>
);

export const SpinnerHourglass = () => (
  <div className="w-8 h-8 border-8 border-gray-300 border-t-gray-900 border-b-gray-900 rounded-full animate-spin"></div>
);

export const SpinnerRipple = () => (
  <div className="relative w-8 h-8">
    <div className="absolute border-4 border-gray-900 rounded-full animate-ripple"></div>
    <div className="absolute border-4 border-gray-900 rounded-full animate-ripple" style={{animationDelay: '0.5s'}}></div>
  </div>
);

export const SpinnerWave = () => (
  <div className="flex space-x-1">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="w-2 h-8 bg-gray-900 animate-wave" style={{animationDelay: `${i * 0.1}s`}}></div>
    ))}
  </div>
);

export const SpinnerCube = () => (
  <div className="w-8 h-8 bg-gray-900 animate-cube"></div>
);

export const SpinnerFade = () => (
  <div className="flex space-x-1">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="w-2 h-8 bg-gray-900 animate-fade" style={{animationDelay: `${i * 0.1}s`}}></div>
    ))}
  </div>
);

export const SpinnerDots2 = () => (
  <div className="flex space-x-1">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="w-2 h-2 bg-gray-900 rounded-full animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
    ))}
  </div>
);

export const SpinnerCircle = () => (
  <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
);

export const SpinnerBounce = () => (
  <div className="flex space-x-1">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: `${i * 0.1}s`}}></div>
    ))}
  </div>
);

export const SpinnerRotatingDots = () => (
  <div className="relative w-8 h-8">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="absolute w-2 h-2 bg-gray-900 rounded-full animate-rotate-dots" style={{
        top: '50%',
        left: '50%',
        transform: `rotate(${i * 45}deg) translate(0, -150%)`,
        animationDelay: `${i * 0.1}s`
      }}></div>
    ))}
  </div>
);

export const SpinnerPulsingRing = () => (
  <div className="relative w-8 h-8">
    <div className="absolute inset-0 border-4 border-gray-300 rounded-full animate-pulse"></div>
    <div className="absolute inset-0 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export const SpinnerGradient = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-900 animate-spin"></div>
);

export const SpinnerSpiral = () => (
  <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spiral"></div>
);

export const SpinnerCross = () => (
  <div className="relative w-8 h-8">
    <div className="absolute w-8 h-2 bg-gray-900 animate-pulse"></div>
    <div className="absolute w-2 h-8 bg-gray-900 animate-pulse"></div>
  </div>
);

export const SpinnerTriangle = () => (
  <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-gray-900 animate-bounce"></div>
);

export const SpinnerHeart = () => (
  <div className="w-8 h-8 bg-gray-900 animate-heart"></div>
);

export const SpinnerAtom = () => (
  <div className="relative w-8 h-8">
    <div className="absolute w-full h-full border-4 border-gray-900 rounded-full animate-spin"></div>
    <div className="absolute w-full h-full border-4 border-gray-900 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
    <div className="absolute w-2 h-2 bg-gray-900 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
  </div>
);

export const SpinnerClock = () => (
  <div className="relative w-8 h-8 border-4 border-gray-900 rounded-full">
    <div className="absolute w-1 h-3 bg-gray-900 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-bottom animate-clock-hours"></div>
    <div className="absolute w-1 h-4 bg-gray-900 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-bottom animate-clock-minutes"></div>
  </div>
);

export const SpinnerGear = () => (
  <div className="w-8 h-8 border-4 border-gray-900 rounded-full animate-spin relative">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="absolute w-2 h-2 bg-gray-900" style={{
        top: '50%',
        left: '50%',
        transform: `rotate(${i * 45}deg) translate(0, -150%)`,
      }}></div>
    ))}
  </div>
);

export const SpinnerInfinity = () => (
  <div className="w-12 h-6 relative">
    <div className="absolute w-6 h-6 border-4 border-gray-900 rounded-full left-0 animate-infinity-left"></div>
    <div className="absolute w-6 h-6 border-4 border-gray-900 rounded-full right-0 animate-infinity-right"></div>
  </div>
);

export const SpinnerSquareDots = () => (
  <div className="grid grid-cols-3 gap-1 w-8 h-8">
    {[...Array(9)].map((_, i) => (
      <div key={i} className="w-2 h-2 bg-gray-900 rounded-full animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
    ))}
  </div>
);