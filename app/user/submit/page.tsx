// app/user/submit/page.tsx
'use client';

import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/form/SelectField';
import { TextareaField } from '@/components/ui/form/TextareaField';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { reportSchema, HazardType } from '@/types'; // Import new schema and enums
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { FormField } from '@/components/ui/form/FormField'; // Re-using for the image URL for now

// Define the type for the form input based on our new Zod schema
type ReportInput = z.input<typeof reportSchema>;

export default function SubmitPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const methods = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      // Set default values for the new form
      hazardType: HazardType.Other,
      description: '',
      imageUrl: '',
      latitude: 0,
      longitude: 0,
    },
  });

  const { register, handleSubmit, control, formState: { errors }, setValue } = methods;

  // --- NEW: Geolocation Logic ---
  useEffect(() => {
    // Check if the geolocation API is available in the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // On success, update the form's hidden latitude and longitude fields
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          toast.success("Location captured successfully!");
        },
        (error) => {
          // Handle errors, like user denying permission
          console.error("Geolocation error:", error);
          toast.error("Could not get your location. Please enable location services in your browser.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, [setValue]);


  // Set the user ID when the user object is available
  useEffect(() => {
    if (user?.id) {
      setValue('userId', user.id);
    }
  }, [user, setValue]);

  // The main submission handler
  const onSubmit = async (data: ReportInput) => {
    setIsLoading(true);
    const toastId = toast.loading("Submitting your report...");
    try {
      await axios.post('/api/me/reports', data);
      toast.success("Report submitted successfully!", { id: toastId });
      router.push('/user/dashboard'); // Redirect to the user's dashboard after success
      router.refresh();
    } catch (error) {
      console.error("Failed to submit report:", error);
      toast.error("Failed to submit the report. Please check your connection and try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Report an Ocean Hazard" />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Hazard Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* --- NEW FORM FIELDS --- */}
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

              <FormField
                  label="Location"
                  name="locationAlias"
                  register={register('locationAlias')}
                  error={errors.locationAlias}
              />
              
              {/* For the MVP, we'll use a simple text input for the image URL.
                  This can be replaced with an UploadThing component later. */}
              <FormField
                label="Photo URL (Optional)"
                name="imageUrl"
                register={register('imageUrl')}
                error={errors.imageUrl}
                className="md:col-span-2"
/*                 placeholder="https://example.com/image.jpg"
 */              />

            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}