// app/admin/[reportId]/edit/page.tsx

// issue in `/api/admin/reports/${reportId}` for some reason (`/api/me/reports/${reportId}` works fine though)

'use client';

import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form/FormField';
import { SelectField } from '@/components/ui/form/SelectField';
import { TextareaField } from '@/components/ui/form/TextareaField';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { reportSchema, HazardType, ReportStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';

// Admin can edit more fields, so we extend the base schema for the form
const adminEditSchema = reportSchema.extend({
  notes: z.string().optional(),
});

type AdminReportInput = z.input<typeof adminEditSchema>;

export default function AdminEditPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.reportId as string;
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const methods = useForm<AdminReportInput>({
    resolver: zodResolver(adminEditSchema),
  });

  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = methods;

  useEffect(() => {
    if (!reportId) return;
    const fetchReportData = async () => {
      try {
        const response = await axios.get(`/api/me/reports/${reportId}`);
        reset(response.data);
      } catch (error) {
        toast.error("Could not load report data.");
        router.push('/admin');
      } finally {
        setIsFetching(false);
      }
    };
    fetchReportData();
  }, [reportId, reset, router]);

  const onSubmit = async (data: AdminReportInput) => {
    if (!user) return;
    setIsLoading(true);
    const toastId = toast.loading("Saving changes...");

    // Set verification details if status is changed
    if (data.status && data.status !== ReportStatus.Unverified) {
      data.verifiedById = user.id;
      data.verifiedAt = new Date();
    }
    
    try {
      // NOTE: Using the admin API route which will be created next
      await axios.put(`/api/me/reports/${reportId}`, data);
      toast.success("Report updated successfully.", { id: toastId });
      router.push('/admin');
      router.refresh();
    } catch (error) {
      toast.error("Failed to update the report.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="container mx-auto py-8 text-center">Loading report...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Verify or Edit Hazard Report" />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Official Verification</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Verification Status"
                    name={field.name}
                    options={Object.values(ReportStatus)}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    error={errors.status}
                    required
                  />
                )}
              />
              <TextareaField
                label="Internal Notes for Officials"
                name="notes"
                register={register('notes')}
                error={errors.notes}
                className="md:col-span-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Citizen Submitted Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="hazardType"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Type of Hazard"
                    name={field.name}
                    options={Object.values(HazardType)}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    error={errors.hazardType}
                    required
                  />
                )}
              />
               <FormField
                  label="Location Alias"
                  name="locationAlias"
                  register={register('locationAlias')}
                  error={errors.locationAlias}
                />
              <TextareaField
                label="Description"
                name="description"
                register={register('description')}
                error={errors.description}
                className="md:col-span-2"
              />
              <FormField
                label="Photo URL"
                name="imageUrl"
                register={register('imageUrl')}
                error={errors.imageUrl}
                className="md:col-span-2"
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}