/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface Job {
  id: string;
  title: string;
  description?: string;
  status: string;
  scheduledDate?: string;
  clientId: string;
  technicianId?: string;
}

interface JobFormProps {
  job?: Job;
  onSuccess: () => void;
  onCancel: () => void;
}

interface UserSummary {
  id: string;
  name: string;
  role: string;
}

export const JobForm: React.FC<JobFormProps> = ({ job, onSuccess, onCancel }) => {
  const isEdit = !!job;
  const [isLoading, setIsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    scheduledDate: job?.scheduledDate ? new Date(job.scheduledDate).toISOString().slice(0, 16) : '',
    clientId: job?.clientId || '',
    technicianId: job?.technicianId || '',
    status: job?.status || 'DRAFT',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to load users', err);
        setError('Failed to load users for selection');
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const clients = users.filter(u => u.role === 'CLIENT').map(u => ({ label: u.name, value: u.id }));
  const technicians = users.filter(u => u.role === 'TECHNICIAN').map(u => ({ label: u.name, value: u.id }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.clientId) {
      setError('Please select a client');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString() : null,
        technicianId: formData.technicianId || null,
      };

      if (isEdit) {
        await api.patch(`/jobs/${job.id}`, payload);
        toast.success('Job updated successfully');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job created successfully');
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} job`);
      toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} job`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <Input
        label="Title"
        name="title"
        required
        value={formData.title}
        onChange={handleChange}
        placeholder="Job Title"
      />

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Job description and notes"
        />
      </div>

      <Input
        label="Scheduled Date"
        type="datetime-local"
        name="scheduledDate"
        value={formData.scheduledDate}
        onChange={handleChange}
        min={new Date().toISOString().slice(0, 16)}
      />

      <Select
        label="Client"
        name="clientId"
        required
        value={formData.clientId}
        onChange={handleChange}
        options={usersLoading ? [] : clients}
        disabled={isEdit || usersLoading}
      />

      <Select
        label="Assign Technician"
        name="technicianId"
        value={formData.technicianId}
        onChange={handleChange}
        options={usersLoading ? [] : [{ label: 'Unassigned', value: '' }, ...technicians]}
        disabled={usersLoading}
      />

      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={[
          { label: 'Draft', value: 'DRAFT' },
          { label: 'Scheduled', value: 'SCHEDULED' },
          { label: 'In Progress', value: 'IN_PROGRESS' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ]}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={isLoading || usersLoading}>
          {isEdit ? 'Update Job' : 'Create Job'}
        </Button>
      </div>
    </form>
  );
};