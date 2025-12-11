import React from 'react';
import Header from '@/components/common/header/Header';
import {UserService} from "@/service/user.service";
import LoadUserToStore from "@/components/general/LoadUserToStore";
import { redirect } from 'next/navigation';
import {Routes} from "@/enum/routes";


const Layout = async ({children}: { children: React.ReactNode }) => {
  const user = await UserService.getUserRequest();

  if (!user) {
    redirect(Routes.LOGIN);
  }

  return (
    <>
      <LoadUserToStore user={user} />
      <Header/>
      <div className='flex mt-4 items-center justify-center px-2 mx-auto max-w-7xl'>
        {children}
      </div>
    </>
  );
};

export default Layout;