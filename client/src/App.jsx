import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import ClientLayout from './layouts/ClientLayout';
import AdvocateLayout from './layouts/AdvocateLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import AdvocatesDirectoryPage from './pages/public/AdvocatesDirectoryPage';
import AdvocateDetailsPage from './pages/public/AdvocateDetailsPage';
import PracticeAreasPage from './pages/public/PracticeAreasPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Client Dashboard Pages
import ClientDashboardPage from './pages/client/ClientDashboardPage';
import BookingsPage from './pages/client/BookingsPage';
import BookingDetailsPage from './pages/client/BookingDetailsPage';
import BookConsultationPage from './pages/client/BookConsultationPage';
import CasesPage from './pages/client/CasesPage';
import CaseDetailsPage from './pages/client/CaseDetailsPage';
import DocumentsPage from './pages/client/DocumentsPage';
import MessagesPage from './pages/client/MessagesPage';
import PaymentsPage from './pages/client/PaymentsPage';
import SavedAdvocatesPage from './pages/client/SavedAdvocatesPage';
import NotificationsPage from './pages/client/NotificationsPage';
import ProfilePage from './pages/client/ProfilePage';

// Advocate Dashboard Pages
import AdvocateDashboardPage from './pages/advocate/AdvocateDashboardPage';
import AdvocateBookingsPage from './pages/advocate/AdvocateBookingsPage';
import AdvocateCasesPage from './pages/advocate/AdvocateCasesPage';
import AdvocateCaseDetailsPage from './pages/advocate/AdvocateCaseDetailsPage';
import AdvocateDocumentsPage from './pages/advocate/AdvocateDocumentsPage';
import AdvocateMessagesPage from './pages/advocate/AdvocateMessagesPage';
import AdvocateEarningsPage from './pages/advocate/AdvocateEarningsPage';
import AdvocateAvailabilityPage from './pages/advocate/AdvocateAvailabilityPage';
import AdvocateProfilePage from './pages/advocate/AdvocateProfilePage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/advocates" element={<AdvocatesDirectoryPage />} />
          <Route path="/advocates/:id" element={<AdvocateDetailsPage />} />
          <Route path="/practice-areas" element={<PracticeAreasPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>

        {/* Client Protected Routes */}
        <Route
          path="/client"
          element={
            <ProtectedRoute roles={['client']}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/client/dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboardPage />} />
          <Route path="find-advocate" element={<AdvocatesDirectoryPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="bookings/:id" element={<BookingDetailsPage />} />
          <Route path="book" element={<BookConsultationPage />} />
          <Route path="book/:id" element={<BookConsultationPage />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="cases/:id" element={<CaseDetailsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="saved" element={<SavedAdvocatesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Advocate Protected Routes */}
        <Route
          path="/advocate"
          element={
            <ProtectedRoute roles={['advocate']}>
              <AdvocateLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/advocate/dashboard" replace />} />
          <Route path="dashboard" element={<AdvocateDashboardPage />} />
          <Route path="bookings" element={<AdvocateBookingsPage />} />
          <Route path="cases" element={<AdvocateCasesPage />} />
          <Route path="cases/:id" element={<AdvocateCaseDetailsPage />} />
          <Route path="documents" element={<AdvocateDocumentsPage />} />
          <Route path="messages" element={<AdvocateMessagesPage />} />
          <Route path="earnings" element={<AdvocateEarningsPage />} />
          <Route path="availability" element={<AdvocateAvailabilityPage />} />
          <Route path="profile" element={<AdvocateProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
