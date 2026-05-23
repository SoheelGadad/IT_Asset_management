# PeopleDesk: Cloud-Native IT Asset Management System

PeopleDesk is a modern, cloud-native IT Asset Management System (ITAM) designed to eliminate manual tracking gaps in technology startups. By leveraging the MERN stack and Microsoft Azure, this solution provides enterprise-grade asset accountability, real-time health monitoring, and secure role-based access.

## 🌐 Live Demo

You can access the live application here:
**[https://assetmanagementsystem-hkdfe0dzd9gchkbj.centralindia-01.azurewebsites.net/](https://assetmanagementsystem-hkdfe0dzd9gchkbj.centralindia-01.azurewebsites.net/)**

---

## ⚙️ How It Works

The platform follows a secure request-to-fulfillment cycle:

1. **Registration & Admin Approval:** When a new user signs up, their account status is set to `pending`. They must wait for an **Administrator** to review and approve their credentials before they can log in to the dashboard.
2. **Asset Requesting:** Once authorized, employees can browse the inventory and submit a claim for an asset.
3. **Admin Verification:** Administrators receive a notification of the pending request. They review the serial numbers and availability before approving the assignment.
4. **Automatic Provisioning:** Upon approval, the system automatically migrates the asset's status to `Assigned` and records an active assignment link between the user and the hardware.

---

## 🚀 Key Features

* **Circular Logic Flow:** Complete asset lifecycle governance from procurement, verification, and maintenance to retirement.
* **Zero-Trust Security:** JWT-based stateless authentication and Bcrypt password encryption.
* **Role-Based Access (RBAC):** Specialized dashboards for Admins, Employees, and Technicians.
* **Azure Cloud Native:** Hosted on Microsoft Azure with automated CI/CD deployment via GitHub Actions.
* **Scalability:** MongoDB Atlas backend allows seamless scaling from 15 to 150+ users.

## 🛠️ Technology Stack

* **Frontend:** React.js (Vite), Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (NoSQL)
* **Deployment:** Microsoft Azure App Service, GitHub Actions

## 👤 Author

* **Soheel Majid Gadad**
* **Master of Computer Application (MCA)**, Chandigarh University

---

*This project was submitted in partial fulfillment of the requirements for the award of the degree of Master of Computer Application (MCA).*