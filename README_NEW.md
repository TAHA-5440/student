# StudentForm - AI-Powered Form Builder

## Overview

**StudentForm** is an intelligent form builder application that leverages AI to automatically generate customized forms based on text descriptions. Users can create, edit, preview, download, and manage forms seamlessly through an intuitive dashboard interface.

## Key Features

- 🤖 **AI-Powered Form Generation** - Describe your form requirements and let AI create the structure automatically
- 📝 **Form Management** - Create, edit, preview, and delete forms with ease
- 👁️ **Live Preview** - Toggle between editing and preview modes to see your form in real-time
- 📥 **Field Editing** - Customize field labels, placeholders, and properties with an intuitive popover interface
- 📄 **PDF Export** - Download forms as PDF documents for offline use or sharing
- 🔗 **Form Sharing** - Generate shareable links for form distribution
- 🔐 **Authentication** - Secure sign-in and sign-up with Clerk authentication
- 📊 **Dashboard** - Centralized dashboard to manage all your forms

## Tech Stack

- **Frontend**: Next.js 14+, React 18, TypeScript/JavaScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **UI Components**: Custom Shadcn/UI components
- **AI Integration**: OpenAI API
- **Styling**: Tailwind CSS, PostCSS
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **Icons**: Lucide React

## Project Structure

```
student/
├── app/
│   ├── _component/          # Reusable UI components
│   │   ├── CreateForm.jsx   # Form creation with AI
│   │   ├── form.jsx         # Form editing and preview
│   │   ├── DownloadPDF.js   # PDF export functionality
│   │   ├── header.tsx       # Navigation header
│   │   ├── SideNav.jsx      # Sidebar navigation
│   │   ├── HeroSection.tsx  # Landing page hero
│   │   └── config/          # Configuration files
│   ├── Dashboard/           # Main dashboard page
│   ├── api/                 # Backend API routes
│   │   └── ai/              # AI integration endpoints
│   ├── editform/            # Dynamic form editing page
│   ├── previewform/         # Form preview page
│   ├── (auth)/              # Authentication pages
│   ├── lib/                 # Utility functions (Supabase, helpers)
│   └── layout.tsx           # Root layout
├── components/              # Shadcn UI components
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account
- Clerk account
- OpenAI API key

### Installation

1. **Clone the repository**

```bash
cd student
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file in the `student` directory:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
OPENAI_API_KEY=your_openai_key
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### Creating a Form

1. Navigate to your Dashboard
2. Click the "Create Form" button
3. Describe your form requirements (e.g., "A student enrollment form with name, email, student ID, and major fields")
4. Let AI generate the form structure
5. Customize fields as needed

### Editing Forms

1. From the Dashboard, click "Edit" on any form
2. Use the field editing popover to modify labels and placeholders
3. Toggle preview mode to see real-time changes
4. Save your changes

### Sharing & Exporting

- **Share**: Click the share icon to copy the shareable form link
- **Download**: Click the download icon to export the form as a PDF

### Previewing Forms

1. Click the "Eye" icon to toggle preview mode
2. See how your form looks to end-users
3. Test field visibility and interactions

## API Routes

### AI Form Generation

- **Endpoint**: `/api/ai`
- **Method**: POST
- **Body**: `{ prompt: string }`
- **Response**: AI-generated form structure in JSON format

## Key Components

### CreateForm.jsx

Handles form creation with AI integration:

- Accepts user descriptions
- Calls AI API to generate form structure
- Saves generated forms to Supabase
- Manages loading and error states

### form.jsx

Main form editing and preview component:

- Displays form fields dynamically
- Provides field editing capabilities
- Toggles between edit and preview modes
- Handles form data submission
- Manages form state and field values

### DownloadPDF.js

Converts forms to PDF documents:

- Uses jsPDF for PDF generation
- Formats form fields and values
- Handles file download

### Dashboard (page.jsx)

Central hub for form management:

- Lists all created forms
- Allows form deletion
- Provides navigation to edit/preview
- Displays form titles and descriptions

## Database Schema (Supabase)

### Ai Form Builder Table

- `id` - Primary key
- `AI response` - JSON structure with form definition
- `created_at` - Timestamp
- `user_id` - Reference to user

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License

## Support

For questions or issues, please open an issue in the repository.
