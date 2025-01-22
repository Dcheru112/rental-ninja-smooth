# Rental Ninja Smooth

Rental Ninja Smooth is a comprehensive rental management web application that allows property managers, owners, and tenants to handle various aspects of property management, including property listing, maintenance requests, payment management, and user administration.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Live Demo](#live-demo)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Description

Rental Ninja Smooth aims to streamline property management tasks by providing a user-friendly interface and powerful tools for administrators, property owners, and tenants. The application supports the following functionalities:
- Property management and listing
- Maintenance request submission and tracking
- Payment management and tracking
- User administration and role-based access control

## Features

### Admin Dashboard
- Complete system oversight
- User management capabilities
- Access to system-wide statistics
- Property and maintenance request monitoring
- Payment tracking and management

### Owner Dashboard
- Property portfolio management
- Tenant oversight and communication
- Maintenance request handling
- Payment tracking and reporting
- Property statistics and analytics

### Tenant Dashboard
- Unit-specific dashboard
- Maintenance request submission and tracking
- Rent payment processing
- Property information access
- Communication with property owners

### Property Dashboard
- Comprehensive property statistics
- Tenant information management
- Payment status tracking
- Maintenance history
- Occupancy tracking

## Live Demo

Experience Rental Ninja Smooth in action: [Live Demo](https://lovable.dev/projects/ce558d0e-16ec-4c9d-b45d-677c6ddf4c29)

## Installation

To get started with Rental Ninja Smooth, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/dcheru112-rental-ninja-smooth.git
   cd dcheru112-rental-ninja-smooth
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update the necessary environment variables

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Usage

### User Roles

1. **Administrator**:
   - Access the admin dashboard at `/admin`
   - Manage users, properties, and system settings
   - Monitor system-wide statistics

2. **Property Owner**:
   - Navigate to the owner dashboard
   - Add and manage properties
   - Handle maintenance requests
   - Track payments and occupancy

3. **Tenant**:
   - Access the tenant portal
   - Submit maintenance requests
   - Process rent payments
   - View property information

## File Structure

```
rental-ninja-smooth/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── ui/
│   │   └── shared/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── public/
└── tests/
```

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Router DOM
- React Query

### Backend (Supabase)
- PostgreSQL
- Row Level Security
- Real-time Subscriptions
- Authentication
- Storage

### Development Tools
- ESLint
- Prettier
- Git
- npm

## Contributing

We welcome contributions to Rental Ninja Smooth! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/yourusername/dcheru112-rental-ninja-smooth](https://github.com/yourusername/dcheru112-rental-ninja-smooth)

Live Demo: [https://lovable.dev/projects/ce558d0e-16ec-4c9d-b45d-677c6ddf4c29](https://lovable.dev/projects/ce558d0e-16ec-4c9d-b45d-677c6ddf4c29)

For questions or feedback, please open an issue in the GitHub repository.