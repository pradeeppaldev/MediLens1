import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UploadPrescription from './pages/UploadPrescription';
import AddMedicine from './pages/AddMedicine';
import MedicineInfo from './pages/MedicineInfo';
import AllMedicines from './pages/AllMedicines';
import AllDocuments from './pages/AllDocuments';
import AllDoctors from './pages/AllDoctors';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Analytics from './pages/Analytics';
import AIChat from './pages/AIChat';
import Reminders from './pages/Reminders';
import HealthMonitor from './pages/HealthMonitor';
import ExpenseTracker from './pages/ExpenseTracker';
import PharmacyLocator from './pages/PharmacyLocator';
import FloatingChatButton from './components/FloatingChatButton';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading MediLens...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public route component (redirects logged in users)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading MediLens...</p>
      </div>
    );
  }
  
  if (user && !user.isGuest) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Layout component for authenticated routes
const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 md:ml-64 min-w-0 transition-all duration-200 ease-emil-out">
          <div className="animate-stagger-1 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Footer />
      <FloatingChatButton />
    </div>
  );
};

function App() {
  const { theme } = useTheme();

  return (
    <>
      <Toaster
        theme={theme === 'dark' ? 'dark' : 'light'}
        richColors
        position="top-right"
        closeButton
        offset={20}
        toastOptions={{
          style: {
            borderRadius: '1rem',
            padding: '12px 16px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <AppLayout>
              <Analytics />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/prescriptions/upload" element={
          <ProtectedRoute>
            <AppLayout>
              <UploadPrescription />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/medications/add" element={
          <ProtectedRoute>
            <AppLayout>
              <AddMedicine />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/medications" element={
          <ProtectedRoute>
            <AppLayout>
              <AllMedicines />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/medications/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <MedicineInfo />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/documents" element={
          <ProtectedRoute>
            <AppLayout>
              <AllDocuments />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/doctors" element={
          <ProtectedRoute>
            <AppLayout>
              <AllDoctors />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/ai/chat" element={
          <ProtectedRoute>
            <AppLayout>
              <AIChat />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/ai-chat" element={<Navigate to="/ai/chat" replace />} />
        <Route path="/reminders" element={
          <ProtectedRoute>
            <AppLayout>
              <Reminders />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/monitor" element={
          <ProtectedRoute>
            <AppLayout>
              <HealthMonitor />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/expense-tracker" element={
          <ProtectedRoute>
            <AppLayout>
              <ExpenseTracker />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/pharmacy-locator" element={
          <ProtectedRoute>
            <AppLayout>
              <PharmacyLocator />
            </AppLayout>
          </ProtectedRoute>
        } />
        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
