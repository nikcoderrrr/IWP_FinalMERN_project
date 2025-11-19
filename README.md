# Hostel Complaint and Maintenance System

A full-stack MERN application designed to streamline hostel operations, focusing on complaint lodging, maintenance task tracking, and user management.

## 🚀 Technologies & Tools Used

### Frontend
* **React (v19):** JavaScript library for building the user interface.
* **React Router DOM:** For handling client-side navigation and routing.
* **Axios:** For making HTTP requests to the backend API.
* **GSAP:** Used for creating high-performance animations.
* **React Scripts:** Configuration and scripts for the Create React App environment.

### Backend
* **Node.js & Express.js:** Server-side runtime and framework for building the REST API.
* **MongoDB & Mongoose:** NoSQL database and Object Data Modeling (ODM) library.
* **Google GenAI:** Integration with Google's AI models (likely for complaint analysis or automated assistance).
* **JWT (JSON Web Tokens):** For secure user authentication and session management.
* **BcryptJS:** For hashing and securing user passwords.
* **Dotenv:** For managing environment variables.
* **Nodemon:** Utility for automatically restarting the server during development.

## ✨ Features

Based on the project structure, the system includes:

* **User Authentication:** Secure login and registration for different user roles (Students and Wardens).
* **Role-Based Dashboards:**
    * **Student Dashboard:** Allows students to file new complaints and view status updates.
    * **Warden Dashboard:** Allows wardens to view, manage, and resolve complaints.
* **Complaint Management:** A dedicated system for filing and tracking hostel complaints.
* **Maintenance Tracking:** Features to define and manage maintenance tasks (`maintenanceController`).
* **AI Integration:** Utilizes Google GenAI to assist with complaint processing or user interaction.

## 🛠️ Setup & Installation

1.  **Clone the repository.**
2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```
4.  **Environment Setup:**
    * Ensure you have a `.env` file in the `backend` directory with your MongoDB URI, JWT Secret, and Google API Key.

## ▶️ How to Run

You can start the project using the automated script provided in the root directory, or manually:

**Manual Method:**
1.  **Backend:** Open a terminal, `cd backend`, and run `npm run dev`.
2.  **Frontend:** Open a second terminal, `cd frontend`, and run `npm start`.

The frontend will typically run on `http://localhost:3000` and the backend on `http://localhost:5000`.