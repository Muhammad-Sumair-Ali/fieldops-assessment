'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/Button';
import { LayoutDashboard, LogOut, Wrench } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Wrench className="h-6 w-6" />
                <span className="font-bold text-xl tracking-tight">FieldOps</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href={`/dashboard/${user.role.toLowerCase()}`}
                className="border-blue-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <LayoutDashboard className="w-4 h-4 mr-2"/>
                {user.role === 'ADMIN' && 'Admin Dashboard'}
                {user.role === 'TECHNICIAN' && 'My Schedule'}
                {user.role === 'CLIENT' && 'My Requests'}
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">Logged in as </span>
                <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                  {user.role.toLowerCase()}
                </span>
              </div>
              <Button onClick={logout} variant="outline" className="hidden cursor-pointer sm:inline-flex mt-0 ml-4 py-1.5 px-3 border-gray-200 dark:border-gray-600">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="text-sm">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
