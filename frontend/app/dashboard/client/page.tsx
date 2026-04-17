'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { Job, JobCard } from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/Button';
import { Plus, FileText } from 'lucide-react';

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await api.get('/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to load jobs', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'CLIENT') {
      fetchJobs();
    }
  }, [user]);

  if (user?.role !== 'CLIENT') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Service Requests</h1>
          <p className="text-sm text-gray-500">View the status and details of your service requests.</p>
        </div>
        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Request New Service
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                You haven't requested any service yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
                When you request a service, it will appear here. Get started by clicking the button above.
              </p>
            </div>
          ) : (
            jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
