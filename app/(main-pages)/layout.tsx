import React from 'react';
import Header from '@/components/common/header/header';
import BottomNav from '@/components/common/bottom-nav/bottom-nav';
import LoadUserToStore from "@/components/general/load-user-to-store/load-user-to-store";
import { redirect } from 'next/navigation';
import {Routes} from "@/enum/routes";
import {UserServerService} from "@/service/server/user.service";

const Layout = async ({children}: { children: React.ReactNode }) => {
  const user = await UserServerService.getUserRequest();

  if (!user) {
    redirect(Routes.LOGIN);
  }

  return (
    <>
      <LoadUserToStore user={user} />
      <Header/>
      <div className='flex mt-4 items-center justify-center px-2 mx-auto max-w-7xl pb-20 md:pb-4'>
        {children}
      </div>
      <BottomNav />
    </>
  );
};

export default Layout;