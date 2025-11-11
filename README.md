# Todo API

A RESTful API built with Node.js, Express, and MongoDB for managing user authentication and profiles with file upload functionality.

## Features

- 🔐 User authentication (register/login) with JWT
- 👤 User profile management
- 🖼️ Profile image upload with Multer
- 🔒 Protected routes with middleware
- 📄 Pagination support
- 🔑 Password change functionality
- 📋 User listing and management

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB installed and running locally
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your_jwt_secret_here
```

## Running the Application

Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000` (or the port specified in your .env file).

## API Endpoints

### Authentication

#### Register a new user
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

#### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### User Profile (Protected Routes)

All profile routes require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get user profile
```
GET /api/users/profile
```

#### Update user profile
```
PUT /api/users/updateProfile
Content-Type: multipart/form-data

Fields:
- name (optional)
- email (optional)
- phone (optional)
- profileImage (optional, image file)
```

#### Change password
```
PUT /api/users/changePassword
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### User Management (Protected Routes)

#### Get users list
```
GET /api/users/usersList
Query parameters:
- page (optional, default: 1)
- limit (optional, default: 10)
```

#### Delete user
```
DELETE /api/users/deleteUser/:id
```

### Development/Testing

#### Add dummy users (for testing)
```
GET /api/users/add-dummy-users
```

## File Upload

Profile images are stored in the `uploads/avatars/` directory. Supported formats:
- JPEG
- JPG
- PNG
- GIF

Access uploaded files via: `http://localhost:5000/uploads/avatars/<filename>`

## Project Structure

```
todo-api/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   └── userController.js  # User-related business logic
├── middleware/
│   └── authMiddleware.js  # JWT authentication middleware
├── models/
│   └── userModel.js       # User schema and model
├── routes/
│   └── userRoutes.js      # API route definitions
├── uploads/
│   └── avatars/           # Uploaded profile images
├── .env                   # Environment variables (not in repo)
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
└── server.js              # Application entry point
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- File type validation for uploads
- CORS enabled

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

## Author

Your Name

## Support

For support, email your-email@example.com or open an issue in the repository.
