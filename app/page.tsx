// app/page.tsx
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-3xl flex flex-col items-center gap-8">
        {/* Using a generic globe icon for INCOIS */}
        <Image
          src="/globe.svg" // Make sure you have a globe.svg in your /public folder
          alt="INCOIS Logo Placeholder"
          width={100}
          height={100}
          className="rounded-lg"
          priority
        />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Ocean Hazard Reporting Platform
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          A unified platform for citizens and authorities to report and monitor ocean-related hazards in real-time. Your reports help ensure coastal safety.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <SignedOut>
            <SignInButton>
              <Button>Report a Hazard</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
             <Button asChild>
                <Link href="/user/dashboard">Go to Your Dashboard</Link>
             </Button>
          </SignedIn>
        </div>
      </div>
    </main>
  );
}