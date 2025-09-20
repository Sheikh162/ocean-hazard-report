// app/user/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { z } from 'zod';
import { reportSchema, Report } from '@/types';
import { DataTable } from '@/components/ui/data-display/DataTable';
import { columns } from './columns';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';

export default function UserDashboard() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`/api/me/reports`);
        const validatedReports = z.array(reportSchema).parse(res.data);
        setReports(validatedReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setError("Failed to load your reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const table = useReactTable({
    data: reports,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) return <div className="p-4 text-center">Loading your reports...</div>;
  if (error) return <div className="p-4 text-center text-destructive">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Your Submitted Reports"
        actionText="Submit New Report"
        onActionClick={() => router.push('/user/submit')}
      />
      
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
  );
}