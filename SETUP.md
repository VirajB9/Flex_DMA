# FlexCRM Setup & Installation Guide

This document outlines everything you need to download and install to run the FlexCRM project (both the Frontend and the Backend) on your local machine.

## 1. Backend Requirements (Spring Boot)
The backend is a Java-based Spring Boot application.

*   **Java Development Kit (JDK) 17**
    *   The project specifically requires Java 17. 
    *   *Download*: [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) or [Eclipse Temurin (Adoptium)](https://adoptium.net/temurin/releases/?version=17).
*   **MongoDB**
    *   The backend uses MongoDB as its NoSQL database.
    *   *Download*: [MongoDB Community Server](https://www.mongodb.com/try/download/community).
    *   *Optional but highly recommended*: Download [MongoDB Compass](https://www.mongodb.com/products/compass) which provides a great visual user interface to see your database collections.

## 2. Frontend Requirements (React + Vite)
The frontend is built using React, TypeScript, and Vite.

*   **Node.js**
    *   You need Node.js (version 18 or higher is recommended) to run the development server and install packages.
    *   *Download*: [Node.js Official Website](https://nodejs.org/) (Choose the "LTS" version).
*   **npm (Node Package Manager)**
    *   You do not need to download this separately; it comes pre-installed automatically when you install Node.js.

## 3. General Development Tools (Highly Recommended)
*   **Git**: To clone and push code to your GitHub repository.
    *   *Download*: [Git](https://git-scm.com/downloads)
*   **Code Editors (IDE)**:
    *   For Frontend: [Visual Studio Code (VS Code)](https://code.visualstudio.com/) is the industry standard.
    *   For Backend: [IntelliJ IDEA Community Edition](https://www.jetbrains.com/idea/download/) is highly recommended for Java/Spring Boot development.

---

## Quick Start Guide: How to Run the App

Once you have installed the tools above, follow these steps to run the application locally.

### Step 1: Clone the Repository
```bash
git clone git@github.com:coderbhaai/sb_amitkk.git
cd sb_amitkk
```

### Step 2: Start the Database
Ensure your local MongoDB server is running in the background. (By default, Spring Boot looks for it at `mongodb://localhost:27017/digital_marketing_agency`).

### Step 3: Start the Backend
Open a terminal inside the project folder and navigate to the backend:
```bash
cd DMA-backend
```
Then run the Gradle wrapper (no need to install Gradle manually, the wrapper handles it):
*   **Mac/Linux:** `./gradlew bootRun`
*   **Windows:** `gradlew.bat bootRun`

*The backend API will start running at `http://localhost:8080`.*

### Step 4: Start the Frontend
Open a **new** terminal tab, go to the root project folder, and navigate to the frontend:
```bash
cd DMA-frontend
```
Install the JavaScript dependencies:
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```

*The frontend UI will start running at `http://localhost:5173`. Open this link in your browser to view the app!*
