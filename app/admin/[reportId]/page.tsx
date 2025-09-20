// app/admin/[reportId]/page.tsx
import { prisma } from '@/lib/prisma';
import { reportSchema } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailItem } from '@/components/ui/data-display/DetailItem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function AdminSingleReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const reportId=(await params).reportId
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    return notFound();
  }

  const validatedReport = reportSchema.parse(report);

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Review Submitted Hazard Report" />
      <Button asChild className="mb-6">
        <Link href={`/admin/${reportId}/edit`}>
          Verify or Edit Report
        </Link>
      </Button>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Hazard Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Hazard Type" value={validatedReport.hazardType} />
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge>{validatedReport.status}</Badge>
            </div>
            <DetailItem label="Description" value={validatedReport.description} className="col-span-full" />
            {validatedReport.imageUrl && (
              <div className="col-span-full">
                <p className="text-sm font-medium text-muted-foreground">Submitted Photo:</p>
                <a href={validatedReport.imageUrl} target="_blank" rel="noopener noreferrer">
                  <img src={validatedReport.imageUrl} alt="Hazard report" className="mt-2 rounded-lg border max-w-sm hover:opacity-80 transition-opacity" />
                </a>
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
        
        <Card>
          <CardHeader>
            <CardTitle>Verification and Audit</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Submitted By (User ID)" value={validatedReport.userId} />
            <DetailItem label="Data Source" value={validatedReport.source} />
            <DetailItem label="Verified By (Admin ID)" value={validatedReport.verifiedById} />
            <DetailItem label="Verified At" value={validatedReport.verifiedAt?.toLocaleString()} />
            <DetailItem label="Internal Notes" value={validatedReport.notes} className="col-span-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}