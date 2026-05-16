# PeopleDesk 🌐 | IT Asset Management System

PeopleDesk is a modern, enterprise-grade IT Asset Management platform designed to help organizations track, manage, and optimize their hardware inventory. From procurement to employee assignment, PeopleDesk provides a unified interface for Admins, Technicians, and Employees.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/frontend-React-61dafb.svg)
![Node](https://img.shields.io/badge/backend-Node.js-339933.svg)
![Tailwind](https://img.shields.io/badge/styling-TailwindCSS-38b2ac.svg)

---

## 🚀 Key Features

### For Administrators
* **User Management:** Approve, reject, or edit employee access and roles.
* **Asset Inventory:** Full CRUD operations (Create, Read, Update, Delete) for hardware assets.
* **Smart Tracking:** Real-time tracking of which asset is assigned to which employee.
* **Data Export:** Export user and asset lists to CSV/Excel for reporting.

### For Employees
* **Personal Dashboard:** View all assets currently assigned to you.
* **Profile Management:** Secure login and profile viewing.

### Security
* **Protected Routes:** React-based route guarding to prevent unauthorized access.
* **Secure Auth:** Token-based authentication with cookie storage.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Functional Components, Hooks)
* React Router v6 (Routing & Layouts)
* Tailwind CSS (Modern UI/UX Design)
* Lucide React (Iconography)
* React-Toastify (User Notifications)

**Backend:**
* Node.js & Express
* Axios (API communication)
* JWT-Decode (Token handling)

---

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/peopledesk.git](https://github.com/yourusername/peopledesk.git)
    cd peopledesk
    ```

2.  **Install Dependencies**
    ```bash
    # Install frontend dependencies
    npm install

    # Install lucide icons and toastify if not already present
    npm install lucide-react react-toastify
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory and add your API configuration:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Modals, Buttons, etc.)
├── layouts/        # Layout wrappers (AuthLayout, MainLayout)
├── pages/          # Full page components (Dashboard, Inventory, etc.)
├── utils/          # Helper functions (Export to CSV, Logic)
├── assets/         # Images and global styles
└── App.jsx         # Main routing logic and Protected Routes