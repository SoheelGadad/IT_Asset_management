# React + Vite

This is a comprehensive guide based on your **IT Asset Management System** (PeopleDesk). This documentation is structured to help you with your MCA project report and final presentation.

---

## 📄 Section 1: User Manual (Employee & Technician)

### 1. Registration & Access
* **Sign Up:** New users must create an account via the `/sign-up` page. You must provide a unique username, email, and choose a role (Employee/Admin).
* **Approval Pending:** After signup, the account enters a `pending` state. You cannot log in until an Administrator approves your request.
* **Login:** Once approved, use your email and password at the `/login` page to access your specific portal.

### 2. Employee Portal
* **Dashboard Overview:** Displays a personalized welcome message and your User ID.
* **My Assets:** A dedicated table showing all hardware (Laptops, Monitors, etc.) currently assigned to you, including the date they were issued.
* **Security:** Access the **Logout** button to safely end your session and clear secure cookies.

### 3. Technician Portal
* **Maintenance Logs:** Technicians can access the `AddAssetForm` to log maintenance schedules.
* **Update Status:** Change asset conditions from `Active` to `Repair` or `Inactive` to keep the inventory data accurate.

---

## 👑 Section 2: Admin Manual

### 1. System Overview Dashboard
* **Real-time Analytics:** View total asset counts and total registered users.
* **Module Navigation:** Quick links to manage the Inventory, Users, or Tracking details.

### 2. User Management
* **Pending Requests:** View a list of all new signups. Admins can click the **CheckCircle** (Approve) or **XCircle** (Reject) icons.
* **Modify Users:** Edit existing user roles (e.g., promoting an Employee to Admin) or delete inactive accounts.
* **OTP Generation:** Generate temporary passwords for users who have forgotten their credentials.

### 3. Inventory Control
* **Register Assets:** Use the "Add New Asset" form to enter Serial Numbers, Model names, and Warranty details.
* **Lifecycle Tracking:** Every asset can be assigned to a specific Employee via a dropdown menu or left as "Unassigned" (In Stock).

---

## ⚙️ Section 3: Technical Report (Code Flow & Architecture)

### 1. The Full-Stack Architecture
The application follows the **MERN** stack architecture (MongoDB, Express, React, Node.js) and is containerized using **Docker** for cloud deployment on **Render**.



### 2. Core Code Flow (Authentication Example)

1.  **Frontend Request:** The `LoginPage.jsx` sends a `POST` request to `${API_BASE_URL}/api/login` using the `credentials: 'include'` flag.
2.  **Backend Verification:** `auth.js` queries the **MongoDB** `AdminUser` collection to check the email and verify the **bcrypt** hashed password.
3.  **Token Generation:** If valid, the backend creates a **JWT (JSON Web Token)** containing the `userId` and `role`.
4.  **Cookie Issuance:** The server sends the token back via a **Secure, SameSite=None** cookie named `Authtoken`.
5.  **Route Protection:** The `ProtectedRoute.jsx` component intercepts every navigation, decodes the cookie using `jwt-decode`, and ensures the user's `role` matches the `allowedRoles` for that page.

### 3. Environment Synchronization
* **Local Development:** Uses `http://localhost:5001` as the backend target.
* **Production (Render):** Uses `import.meta.env.VITE_API_URL` to dynamically point the Frontend to the live API URL.

---

## 📊 Section 4: Database Schema (Summary)

| Collection | Key Fields | Purpose |
| :--- | :--- | :--- |
| **AdminUsers** | `userId`, `username`, `email`, `role`, `status` | Stores all user accounts and approval states. |
| **Assets** | `assetId`, `assetName`, `serialNumber`, `warranty`, `location` | Main hardware inventory records. |
| **Assignments** | `userId`, `assetId`, `assignmentDate` | Mapping table to link users to hardware. |

---

### Final Project Checklist for Report:
* [x] **Security:** Password Hashing (Bcrypt) & Token Authorization (JWT).
* [x] **Cloud Ready:** Dockerized Nginx UI & Node.js API.
* [x] **State Management:** React Hooks (`useState`, `useEffect`) for real-time UI updates.
* [x] **Responsiveness:** Tailwind CSS and Lucide-React icons for modern UI/UX.

**Would you like me to help you format this into a professional PDF structure or help you write the "Conclusion" and "Future Scope" sections for your MCA project report?**
