// app/user/dashboard/[reportId]/edit/page.tsx
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
import { reportSchema, HazardType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';

type ReportInput = z.input<typeof reportSchema>;

export default function UserEditReportPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.reportId as string;
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const methods = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
  });

  const { register, handleSubmit, control, formState: { errors }, reset } = methods;

  useEffect(() => {
    if (!reportId || !user) return;
    const fetchReportData = async () => {
      try {
        const response = await axios.get(`/api/me/reports/${reportId}`);
        reset(response.data); // Pre-populate the form with fetched data
      } catch (error) {
        console.error("Failed to fetch report data:", error);
        toast.error("Could not load your report for editing.");
        router.push('/user/dashboard');
      } finally {
        setIsFetching(false);
      }
    };
    fetchReportData();
  }, [reportId, user, reset, router]);

  const onSubmit = async (data: ReportInput) => {
    setIsLoading(true);
    const toastId = toast.loading("Updating your report...");
    try {
      await axios.put(`/api/me/reports/${reportId}`, data);
      toast.success("Report updated successfully.", { id: toastId });
      router.push('/user/dashboard');
      router.refresh();
    } catch (error) {
      console.error("Failed to update report:", error);
      toast.error("Failed to update the report. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="container mx-auto py-8 text-center">Loading report for editing...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Edit Your Hazard Report" />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Edit Hazard Details</CardTitle>
            </CardHeader>
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
                    className="md:col-span-2"
                  />
                )}
              />

              <TextareaField
                label="Description of Hazard"
                name="description"
                register={register('description')}
                error={errors.description}
                className="md:col-span-2"
              />

              <FormField
                label="Photo URL (Optional)"
                name="imageUrl"
                register={register('imageUrl')}
                error={errors.imageUrl}
                className="md:col-span-2"
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}