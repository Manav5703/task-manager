# Task Manager Application

## Live Demo
You can view the live version of the web application at [https://tasknexlify.netlify.app/](https://tasknexlify.netlify.app/).

A full-stack task management application built with Angular and Node.js.

## Features

- User authentication (signup, login, logout)
- Create, read, update, and delete task lists
- Create, read, update, and delete tasks within lists
- Mark tasks as completed/incomplete
- Responsive design for mobile and desktop

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
