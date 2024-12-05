
# HIGHWAY_DELITE

This is an internship task project focused on task management. It consists of a frontend built with React (using Vite) and a backend API using Node.js and Express.


## Description
This project provides a web-based task management application with user authentication and email functionality (OTP for verification). The backend is powered by Node.js and Express, while the frontend is built with React and Vite. Data is stored in a MongoDB database.

## Technologies Used
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Others**: Axios for API calls, JWT for authentication

## Setup and Installation

Follow these steps to set up the project on your local machine.

### Clone the repository
```bash
git clone https://github.com/yash095desh/Highway_delite.git
cd Highway_delite
```

### Install Backend Dependencies
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

### Install Frontend Dependencies
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Make sure to create `.env` files in both the backend and frontend with the following variables:

#### Backend `.env` example:
```env
PORT=5000
MONGO_URI=your_mongo_connection_string
SECRET_KEY=your_secret_key
```

#### Frontend `.env` example:
```env
VITE_API_URL=http://localhost:5000
```

## Usage

### Running the Backend
To run the backend server locally:
```bash
cd backend
npm start
```
The backend will be running at `http://localhost:5000`.

### Running the Frontend
To run the frontend development server locally:
```bash
cd frontend
npm run dev
```
The frontend will be running at `http://localhost:5173`.

#Deployment
Backend Deployment
The backend has been deployed to Render:

https://highway-delite-50lc.onrender.com

Frontend Deployment
The frontend has been deployed to Vercel:

https://highway-delite-delta.vercel.app/
