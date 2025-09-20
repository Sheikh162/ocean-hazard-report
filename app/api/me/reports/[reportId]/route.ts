// /api/me/reports/[reportId]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { reportSchema } from '@/types';
import { auth } from '@clerk/nextjs/server';

// GET: Fetch a single report by its ID, ensuring it belongs to the user
export async function GET(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reportId=(await params).reportId
  const report = await prisma.report.findFirst({
    where: { id: reportId}, // Security check
  });

  if (!report) {
    return NextResponse.json({ error: 'Report not found or access denied' }, { status: 404 });
  }
  return NextResponse.json(report);
}


// PUT: Update an existing report
export async function PUT(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reportId=(await params).reportId
  // First, ensure the report exists and belongs to the user
  const existingReport = await prisma.report.findFirst({
    where: { id: reportId },
  });

  if (!existingReport) {
    return NextResponse.json({ error: 'Report not found or access denied' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = reportSchema.safeParse({ ...body});

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.issues }, { status: 400 });
  }

  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: {
      ...parsed.data,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(updatedReport);
}