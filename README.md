// Project: InsightLoop – AI-powered Meeting & Document Knowledge Hub

// Stack:
// Frontend: Next.js (App Router), Tailwind, shadcn/ui
// Backend: Next.js API routes
// Database: PostgreSQL with Prisma
// Auth: NextAuth.js
// AI: OpenAI API
// File Upload: Base64 (for now), S3 (optional later)

// Initial Setup Plan:
// 1. Folder structure
// 2. Prisma schema
// 3. Page layout overview
// 4. API endpoint plan
// 5. MVP task list

// Folder Structure (inside /insightloop):
// ├── app
// │   ├── layout.tsx
// │   ├── page.tsx (landing page)
// │   ├── dashboard
// │   │   ├── page.tsx (user dashboard)
// │   │   └── [docId]/page.tsx (single document/chat view)
// ├── components
// │   ├── Navbar.tsx
// │   ├── FileUploader.tsx
// │   ├── ChatWithDoc.tsx
// │   ├── NotesEditor.tsx
// ├── lib
// │   ├── prisma.ts
// │   ├── openai.ts
// ├── pages
// │   └── api
// │       ├── auth/[...nextauth].ts
// │       ├── upload.ts
// │       ├── summarize.ts
// │       └── chat.ts
// ├── prisma
// │   └── schema.prisma
// ├── styles
// ├── public
// ├── .env

// Prisma Schema (first draft):
/*
model User {
  id            String   @id @default(cuid())
  name          String?
  email         String? @unique
  image         String?
  documents     Document[]
  notes         Note[]
  createdAt     DateTime @default(now())
}

model Document {
  id            String   @id @default(cuid())
  title         String
  content       String   // base64 or text
  summary       String?
  user          User     @relation(fields: [userId], references: [id])
  userId        String
  sharedWith    String[] // emails with access
  createdAt     DateTime @default(now())
}

model Note {
  id            String   @id @default(cuid())
  content       String
  document      Document @relation(fields: [documentId], references: [id])
  documentId    String
  user          User     @relation(fields: [userId], references: [id])
  userId        String
  createdAt     DateTime @default(now())
}
*/

// Next Steps:
// - Setup Next.js with App Router
// - Add Tailwind & shadcn
// - Configure Prisma + PostgreSQL
// - Add NextAuth with Google login
// - Create upload + summary API endpoints
// - Build Dashboard UI (upload, list docs, click to open)
// - Add Chat + Notes view
