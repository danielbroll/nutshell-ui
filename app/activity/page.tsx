"use client";

import { useEffect, useState } from 'react';
import { Card, Spinner } from 'flowbite-react';

interface SystemInfo {
  diskSpace: {
    free: string;
    total: string;
    percentFree: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
}

export default function ActivityPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await fetch('/api/system-info');
        if (!response.ok) {
          throw new Error('Failed to fetch system information');
        }
        const data = await response.json();
        setSystemInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">System Activity</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 rounded-lg bg-red-100 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      ) : systemInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Card>
            <div className="flex flex-col items-center">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                Disk Space
              </h5>
              <div className="mb-4 text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  Free: <span className="font-semibold">{systemInfo.diskSpace.free}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Total: <span className="font-semibold">{systemInfo.diskSpace.total}</span>
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-4 rounded-full" 
                  style={{ width: `${systemInfo.diskSpace.percentFree}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {systemInfo.diskSpace.percentFree}% free
              </p>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col items-center">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                CPU Activity
              </h5>
              <div className="relative h-40 w-40 mb-4">
                <div className="h-40 w-40 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
                <div 
                  className="absolute top-0 left-0 h-40 w-40 rounded-full border-8 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent"
                  style={{ 
                    transform: `rotate(${(systemInfo.cpu.usage / 100) * 360}deg)`,
                    transition: 'transform 0.5s ease-in-out'
                  }}
                ></div>
                <div className="absolute top-0 left-0 h-40 w-40 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{systemInfo.cpu.usage}%</span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {systemInfo.cpu.cores} CPU Cores Available
              </p>
            </div>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
