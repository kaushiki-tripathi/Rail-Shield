import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/Homepage'
import Navbar from './components/Navbar'
import SafetyAlertsPage from './pages/SafetyAlerts'
import EmergencyContacts from './pages/EmergencyContacts'
import AboutPage from './pages/About'
import ContactPage from './pages/Contact'
import AuthFlow from './pages/AuthFlow'
import Footer from './components/Footer'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ReportDetailsPage from './pages/ReportDetailsPage'
import Report from './pages/Report'
import PrivacyPolicyPage from './pages/PrivacyPolicy'
<<<<<<< HEAD
import StatusPage from './pages/StatusPage'
=======
import { AuthProvider } from './contexts/AuthContext'
>>>>>>> 188d3d2d8d57a93019249947f2e85128711d1307


function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
    <div className='flex flex-col min-h-screen'>
      <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            {/* These are visible to everyone */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/login" element={<AuthFlow defaultView="login" />} />
            <Route path='/register' element={<AuthFlow defaultView="register"/>} />

            {/* --- USER PROTECTED ROUTES --- */}
            {/* These require any user to be logged in */}
            <Route 
              path="/about" 
              element={<ProtectedRoute><AboutPage /></ProtectedRoute>} 
            />
            <Route 
              path="/alerts" 
              element={<ProtectedRoute><SafetyAlertsPage /></ProtectedRoute>} 
            />
            <Route 
              path="/contacts" 
              element={<ProtectedRoute><EmergencyContacts /></ProtectedRoute>} 
            />
            <Route 
              path="/report" 
              element={<ProtectedRoute><Report /></ProtectedRoute>} 
            />
            <Route 
              path="/status" 
              element={<ProtectedRoute><StatusPage /></ProtectedRoute>} 
            />

            {/* --- ADMIN PROTECTED ROUTES --- */}
            {/* These require a user with the 'Admin' role */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/report/:id" 
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <ReportDetailsPage />
                </ProtectedRoute>
              } 
            />
            
          </Routes>
        </main>
        <Footer />
      </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
