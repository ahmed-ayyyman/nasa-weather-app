# 🌤️ NASA Weather App

A comprehensive weather probability API with user authentication and search history tracking. This application provides historical weather data analysis with secure user management and personalized search tracking.

## ✨ Features

### 🔐 Authentication System

- **User Registration**: Secure user registration with username and password validation
- **User Login**: JWT token-based authentication with secure password hashing
- **Password Security**: bcryptjs encryption for secure password storage
- **Session Management**: Express sessions for enhanced security
- **Protected Routes**: All weather data endpoints require authentication

### 📊 Weather Data Analysis

- **Historical Weather Probability**: Calculate probability of extreme weather conditions
- **Location-based Analysis**: Weather data for specific coordinates
- **Multiple Weather Types**: Support for temperature, rain, wind, and snow analysis
- **Threshold-based Queries**: Customizable weather condition thresholds
- **Monthly Analysis**: Month-specific weather probability calculations

### 📈 Search History Tracking

- **Automatic Tracking**: All weather searches are automatically saved
- **Detailed History**: Stores location, parameters, results, and timestamps
- **User-specific Data**: Each user has their own search history
- **Smart Storage**: Keeps last 50 searches to prevent unlimited growth
- **Chronological Order**: Most recent searches displayed first

### 🛡️ Security Features

- **Password Validation**: Minimum 6 characters required
- **Unique Usernames**: Prevents duplicate user registrations
- **JWT Tokens**: Secure token-based authentication
- **Database Connection Validation**: Graceful handling of database issues
- **Error Handling**: Comprehensive error messages and status codes

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nasa-weather-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up MongoDB**

   **Option A: Local MongoDB**

   ```bash
   # Install MongoDB Community Server
   # Download from: https://www.mongodb.com/try/download/community

   # Start MongoDB service (Windows)
   net start MongoDB

   # Set environment variable
   set MONGODB_URI=mongodb://localhost:27017/nasa-weather-app
   ```

   **Option B: MongoDB Atlas (Cloud)**

   ```bash
   # Create free account at https://cloud.mongodb.com/
   # Create a new cluster
   # Get your connection string
   set MONGODB_URI=your_mongodb_atlas_connection_string
   ```

4. **Start the server**

   ```bash
   npm start
   ```

5. **Verify installation**
   ```bash
   # Test server is running
   curl http://localhost:5000
   ```

## 📦 Dependencies

### Core Dependencies

- **express**: ^4.18.2 - Web framework for Node.js
- **mongoose**: ^7.5.0 - MongoDB object modeling for Node.js
- **mongodb**: ^6.20.0 - MongoDB driver for Node.js

### Authentication Dependencies

- **bcryptjs**: ^2.4.3 - Password hashing library
- **jsonwebtoken**: ^9.0.2 - JWT token generation and verification
- **express-session**: ^1.17.3 - Session management middleware

### Development Dependencies

- **node**: v14+ - JavaScript runtime environment

## 🔧 API Endpoints

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "your_username"
  }
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "your_username"
  }
}
```

### Weather Data Endpoints

#### Get Weather Probability

```http
POST /weather/probability?lat=40.7128&lon=-74.0060
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "month": 7,
  "weatherType": "temp",
  "threshold": 30
}
```

**Response:**

```json
{
  "probability": 0.75
}
```

### User History Endpoints

#### Get Search History

```http
GET /user/history
Authorization: Bearer <your_jwt_token>
```

**Response:**

```json
{
  "searchHistory": [
    {
      "lat": 40.7128,
      "lon": -74.006,
      "month": 7,
      "weatherType": "temp",
      "threshold": 30,
      "probability": 0.75,
      "searchedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## 🧪 Usage Examples

### 1. Register a New User

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "password123"}'
```

### 2. Login and Get Token

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "password123"}'
```

### 3. Get Weather Probability (with authentication)

```bash
curl -X POST "http://localhost:5000/weather/probability?lat=40.7128&lon=-74.0060" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"month": 7, "weatherType": "temp", "threshold": 30}'
```

### 4. Get User Search History

```bash
curl -X GET http://localhost:5000/user/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏗️ Project Structure

```
nasa-weather-app/
├── models/
│   ├── Weather.js          # Weather data model
│   └── User.js             # User model with authentication
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
├── seed.js                 # Database seeding script
└── README.md               # This file
```

## 🔒 Security Considerations

- **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **Input Validation**: Comprehensive validation for all user inputs
- **Database Security**: MongoDB connection with proper error handling
- **Session Management**: Secure session configuration

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/nasa-weather-app
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key

# Server Port (optional)
PORT=5000
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   ```
   Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.b7jge59.mongodb.net
   ```

   **Solution**: Check your MongoDB connection string or use a local MongoDB instance.

2. **Module Not Found Error**

   ```
   Error: Cannot find module 'jsonwebtoken'
   ```

   **Solution**: Run `npm install` to install all dependencies.

3. **Database Connection Not Available**
   ```
   Database connection not available. Please check your MongoDB connection.
   ```
   **Solution**: Ensure MongoDB is running and the connection string is correct.

### Database Setup

**Local MongoDB:**

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**MongoDB Atlas:**

1. Create account at https://cloud.mongodb.com/
2. Create a new cluster
3. Get connection string
4. Set MONGODB_URI environment variable

## 📊 Database Schema

### User Schema

```javascript
{
  username: String (unique, required),
  password: String (hashed, required),
  searchHistory: [{
    lat: Number,
    lon: Number,
    month: Number,
    weatherType: String,
    threshold: Number,
    probability: Number,
    searchedAt: Date
  }],
  createdAt: Date
}
```

### Weather Schema

```javascript
{
  lat: Number,
  lon: Number,
  date: Date,
  temp: Number,
  rain: Number,
  wind: Number,
  snow: Number
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Ensure all dependencies are installed
4. Verify MongoDB connection

## 🔄 Version History

- **v1.0.0**: Initial release with basic weather probability API
- **v2.0.0**: Added user authentication and search history tracking
- **v2.1.0**: Enhanced error handling and security features

---

**Made with ❤️ for weather data analysis and user experience**
