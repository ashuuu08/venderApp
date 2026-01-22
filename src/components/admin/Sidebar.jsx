// src/components/admin/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../utils/storage';
import { LayoutDashboard, Send, Truck, CheckCircle, LogOut, RefreshCcw } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const handleResetData = () => { /* ... keep your reset logic ... */ };

  // REMOVED <div className="sidebar"> wrapper because App.jsx handles it now
  return (
    <> 
      <div className="sidebar-header">
        <h3>🚀 Dispatcher</h3>
      </div>
      
      <ul className="sidebar-menu">
        <li><NavLink to="/admin/overview" className={({isActive})=>isActive?"active":""}><LayoutDashboard size={20}/> Overview</NavLink></li>
        <li><NavLink to="/admin/pre-dispatch" className={({isActive})=>isActive?"active":""}><Send size={20}/> Pre-Dispatch</NavLink></li>
        <li><NavLink to="/admin/dispatch" className={({isActive})=>isActive?"active":""}><Truck size={20}/> Dispatch</NavLink></li>
        <li><NavLink to="/admin/post-dispatch" className={({isActive})=>isActive?"active":""}><CheckCircle size={20}/> History</NavLink></li>
      </ul>

      <div className="sidebar-footer">
         {/* ... keep your buttons ... */}
        <button onClick={handleLogout} className="logout-btn"><LogOut size={18}/> Logout</button>
      </div>
    </>
  );
};
export default Sidebar;