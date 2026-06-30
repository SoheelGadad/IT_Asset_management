# PeopleDesk: Cloud-Native IT Asset Management System

PeopleDesk is an enterprise-grade, cloud-native IT Asset Management System (ITAM) built to streamline hardware lifecycles, eliminate tracking vulnerabilities, and orchestrate automated procurement workflows.

This project was developed and submitted in partial fulfillment of the requirements for the award of the degree of **Master of Computer Application (MCA)** at **Chandigarh University**.

## 🌐 Live Application Link

* **Production Deployment:** [https://assetmanagementsystem-hkdfe0dzd9gchkbj.centralindia-01.azurewebsites.net/](https://assetmanagementsystem-hkdfe0dzd9gchkbj.centralindia-01.azurewebsites.net/)
* * **Qollabb Certificate:** [https://drive.google.com/file/d/1GV2QMDpHDojgm8ZbDxta0hWxxrO28Lid/view?usp=drive_link/](https://drive.google.com/file/d/1GV2QMDpHDojgm8ZbDxta0hWxxrO28Lid/view?usp=drive_link) 

---

## 🏗️ Architectural Overview

The platform uses a decoupled **Client-Server Architecture** orchestrated over a secure network layer. In the production environment, the React client is compiled into static production assets and served seamlessly via the Node/Express backend container to optimize cross-origin security and load times.

### System Flow Diagram

1. **Authentication & Authorization Guard:** Requests are validated using stateless JSON Web Tokens (JWT) cross-referenced against Role-Based Access Control (RBAC) matrices.
2. **State & Database Layer:** Transactions are asynchronously processed by the Express backend and mirrored across multi-region clusters on MongoDB Atlas using Mongoose ODM.
3. **Hardware Lifecycle Fulfillments:** Triggers handle states across assets smoothly (`Warehouse Stock` $\rightarrow$ `Pending Claim` $\rightarrow$ `Active Assigned` $\rightarrow$ `Maintenance/Repair`).

---

## 🚀 Core Features & Technical Engineering

### 1. Advanced Environment Switch Strategy (Cross-Environment Stability)

To prevent build-time variables from causing network failures in cloud environments, the client implements a **Dynamic Environment Isolation Utility** (`src/api.js`).

* **Local Development Configuration:** Routes fall back dynamically to root proxies targeting a local microservice port (`http://localhost:5001`).
* **Cloud Native Production Layout:** Vite compiles out explicit string hardcoding and forces the user's web browser to relative paths (`""`), ensuring endpoints seamlessly map exactly to the dynamically assigned Azure App Service domain.

### 2. Role-Based Access Control Matrix (RBAC)

* **Administrator Node:** Absolute administrative command. Controls profile verification/purging, manual provisioning, and asset modification overrides.
* **Employee Node:** Self-service workspace. Controls individual configuration tracking, profile state mapping, and new device registration/claims processing.
* **Technician Node:** Fleet operational health tier. Direct access to deep maintenance logging history, service updates, and physical hardware verification portals.

### 3. Automated State Synchronization

* When an assignment is deleted, database triggers automatically transition the master asset back to `Unassigned` stock.
* Marking an asset for repair dynamically shifts assignment constraints, notifying stakeholders while preventing unauthorized assignments.

---

## 🛠️ Technology Stack

| Tier | Component | Technology Used |
| --- | --- | --- |
| **Frontend** | View Tier & UI Layer | React.js (Vite Core), Tailwind CSS, Lucide Icons |
| **Backend** | REST API & Core Engine | Node.js, Express.js |
| **Database** | Persistent Storage Tier | MongoDB Atlas, Mongoose ODM |
| **Security** | Identity & Access Control | JWT (Stateless Bearer Tokens), HTTP-Only Cookies, Bcrypt |
| **Hosting** | Cloud Infrastructure | Microsoft Azure App Service (Linux Web App Containers) |
| **DevOps** | Continuous Integration | GitHub Actions, Git Workflows |

---

## 📋 Key REST API Endpoints

### Authentication & Identities (`/api/users`)

* `POST /api/register` — User self-registration (Initializes identity as `pending`).
* `POST /api/login` — Session authentication & JWT generation.
* `GET /api/users` — Fetch entire user directory *(Admin Only)*.
* `PUT /api/users/:id` — Update profile metadata or verify registration state.

### Hardware Inventories (`/api/assets`)

* `GET /api/assets` — Retrieve global hardware fleet list.
* `POST /api/assets` — Provision a new hardware asset node.
* `PUT /api/assets/:id` — Mutate configuration arrays, live status, or technician notes.
* `DELETE /api/assets/:id` — Purge a specific asset record permanently.

### Request Pipelines (`/api/requests`)

* `POST /api/requests` — Submit an automated claim or procurement request.
* `GET /api/requests/pending` — Poll active request queues *(Admin Notification Tracker)*.
* `PUT /api/requests/:id` — Approve or reject pending lifecycle tokens.

---

## 🔧 Local Installation & Deployment Guide

Follow these steps to spin up a local instance of the application for debugging and evaluation:

### Prerequisites

* Node.js (v18.x or higher)
* NPM (v9.x or higher)
* MongoDB Atlas Connection String (or local MongoDB instance)

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/SoheelGadad/IT_Asset_management.git
cd PeopleDesk

# Install backend root dependencies
npm install

# Navigate to client directory and install frontend dependencies
cd client
npm install

```

### 2. Configure Environment Variables

Create a `.env` file in the **root directory** (backend):

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/PeopleDesk
JWT_SECRET=your_super_secret_jwt_encryption_key
NODE_ENV=development

```

Create a `.env` file in the **client directory** (frontend):

```env
VITE_API_URL=http://localhost:5001

```

### 3. Execution Coordinates

To run the system simultaneously in a local development cluster:

```bash
# In the root backend directory:
npm run dev

# Open a new terminal instance in the client folder:
npm run dev

```

* **Frontend UI Endpoint:** `http://localhost:5173`
* **Backend Core Port:** `http://localhost:5001`

---

## 👤 Developer Profile

* **Developer:** Soheel Majid Gadad
* **Academic Specialization:** Master of Computer Application (MCA)
* **Institution:** Chandigarh University

---

*This software was designed, engineered, and deployed independently using strict Agile software engineering methodologies for academic evaluation.*
