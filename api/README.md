# Task Manager API

This is the backend API for the Task Manager application. It provides endpoints for managing tasks and lists, as well as user authentication.

## Features

- User authentication with JWT
- CRUD operations for tasks and lists
- RESTful API design

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (optional):
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=3000
     NODE_ENV=development
     ```

### Running the Application

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication

- `POST /users` - Register a new user
- `POST /users/login` - Login a user
- `GET /users/me/access-token` - Get a new access token using refresh token

### Lists

- `GET /lists` - Get all lists
- `POST /lists` - Create a new list
- `GET /lists/:id` - Get a specific list
- `PATCH /lists/:id` - Update a list
- `DELETE /lists/:id` - Delete a list

### Tasks

- `GET /lists/:listId/tasks` - Get all tasks in a list
- `POST /lists/:listId/tasks` - Create a new task in a list
- `GET /lists/:listId/tasks/:taskId` - Get a specific task
- `PATCH /lists/:listId/tasks/:taskId` - Update a task
- `DELETE /lists/:listId/tasks/:taskId` - Delete a task

## Deployment

This API can be deployed to services like Render, Heroku, or any other Node.js hosting platform.

## License

ISC 