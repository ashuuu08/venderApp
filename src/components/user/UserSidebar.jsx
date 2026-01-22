// src/components/user/UserSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../utils/storage';
import { Home, PlusCircle, List, Bell, LogOut } from 'lucide-react';

const UserSidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <div className="sidebar-header">
        <h3>👤 Client Portal</h3>
      </div>
      
      <ul className="sidebar-menu">
        <li><NavLink to="/user/dashboard" className={({isActive})=>isActive?"active":""}><Home size={20}/> Dashboard</NavLink></li>
        <li><NavLink to="/user/create-order" className={({isActive})=>isActive?"active":""}><PlusCircle size={20}/> New Order</NavLink></li>
        <li><NavLink to="/user/my-orders" className={({isActive})=>isActive?"active":""}><List size={20}/> History</NavLink></li>
        <li><NavLink to="/user/notifications" className={({isActive})=>isActive?"active":""}><Bell size={20}/> Notifications</NavLink></li>
      </ul>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn"><LogOut size={18}/> Logout</button>
      </div>
    </>
  );
};
export default UserSidebar;