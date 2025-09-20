// components/Navbar.tsx
'use client'

import {
  SignedOut,
  SignedIn,
  SignInButton,
  SignOutButton,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  navigationMenuTriggerStyle 
} from '@/components/ui/navigation-menu'
import { ThemeToggle } from './ThemeToggle'

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Image
            src="/globe.svg" // Using the same generic icon
            alt="INCOIS Logo Placeholder"
            width={30}
            height={30}
            priority
          />
{/*           <span>INCOIS Hazard Reporting</span> */}
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <SignedOut>
              <NavigationMenuItem>
                <ThemeToggle/>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <SignInButton>
                  <Button>Sign In</Button>
                </SignInButton>
              </NavigationMenuItem>
            </SignedOut>

            <SignedIn>
              <NavigationMenuItem>
                <ThemeToggle/>
              </NavigationMenuItem>
{/*               <NavigationMenuItem>
                <NavigationMenuLink href="/user/dashboard" className={navigationMenuTriggerStyle()}>
                    Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/user/submit" className={navigationMenuTriggerStyle()}>
                    Submit Report
                </NavigationMenuLink>
              </NavigationMenuItem> */}
              <NavigationMenuItem>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonPopoverCard: 'shadow-lg border rounded-xl',
                    },
                  }}
                />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <SignOutButton>
                  <Button variant="outline">Sign Out</Button>
                </SignOutButton>
              </NavigationMenuItem>
              
            </SignedIn>
          </NavigationMenuList>
        </NavigationMenu>

      </div>
    </header>
  )
}
