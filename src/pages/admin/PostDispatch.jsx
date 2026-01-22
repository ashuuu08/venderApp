import React, { useEffect, useState } from 'react';
import { getOrders } from '../../utils/storage';

const PostDispatch = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getOrders().filter(o => o.status === 'Completed'));
  }, []);

  return (
    <div className="dashboard-content">
      <div className="top-header">
        <h2>✅ Post Dispatch (History)</h2>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr className="table-header-row">
              <th>Status</th>
              <th>Completed Date</th>
              <th>Client</th>
              <th>Item</th>
              <th>Final Qty</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>No history yet.</td></tr> :
              history.map(order => (
                <tr key={order.id}>
                   <td><span style={{color:'green', fontWeight:'bold'}}>Completed</span></td>
                   <td>{order.lastUpdated}</td>
                   <td>{order.client}</td>
                   <td>{order.item}</td>
                   <td>{order.qty}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostDispatch;