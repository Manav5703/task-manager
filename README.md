# Task Manager Application

A full-stack task management application built with Angular and Node.js.

## Features

- User authentication (signup, login, logout)
- Create, read, update, and delete task lists
- Create, read, update, and delete tasks within lists
- Mark tasks as completed/incomplete
- Responsive design for mobile and desktop

## Deployment Instructions

### Frontend Deployment (Netlify)

1. Install Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```
   netlify login
   ```

3. Build and deploy:
   ```
   npm run deploy:netlify
   ```
   
   Or manually:
   ```
   npm run build:prod
   netlify deploy --prod
   ```

4. Alternatively, deploy via Netlify website:
   - Go to [Netlify](https://www.netlify.com/)
   - Sign up or log in
   - Drag and drop the `dist/frontend` folder to deploy
   - Or connect your GitHub repository for continuous deployment

### Backend Deployment

1. Deploy your backend API to a service like:
   - [Render](https://render.com/)
   - [Railway](https://railway.app/)
   - [Heroku](https://www.heroku.com/)

2. Update the API URL in `environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-backend-api.com'
   };
   ```

3. For MongoDB, use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting.

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend:
   ```
   npm start
   ```
4. Start the backend:
   ```
   npm run server:dev
   ```

## Technologies Used

- **Frontend**: Angular, SCSS, Bulma CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Project Structure

The project is organized into two main components:

- `frontend/`: Contains the client-side application built with Angular
- `api/`: Contains the server-side application

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Manav5703/task-manager.git
   cd task-manager
   ```

2. Install API dependencies:
   ```bash
   cd api
   npm install
   ```

3. Install Frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create `.env` file in the api directory
   - Create `environment.ts` and `environment.prod.ts` files in the frontend/src/environments directory

### Running the Application

1. Start the API server:
   ```bash
   cd api
   nodemon app.js
   ```

2. Start the Frontend development server:
   ```bash
   cd frontend
   ng serve
   ```

The application will be available at:
- Frontend: http://localhost:4200

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Manav Patel - [GitHub](https://github.com/Manav5703) 
