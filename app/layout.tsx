// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ibmPlexMono, inter } from './font';
import { ThemeProvider } from "@/components/ThemeProvider"; // Import the provider
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'INCOIS | Ocean Hazard Reporting Platform',
  description: 'A platform for citizens and authorities to report and monitor ocean-related hazards in real-time, ensuring coastal safety.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans text-foreground antialiased",
            inter.variable, 
            ibmPlexMono.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex flex-col min-h-screen px-4 pt-20 md:px-8">
              {children}
            </main>

            <Toaster/>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}