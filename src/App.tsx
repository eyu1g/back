import React, { type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/signup';
import AddStaffMember from './components/staffadd';
import StaffManagement from './components/StaffManagement';
import AdminDashboard from './pages/admin/dashboard'; // Adjust path if needed

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/login" />;
};

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        {/* Admin dashboard with tabs for staff and news */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Existing individual staff routes */}
        <Route
          path="/admin/staff"
          element={
            <PrivateRoute>
              <StaffManagement onStaffAdded={function (): void {
                throw new Error('Function not implemented.');
              } } />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/staffadd"
          element={
            <PrivateRoute>
              <AddStaffMember onStaffAdded={() => {}} />
            </PrivateRoute>
          }
        />

        {/* Redirect all unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
