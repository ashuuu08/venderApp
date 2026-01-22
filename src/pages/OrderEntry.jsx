import React, { useState, useEffect } from 'react';
import { saveOrder, getCurrentUser } from '../utils/storage'; // Import storage helpers
import { useNavigate } from 'react-router-dom';

const OrderEntry = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Form State
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [godown, setGodown] = useState('G1'); // Default Godown

  // Check login on load
  useEffect(() => {
    const loggedInUser = getCurrentUser();
    if (!loggedInUser) {
      navigate('/'); // Redirect to login if not found
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item || !qty) return alert("Please fill in Item and Quantity");

    // Create the order object
    const newOrder = {
      client: user.name, // AUTOMATICALLY use the logged-in name
      item: item,
      qty: qty,
      godown: godown
    };

    // Save to LocalStorage (Send to Admin)
    saveOrder(newOrder);
    
    alert('✅ Order Sent to Admin Successfully!');

    // Logic: If Admin, clear form. If Client, go to History.
    if (user.role === 'admin') {
      setItem(''); setQty(''); setGodown('G1'); // Admin might add multiple
    } else {
      navigate('/user/my-orders'); // Client is done, send them to history
    }
  };

  // Prevent render until user is loaded
  if (!user) return null;

  return (
    <div className="page-container" style={{padding: '20px'}}>
      <h2>📝 New Order Entry</h2>
      
      <div className="card" style={{maxWidth: '500px', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
        <form onSubmit={handleSubmit} className="entry-form">
          
          {/* READ-ONLY CLIENT NAME */}
          <div className="form-row" style={{marginBottom: '15px'}}>
            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Client Name</label>
            <input 
              type="text" 
              value={user.name} 
              disabled 
              style={{
                background: '#e9ecef', 
                cursor: 'not-allowed', 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }} 
            />
          </div>

          {/* ITEM NAME */}
          <div className="form-row" style={{marginBottom: '15px'}}>
            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Item Name</label>
            <input 
              type="text" 
              value={item} 
              onChange={e => setItem(e.target.value)} 
              placeholder="e.g. Parag Ld 51mic" 
              style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
            />
          </div>

          {/* QUANTITY */}
          <div className="form-row" style={{marginBottom: '15px'}}>
            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Quantity</label>
            <input 
              type="number" 
              value={qty} 
              onChange={e => setQty(e.target.value)} 
              placeholder="0" 
              style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
            />
          </div>

          {/* GODOWN SELECT */}
          <div className="form-row" style={{marginBottom: '20px'}}>
            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Godown</label>
            <select 
              value={godown} 
              onChange={e => setGodown(e.target.value)}
              style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
            >
              <option value="G1">Godown 1</option>
              <option value="G2">Godown 2</option>
              <option value="G3">Godown 3</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-success" 
            style={{
              width: '100%', 
              padding: '12px', 
              background: '#22c55e', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              fontSize: '16px', 
              cursor: 'pointer'
            }}
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderEntry;