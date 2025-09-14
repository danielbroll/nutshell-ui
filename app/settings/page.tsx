"use client";

import { useEffect, useState } from "react";
import { Card, Spinner, Table, TableBody, TableCell, TableRow } from "flowbite-react";

interface MintSettings {
  settings: Record<string, string>[];
}

function formatSettingName(key: string): string {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function SettingsPage() {
  const [mintInfo, setMintInfo] = useState<MintSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMintSettings = async () => {
      try {
        const response = await fetch("/api/mint-settings");
        if (!response.ok) {
          setError("Failed to fetch mint information");
          return;
        }
        const data = await response.json();
        setMintInfo(data as MintSettings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMintSettings();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-white p-8 dark:bg-gray-900">
      <h1 className="mb-8 text-3xl font-bold dark:text-white">Mint Settings</h1>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-100 p-4 text-red-500 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      ) : mintInfo ? (
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6">
          <Card>
            {mintInfo.settings && mintInfo.settings.length > 0 ? (
              <Table hoverable>
                <TableBody className="divide-y">
                  {mintInfo.settings.map((settingObj, index) => {
                    const key = Object.keys(settingObj)[0];
                    const value = settingObj[key];

                    return (
                      <TableRow key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white w-1/2">
                          {formatSettingName(key)}
                        </TableCell>
                        <TableCell>
                          {typeof value === 'object'
                            ? JSON.stringify(value)
                            : String(value)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">
                No settings available
              </div>
            )}
          </Card>
        </div>
      ) : null}
    </main>
  );
}
