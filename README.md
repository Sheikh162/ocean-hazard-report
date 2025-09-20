# Ocean Hazard Reporting Platform

A modern, web-based platform designed for the Indian National Centre for Ocean Information Services (INCOIS) to enable real-time, crowdsourced reporting and monitoring of ocean hazards.

## 🌊 Project Overview

This platform provides a critical link between citizens on the coast and disaster management authorities. It allows coastal residents, volunteers, and officials to submit geotagged reports of observed hazards, which are then visualized on a dynamic, map-based dashboard for immediate situational awareness.

### Core Features

-   **Citizen Reporting**: A simple, mobile-friendly form for submitting geotagged hazard reports with descriptions and photos.
-   **Role-Based Access**: Secure authentication via Clerk, with distinct roles for **Citizens** and **Officials**.
-   **Real-time Map Dashboard**: An interactive dashboard for officials to view all incoming reports on a map, with the ability to switch to a detailed table view.
-   **Verification Workflow**: A system for officials to verify, update, and manage the status of citizen reports.

## 🛠️ Tech Stack & Architecture

-   **Framework**: Next.js 15 (App Router)
-   **Database**: PostgreSQL (hosted on Neon) with Prisma ORM
-   **Authentication**: Clerk for secure, role-based user management
-   **UI**: Tailwind CSS with shadcn/ui components
-   **Mapping**: Leaflet and React-Leaflet for the interactive map
-   **File Uploads**: UploadThing (for image uploads)
-   **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   A PostgreSQL database (e.g., from Neon)
-   A Clerk account
-   An UploadThing account

### Installation

1.  **Clone the repository**
2.  **Install dependencies**: `npm install`
3.  **Set up environment variables**: Create a `.env.local` file with your `DATABASE_URL`, Clerk keys, and `UPLOADTHING_TOKEN`.
4.  **Run database migrations**: `npx prisma migrate dev`
5.  **Run the development server**: `npm run dev`