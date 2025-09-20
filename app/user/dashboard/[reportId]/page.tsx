// app/user/dashboard/[reportId]/page.tsx
import { prisma } from '@/lib/prisma';
import { reportSchema, Report } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailItem } from '@/components/ui/data-display/DetailItem';
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs/server';

export default async function UserSingleReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { userId } = await auth();
  if (!userId) return notFound();
  const reportId=(await params).reportId

  const report = await prisma.report.findFirst({
    where: { 
      id: reportId,
      userId: userId // Ensure user can only see their own reports
    },
  });

  if (!report) {
    return notFound();
  }
  
  const validatedReport = reportSchema.parse(report);

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Submitted Report Details" />
      <Button asChild className="mb-6">
        <Link href={`/user/dashboard/${reportId}/edit`}>
          Edit Report
        </Link>
      </Button>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Hazard Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Hazard Type" value={validatedReport.hazardType} />
            <DetailItem label="Verification Status" value={validatedReport.status} />
            <DetailItem label="Description" value={validatedReport.description} className="col-span-full" />
            {validatedReport.imageUrl && (
              <div className="col-span-full">
                <p className="text-sm font-medium text-muted-foreground">Submitted Photo:</p>
                <img src={validatedReport.imageUrl} alt="Hazard report" className="mt-2 rounded-lg border max-w-sm" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Location Alias" value={validatedReport.locationAlias} />
            <DetailItem label="Latitude" value={validatedReport.latitude.toString()} />
            <DetailItem label="Longitude" value={validatedReport.longitude.toString()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}