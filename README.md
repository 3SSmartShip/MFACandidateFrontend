# MFA — Marine Form Automation (Candidate Dashboard)

The candidate portal for the Marine Form Automation platform. This dashboard allows seafaring candidates to securely log in, view their parsed documents, track form statuses, and review information extracted from their uploaded files.

## What It Does
The MFA Candidate Dashboard provides specialized tools for candidates:
- **Secure Access**: Phone number and OTP-based authentication for candidates.
- **Document Repository**: View and access processed certificates, passports, and resumes.
- **Form Tracking**: Monitor the approval status of submitted forms.
- **Data Verification**: Review the extracted data for accuracy before final processing.

## Tech Stack

| Concern | Choice |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router) |
| **Language** | JavaScript (React) |
| **State Management** | Redux Toolkit |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React & Remixicon |
| **Auth/DB Client** | Supabase JS |
| **HTTP Client** | Axios |
| **Document Tools** | @cyntler/react-doc-viewer, @univerjs |

## Project Structure

```text
src/
  api/
    auth/             — Candidate authentication services
    axios.js          — Pre-configured Axios instance for Backend API
  app/
    candidate/
      dashboard/      — Candidate overview and form statuses
      login/          — Candidate gateway (OTP flow)
      applications/   — Detailed application tracking
    components/
      candidate/      — Core UI components (Cards, Modals)
      upload/         — Document viewing components
    globals.css       — Design system and Tailwind layers
  redux/
    store.js          — Redux store entry point
    slices/           — Global state management
  lib/                — Platform utilities and helpers
```

## Environment Variables

Configure your `.env` file with the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_backend_api_url
```

## Getting Started

1. **Setup**:
   ```bash
   npm install
   ```

2. **Development**:
   ```bash
   npm run dev
   ```
   Access the dashboard at `http://localhost:3000`.

3. **Production Build**:
   ```bash
   npm run build
   ```
