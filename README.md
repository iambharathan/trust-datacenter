# Madrasa Rahmania Arabia Kambipur Trust - Student Management System

A modern React application for managing student information and documents for the Madrasa Rahmania Arabia Kambipur Trust.

## Features

- **Authentication**: Secure login system using Supabase Auth
- **Student Management**: Add, view, edit, and delete student records
- **Document Upload**: Upload and manage student documents (images, PDFs, etc.)
- **Search**: Search students by name, class, or father's name
- **Responsive Design**: Modern, mobile-friendly interface

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Supabase (PostgreSQL database, authentication, file storage)
- **Styling**: Custom CSS (Tailwind-like utilities)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/iambharathan/trust-datacenter.git
cd trust-datacenter
npm install
```

### 2. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. In the Supabase dashboard, go to the SQL Editor
3. Run the SQL script from `supabase-setup.sql` to create the necessary tables and policies
4. Go to Authentication > Settings and configure your authentication preferences
5. Go to Storage and verify that the `student-documents` bucket was created

### 3. Environment Configuration

The Supabase configuration is already set up in `src/lib/supabase.ts` with your provided credentials:
- URL: `https://wonhvsdhdprbwmickxip.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Create Admin User

1. In Supabase dashboard, go to Authentication > Users
2. Click "Add user" to create an admin user
3. Use this user to log in to the application

### 5. Run the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Database Schema

### Students Table
- `id`: UUID (Primary Key)
- `name`: Student's full name
- `age`: Student's age
- `class`: Class/grade
- `father_name`: Father's name
- `mother_name`: Mother's name
- `address`: Home address
- `phone`: Contact phone number
- `email`: Email address (optional)
- `admission_date`: Date of admission
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### Student Documents Table
- `id`: UUID (Primary Key)
- `student_id`: Foreign key to students table
- `document_name`: Original file name
- `document_url`: URL to the stored file
- `uploaded_at`: Upload timestamp

## Usage

1. **Login**: Use the admin credentials to log in
2. **View Students**: See a list of all students with search functionality
3. **Add Student**: Click "Add Student" to create a new student record
4. **View Details**: Click on a student's "View" button to see full details
5. **Upload Documents**: In the student detail page, upload documents using the upload button
6. **Edit Student**: Use the "Edit" button to modify student information
7. **Delete Student**: Use the "Delete" button to remove a student (with confirmation)

## File Upload

The application supports uploading various file types:
- Images: JPG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX

Files are stored securely in Supabase Storage and can be viewed/downloaded from the student detail page.

## Image Display Features

- **Full Image Preview**: Images display completely without cropping
- **Click to View Full Size**: Click any image to open in new tab
- **Proper Aspect Ratio**: Images maintain original proportions
- **Error Handling**: Fallback display if images fail to load

## Security

- Row Level Security (RLS) is enabled on all tables
- Only authenticated users can access the data
- File uploads are restricted to authenticated users
- All database operations require authentication

## Deployment

To deploy the application:

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting provider (Vercel, Netlify, etc.)

3. Make sure to configure environment variables if you move the Supabase configuration to environment variables

## Repository

This project is hosted on GitHub: [https://github.com/iambharathan/trust-datacenter](https://github.com/iambharathan/trust-datacenter)

## Support

For any issues or questions, please contact the system administrator.