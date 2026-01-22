const KEYS = {
  USERS: 'app_users',
  ORDERS: 'app_orders',
  CURRENT_USER: 'app_current_user'
};

// --- INITIALIZATION ---
export const initializeData = () => {
  // 1. SETUP USERS (Added 3 different clients for testing)
  if (!localStorage.getItem(KEYS.USERS)) {
    const defaultUsers = [
      // ADMIN
      { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Admin User' },
      
      // CLIENT 1 (Matches your previous test)
      { id: 2, username: 'client', password: '123', role: 'user', name: 'Agrawal Plastic GYD' },
      
      // CLIENT 2
      { id: 3, username: 'ahuja', password: '123', role: 'user', name: 'Ahuja Agency' },

      // CLIENT 3
      { id: 4, username: 'vikas', password: '123', role: 'user', name: 'Vikas Traders' }
    ];
    localStorage.setItem(KEYS.USERS, JSON.stringify(defaultUsers));
  }

  // 2. SETUP ORDERS (Fixed 'client' names to match users above)
  if (!localStorage.getItem(KEYS.ORDERS)) {
    const dummyOrders = [
      // --- NOTIFICATIONS (Status: 'Client Approval Pending') ---
      // This will show up for 'client' (Agrawal Plastic GYD) in Notifications
      { id: 202, client: 'Agrawal Plastic GYD', item: 'Test Item Notification', qty: '500', godown: 'G1', status: 'Client Approval Pending', createdAt: '21/01/2026' },
      
      // --- PENDING ORDERS (Status: 'Pending') ---
      // This will show up for 'client' (Agrawal Plastic GYD) in History
      { id: 101, client: 'Agrawal Plastic GYD', item: 'Parag Ld 51mic', qty: '150', godown: 'G1', status: 'Pending', createdAt: '20/01/2026' },
      
      // This will show up for 'ahuja'
      { id: 102, client: 'Ahuja Agency', item: 'Raja Color 5x10', qty: '200', godown: 'G2', status: 'Pending', createdAt: '21/01/2026' },

      // This will show up for 'vikas'
      { id: 103, client: 'Vikas Traders', item: 'Galaxy Black', qty: '120', godown: 'G3', status: 'Pending', createdAt: '22/01/2026' },
    ];
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(dummyOrders));
  }
};

// --- AUTHENTICATION ---
export const loginUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
  window.location.href = '/';
};

export const getCurrentUser = () => JSON.parse(localStorage.getItem(KEYS.CURRENT_USER));

// --- ORDER MANAGEMENT ---
export const getOrders = () => JSON.parse(localStorage.getItem(KEYS.ORDERS) || '[]');

export const saveOrder = (order) => {
  const orders = getOrders();
  const newOrder = { 
    ...order, 
    id: Date.now(), 
    status: 'Pending', 
    createdAt: new Date().toLocaleDateString() 
  };
  orders.push(newOrder);
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
};

// Update Status (Robust ID checking)
export const updateOrderStatus = (ids, newStatus) => {
  const orders = getOrders();
  const updatedOrders = orders.map(order => {
    // Convert both to String to ensure "101" (string) matches 101 (number)
    if (ids.map(String).includes(String(order.id))) {
      return { ...order, status: newStatus, lastUpdated: new Date().toLocaleDateString() };
    }
    return order;
  });
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(updatedOrders));
};

// Edit Order Details
export const updateOrderDetails = (id, updatedData) => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  
  if (index !== -1) {
    // Merge old data with new data
    orders[index] = { ...orders[index], ...updatedData };
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    return true;
  }
  return false;
};