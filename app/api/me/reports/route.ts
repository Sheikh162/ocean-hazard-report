// /api/me/reports/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reportSchema } from '@/types';
import { auth } from '@clerk/nextjs/server';

// GET: Fetch all reports for the currently logged-in user
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Failed to fetch user reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

// POST: Create a new hazard report
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // Validate the incoming data against our new, simplified report schema
    const parsed = reportSchema.safeParse({ ...body});

    if (!parsed.success) {
      // Log the specific validation errors for easier debugging
      console.error('Zod validation errors:', parsed.error.issues);
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.issues }, { status: 400 });
    }

    // Create the new report in the database
    const newReport = await prisma.report.create({
      data: parsed.data,
    });

    // Future enhancement: Email notifications to admins could be triggered here.

    return NextResponse.json(newReport, { status: 201 });
  } catch (err) {
    console.error('Failed to create report:', err);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}