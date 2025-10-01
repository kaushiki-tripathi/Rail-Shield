import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import HomePage from './pages/Homepage'
import Navbar from './components/Navbar'
import SafetyAlertsPage from './pages/SafetyAlerts'
import EmergencyContacts from './pages/EmergencyContacts'
import AboutPage from './pages/About'
import ContactPage from './pages/Contact'
import LoginPage from './pages/LoginPage'
import Footer from './components/Footer'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ReportDetailsPage from './pages/ReportDetailsPage'
import Report from './pages/Report'
import PrivacyPolicyPage from './pages/PrivacyPolicy'


function App() {
  return (
    <BrowserRouter>
    <div className='flex flex-col min-h-screen'>
      <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/report" element={<Report />} />
            <Route path="/alerts" element={<SafetyAlertsPage />} />
            <Route path="/contacts" element={<EmergencyContacts />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/privacy' element={<PrivacyPolicyPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/report/:id" element={<ReportDetailsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
