import { z } from "zod";

// --- ENUMS for the new Ocean Hazard schema ---
// These match the enums in your prisma.schema and provide standardized options

export enum HazardType {
  UnusualTides = "UnusualTides",
  CoastalFlooding = "CoastalFlooding",
  CoastalDamage = "CoastalDamage",
  HighWaves = "HighWaves",
  SwellSurge = "SwellSurge",
  StormSurge = "StormSurge",
  TsunamiWarning = "TsunamiWarning",
  AbnormalSeaBehaviour = "AbnormalSeaBehaviour",
  CoastalCurrents = "CoastalCurrents",
  Other = "Other",
}

export enum ReportStatus {
  Unverified = "Unverified",
  Verified = "Verified",
  Alert = "Alert",
  Archived = "Archived",
}

export enum DataSource {
  CITIZEN_WEB = "CITIZEN_WEB",
  CITIZEN_MOBILE = "CITIZEN_MOBILE",
  IOT_SENSOR = "IOT_SENSOR",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
}


// --- ZOD SCHEMA for form validation ---
// This schema validates the data for a new report submission

export const reportSchema = z.object({
  // --- Core Hazard Information ---
  hazardType: z.nativeEnum(HazardType, {
    required_error: "Hazard type is required.",
  }),
  description: z.string().max(1000, "Description cannot exceed 1000 characters.").optional(),
  imageUrl: z.string().url("Invalid image URL.").optional().nullable(),

  // --- Geolocation ---
  latitude: z.number({ required_error: "Latitude is required." }).min(-90).max(90),
  longitude: z.number({ required_error: "Longitude is required." }).min(-180).max(180),
  locationAlias: z.string().max(150, "Location name is too long.").optional().nullable(),

  // --- Hidden/System Fields ---
  id: z.string().uuid().optional(),
  userId: z.string(), // This will be set automatically from Clerk
  source: z.nativeEnum(DataSource).default(DataSource.CITIZEN_WEB),
  
  // These fields are for admin use and not part of the submission form
  status: z.nativeEnum(ReportStatus).optional(),
  verifiedById: z.string().optional().nullable(),
  verifiedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  notes: z.string().optional().nullable(),
});

// --- TYPE INFERENCE ---
// This creates a TypeScript type from your Zod schema for use in your components

export type Report = z.infer<typeof reportSchema>;


// Sanitizer function (still useful)
export function sanitizeForPrisma<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, v) => (v === undefined ? null : v))
  );
}