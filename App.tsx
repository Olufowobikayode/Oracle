
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AppShell from './components/AppShell';
import PublicLayout from './components/PublicLayout';

// New App Structure
import OracleGatewayPage from './pages/OracleGatewayPage';
import DashboardPage from './pages/DashboardPage';
import MarketAnalysisPage from './pages/MarketAnalysisPage';
import KeywordResearchPage from './pages/KeywordResearchPage';
import PlatformFinderPage from './pages/PlatformFinderPage';
import ContentStrategyPage from './pages/ContentStrategyPage';
import VentureIdeasPage from './pages/VentureIdeasPage';
import QnaPage from './pages/QnaPage';
import SocialMediaPage from './pages/SocialMediaPage';
import CopywritingPage from './pages/CopywritingPage';
import SalesArbitragePage from './pages/SalesArbitragePage';
import ScenarioPlannerPage from './pages/ScenarioPlannerPage';
import MediaStudioPage from './pages/MediaStudioPage';


// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import TermsPage from './pages/TermsPage';
import CopyrightPage from './pages/CopyrightPage';
import LoginPage from './pages/LoginPage';
import BlogAdminPage from './pages/BlogAdminPage';

// Auth
import ProtectedRoute from './components/ProtectedRoute';


const AppRoutes: React.FC = () => {
    return (
        <AppShell>
            <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="analysis" element={<MarketAnalysisPage />} />
                <Route path="keywords" element={<KeywordResearchPage />} />
                <Route path="platforms" element={<PlatformFinderPage />} />
                <Route path="content" element={<ContentStrategyPage />} />
                <Route path="ventures" element={<VentureIdeasPage />} />
                <Route path="qna" element={<QnaPage />} />
                <Route path="socials" element={<SocialMediaPage />} />
                <Route path="copy" element={<CopywritingPage />} />
                <Route path="arbitrage" element={<SalesArbitragePage />} />
                <Route path="scenarios" element={<ScenarioPlannerPage />} />
                <Route path="media" element={<MediaStudioPage />} />

                {/* Redirect from base /app to the dashboard */}
                <Route path="/" element={<Navigate to="dashboard" replace />} />
            </Routes>
        </AppShell>
    );
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public facing pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/copyright" element={<CopyrightPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/blog/admin"
          element={
            <ProtectedRoute>
              <BlogAdminPage />
            </ProtectedRoute>
          }
        />
      </Route>
      
      {/* The main app, now starting with the gateway */}
      <Route path="/app/initiate" element={<OracleGatewayPage />} />
      <Route path="/app/*" element={<AppRoutes />} />
    </Routes>
  );
};

export default App;