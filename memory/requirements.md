# SitePulse – AI Website Audit

## Product Language
English

## What to Build
SitePulse is a SaaS dashboard that enables users to audit websites for performance, SEO, accessibility, and best practices. Users can sign in, create projects by entering a website URL, trigger audit jobs, and view comprehensive audit results with real-time status updates. The product focuses on delivering a professional, data-driven dashboard experience with clear visualizations of audit scores, issues, and actionable recommendations.

## Target Audience
A diverse group of web professionals including SEO specialists tracking performance metrics, digital marketers optimizing client sites, web developers auditing projects for technical issues, and website owners looking to improve their own sites. These users regularly audit multiple websites, need quick insights into technical problems, and want actionable recommendations to optimize web properties. They value clean data presentation, fast workflows, and reliable audit history tracking.

## Screen Type
Desktop (1440px) - SaaS dashboard optimized for desktop workflows with data tables and detailed analytics views.

## Product Sides
User dashboard only - single-sided product for running audits without admin panel.

## Features & Pages
The demo includes five core pages that represent a complete SaaS workflow:

1. **Login page** (`/login`) - Email and password authentication with validation states, loading indicators, error toasts, and links to password recovery and account creation. Redirects to dashboard on success.

2. **Dashboard** (`/dashboard`) - Main project management hub featuring a top navigation bar with logo, sections (Projects, Billing, Settings), and user avatar dropdown. The main area displays a projects table with columns for Name, URL, Last Audit, Status, Members, and Actions. Includes "New Project" creation, per-project "Run Audit" triggers, and "View" links to project details. Implements empty state for new users, loading skeletons during data fetch, and error state banners with retry functionality.

3. **Project Details** (`/projects/:id`) - Detailed view showing project header with name, URL, and "Run New Audit" button. Left sidebar lists audit history (recent audits), right panel shows tabbed audit details (Overview, Issues, Performance, SEO, Accessibility). Displays audit status badges (queued, running, done, failed) and completed audit results including score cards (Performance, SEO, Accessibility, Best Practices on 0-100 scale), issues table with severity/title/page/recommendation columns, and chart placeholders for visual data representation.

4. **Billing** (`/billing`) - Simple plan comparison page with Free, Pro, and Team tier cards, current plan indicator, and upgrade CTAs.

5. **Settings** (`/settings`) - User profile management with editable fields (name, company, timezone) and team members list showing roles (Owner/Member).

## Data Model
The demo uses mock data structured around four entities:
- **User**: `{ id, email, name }`
- **Project**: `{ id, ownerId, name, url, createdAt }`
- **Membership**: `{ id, projectId, userId, role: "owner"|"member" }`
- **Audit**: `{ id, projectId, status: "queued"|"running"|"done"|"failed", createdAt, completedAt, scores, issues[] }`

## Design Requirements
Modern SaaS UI with responsive layout, componentized architecture, and consistent design patterns. Uses status badges for audit states, toast notifications for user actions (project created, audit started/finished), and comprehensive UI state handling (empty states with CTAs, loading skeletons, error banners with retry). The aesthetic should feel like a professional product dashboard with data tables, cards, and clear information hierarchy – not a marketing landing page.