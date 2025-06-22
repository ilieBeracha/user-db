# Modelyo Server

This is the backend server for the Modelyo project. It provides a RESTful API for managing resources.

## Features

- **Model Management:** Create, update, and delete models.
- **Application Builder:** Add multiple models to each application.
- **Docker Integration:** Manages Docker containers for model deployment.
- **User Authentication:** Secure user login and session management using JWT.
- **API Documentation:** Automatically generated API documentation with Swagger.

## Core Technologies

- **Nest.js**: A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- **TypeScript**: A statically typed superset of JavaScript.
- **TypeORM**: A TypeScript ORM for PostgreSQL, MariaDB, MySQL, and more.
- **PostgreSQL**: A powerful, open source object-relational database system.
- **Swagger**: A tool for API documentation.
- **Dockerode**: A Node.js module for interacting with the Docker Remote API.

## Getting Started

To get the project up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/modelyo-server.git
    cd modelyo-server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the necessary environment variables (e.g., database connection string, JWT secret).

4.  **Run the development server:**
    ```bash
    npm run start:dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application (or the API endpoint).

## Learn More

To learn more about Nest.js, take a look at the following resources:

- [Nest.js Documentation](https://docs.nestjs.com/) - learn about Nest.js features and API.
- [Nest.js GitHub repository](https://github.com/nestjs/nest) - your feedback and contributions are welcome!
# base-server-auth
