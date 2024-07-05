# Weather Application

This Weather Application is built using React with Vite, providing a fast and efficient development experience. It features user registration, login, and the ability to view weather data. The application ensures a seamless user experience with persistent sessions and protected routes.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## Features

- **User Registration and Login**: Securely register and log in users. User data is stored using a JSON server.
- **Weather Data Display**: Fetch and display weather data for various locations.
- **Persistent User Sessions**: User sessions are maintained even after the page is refreshed, ensuring a seamless experience.
- **Protected Routes**: Some routes are accessible only to authenticated users, enhancing the application's security.

## Components

- `Login`: Handles user login, including input validation and error handling.
- `Register`: Manages user registration.
- `Weather`: Displays weather data for the user's selected location.
- `ProtectedRoute`: Guards certain routes to ensure they are accessible only to authenticated users.

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

This project uses the `concurrently` library to run both the React application and the JSON server simultaneously. To start the application, execute:

```bash
npm run dev
```

This command starts the JSON server on port 3000 and the React application. If the JSON server starts on a different port, please update the fetch URLs in the application accordingly.

## Usage

- **Registration**: Navigate to the registration page to create a new user account.
- **Login**: Log in using your registered credentials to access the weather data.
- **View Weather**: Once logged in, you can view the weather data for your current location or search for other locations.

## Screenshots

- **Login Page**

  ![Login Page](path/to/login_page_screenshot.png)

- **Registration Page**

  ![Registration Page](path/to/registration_page_screenshot.png)

- **Weather Data Page**

  ![Weather Data Page](path/to/weather_data_page_screenshot.png)

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Ensure to replace placeholders (like `<repository-url>`, `<project-directory>`, and `path/to/...`) with actual values relevant to your project.