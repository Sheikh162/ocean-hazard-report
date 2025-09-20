// /api/admin/reports/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Fetch all reports for the admin dashboard
// Note: Authorization is handled by the middleware.ts file
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Failed to fetch admin reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}