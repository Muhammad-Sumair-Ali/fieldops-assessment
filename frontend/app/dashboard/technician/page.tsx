'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { Job, JobCard } from '@/components/jobs/JobCard';
import { toast } from 'sonner';

export default function TechnicianDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (user?.role === 'TECHNICIAN') {
      fetchJobs();
    }
  }, [user]);

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await api.patch(`/jobs/${jobId}/status`, { status: newStatus });
      // Update local state to reflect change instantly
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
      toast.success('Job status updated securely');
    } catch (err: any) {
      console.error('Failed to change status', err);
      toast.error(err.response?.data?.message || 'Failed to update job status.');
    }
  };

  if (user?.role !== 'TECHNICIAN') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Assigned Jobs</h1>
        <p className="text-sm text-gray-500">View and update the status of operations assigned to you.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">You currently have no assigned jobs.</p>
            </div>
          ) : (
            jobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onStatusChange={handleStatusChange} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
