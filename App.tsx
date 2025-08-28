import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import BuyerPage from './pages/BuyerPage';
import ArtistPage from './pages/ArtistPage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { UserRole } from './types';

const AppRoutes: React.FC = () => {
    const { currentUser } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (currentUser) {
            const dashboardPath = currentUser.activeRole === UserRole.BUYER ? '/buyer' : '/artist';
            if (location.pathname !== dashboardPath && !location.pathname.startsWith('/job')) {
                navigate(dashboardPath, { replace: true });
            }
        }
    }, [currentUser?.activeRole, currentUser, navigate, location.pathname]);


    if (currentUser) {
        return (
            <Routes>
                <Route path="/buyer" element={currentUser.activeRole === UserRole.BUYER ? <BuyerPage /> : <Navigate to="/artist" replace />} />
                <Route path="/artist" element={currentUser.activeRole === UserRole.ARTIST ? <ArtistPage /> : <Navigate to="/buyer" replace />} />
                <Route path="/job/:jobId" element={<JobDetailPage />} />
                <Route path="*" element={<Navigate to={currentUser.activeRole === UserRole.BUYER ? '/buyer' : '/artist'} replace />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <AppProvider>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
    </AppProvider>
  );
};

export default App;