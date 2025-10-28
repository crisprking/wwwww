import React from 'react';
import { BrainCircuit } from './icons';

export const Header = () => {
  return (
    <header className='flex items-center gap-2.5'>
      <BrainCircuit className='size-6 text-blue-500' />
      <h1 className='text-xl font-semibold tracking-tight'>
        Elite Science Responder
      </h1>
    </header>
  );
};

export default Header;