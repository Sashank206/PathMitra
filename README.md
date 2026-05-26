# Path Mitra - Your Smart Employment Companion

Path Mitra is a modern, responsive, and user-friendly platform designed to help users navigate their career path through a guided step-by-step assistance module.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS (Vite)
- **Backend**: Laravel (REST API)
- **Database**: MySQL
- **Authentication**: Laravel Sanctum

## Project Structure
- `frontend/`: React application.
- `backend/`: Laravel application.

## Getting Started

### 1. Database Setup
Since you are using Windows, if you are using XAMPP or a similar server:
1. Open phpMyAdmin (or your preferred MySQL client).
2. Create a new database named `pathmitra`.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies (already installed but good to verify):
   ```bash
   composer install
   ```
3. Run the migrations to create the required tables:
   ```bash
   php artisan migrate
   ```
4. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   The backend will be available at `http://localhost:8000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at the URL provided by Vite (usually `http://localhost:5173`).

## Key Features Implemented
- **Stunning UI**: The application features a beautiful, dynamic, and professional design using Tailwind CSS.
- **Guided Navigation System**: A step-by-step questionnaire that recommends the best career path based on the user's qualifications, experience, and interests.
- **User Dashboard**: A personalized dashboard for users to track their applications, saved jobs, and profile completion.
- **RESTful API**: Laravel backend with configured models, migrations, and controllers for Jobs and Authentication.
- **Authentication Pages**: Beautiful and responsive login and registration pages.

Enjoy building your career with Path Mitra!
