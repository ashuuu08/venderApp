import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Icons for the menu

// Components
import Sidebar from './components/admin/Sidebar';         
import UserSidebar from './components/user/UserSidebar'; 
import ProtectedRoute from './components/ProtectedRoute';

// Public
import Login from './pages/Login';

// Admin Pages
import Overview from './pages/admin/Overview';
import PreDispatch from './pages/admin/PreDispatch';
import OrderDispatch from './pages/admin/OrderDispatch';
import PostDispatch from './pages/admin/PostDispatch';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserNotifications from './pages/user/UserNotifications';
import UserOrders from './pages/user/UserOrders';
import OrderEntry from './pages/OrderEntry'; 

// --- MOBILE LAYOUT WRAPPER ---
// This handles the "Hamburger Menu" logic
const MobileLayout = ({ SidebarComponent }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Mobile Dark Overlay (Click to close menu) */}
      <div 
        className={`mobile-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* The Sidebar (Passes a class to slide it in/out) */}
      <div className={`sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Close Button inside Sidebar (Mobile Only) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', display: window.innerWidth > 768 ? 'none' : 'flex' }}>
           <button onClick={() => setIsSidebarOpen(false)} style={{background:'transparent', color:'white'}}><X size={24}/></button>
        </div>
        <SidebarComponent />
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Mobile Header Bar */}
        <div className="mobile-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          
          {/* --- USER ROUTES --- */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/user" element={<MobileLayout SidebarComponent={UserSidebar} />}>
              <Route index element={<UserDashboard />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="create-order" element={<OrderEntry />} />
              <Route path="my-orders" element={<UserOrders />} />
              <Route path="notifications" element={<UserNotifications />} />
            </Route>
          </Route>

          {/* --- ADMIN ROUTES --- */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<MobileLayout SidebarComponent={Sidebar} />}>
               <Route index element={<Overview />} /> 
               <Route path="overview" element={<Overview />} />
               <Route path="pre-dispatch" element={<PreDispatch />} />
               <Route path="dispatch" element={<OrderDispatch />} />
               <Route path="post-dispatch" element={<PostDispatch />} />
            </Route>
          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;