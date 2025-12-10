import React from 'react';
import Header from '@/components/common/header/Header';

const Layout = ({children}: { children: React.ReactNode }) => {
  return (
    <>
      <Header/>
      <div className='flex mt-4 items-center justify-center px-2 mx-auto max-w-7xl'>
        {children}
      </div>
    </>
  );
};

export default Layout;