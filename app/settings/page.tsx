"use client";

import { useEffect, useState } from 'react';
import { Card, Spinner, Badge, Table, TableBody, TableRow, TableCell } from 'flowbite-react';

interface MintInfo {
  name: string;
  pubkey: string;
  version: string;
  description: string;
  description_long: string;
  contact: [string, string][];
  nuts: string[];
  motd: string;
  parameter: {
    peg_out_only: boolean;
  };
}

export default function SettingsPage() {
  const [mintInfo, setMintInfo] = useState<MintInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMintInfo = async () => {
      try {
        const response = await fetch('/api/mint-info');
        if (!response.ok) {
          setError('Failed to fetch mint information');
          return;
        }
        const data = await response.json();
        setMintInfo(data as MintInfo);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMintInfo();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Mint Settings</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 rounded-lg bg-red-100 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      ) : mintInfo ? (
        <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
          <Card>
            <div className="flex flex-col">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                {mintInfo.name}
              </h5>

              <div className="mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{mintInfo.description}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{mintInfo.description_long}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">Version</p>
                <p className="text-gray-600 dark:text-gray-400">{mintInfo.version}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">Public Key</p>
                <p className="text-gray-600 dark:text-gray-400 break-all">{mintInfo.pubkey}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Supported</p>
                <div className="flex flex-wrap gap-2">
                  {mintInfo.nuts.map((nut, index) => (
                    <Badge key={index} color="info">{nut}</Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">Message</p>
                <p className="text-gray-600 dark:text-gray-400 italic">{mintInfo.motd}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Parameters</p>
                <Table hoverable>
                  <TableBody className="divide-y">
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white w-1/3">
                        Peg Out Only
                      </TableCell>
                      <TableCell>
                        <div className="inline-block">
                          <Badge color={mintInfo.parameter.peg_out_only ? "warning" : "success"}>
                            {mintInfo.parameter.peg_out_only ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Contact</p>
                <Table hoverable>
                  <TableBody className="divide-y">
                    {mintInfo.contact.map(([type, value], index) => (
                      <TableRow key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white w-1/3 capitalize">
                          {type}
                        </TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
