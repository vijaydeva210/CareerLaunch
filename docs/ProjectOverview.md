# CareerLaunch - Project Overview

Hello Team,

This document explains what we are building, why we are building it, and how everyone will contribute.

Please read the entire document before starting any work.

---

1. WHAT IS CAREERLAUNCH?

---

CareerLaunch is a Placement Preparation and Assessment Platform.

The main goal is to help students prepare for placements from a single platform.

Instead of using multiple websites for:

* Interview Questions
* Aptitude Preparation
* Resume Management
* Technical Assessments
* Progress Tracking

everything will be available in one platform.

---

2. WHY ARE WE BUILDING THIS?

---

Most students prepare for placements using different websites.

For example:

IndiaBix -> Aptitude

GeeksForGeeks -> Technical Questions

Google Drive -> Resume Storage

YouTube -> Learning

Because of this:

* Preparation becomes scattered
* Progress cannot be tracked properly
* Students don't know how much they have completed

Our platform solves this problem.

---

3. USERS IN OUR SYSTEM

---

There are only 2 users.

1. Student/Fresher

2. Admin

We are NOT building Recruiter functionality in Version 1.

---

4. STUDENT FEATURES

---

After login, the student can access:

A. Profile

* View Profile
* Edit Profile

---

B. Resume Management

* Upload Resume
* View Resume
* Download Resume

Resume formats:

* PDF
* DOCX

---

C. Technical Question Bank

Categories:

* HTML
* CSS
* JavaScript
* SQL
* Python
* Django
* DRF
* React
* HR Questions

Student can view questions and answers.

---

D. Company-wise Interview Questions

Examples:

* TCS
* Infosys
* Accenture
* Cognizant
* Wipro
* Capgemini

Student can view commonly reported interview questions.

---

E. Technical Assessments

Technologies:

* HTML
* CSS
* JavaScript
* SQL
* Python
* Django
* DRF
* React

Each test contains MCQ questions.

After submission:

* Score is calculated
* Result is stored

---

F. Placement Readiness Progress

This is one of our main features.

Progress is NOT divided equally.

Example:

HTML = 5%

CSS = 5%

JavaScript = 20%

SQL = 15%

Python = 25%

Django = 10%

DRF = 5%

React = 15%

Total = 100%

Reason:

Some technologies are more important in placements.

For example:

Completing Python should increase progress more than completing HTML.

---

G. Aptitude Learning Section

Contains:

* Quantitative Aptitude
* Logical Reasoning
* Verbal Ability

Students can view aptitude preparation material.

---

H. Aptitude Tests

Students can take aptitude tests.

IMPORTANT:

Aptitude scores do NOT affect Technical Progress.

Technical Progress is calculated only from technical subjects.

---

5. ADMIN FEATURES

---

Admin can:

A. Manage Students

* View Students
* Search Students
* Delete Students

---

B. Manage Question Bank

* Add Questions
* Edit Questions
* Delete Questions

---

C. Manage Assessments

* Create New Tests
* Add Questions
* Modify Questions
* Remove Questions

---

D. Monitor Performance

Admin can view:

* Student Scores
* Progress
* Test Results

---

6. PROJECT ARCHITECTURE

---

The project flow is:

Student
↓
React Frontend
↓
Axios Requests
↓
Django REST APIs
↓
MySQL Database

Explanation:

Frontend:
User interface visible to students and admin.

Backend:
Processes requests and business logic.

Database:
Stores all project data.

---

7. DATABASE TABLES

---

Main tables:

Users

StudentProfile

QuestionBank

Tests

Questions

Results

Technologies

These tables are connected using relationships.

---

8. PROJECT FOLDER STRUCTURE

---

CareerLaunch/

frontend/

backend/

docs/

database/

README.md

---

9. TEAM RESPONSIBILITIES

---

Team Lead:

* Architecture Design
* Database Design
* API Planning
* Integration
* Team Coordination

Frontend Team:

* Login Pages
* Dashboard
* Profile Pages

Backend Team:

* APIs
* Authentication
* Test Management

Question Bank Team:

* Technical Questions
* Company Questions
* Aptitude Questions

Testing Team:

* Testing
* Bug Reporting

Documentation Team:

* PPT
* Project Report
* User Manual

---

10. IMPORTANT RULES

---

Rule 1:

Do not create new features without discussing with the team.

---

Rule 2:

Keep commits meaningful.

Example:

Good:

"Added Login API"

Bad:

"updated"

---

Rule 3:

Before starting work:

git pull

After completing work:

git add .

git commit -m "meaningful message"

git push

---

Rule 4:

Ask questions immediately if stuck.

Do not remain blocked for hours.

---

11. PROJECT GOAL

---

Our goal is not just to complete a college project.

Our goal is to build a project that demonstrates:

* React
* Django
* REST APIs
* MySQL
* Authentication
* Assessments
* Analytics

and can be confidently explained during interviews.

Let's build something we can proudly discuss in placements.
