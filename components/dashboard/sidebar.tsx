'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HomeIcon, UserIcon, BriefcaseIcon, UsersIcon, MessageSquareIcon, BellIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'My Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'About me', href: '/dashboard/about-me', icon: BriefcaseIcon },
  { name: 'Network', href: '/dashboard/network', icon: UsersIcon },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquareIcon },
  { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Card className="p-4 space-y-4 border-zinc-800 bg-zinc-900">
      {navigation.map((item) => (
        <Button
          key={item.name}
          variant="ghost"
          className={`w-full justify-start gap-2 ${
            pathname === item.href
              ? 'bg-zinc-800 text-zinc-100'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
          }`}
          onClick={() => router.push(item.href)}
        >
          <item.icon className="h-5 w-5" />
          {item.name}
        </Button>
      ))}
    </Card>
  );
}