// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { reportSchema, Report } from '@/types';
import { DataTable } from '@/components/ui/data-display/DataTable';
import { columns } from './columns';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import dynamic from 'next/dynamic';

// Dynamically import the MapDisplay component to prevent SSR issues with Leaflet
const MapDisplay = dynamic(() => import('@/components/MapDisplay'), { ssr: false });

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'table'>('map'); // Default to map view

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/reports');
        // We need to parse with an `id` field for the table and map keys
        const validatedReports = z.array(reportSchema).parse(response.data);
        setReports(validatedReports);
      } catch (err) {
        setError('Failed to load reports');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const table = useReactTable({
    data: reports,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-center text-destructive">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Admin Dashboard: Hazard Reports" />

      <div className="flex space-x-2 mb-4">
        <Button variant={activeView === 'map' ? 'default' : 'outline'} onClick={() => setActiveView('map')}>
          Map View
        </Button>
        <Button variant={activeView === 'table' ? 'default' : 'outline'} onClick={() => setActiveView('table')}>
          Table View
        </Button>
      </div>

      <div>
        {activeView === 'map' ? (
          <MapDisplay reports={reports} />
        ) : (
          <div>
            <DataTable table={table} columns={columns} />
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}