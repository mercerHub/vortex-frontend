'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { Feed } from '@/components/dashboard/feed';
import { UserProfile } from '@/components/dashboard/user-profile';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 py-8">
          <div className="col-span-3">
            <Sidebar />
          </div>
          <div className="col-span-6">
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