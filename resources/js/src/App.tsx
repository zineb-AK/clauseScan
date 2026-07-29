import { Routes, Route } from 'react-router';
import RequireAuth from './features/auth/RequireAuth';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContractsPage from './pages/ContractsPage';
import NewContractPage from './pages/NewContractPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';

export default function App() {
    return (
        <Routes>
            <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                    <Route index element={<div>Dashboard</div>} />
                    <Route path="contracts" element={<ContractsPage />} />
                    <Route path="contracts/new" element={<NewContractPage />} />
                    <Route path="history" element={<div>History</div>} />
                </Route>
            </Route>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="error" element={<ErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
