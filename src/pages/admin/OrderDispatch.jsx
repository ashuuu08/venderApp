import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../utils/storage';

const OrderDispatch = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Only show orders that are 'Ready' (confirmed in Pre-Dispatch)
    const readyOrders = getOrders().filter(o => o.status === 'Ready');
    setOrders(readyOrders);
  }, []);

  const handleCompleteDispatch = (id) => {
    if (confirm("Finalize this dispatch? It will move to history.")) {
      updateOrderStatus([id], 'Completed');
      // Refresh list locally
      setOrders(prev => prev.filter(o => o.id !== id)); 
    }
  };

  return (
    <div className="dashboard-content">
      <div className="top-header" style={{background: '#c5cae9'}}>
        <h2>🚚 Order Dispatch Entry</h2>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr className="table-header-row">
              <th>Action</th>
              <th>Dispatch No</th>
              <th>Dispatch Date</th>
              <th>Order No</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Godown</th>
              <th>Dispatch Qty</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
               <tr><td colSpan="8" style={{textAlign:'center', padding:'20px'}}>No orders ready for dispatch.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                   <td>
                     <button className="btn-green" style={{padding:'4px 8px'}} onClick={() => handleCompleteDispatch(order.id)}>
                       Step 3: Finish
                     </button>
                   </td>
                   <td>DN-{order.id}</td>
                   <td>{new Date().toLocaleDateString()}</td>
                   <td>VPR/OR-{order.id}</td>
                   <td>{order.client}</td>
                   <td>{order.item}</td>
                   <td>{order.godown}</td>
                   <td><input type="number" defaultValue={order.qty} style={{width:'60px'}} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDispatch;