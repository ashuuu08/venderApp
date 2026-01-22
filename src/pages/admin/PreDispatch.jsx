import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../utils/storage';

const PreDispatch = () => {
  const [orders, setOrders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    // Show orders that are 'Planned' and waiting for Admin action
    setOrders(getOrders().filter(o => o.status === 'Planned'));
  }, []);

  const toggleSelect = (id) => {
    selectedIds.includes(id) 
      ? setSelectedIds(selectedIds.filter(sid => sid !== id))
      : setSelectedIds([...selectedIds, id]);
  };

  const handleSendToClient = () => {
    if (selectedIds.length === 0) return alert("Please select orders first.");
    
    // CONFIRMATION DIALOG
    if (confirm(`Send notification to client for ${selectedIds.length} orders?`)) {
      
      // UPDATE STATUS: Moves order to the User's "Notifications" tab
      updateOrderStatus(selectedIds, 'Client Approval Pending'); 
      
      alert("✅ Notification sent to Client! They must approve it before dispatch.");
      window.location.reload(); // Refresh to remove sent items from list
    }
  };

  return (
    <div className="dashboard-content">
      <div className="top-header">
        <h2>📢 Pre-Dispatch (Notify Client)</h2>
        <div className="header-actions">
           <button className="btn-green" onClick={handleSendToClient}>
             📨 Send to Client
           </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr className="table-header-row">
              <th>Select</th>
              <th>Order No</th>
              <th>Client Name</th>
              <th>Item Name</th>
              <th>Planned Qty</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No planned orders found.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className={selectedIds.includes(order.id) ? 'selected-row' : ''}>
                   <td>
                     <input 
                       type="checkbox" 
                       onChange={() => toggleSelect(order.id)} 
                       checked={selectedIds.includes(order.id)}
                     />
                   </td>
                   <td>ORD-{order.id}</td>
                   <td>{order.client}</td>
                   <td>{order.item}</td>
                   <td>{order.qty}</td>
                   <td><span className="badge-purple">Planned</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreDispatch;