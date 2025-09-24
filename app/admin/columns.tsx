// app/admin/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Report, ReportStatus, HazardType } from '@/types' // Import new types
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
const getStatusBadgeVariant = (status: ReportStatus) => {
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
        Reported At
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
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as ReportStatus;
        return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
    }
  },
  {
    accessorKey: "locationAlias",
    header: "Location Alias",
  },
/*   {
    accessorKey: "verifiedById",
    header: "Verified By",
    cell: ({ row }) => row.getValue("verifiedById") || "N/A",
  }, */
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original as Report;
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
              <Link href={`/admin/${report.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/${report.id}/edit`}>Verify/Edit Report</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]