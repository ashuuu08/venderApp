import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus, getCurrentUser } from '../../utils/storage';

const UserNotifications = () => {
  const [orders, setOrders] = useState([]);
  const [allOrdersDebug, setAllOrdersDebug] = useState([]); // For debugging
  const user = getCurrentUser();

  useEffect(() => {
    const allOrders = getOrders();
    setAllOrdersDebug(allOrders); // Save all orders to check later

    // FILTER LOGIC
    const myNotifications = allOrders.filter(o => 
      o.client === user.name && o.status === 'Client Approval Pending'
    );
    setOrders(myNotifications);
  }, [user.name]);

  const handleApprove = (id) => {
    if (confirm("Confirm dispatch?")) {
      updateOrderStatus([id], 'Ready');
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-content">
      <div className="top-header">
        <h2>🔔 Dispatch Notifications</h2>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr className="table-header-row">
              <th>Action</th>
              <th>Order No</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
               <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>No notifications found. check debug box above.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} style={{backgroundColor: '#fff3e0'}}>
                   <td><button className="btn-green" onClick={() => handleApprove(order.id)}>✅ Approve</button></td>
                   <td>ORD-{order.id}</td>
                   <td>{order.item}</td>
                   <td>{order.qty}</td>
                   <td>Ready for dispatch.</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserNotifications;