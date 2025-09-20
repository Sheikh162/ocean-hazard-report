// app/user/dashboard/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Report, ReportStatus } from '@/types'
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

// Helper function to assign colors to statuses
const getStatusBadgeVariant = (status?: ReportStatus) => {
  switch (status) {
    case ReportStatus.Verified:
      return "default"; // Blue
    case ReportStatus.Alert:
      return "destructive"; // Red
    case ReportStatus.Unverified:
    default:
      return "secondary"; // Gray
  }
};

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date Submitted
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
  },
  {
    accessorKey: "hazardType",
    header: "Hazard Type",
  },
  {
    accessorKey: "status",
    header: "Verification Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as ReportStatus;
        return <Badge variant={getStatusBadgeVariant(status)}>{status || 'Unverified'}</Badge>
    }
  },
  {
    accessorKey: "locationAlias",
    header: "Location",
    cell: ({ row }) => row.getValue("locationAlias") || "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
                <Link href={`/user/dashboard/${report.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href={`/user/dashboard/${report.id}/edit`}>Edit Report</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]