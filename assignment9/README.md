# Reading List Application

A full-stack Reading List management web application built with **React (Vite)** on the frontend and **Express 5 (Node.js)** on the backend. Users can search, filter, sort, add, edit, rate, and delete books with live library statistics.

---

## Project Structure

```text
assignment9/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Fetch API wrapper functions (books.js)
│   │   ├── components/     # UI components (StatsPanel, BookForm, BookItem)
│   │   ├── App.jsx         # Main application state and views
│   │   └── main.jsx        # React entry point
│   ├── .env.example        # Environment variable template
│   └── package.json
├── server/                 # Express 5 REST API backend
│   ├── bookStore.js        # In-memory data store and CRUD operations
│   ├── validate.js         # Input validation and ID parsing
│   ├── server.js           # Express API routes and middleware
│   └── package.json
├── .gitignore
└── README.md

Prerequisites
-Node.js (v18 or higher).
-npm.

Setup & Running Instructions1
 
 1.Start the Backend Server
 Open a terminal, navigate to the server directory, install dependencies, and start the server:
 Bash
 cd server
npm install
npm start

The API server will run on http://localhost:3000.2.

2.Configure & Start the Frontend Client
Open a second terminal, navigate to the client directory, copy .env.example to .env, install dependencies, and start the development server:
Bash
cd client
Copy-Item .env.example .env
npm install
npm run dev
The frontend application will run on http://localhost:5173.

3.Environment Variables
Create a .env file inside client/ based on client/.env.example:VariableDefault ValueDescriptionVITE_API_URLhttp://localhost:3000Base URL for the Express backend APIAPI Endpoints ReferenceMethodEndpointDescriptionGET/api/booksRetrieve books with optional query filters (q, genre, read, sort, order, limit, page)GET/api/books/:idRetrieve a single book by its positive integer IDGET/api/statsRetrieve total books, read/unread counts, average rating, and breakdown by genrePOST/api/booksCreate a new book entryPUT/api/books/:idFully replace an existing book recordPATCH/api/books/:idPartially update fields (e.g., read status or rating)DELETE/api/books/:idDelete a book by ID

Testing the API with
curlWith the backend server running on port 3000, verify the endpoints using curl.exe in Windows PowerShell:

1. Get filtered and sorted booksPowerShellcurl.exe -i "http://localhost:3000/api/books?genre=science&sort=year&order=desc"
2. Get library statisticsPowerShellcurl.exe -i "http://localhost:3000/api/stats"
3. Create a new book (POST)PowerShellcurl.exe -i -X POST "http://localhost:3000/api/books" -H "Content-Type: application/json" -d "{\"title\":\"Clean Code\",\"author\":\"Robert C. Martin\",\"year\":2008,\"genre\":\"non-fiction\",\"read\":true,\"rating\":5}"
4. Partially update a book (PATCH)PowerShellcurl.exe -i -X PATCH "http://localhost:3000/api/books/4" -H "Content-Type: application/json" -d "{\"read\":true,\"rating\":4}"
5. Fully replace a book (PUT)PowerShellcurl.exe -i -X PUT "http://localhost:3000/api/books/4" -H "Content-Type: application/json" -d "{\"title\":\"1984\",\"author\":\"George Orwell\",\"year\":1949,\"genre\":\"fiction\",\"read\":true,\"rating\":5}"
6. Delete a book (DELETE)PowerShellcurl.exe -i -X DELETE "http://localhost:3000/api/books/7"