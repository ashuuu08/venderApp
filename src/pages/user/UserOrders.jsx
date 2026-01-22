import React, { useEffect, useState } from 'react';
import { getOrders, getCurrentUser } from '../../utils/storage';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      const allOrders = getOrders();
      
      // 1. FILTER: Only show orders belonging to this user
      const myOrders = allOrders.filter(o => o.client === user.name);
      
      // 2. SORT: Newest items first
      myOrders.sort((a, b) => b.id - a.id);
      
      setOrders(myOrders);
    }
    // --- FIX IS BELOW: Changed [user] to [user.name] ---
  }, [user?.name]); 

  // Helper to get the right CSS class for status
  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'badge-yellow'; 
      case 'Planned': return 'badge-purple'; 
      case 'Ready': return 'badge-green';    
      case 'Client Approval Pending': return 'badge-red';
      default: return 'badge-purple';
    }
  };

  if (!user) return <div className="dashboard-content">Please log in to view orders.</div>;

  return (
    <div className="dashboard-content">
      <div className="top-header">
        <h2>📜 My Order History</h2>
        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>
          Logged in as: <strong>{user.name}</strong>
        </span>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr className="table-header-row">
              <th>Date</th>
              <th>Order ID</th>
              <th>Item Name</th>
              <th>Qty</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{textAlign:'center', padding:'30px', color:'var(--text-muted)'}}>
                  You haven't placed any orders yet.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                   <td>{order.createdAt}</td>
                   <td><strong>ORD-{order.id}</strong></td>
                   <td>{order.item}</td>
                   <td>{order.qty}</td>
                   <td>
                     <span className={`badge-purple ${getStatusClass(order.status)}`} style={{fontSize:'0.8rem'}}>
                       {order.status}
                     </span>
                   </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrders;