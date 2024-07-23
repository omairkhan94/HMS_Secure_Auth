# Medical Management System_Secure Authentication and Authorization 

The Medical Management System is a robust backend solution designed to optimize the management of patients, doctors, and appointments in healthcare settings. This system ensures secure authentication, role-based access control, and efficient data handling.

## Key Features

- **User Management:**
  - Secure registration and login for Admin, Doctor, and Patient roles.
  - Role-based access control.

- **Patient Management:**
  - Comprehensive patient registration and information management.

- **Doctor Management:**
  - Doctor registration, department assignment, and profile management.

- **Appointment Management:**
  - Scheduling, conflict detection, and management of patient appointments.

- **Prescription Management:**
  - Creation, update, and retrieval of prescriptions linked to patient and doctor records.

## Technologies Used

- **Node.js** and **Express.js** for server-side development.
- **MongoDB** with **Mongoose** for database management.
- **Cloudinary** for image storage.
- **JWT** and **bcrypt** for authentication and password security.

## Installation

1. **Clone the Repository:**
   
   git clone https://github.com/yourusername/medical-management-system.git
   cd project_directory

 ##  Install Dependencies:
 npm install

 ## Setup Environment Variables: Create a .env file
 PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRES=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
## Run the Server:
nodemon server.js

## API Endpoints
## User Routes
POST /api/v1/user/register: Register a new user.
POST /api/v1/user/login: Login an existing user.


## Patient Routes
// Get patient details.
POST /api/v1/patient/register: Register a new patient.
GET /api/v1/patient/



## Doctor Routes
// Get doctor details.
POST /api/v1/doctor/register: Register a new doctor.
GET /api/v1/doctor/



## Appointment Routes
POST /api/v1/appointment: Schedule a new appointment.
PUT /api/v1/appointment/
 Update an existing appointment.
GET /api/v1/appointment/
 Get appointment details.




## Prescription Routes
POST /api/v1/prescription: Create a new prescription.
PUT /api/v1/prescription/
 Update an existing prescription.
GET /api/v1/prescription/
 Get prescription details.





 
## Contribution
Fork the repository.
Create a new branch for features or bug fixes.
Commit your changes.
Submit a pull request with a detailed description.

## Contact
For any questions or feedback, please contact omairyahya55@gmail.com
Thanks
