'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/Card';
import { ClipboardList, FileEdit, Calendar, Loader, CheckCircle, XCircle } from 'lucide-react';

interface StatsData {
  totalJobs: number;
  draft: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export const AdminStats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/jobs/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-28 flex justify-center items-center">
              <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Jobs',
      value: stats.totalJobs,
      icon: <ClipboardList className="w-5 h-5 text-gray-700 dark:text-gray-300" />,
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-900 dark:text-white',
    },
    {
      label: 'Draft',
      value: stats.draft,
      icon: <FileEdit className="w-5 h-5 text-slate-500 dark:text-slate-400" />,
      bg: 'bg-slate-50 dark:bg-slate-900/40',
      text: 'text-slate-700 dark:text-slate-300',
    },
    {
      label: 'Scheduled',
      value: stats.scheduled,
      icon: <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: <Loader className={`w-5 h-5 text-amber-500 dark:text-amber-400 ${stats.inProgress > 0 ? 'animate-spin-slow' : ''}`} />,
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-300',
      pulse: stats.inProgress > 0,
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-300',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
      bg: 'bg-rose-50 dark:bg-rose-900/30',
      text: 'text-rose-700 dark:text-rose-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {statCards.map((stat, idx) => (
        <Card key={idx} className="overflow-hidden border-none shadow-sm relative group">
          {stat.pulse && (
            <div className="absolute top-0 right-0 w-3 h-3 m-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </div>
          )}
          <div className={`${stat.bg} w-full h-full p-5 transition-colors group-hover:brightness-95 dark:group-hover:brightness-110 flex flex-col justify-between`}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/60 dark:bg-black/20 rounded-lg shadow-sm">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight mb-1">{stat.value}</p>
              <p className={`text-sm font-medium ${stat.text}`}>{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
