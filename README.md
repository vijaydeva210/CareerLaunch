# 🚀 CareerLaunch

**A Full-Stack Technical Readiness & Assessment Platform**

CareerLaunch is a comprehensive EdTech platform designed to prepare engineering students for high-tier professional placements, specifically targeting the TCS NQT and Infosys recruitment exams. It provides a structured pathway from learning core concepts to taking secure assessments and tracking overall career readiness.

## ✨ Core Features

* **The Learning Hub:** A structured curriculum center covering Python, Full-Stack development, and core engineering principles.
* **Assessment Center:** Secure, timed testing environments to validate technical knowledge and simulate real-world recruitment exams.
* **Readiness Dashboard:** Real-time tracking of student progress, completion rates, and an aggregated exam readiness score.
* **Unified Career Profile:** A centralized student hub for managing academic details and an integrated Cinematic Document Viewer for PDF resumes.
* **Admin Control Center:** A secure portal for administrators to manage the student roster, including instant "soft-delete" suspension capabilities to protect data integrity without destroying records.

## 🛠️ Technical Architecture

This application is built with a decoupled frontend and backend architecture, connected via a RESTful API.

**Frontend Engine:**
* React.js
* Tailwind CSS (Styling & Dark Mode UI)
* React Router (Client-side routing)
* Axios (API Integration)

**Backend Engine:**
* Django & Django REST Framework (DRF)
* MySQL (Relational Database)
* JSON Web Tokens (JWT Authentication)
* Django FileField (Secure media handling for Resumes)

## ⚙️ Local Development Setup

Follow these steps to run the application locally on your machine.

### 1. Database Configuration
Ensure MySQL Server is running on your machine. Create an empty database:
```sql
CREATE DATABASE careerlaunch_db;