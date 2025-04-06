'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { Feed } from '@/components/dashboard/feed';
import { UserProfile } from '@/components/dashboard/user-profile';

export default function Dashboard() {
  return (
    <div className="min-h-screen dark:bg-gray-900 w-full ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 py-8 max-h-screen overflow-hidden">
          <div className="col-span-3">
            <Sidebar />
          </div>
          <div className="col-span-6 h-[97vh] overflow-y-scroll scrollbar-hide">
            <Feed />
          </div>
          <div className="col-span-3">
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
}