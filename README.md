# LexAdvocate — MERN Stack Legal Services Platform

**LexAdvocate** is a comprehensive, production-minded legal consultation and practice management platform built with the MERN stack (MongoDB, Express.js, React.js with Vite, Node.js). Designed with a premium **red-and-white theme**, it provides dedicated experiences for clients seeking legal counsel and advocates managing their legal chambers.

---

## 🏛️ Key Features

### For Clients
- **Advocate Search & Discovery**: Filter verified advocates by name, city, practice area (Criminal, Family, Property, Corporate, Civil, Consumer), experience, rating, and fee.
- **Consultation Booking Flow**: 
  - Select advocate & practice area.
  - Choose consultation date and 30-minute time slot.
  - Pick format: Video Call, Audio Call, or In-Person Chambers.
  - Provide legal brief summary.
  - Review and complete test payment via the mock payment adapter.
  - Instant confirmation with booking reference (e.g. `BK-...`).
  - Double-booking prevention enforced at the database level.
- **Litigation Case Tracking**:
  - View court cases linked to your profile with reference IDs (e.g. `CASE-...`).
  - 5-stage procedural timeline visualizer: `Case Filed` ➔ `Documents Verified` ➔ `Hearing Scheduled` ➔ `Hearing Completed` ➔ `Case Closed`.
  - Next hearing date alerts and attorney court notes.
- **Confidential Document Vault**:
  - Upload petitions, evidence, and affidavits (PDF, JPG, PNG up to 10MB).
  - Securely download and link documents to active cases.
  - Access-control protected (no unauthorized public URLs).
- **Real-Time Client-Advocate Messaging**:
  - Socket.IO-powered real-time private messaging.
  - Typing indicators and message timestamps.
- **Billing & Remittance History**:
  - Transaction ledger with IDs, amounts, dates, and statuses.
- **Saved Advocates & Verified Reviews**:
  - Bookmark favorite counsel and submit verified reviews upon consultation completion.

---

### For Advocates
- **Chambers Practice Dashboard**:
  - Statistics overview: Pending requests, active cases, total consultations, and client rating.
  - Real-time notification feed.
- **Consultation Request Management**:
  - Accept or decline incoming consultation requests.
  - Provide Google Meet / video room links when accepting.
  - Mark consultations as completed.
- **Case Registry & Litigation Management**:
  - Create new case files assigned to clients.
  - Record progressive milestones with dates and order notes.
  - Schedule next hearing dates and update litigation statuses (`active`, `pending`, `on_hold`, `won`, `lost`, `closed`).
- **Chamber Working Hours & Consultation Fees**:
  - Set custom 30-minute consultation rates (INR).
  - Configure weekly working hours and active days (Monday to Sunday).
  - Enable/disable consultation formats (Video, Audio, In-Person).
- **Professional Profile Management**:
  - State Bar Council enrollment number verification.
  - Professional biography, courtroom practice areas, years of experience, languages, and primary court/bench.
- **Client Messaging**:
  - Real-time client discussions over Socket.IO.

---

## 🎨 Design System

- **Primary Red**: `#D32F2F`
- **Dark Red**: `#B71C1C`
- **Background**: `#FFFFFF`
- **Surface / Light Background**: `#F8F8F8`
- **Primary Text**: `#222222`
- **Secondary Text**: `#666666`
- **Borders**: `#E5E5E5`
- **Success / Verified**: `#198754`
- **Typography**: Inter (Google Fonts)
- **Grid & Spacing**: 8px baseline spacing system
- **Responsive Layout**: Desktop navigation header + sidebar, tablet-optimized views, and mobile bottom navigation bar.

---

## 🛠️ Technology Stack

### Frontend (`/client`)
- **React.js 19** with **Vite**
- **JavaScript (ES6+)** with JSX
- **Tailwind CSS v3** with custom legal design tokens
- **React Router DOM v7** for single-page routing & role guards
- **Lucide React** for legal iconography
- **Axios** with centralized API interceptors
- **React Hook Form** for client & advocate forms
- **React Hot Toast** for notifications
- **Socket.IO Client** for real-time messaging

### Backend (`/server`)
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose ODM**
- **JSON Web Tokens (JWT)** for stateless authentication
- **bcryptjs** for 10-round salted password hashing
- **Socket.IO** for real-time bidirectional events
- **Multer** for MIME & size-validated document uploads
- **Helmet & CORS** for HTTP security
- **Express Rate Limit** for brute-force protection
- **Mock Payment Adapter** with test-mode simulation

---

## 📁 Project Structure

