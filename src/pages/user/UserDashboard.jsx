import React, { useEffect, useState } from 'react';
import { getOrders, getCurrentUser } from '../../utils/storage';

const UserDashboard = () => {
  const [stats, setStats] = useState({ pending: 0, dispatched: 0, approvalNeeded: 0 });
  const user = getCurrentUser();

  useEffect(() => {
    const myOrders = getOrders().filter(o => o.client === user.name);
    
    setStats({
      pending: myOrders.filter(o => o.status === 'Pending' || o.status === 'Planned').length,
      dispatched: myOrders.filter(o => o.status === 'Completed').length,
      approvalNeeded: myOrders.filter(o => o.status === 'Client Approval Pending').length,
    });
  }, [user.name]);

  return (
    <div className="dashboard-content">
      <div className="top-header">
        <h2>👋 Welcome, {user.name}</h2>
      </div>

      <div className="stats-row">
        <div className="stat-box yellow-border">
          <label>Pending Orders</label><h1>{stats.pending}</h1>
        </div>
        <div className="stat-box blue-border">
          <label>Action Required</label><h1>{stats.approvalNeeded}</h1>
        </div>
        <div className="stat-box green-border">
          <label>Dispatched / Completed</label><h1>{stats.dispatched}</h1>
        </div>
      </div>
      
      <div className="card" style={{padding:'20px', marginTop:'20px'}}>
        <h3>Recent Activity</h3>
        <p>You have <strong>{stats.approvalNeeded}</strong> shipments waiting for your approval. Go to Notifications.</p>
      </div>
    </div>
  );
};

export default UserDashboard;