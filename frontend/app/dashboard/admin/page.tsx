'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { Job, JobCard } from '@/components/jobs/JobCard';
import { JobForm } from '@/components/jobs/JobForm';
import { Button } from '@/components/ui/Button';
import { PlusCircle } from 'lucide-react';
import { AdminStats } from '@/components/dashboard/AdminStats';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);

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
    if (user?.role === 'ADMIN') {
      fetchJobs();
    }
  }, [user]);

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingJob(undefined);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingJob(undefined);
  };

  if (user?.role !== 'ADMIN') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage all jobs and team assignments.</p>
        </div>
        <Button onClick={handleCreate}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Job
        </Button>
      </div>

      <AdminStats />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
            <JobForm 
              job={editingJob}
              onSuccess={() => {
                closeForm();
                fetchJobs();
              }}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No jobs found. Create one to get started.</p>
            </div>
          ) : (
            jobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
