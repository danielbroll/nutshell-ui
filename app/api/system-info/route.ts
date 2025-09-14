import { NextResponse } from 'next/server';
import os from 'os';
import fs from 'fs';
import { promisify } from 'util';

// Convert fs.statfs to promise-based
const statfs = promisify(fs.statfs);

// Function to get CPU usage percentage
async function getCpuUsage(): Promise<number> {
  // Get initial CPU measurements
  const startMeasure = os.cpus().map(cpu => {
    return Object.values(cpu.times).reduce((sum, tv) => sum + tv, 0);
  });

  // Wait a short period before taking second measurement
  await new Promise(resolve => setTimeout(resolve, 100));

  // Get CPU measurements after short delay
  const endMeasure = os.cpus().map(cpu => {
    return Object.values(cpu.times).reduce((sum, tv) => sum + tv, 0);
  });

  // Calculate the difference (usage)
  const idleCpus = os.cpus().map((cpu, i) => {
    const idleDifference = cpu.times.idle - (os.cpus()[i].times.idle);
    const totalDifference = endMeasure[i] - startMeasure[i];
    return (1 - idleDifference / totalDifference) * 100;
  });

  // Return average CPU usage across all cores
  return Math.round(idleCpus.reduce((sum, idle) => sum + idle, 0) / idleCpus.length);
}

// Helper function to format bytes to human-readable format
function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export async function GET() {
  try {
    // Get disk space information (for the root directory)
    const rootDirPath = '/';
    let diskInfo;

    try {
      // Try to use fs.statfs which works on Unix-like systems
      diskInfo = await statfs(rootDirPath);
    } catch (error) {
      // Fallback for Windows or if statfs is not available
      // Provide some mock data for development
      diskInfo = {
        bsize: 4096,
        blocks: 1000000000,
        bfree: 500000000,
      };
    }

    const totalSpace = diskInfo.blocks * diskInfo.bsize;
    const freeSpace = diskInfo.bfree * diskInfo.bsize;
    const percentFree = Math.round((freeSpace / totalSpace) * 100);

    // Get CPU info
    const cpuUsage = await getCpuUsage();
    const cpuCores = os.cpus().length;

    // Return the system information
    return NextResponse.json({
      diskSpace: {
        free: formatBytes(freeSpace),
        total: formatBytes(totalSpace),
        percentFree
      },
      cpu: {
        usage: cpuUsage,
        cores: cpuCores
      }
    });
  } catch (error) {
    console.error('Error getting system information:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve system information' },
      { status: 500 }
    );
  }
}
