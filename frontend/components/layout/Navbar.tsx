'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/Button';
import { LayoutDashboard, LogOut, Wrench, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const dashboardLabel = {
    ADMIN: 'Admin Dashboard',
    TECHNICIAN: 'My Schedule',
    CLIENT: 'My Requests',
  }[user.role];

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Wrench className="h-5 w-5" />
            <span className="font-bold text-lg tracking-tight">FieldOps</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href={`/dashboard/${user.role.toLowerCase()}`}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-b-2 border-blue-500 pb-0.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              {dashboardLabel}
            </Link>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                {user.role.toLowerCase()}
              </span>
            </div>

            <Button
              onClick={logout}
              variant="outline"
              className="flex items-center gap-2 cursor-pointer py-1.5 px-3 border-gray-200 dark:border-gray-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </Button>
          </div>

          {/* Hamburger */}
          <button
            className="sm:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 space-y-3">
          <Link
            href={`/dashboard/${user.role.toLowerCase()}`}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 py-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            {dashboardLabel}
          </Link>

          <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                {user.role.toLowerCase()}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};