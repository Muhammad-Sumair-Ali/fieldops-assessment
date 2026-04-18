import React, { useEffect, useState } from 'react';
import { Clock, ArrowRight, User as UserIcon, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '@/lib/axios';

interface JobLog {
  id: string;
  action: string;
  oldValue: string | null;
  newValue: string | null;
  userName: string;
  createdAt: string;
}

interface JobTimelineProps {
  jobId: string;
}

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  DRAFT: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' },
  SCHEDULED: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700' },
  IN_PROGRESS: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-700' },
  COMPLETED: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-700' },
  CANCELLED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-700' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const style = statusStyles[status] || statusStyles.DRAFT;
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export const JobTimeline: React.FC<JobTimelineProps> = ({ jobId }) => {
  const [logs, setLogs] = useState<JobLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/jobs/${jobId}/logs`);
        setLogs(response.data);
      } catch (err) {
        console.error('Failed to load activity logs', err);
        setError('Failed to load activity history');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500">Loading activity history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-500">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-3 opacity-50" />
        <p className="text-sm text-gray-500">No activity recorded for this job yet.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-8">
        {logs.map((log, index) => (
          <div key={log.id} className="relative pl-10">
            {/* Timeline dot */}
            <div className={`absolute left-[13px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 z-10 ${
              index === 0 ? 'bg-blue-600 scale-125 ring-4 ring-blue-500/20' : 'bg-gray-400 dark:bg-gray-600'
            }`} />

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900 dark:text-white">{log.action}</span>
                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </span>
              </div>

              {log.action === 'Status Changed' && log.oldValue && log.newValue && (
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={log.oldValue} />
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                  <StatusBadge status={log.newValue} />
                </div>
              )}

              {log.action === 'Technician Reassigned' && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   Changed from <span className="font-medium">{log.oldValue || 'None'}</span> to <span className="font-medium">{log.newValue || 'None'}</span>
                </div>
              )}

              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <UserIcon className="w-3 h-3" />
                <span>Changed by <span className="font-medium text-gray-700 dark:text-gray-300">{log.userName}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
