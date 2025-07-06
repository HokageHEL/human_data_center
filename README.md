# Human Data Center

A comprehensive web application for managing military personnel data with a focus on privacy and efficiency.

## Features

### Personnel Management
- Create, edit, and delete personnel records
- Track military ranks and positions
- Manage personal information and documents
- Photo upload and management
- Document attachment support

### Advanced Filtering and Sorting
- Filter by multiple criteria:
  - Military rank
  - Position rank
  - Unit/Department
  - Gender
  - Fitness status
  - Combat experience
  - PPD status
- Sort by various fields including name, rank, and completion status

### Status Tracking
- Personnel presence monitoring
- Birthday tracking
- Contract expiration tracking
- Service status monitoring (leave, medical treatment, etc.)

### Data Persistence
- SQLite database for reliable local data storage
- Automatic data backup and recovery
- Document and photo storage

## Technology Stack

- Frontend: React + TypeScript + Vite
- UI Components: Shadcn UI
- Styling: Tailwind CSS
- Backend: Node.js + Express.js
- Database: SQLite3

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd human-data-center
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
node backend/server.js
```

4. In a new terminal, start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:8081
```

## Project Structure

```
├── backend/          # Express.js backend server
├── database/         # SQLite database files
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions and services
│   ├── pages/        # Page components
│   └── types/        # TypeScript type definitions
```

## Development

- The frontend runs on port 8081
- The backend API runs on port 3000
- SQLite database is stored in `database/mydata.sqlite`

## Security

- Local-only application for enhanced data privacy
- No external dependencies for data storage
- Secure document and photo handling
