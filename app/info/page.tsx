"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "flowbite-react";

// Types for specific NUT implementations
interface NutMethod {
  method: string;
  unit?: string;
  min_amount?: number;
  max_amount?: number;
  description?: boolean;
  commands?: string[];
}

interface NutCachedEndpoint {
  method: string;
  path: string;
}

interface Nut4And5 {
  methods: NutMethod[];
  disabled: boolean;
}

interface NutSimple {
  supported: boolean | NutMethod[];
}

interface Nut19 {
  cached_endpoints: NutCachedEndpoint[];
  ttl: number;
}

// Main types
type NutDefinition = Nut4And5 | NutSimple | Nut19;

interface ContactInfo {
  method: string;
  info: string;
}

interface MintInfo {
  name: string;
  pubkey: string;
  version: string;
  description: string;
  description_long?: string;
  contact: ContactInfo[];
  nuts: Record<string, NutDefinition>;
  motd: string;
  parameter?: {
    peg_out_only: boolean;
  };
  icon_url?: string;
  tos_url?: string;
  urls?: string[];
  time?: number;
}

export default function InfoPage() {
  const [mintInfo, setMintInfo] = useState<MintInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMintInfo = async () => {
      try {
        const response = await fetch("/api/mint-info");
        if (!response.ok) {
          setError("Failed to fetch mint information");
          return;
        }
        const data = await response.json();
        setMintInfo(data as MintInfo);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMintInfo();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-white p-8 dark:bg-gray-900">
      <h1 className="mb-8 text-3xl font-bold dark:text-white">Mint Info</h1>

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
            <div className="flex flex-col">
              <div className="mb-4 flex items-start">
                <div className="flex-grow">
                  <h5 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {mintInfo.name}
                  </h5>

                  <div>
                    <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                      {mintInfo.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mintInfo.description_long}
                    </p>
                  </div>
                </div>

                {mintInfo.icon_url && (
                  <div className="ml-4 flex-shrink-0">
                    <img
                      src={mintInfo.icon_url}
                      alt="Mint Icon"
                      className="h-20 w-20 rounded-lg object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
                  Version
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {mintInfo.version}
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
                  Public Key
                </p>
                <p className="break-all text-gray-600 dark:text-gray-400">
                  {mintInfo.pubkey}
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                  Supported
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(mintInfo.nuts).map((nutKey) => (
                    <Badge key={nutKey} color="info">
                      NUT-{nutKey}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
                  Message
                </p>
                <p className="text-gray-600 italic dark:text-gray-400">
                  {mintInfo.motd}
                </p>
              </div>

              {mintInfo.parameter && (
                <div className="mb-4">
                  <p className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                    Parameters
                  </p>
                  <Table hoverable>
                    <TableBody className="divide-y">
                      {mintInfo.parameter.peg_out_only !== undefined && (
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <TableCell className="w-1/3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                            Peg Out Only
                          </TableCell>
                          <TableCell>
                            <div className="inline-block">
                              <Badge
                                color={
                                  mintInfo.parameter.peg_out_only
                                    ? "warning"
                                    : "success"
                                }
                              >
                                {mintInfo.parameter.peg_out_only ? "Yes" : "No"}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {mintInfo.contact && mintInfo.contact.length > 0 ? (
                <div className="mb-4">
                  <p className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                    Contact
                  </p>
                  <Table hoverable>
                    <TableBody className="divide-y">
                      {mintInfo.contact.map((contact, index) => (
                        <TableRow
                          key={index}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <TableCell className="w-1/3 font-medium whitespace-nowrap text-gray-900 capitalize dark:text-white">
                            {contact.method}
                          </TableCell>
                          <TableCell>{contact.info}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : null}

              {(mintInfo.tos_url ||
                (mintInfo.urls && mintInfo.urls.length > 0)) && (
                <div className="mb-4">
                  <p className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                    Resources
                  </p>
                  <Table hoverable>
                    <TableBody className="divide-y">
                      {mintInfo.tos_url && (
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <TableCell className="w-1/3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                            Terms of Service
                          </TableCell>
                          <TableCell>
                            <a
                              href={mintInfo.tos_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {mintInfo.tos_url}
                            </a>
                          </TableCell>
                        </TableRow>
                      )}

                      {mintInfo.urls && mintInfo.urls.length > 0 && (
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <TableCell className="w-1/3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                            Additional URLs
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              {mintInfo.urls.map((url, index) => (
                                <a
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline dark:text-blue-400"
                                >
                                  {url}
                                </a>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