```
lexadvocate/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   │   ├── AdvocateCard.jsx
│   │   │   │   ├── DashboardSidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── MobileBottomNav.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── ui/
│   │   │       ├── Avatar.jsx
│   │   │       ├── Badge.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── ConfirmDialog.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       ├── LoadingScreen.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Pagination.jsx
│   │   │       ├── Spinner.jsx
│   │   │       └── StarRating.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useApi.js
│   │   ├── layouts/
│   │   │   ├── AdvocateLayout.jsx
│   │   │   ├── ClientLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   ├── pages/
│   │   │   ├── advocate/
│   │   │   │   ├── AdvocateAvailabilityPage.jsx
│   │   │   │   ├── AdvocateBookingsPage.jsx
│   │   │   │   ├── AdvocateCaseDetailsPage.jsx
│   │   │   │   ├── AdvocateCasesPage.jsx
│   │   │   │   ├── AdvocateDashboardPage.jsx
│   │   │   │   ├── AdvocateDocumentsPage.jsx
│   │   │   │   ├── AdvocateEarningsPage.jsx
│   │   │   │   ├── AdvocateMessagesPage.jsx
│   │   │   │   └── AdvocateProfilePage.jsx
│   │   │   ├── client/
│   │   │   │   ├── BookConsultationPage.jsx
│   │   │   │   ├── BookingDetailsPage.jsx
│   │   │   │   ├── BookingsPage.jsx
│   │   │   │   ├── CaseDetailsPage.jsx
│   │   │   │   ├── CasesPage.jsx
│   │   │   │   ├── ClientDashboardPage.jsx
│   │   │   │   ├── DocumentsPage.jsx
│   │   │   │   ├── MessagesPage.jsx
│   │   │   │   ├── NotificationsPage.jsx
│   │   │   │   ├── PaymentsPage.jsx
│   │   │   │   ├── ProfilePage.jsx
│   │   │   │   └── SavedAdvocatesPage.jsx
│   │   │   └── public/
│   │   │       ├── AboutPage.jsx
│   │   │       ├── AdvocateDetailsPage.jsx
│   │   │       ├── AdvocatesDirectoryPage.jsx
│   │   │       ├── ContactPage.jsx
│   │   │       ├── ForgotPasswordPage.jsx
│   │   │       ├── LandingPage.jsx
│   │   │       ├── LoginPage.jsx
│   │   │       ├── NotFoundPage.jsx
│   │   │       ├── PracticeAreasPage.jsx
│   │   │       ├── PrivacyPage.jsx
│   │   │       ├── RegisterPage.jsx
│   │   │       └── TermsPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── seed/
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── advocateController.js
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── caseController.js
│   │   │   ├── documentController.js
│   │   │   ├── messageController.js
│   │   │   ├── notificationController.js
│   │   │   ├── paymentController.js
│   │   │   └── reviewController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── authorize.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── upload.js
│   │   ├── models/
│   │   │   ├── AdvocateProfile.js
│   │   │   ├── Case.js
│   │   │   ├── CaseDocument.js
│   │   │   ├── ConsultationBooking.js
│   │   │   ├── Conversation.js
│   │   │   ├── Message.js
│   │   │   ├── Notification.js
│   │   │   ├── Payment.js
│   │   │   ├── Review.js
│   │   │   ├── SavedAdvocate.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── advocates.js
│   │   │   ├── auth.js
│   │   │   ├── bookings.js
│   │   │   ├── cases.js
│   │   │   ├── documents.js
│   │   │   ├── messages.js
│   │   │   ├── notifications.js
│   │   │   ├── payments.js
│   │   │   └── reviews.js
│   │   ├── sockets/
│   │   │   └── chatSocket.js
│   │   ├── utils/
│   │   │   ├── apiResponse.js
│   │   │   └── generateToken.js
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── package.json
├── .gitignore
└── README.md
```

---

## ⚡ Getting Started & Setup Instructions

### 1. Prerequisites
- **Node.js**: v18+ or v20+ (tested on Node v24)
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

---

### 2. Install Dependencies

You can install all dependencies from the root directory with:
```bash
npm run install:all
```

Or install them individually:
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

---

### 3. Environment Configuration

#### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/lexadvocate
JWT_SECRET=lexadvocate_super_secure_jwt_secret_key_2026_red_theme
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_placeholder_for_mock_payments
STRIPE_WEBHOOK_SECRET=whsec_placeholder
NODE_ENV=development
```

#### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

### 4. Database Seeding

Run the seed script to populate realistic advocate profiles across Indian High Courts, consultation bookings, active litigation cases with milestones, and verified client reviews:

```bash
# From root
npm run seed

# Or directly from server folder
cd server
npm run seed
```

#### Default Seed Credentials:
| Role | Email | Password |
|---|---|---|
| **Client** | `client@lexadvocate.com` | `Password123!` |
| **Advocate (Senior Criminal Defense)** | `priya.sharma@lexadvocate.com` | `Password123!` |
| **Advocate (Corporate Partner)** | `vikram.singhania@lexadvocate.com` | `Password123!` |
| **Advocate (Family & Matrimonial)** | `meenakshi.s@lexadvocate.com` | `Password123!` |

*(Note: The login screen also features 1-click demo autofill buttons for immediate testing!)*

---

### 5. Running the Application

#### Option A: Run Both Concurrently from Root
```bash
npm run dev
```

#### Option B: Run Individually

**Start Backend Server (Port 5000):**
```bash
cd server
npm run dev      # Runs with nodemon auto-reload
# or
npm start        # Production node execution
```

**Start Frontend Client (Port 5173):**
```bash
cd client
npm run dev      # Vite development server
```

Open your browser to: **`http://localhost:5173`**

---

## 🔒 Security & Data Integrity

1. **Role-Based Access Control**:
   - Client and advocate roles are guarded on both Express routes (`protect`, `authorize('client')`, `authorize('advocate')`) and React Protected Routes.
2. **Double-Booking Prevention**:
   - Compound unique index on `{ advocate: 1, consultationDate: 1, timeSlot: 1 }` prevents double-booking for overlapping active slots.
3. **Document Security**:
   - Documents are stored locally with unique timestamps and hashes.
   - Downloads are authorized; requests verify that the user is the uploader, case client, or assigned advocate.
4. **Rate Limiting**:
   - Authentication endpoints are rate-limited with `express-rate-limit` to prevent brute force.

---

## 📄 License
This project is licensed under the MIT License.
