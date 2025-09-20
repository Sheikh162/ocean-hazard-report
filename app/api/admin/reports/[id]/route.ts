// /api/admin/reports/[reportId]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Fetch any single report by its ID
export async function GET(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  const reportId=(await params).reportId
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
  return NextResponse.json(report);
}

// DELETE: Remove a report from the database
export async function DELETE(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  const reportId=(await params).reportId
  try {
    await prisma.report.delete({
      where: { id: reportId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete report ${reportId}:`, error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}

/*
// PUT: For future use by admins to verify or update a report's status
// Example of how an admin could verify a report. Not needed for the initial MVP.

export async function PUT(request: Request, { params }: { params: { reportId: string } }) {
  const { userId } = await auth(); // Get the admin's ID
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { status, notes } = body; // Expecting a new status and notes

  const updatedReport = await prisma.report.update({
    where: { id: params.reportId },
    data: {
      status: status, // e.g., "Verified"
      notes: notes,
      verifiedById: userId,
      verifiedAt: new Date(),
    },
  });

  return NextResponse.json(updatedReport);
}
*/