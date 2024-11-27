# RBAC Dashboard Project

This is a React-based dashboard application that allows you to manage users. It provides functionalities to add, edit, and delete users with manage permission and roles . The project is built using React.js, Tailwind CSS, Daisy UI , Lottie animations and makes use of an API service for CRUD operations using backend   - API for CRUD operations using Express.js ,Postman ,MongoDB ,Node.js ,MondoDB compass.

## Features

- **User Management**: Add, Edit, and Delete users
- **Responsive UI**: The dashboard is built to be responsive using Tailwind CSS.
- **Authentication**: User authentication with the ability to log out and redirect to the login page.
- **Modal for User Operations**: Add or Edit users in a modal popup.
- **CRUD Operations**: Perform Create, Read, Update, and Delete operations on user data.
- **Role-Based Access**: Manage users with different roles.

## Tech Stack

- **Frontend**:
  - React.js
  - Tailwind CSS
  - Daisy UI
  - Lottie animations
- **Backend**:
  - API for CRUD operations
  - Express.js
  - Postman
  - MongoDB
  - Node.js
  - MondoDB compass
- **Authentication**:
  - Middleware authentication
  - Authcontroller
- **Routing**:
  - Backend authenticated routes
  - User , Permission , Role


## Installation and Setup

### Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```
## Backend Setup
Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:
```bash
npm install
```
Set up the .env file:

Use the provided .env.example file as a template.
Rename .env.example to .env.
Fill in the required environment variables, such as:
```bash
DB_USERNAME=
DB_PASSWORD=
DB_URL=
PORT=5000
JWT_SECRET=
```
Start the backend server:

```bash
npm start
```
The server should now be running at http://localhost:PORT.

Frontend Setup
Navigate to the frontend directory:

```bash
cd ../frontend
```
Install dependencies:

```bash
npm install
```
Start the frontend development server:

```bash
npm start
```
The application should now be running at http://localhost:5701.


