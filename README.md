

<div align="center">

# 📚 KampüsKitap
### A Book Marketplace for University Students

**[🇹🇷 Türkçe](README_TR.md) | [🇬🇧 English](README.md)**

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

*A modern web platform designed to help university students discover, buy, and sell academic textbooks, making book exchange within university communities easier and more accessible.*

</div>

---

## 🌟 About the Project

**KampüsKitap** is a user-oriented marketplace where university students can buy and sell academic textbooks.

Users can search for books by course code or title, compare listings from different sellers, and create their own listings to sell books they no longer need.

The platform aims to make academic resources more accessible while helping students give their unused textbooks a new life.

## ✨ Key Features

- **🔍 Advanced Book Search:** Search listings by course code, book title, or department.
- **🎯 Smart Filtering:** Filter books by condition (New, Lightly Used, Worn) and maximum price.
- **📚 Create Book Listings:** Publish listings with book title, course code, department, price, condition, and description.
- **👤 User Authentication:** Register and sign in using email and password.
- **🗂️ Personal Library Dashboard:** View your own listings and their combined total value.
- **✏️ Listing Management:** Edit and delete your own book listings.
- **🔗 Share Listings:** Easily copy and share listing URLs.
- **📖 Related Book Listings:** Discover other listings associated with the same course code.
- **🎨 Dynamic Book Covers:** An automatic cover-color system based on the department.
- **📱 Modern UI:** A responsive, user-focused interface designed for different screen sizes.

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 | Modern web application and page management |
| **UI Library** | React 19 | User interface and component management |
| **Programming Language** | TypeScript | Type-safe and maintainable development |
| **CSS Framework** | Tailwind CSS 4 | Modern and responsive UI styling |
| **Backend** | Next.js Server Actions | Server-side operations and business logic |
| **Database** | PostgreSQL | Relational data storage |
| **ORM** | Prisma 7 | Database modeling and data operations |
| **Authentication** | Better Auth | User registration and authentication |
| **Version Control** | Git & GitHub | Source code management |

## 🏗️ Project Architecture

```text
kampus-kitap/
│
├── prisma/
│   ├── migrations/          # Database migration files
│   └── schema.prisma        # Database models
│
├── public/                  # Static assets and images
│
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── giris/           # User sign-in page
│   │   ├── kayit/           # User registration page
│   │   ├── ilan/
│   │   │   ├── yeni/        # Create a new listing
│   │   │   └── [id]/        # Listing details and editing
│   │   ├── ilanlarim/       # User's own listings
│   │   ├── layout.tsx       # Root application layout
│   │   └── page.tsx         # Homepage
│   │
│   ├── components/
│   │   ├── AuthPanel.tsx
│   │   ├── Header.tsx
│   │   ├── ListingForm.tsx
│   │   ├── ShareButton.tsx
│   │   └── DeleteListingButton.tsx
│   │
│   └── lib/
│       ├── auth.ts          # Authentication configuration
│       ├── auth-client.ts   # Client-side authentication
│       ├── prisma.ts        # Database connection
│       └── cover.ts         # Dynamic cover colors
│
├── .env                     # Environment variables
├── package.json
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kampus-kitap
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/kampuskitap"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

Use your own PostgreSQL connection details. Never expose database credentials or secret keys in your public GitHub repository.

### 4. Set Up the Database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the Development Server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

## 🔐 Security & Data Management

- User authentication is handled through Better Auth.
- The application supports email and password-based registration and login.
- Only the owner of a listing can edit or delete it.
- Unauthenticated users cannot access listing creation or personal listing management pages.
- Database operations are handled through Prisma ORM.
- Sensitive connection details should be stored in environment variables.

## 🎯 Project Goal

The main goal of KampüsKitap is to simplify textbook exchange among university students, encourage the reuse of academic books, and create an accessible marketplace where students can easily find the resources they need.

---

<div align="center">

**📚 KampüsKitap — Find Your Book, Sell It on Campus!**

*Made with ❤️ for university students.*

</div>

