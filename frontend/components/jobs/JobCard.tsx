import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, User, UserCheck, Edit2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

export interface Job {
  id: string;
  title: string;
  description?: string;
  status: string;
  scheduledDate?: string;
  clientId: string;
  client: { id: string; name: string };
  technicianId?: string;
  technician?: { id: string; name: string };
  createdAt: string;
}

interface JobCardProps {
  job: Job;
  onStatusChange?: (jobId: string, newStatus: string) => Promise<void>;
  onEdit?: (job: Job) => void;
}

const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  DRAFT: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-700', dot: 'bg-gray-500' },
  SCHEDULED: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700', dot: 'bg-blue-500' },
  IN_PROGRESS: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700', dot: 'bg-amber-500 animate-pulse' },
  COMPLETED: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-700', dot: 'bg-red-500' },
};

const statusOptions = [
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const JobCard: React.FC<JobCardProps> = ({ job, onStatusChange, onEdit }) => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(job.status);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!onStatusChange || newStatus === job.status) return;

    setIsUpdating(true);
    try {
      await onStatusChange(job.id, newStatus);
      setSelectedStatus(newStatus); 
    } catch (error) {
      setSelectedStatus(job.status);
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDate = job.scheduledDate
    ? format(new Date(job.scheduledDate), 'MMM dd, yyyy • h:mm a')
    : 'Not scheduled';

  const style = statusStyles[job.status] || statusStyles.DRAFT;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <CardTitle className="text-lg font-semibold leading-tight">{job.title}</CardTitle>
          </div>

          {/* Status Badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            {job.status.replace('_', ' ')}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {job.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {job.description}
          </p>
        )}

        {/* Job Details */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">Client: <strong>{job.client?.name || 'Unknown'}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <UserCheck className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">Technician: <strong>{job.technician?.name || 'Unassigned'}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">{formattedDate}</span>
          </div>
        </div>

        {/* Technician Status Update Section */}
        {user?.role === 'TECHNICIAN' && onStatusChange && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Update Job Status</p>
            
            <div className="flex gap-4">
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className="flex-1 px-2 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {isUpdating && (
                <Button disabled variant="outline" className="px-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-1.5">
              Only you can update the status of your assigned jobs
            </p>
          </div>
        )}

        {/* Admin Edit Button */}
        {user?.role === 'ADMIN' && onEdit && (
          <Button 
            onClick={() => onEdit(job)} 
            variant="outline" 
            className="w-full mt-2"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Job
          </Button>
        )}
      </CardContent>
    </Card>
  );
};