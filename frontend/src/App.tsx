import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NGODashboard from './pages/NGODashboard';
import BeneficiaryPortal from './pages/BeneficiaryPortal';
import DonorTracker from './pages/DonorTracker';
import Login from './pages/Login';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<NGODashboard />} />
          <Route path="/beneficiary" element={<BeneficiaryPortal />} />
          <Route path="/donor" element={<DonorTracker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
