import React, { useEffect, useState, useMemo } from 'react';
import { getOrders, updateOrderStatus, updateOrderDetails } from '../../utils/storage';
import { Search, Filter, Calendar, ArrowUpDown, RefreshCw, CheckSquare, XSquare, Play, Trash2, Edit, Save, X } from 'lucide-react';

const Overview = () => {
  const [rawOrders, setRawOrders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [stats, setStats] = useState({ total: 0, planning: 0, pending: 0, delivered: 0 });
  
  // --- EDIT MODAL STATE ---
  const [editingOrder, setEditingOrder] = useState(null); // The order currently being edited

  // --- FILTERS STATE ---
  const [inputs, setInputs] = useState({ search: '', client: '', date: '' });
  const [activeFilters, setActiveFilters] = useState({ search: '', client: '', date: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    const allOrders = getOrders();
    setRawOrders(allOrders.filter(o => o.status === 'Pending'));
    
    // Update Stats
    setStats({
      total: allOrders.reduce((sum, o) => sum + Number(o.qty), 0),
      planning: allOrders.filter(o => o.status === 'Planned').reduce((sum, o) => sum + Number(o.qty), 0),
      pending: allOrders.filter(o => o.status === 'Pending').reduce((sum, o) => sum + Number(o.qty), 0),
      delivered: allOrders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + Number(o.qty), 0),
    });
    setSelectedIds([]);
  };

  // --- EDIT HANDLERS ---
  const handleEditClick = (order) => {
    setEditingOrder({ ...order }); // Create a copy to edit
  };

  const handleSaveEdit = () => {
    if (!editingOrder.item || !editingOrder.qty) return alert("Fields cannot be empty");
    
    updateOrderDetails(editingOrder.id, {
        item: editingOrder.item,
        qty: editingOrder.qty,
        client: editingOrder.client
    });
    
    setEditingOrder(null); // Close modal
    loadData(); // Refresh table
    alert("✅ Order Updated Successfully!");
  };

  // --- FILTER LOGIC ---
  const handleApplyFilters = () => setActiveFilters(inputs);
  const handleClearFilters = () => {
    setInputs({ search: '', client: '', date: '' });
    setActiveFilters({ search: '', client: '', date: '' });
  };

  const filteredOrders = useMemo(() => {
    let result = [...rawOrders];
    if (activeFilters.search) {
      const term = activeFilters.search.toLowerCase();
      result = result.filter(o => o.id.toString().includes(term) || o.item.toLowerCase().includes(term));
    }
    if (activeFilters.client) result = result.filter(o => o.client === activeFilters.client);
    if (activeFilters.date) {
      const [y, m, d] = activeFilters.date.split('-');
      result = result.filter(o => o.createdAt === `${d}/${m}/${y}`);
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (sortConfig.key === 'qty') { valA = Number(valA); valB = Number(valB); }
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [rawOrders, activeFilters, sortConfig]);

  const toggleSelect = (id) => {
    selectedIds.includes(id) ? setSelectedIds(selectedIds.filter(sid => sid !== id)) : setSelectedIds([...selectedIds, id]);
  };

  const handleSelectAll = () => {
    selectedIds.length === filteredOrders.length ? setSelectedIds([]) : setSelectedIds(filteredOrders.map(o => o.id));
  };

  const handleSort = (key) => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  
  const handleSubmit = () => {
    if (selectedIds.length === 0) return alert("Select at least one order.");
    if (confirm(`Move ${selectedIds.length} orders to Planning?`)) {
      updateOrderStatus(selectedIds, 'Planned');
      loadData();
    }
  };

  const uniqueClients = [...new Set(rawOrders.map(o => o.client))];

  return (
    <div className="dashboard-content">
      {/* HEADER */}
      <div className="top-header">
        <h2>📦 Dispatch Planning Dashboard</h2>
        <div className="header-actions">
           <button className="btn-white" onClick={loadData} title="Refresh"><RefreshCw size={18}/></button>
           <button className="btn-green" onClick={handleSubmit}>🚀 Submit Dispatches ({selectedIds.length})</button>
        </div>
      </div>

      {/* STATS & FILTERS (Same as before) */}
      <div className="stats-row">
        <div className="stat-box blue-border"><label>Total</label><h1>{stats.total}</h1></div>
        <div className="stat-box green-border"><label>Planning</label><h1>{stats.planning}</h1></div>
        <div className="stat-box yellow-border"><label>Pending</label><h1>{stats.pending}</h1></div>
        <div className="stat-box purple-border"><label>Delivered</label><h1>{stats.delivered}</h1></div>
      </div>

      <div className="filters-container" style={{display:'flex', gap:'15px', alignItems:'end', flexWrap:'wrap'}}>
        <div className="filter-item" style={{flex: 1}}><label><Search size={14}/> Search</label><input type="text" value={inputs.search} onChange={e => setInputs({...inputs, search: e.target.value})} placeholder="ID or Item..."/></div>
        <div className="filter-item"><label><Filter size={14}/> Client</label><select value={inputs.client} onChange={e => setInputs({...inputs, client: e.target.value})}><option value="">All</option>{uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="filter-item"><label><Calendar size={14}/> Date</label><input type="date" value={inputs.date} onChange={e => setInputs({...inputs, date: e.target.value})}/></div>
        <div style={{display:'flex', gap:'10px'}}>
            <button className="btn-green" onClick={handleApplyFilters} style={{height:'42px'}}><Play size={16}/> Apply</button>
            <button className="btn-red" onClick={handleClearFilters} style={{height:'42px'}}><Trash2 size={16}/> Clear</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <div style={{padding: '10px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0', display:'flex', gap:'10px'}}>
            <button onClick={handleSelectAll} className="btn-white" style={{fontSize:'12px', padding:'5px 10px'}}>
               {selectedIds.length === filteredOrders.length && filteredOrders.length > 0 ? <><XSquare size={14}/> Deselect All</> : <><CheckSquare size={14}/> Select All</>}
            </button>
            <span style={{fontSize:'13px', color:'#64748b', alignSelf:'center'}}>Showing {filteredOrders.length} records</span>
        </div>

        <table className="custom-table">
          <thead>
            <tr className="table-header-row">
              <th width="50">Select</th>
              <th width="60">Edit</th> {/* NEW COLUMN */}
              <th onClick={() => handleSort('id')} style={{cursor:'pointer'}}>Order No <ArrowUpDown size={12}/></th>
              <th onClick={() => handleSort('client')} style={{cursor:'pointer'}}>Client <ArrowUpDown size={12}/></th>
              <th>Item</th>
              <th onClick={() => handleSort('qty')} style={{cursor:'pointer'}}>Qty <ArrowUpDown size={12}/></th>
              <th onClick={() => handleSort('createdAt')} style={{cursor:'pointer'}}>Date <ArrowUpDown size={12}/></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? <tr><td colSpan="7" style={{textAlign:'center', padding:'30px'}}>No orders found.</td></tr> : 
              filteredOrders.map(order => (
              <tr key={order.id} className={selectedIds.includes(order.id) ? 'selected-row' : ''}>
                 <td><input type="checkbox" onChange={() => toggleSelect(order.id)} checked={selectedIds.includes(order.id)} style={{width:'16px', height:'16px'}}/></td>
                 
                 {/* EDIT BUTTON */}
                 <td>
                    <button onClick={() => handleEditClick(order)} style={{border:'none', background:'transparent', cursor:'pointer', color:'#2563eb'}}>
                        <Edit size={18} />
                    </button>
                 </td>

                 <td>ORD-{order.id}</td>
                 <td>{order.client}</td>
                 <td>{order.item}</td>
                 <td><span style={{background:'#e0f2fe', color:'#0284c7', padding:'2px 8px', borderRadius:'4px', fontWeight:'bold'}}>{order.qty}</span></td>
                 <td>{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- EDIT MODAL --- */}
      {editingOrder && (
        <div style={{
            position:'fixed', top:0, left:0, right:0, bottom:0, 
            background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000
        }}>
            <div style={{background:'white', padding:'25px', borderRadius:'8px', width:'400px', boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                    <h3>✏️ Edit Order #{editingOrder.id}</h3>
                    <button onClick={() => setEditingOrder(null)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20}/></button>
                </div>
                
                <div style={{marginBottom:'15px'}}>
                    <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Client Name</label>
                    <input type="text" value={editingOrder.client} onChange={e => setEditingOrder({...editingOrder, client: e.target.value})} style={{width:'100%', padding:'8px'}} />
                </div>

                <div style={{marginBottom:'15px'}}>
                    <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Item Name</label>
                    <input type="text" value={editingOrder.item} onChange={e => setEditingOrder({...editingOrder, item: e.target.value})} style={{width:'100%', padding:'8px'}} />
                </div>

                <div style={{marginBottom:'20px'}}>
                    <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Quantity</label>
                    <input type="number" value={editingOrder.qty} onChange={e => setEditingOrder({...editingOrder, qty: e.target.value})} style={{width:'100%', padding:'8px'}} />
                </div>

                <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                    <button onClick={() => setEditingOrder(null)} style={{padding:'10px 20px', background:'#94a3b8', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>Cancel</button>
                    <button onClick={handleSaveEdit} style={{padding:'10px 20px', background:'#22c55e', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px'}}>
                        <Save size={16}/> Save Changes
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Overview;