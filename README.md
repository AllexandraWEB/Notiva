# 📖 Notiva

## 📋 Table of Contents

- [Functional Guide](#-functional-guide)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)

---

## Functional Guide

### Purpose
Notiva is a modern, collaborative note-taking application that enables users to create, organize, and share notes seamlessly. The platform provides both public and private note management, allowing users to discover shared notes from the community while maintaining personal notebooks, favorite collections, and organized project folders.

### Main User Flows

#### 1. **Public Access Flow**
- Users can browse the public catalog of shared notes without authentication
- Access the home page to explore featured content
- View detailed note information including content, creation date, and author details
- Search across all public notes in real-time using the search functionality

#### 2. **Authentication Flow**
- Users can register with email and password or sign in using Google OAuth
- After authentication, users remain logged in across browser sessions through persistent Supabase session management
- Unauthenticated users attempting to access private features are redirected to the login page
- After successful OAuth callback, users are automatically redirected to their home dashboard

#### 3. **Note Management Flow**
- Authenticated users can create new notes with title, body, subtitle, color coding, category, and tags
- Users can edit their own notes or view read-only shared notes from others
- Users can delete their personal notes
- Notes can be organized into projects/notebooks for better structure
- Users can toggle notes as favorites for quick access
- All note changes are synchronized in real-time with the backend

#### 4. **Discovery & Organization Flow**
- Users can browse shared notes in the public catalog
- Users can filter and search notes by title, content, category, and tags
- Users can categorize their personal notes and filter by category
- Users can organize notes into project folders
- Users can view their favorite notes in a dedicated favorites section
- Users can access a shared notes section to see which of their notes is with public status

### Core Features

#### **Note Creation & Editing**
- Rich note form with title, body, subtitle, color selection, category, and tags
- Real-time form validation to ensure data integrity
- Color-coded notes for visual organization (supports multiple color schemes)
- Auto-save functionality for user convenience
- Support for markdown formatting and special formatting within notes

#### **Favorites System**
- One-click favorite toggle on any note
- Dedicated favorites page showing all bookmarked notes
- Persistent favorite state stored in the backend

#### **Project Organization**
- Create custom project folders to group related notes
- Assign notes to projects for hierarchical organization
- Visual project cards showing note counts and project details
- Easy project management (create, delete, view notes within projects)

#### **Search & Discovery**
- Real-time search across note titles, content, subtitles, categories, and tags
- Category-based filtering for quick note discovery
- Search functionality available on public catalog, personal all-notes, and category pages
- Responsive search results with instant filtering

#### **Categories & Tagging**
- Organize notes by category for better classification
- Add multiple tags to notes for fine-grained categorization
- Filter and search notes by category
- Category overview showing all notes in a category

#### **Shared Notes**
- View notes shared with you by other users
- Access a dedicated section for shared notes
- Same search and filtering capabilities for shared notes

#### **Authentication & Security**
- Secure email/password registration and login
- Google OAuth integration for streamlined authentication
- Session persistence across page refreshes
- Auth guards protecting private pages from unauthenticated access
- Safe logout functionality with session termination

### How Users Interact with the System

#### **Navigation Structure**
- **Home Page**: Landing page with application overview and quick access to key features
- **All Notes**: Browse all publicly shared notes from the community
- **My Dashboard**: Access personal note management sections (requires authentication)
  - **Favorites**: Quick access to bookmarked notes
  - **Categories**: Browse notes organized by category
  - **Private Notes**: Review notes that are with private status
  - **Shared Notes**: Access notes that are with public status
  - **Projects**: View project folders and organized note collections

#### **User Interactions**
- **Creating Notes**: Users click "Create Note" from the dashboard, fill out the form with title, content, color, category, and tags, then save
- **Editing Notes**: Users click on a note to view details, then edit button to modify content if they are the author of the note
- **Deleting Notes**: Users can delete personal notes directly from note detail view or list view
- **Searching Notes**: Users enter search terms in the search bar, results update in real-time
- **Using Favorites**: Users click the heart/favorite icon on any note to bookmark it; favorited notes appear in the Favorites section
- **Organizing Projects**: Users create project folders from the dashboard, then assign notes to specific projects
- **Sharing Notes**: Notes can be shared with other users or marked as public for community discovery
- **Logging In/Out**: Users authenticate via the login page using email/password or Google OAuth; logout removes session and redirects to home

#### **Key User Actions**
1. **Authentication**: Register/Login → Choose email or Google OAuth
2. **Explore**: Browse public notes → Search and filter → View note details
3. **Create**: Click create → Fill form → Submit → Note appears in personal list
4. **Organize**: Create projects → Assign notes to projects → Add to favorites → Filter by category
5. **Share**: Mark note as public or share with specific users → Others can discover and access
6. **Manage**: Edit notes → Update category/tags/color → Delete unwanted notes

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Angular 21.x with standalone components
- **Language:** TypeScript 5.x
- **Styling:** 
  - Tailwind CSS 4.x
  - Component-scoped CSS
- **State Management:** Angular Signals & Computed Properties
- **Routing:** Angular Router with standalone routing
- **HTTP Client:** Angular HttpClient with Interceptors
- **Forms:** Reactive Forms with Validators
- **Icons:** Lucide Icons, Material Icons
- **Build Tool:** Angular CLI 21.x

### Backend & Database
- **Backend-as-a-Service:** Supabase (PostgreSQL, Auth, Real-time)
- **Authentication:** Supabase Auth with OAuth2 (Google)
- **Database:** PostgreSQL via Supabase
- **API Client:** Supabase JavaScript SDK

### Deployment & Tools
- **Build System:** Angular CLI with SSR prerendering
- **Version Control:** Git
- **Package Manager:** npm
- **Development:** Vite preview, Angular development server
- **Linting:** ESLint (TypeScript)

---

## 📁 Folder Structure

### Root Directory
```
Notiva/
├── src/                      # Source code
│   ├── app/                  # Angular application module
│   ├── environments/         # Environment configuration
│   ├── styles.css           # Global styles
│   ├── main.ts              # Application entry point
│   ├── main.server.ts       # SSR server entry point
│   └── server.ts            # SSR server configuration
├── public/                   # Static assets
├── angular.json             # Angular CLI configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TypeScript config
├── tsconfig.spec.json       # Test TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

### Application Structure (src/app/)
```
app/
├── app.ts                       # Main app component
├── app.routes.ts                # Route definitions
├── app.routes.server.ts         # SSR route configuration
├── app.config.ts                # App configuration
├── app.config.server.ts         # SSR configuration
├── app.css                      # App-level styles
│
├── core/                        # Core module (singleton services)
│   ├── auth/                    # Authentication
│   │   ├── pages/
│   │   │   ├── login/           # Login page with form
│   │   │   ├── register/        # Register page with form
│   │   │   └── callback/        # OAuth callback handler
│   │   ├── models/
│   │   │   ├── auth.model.ts
│   │   │   ├── login.model.ts
│   │   │   └── register.model.ts
│   │   ├── auth-guard.ts        # Authentication route guard
│   │   ├── auth-store.ts        # Auth state management
│   │   └── auth.routes.ts       # Auth routing
│   │
│   ├── interceptors/            # HTTP interceptors
│   │
│   ├── layout/                  # Main layout components
│   │   ├── notes-layout/        # Notes layout with sidebar
│   │   └── sidebar/             # Sidebar navigation
│   │
│   ├── models/                  # Core data models
│   │   ├── core.models.ts
│   │   ├── supabase-favorite.model.ts
│   │   ├── supabase-note-insert.model.ts
│   │   └── supabase-note-row.model.ts
│   │
│   └── services/
│       └── supabase.service.ts  # Supabase client wrapper
│
├── features/                    # Feature modules (lazy-loaded)
│   ├── home/                    # Home/landing page
│   │   ├── home.ts
│   │   ├── home.html
│   │   └── home.css
│   │
│   ├── not-found/               # 404 error page
│   │   ├── not-found.ts
│   │   ├── not-found.html
│   │   └── not-found.css
│   │
│   └── notes/                   # Notes feature pages
│       ├── categories/          # Filter by category
│       ├── favorites/           # Favorited notes
│       ├── my-shared-notes/     # My shared notes
│       ├── notebooks/           # My private notebooks
│       ├── projects/            # Project folders
│       ├── project-details/     # Individual project view
│       └── shared-notes/        # Public shared notes catalog
│
└── shared/                      # Shared module
    ├── components/              # Reusable shared components
    │   ├── note-creation-form/
    │   ├── note-details/
    │   ├── note-template/
    │   └── project-folder-card/
    │
    ├── consts/
    │   └── consts.ts            # App-wide constants
    │
    ├── models/                  # Shared data models
    │   ├── note-color.model.ts
    │   ├── note-payload.model.ts
    │   └── project-folder.model.ts
    │
    ├── pipes/                   # Custom Angular pipes
    │   ├── relative-date.pipe.ts
    │   ├── note-search.pipe.ts
    │   ├── category-search.pipe.ts
    │   └── project-count-label.pipe.ts
    │
    ├── services/                # Shared business logic
    │   ├── notes-store.ts
    │   └── projects-store.ts
    │
    └── utils/                   # Utility functions
```

### Database Schema (Supabase PostgreSQL)
```
supabase/
└── notes_schema.sql            # PostgreSQL schema & migrations
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (18.x or later)
- npm (9.x or later)
- Git
- A Supabase account ([https://supabase.com](https://supabase.com))

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AllexandraWEB/Notiva.git
   cd Notiva
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Angular environment file:**
    - Open `src/environments/environment.ts`
    - For the test you can use the current Supabase URL and Publishable Key which are connected to the Angular Project `/src/environments/environments.ts`. (*Optional approach if you want to use your own Supabase Project: Replace the values in the exported `environment` object with your Supabase project credentials:*)
       ```ts
       export const environment = {
          production: false,
          supabaseUrl: 'your_supabase_project_url',
          supabasePublishableKey: 'your_supabase_publishable_key',
       };
       ```

4. **Set up Supabase database:**
   - Log in to your Supabase project
   - Go to the SQL Editor
   - Run the SQL schema from `supabase/notes_schema.sql` to create tables and functions

5. **Configure Google OAuth (optional but recommended if you configure your own Supabase Project):**
   - Create a Google OAuth app in Google Cloud Console
   - Add Authorized JavaScript origins: URLs 1: Your Supabase Project URL `...supabase.co` and URLs 2: `http://localhost:4200`
   - Add OAuth redirect URI: URL 1: `...supabase.co/auth/v1/callback` and URls 2: `http://localhost:4200/auth/callback`
   - Enable Google provider in Supabase Authentication settings and add the Google Cloud Console's Client IDs and Client Secret (for OAuth)

### Running the Development Server

1. **Start the development server:**
   ```bash
   ng serve
   ```
   or
   ```bash
   npm start
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:4200/
   ```

3. The application will automatically reload whenever you modify any source files.

### Building for Production

1. **Build the project:**
   ```bash
   ng build
   ```
   or
   ```bash
   npm run build
   ```