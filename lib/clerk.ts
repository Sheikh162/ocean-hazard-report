// lib/clerk.ts
import { auth } from '@clerk/nextjs/server'

export async function getAuthUser() {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const role = sessionClaims?.role as "admin" | "user" | undefined;
  return { userId, role };
}
