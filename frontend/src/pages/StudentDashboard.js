import React, { useState, useEffect } from 'react';
import ComplaintService from '../services/ComplaintService';
import ComplaintList from '../components/ComplaintList';
import ComplaintDetailPanel from '../components/ComplaintDetailPanel';
import { useNavigate } from 'react-router-dom';
import { COMPLAINT_CATEGORIES } from '../config';
import { useAuth } from '../context/AuthContext';
import './StudentDashboard.css';

const filterCategories = ['All', ...COMPLAINT_CATEGORIES];

function StudentDashboard() {
  const [allComplaints, setAllComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  //console.log("CURRENT USER DATA (Dashboard):", currentUser);

 useEffect(() => {
    // We only fetch data if the user object is available
    if (currentUser) {
      const fetchComplaints = async () => {
        try {
          // Pass the user's hostelId to the service
          const data = await ComplaintService.getAllComplaints(currentUser.hostelId);
          setAllComplaints(data);
        } catch (error) {
          console.error("Failed to fetch complaints:", error);
        }
      };
      fetchComplaints();
    }
  }, [currentUser]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

const processedComplaints = allComplaints
    .filter(complaint => {
      // Safeguarding against missing status property
      const currentStatus = complaint.status || 'Unknown';
      return statusFilter === 'All' || currentStatus === statusFilter;
    })
    .filter(complaint => {
      // Safeguarding against missing category property
      const currentCategory = complaint.category || 'Other';
      return categoryFilter === 'All' || currentCategory === categoryFilter;
    })
    .filter(complaint => {
      const search = searchTerm.toLowerCase();
      // Safeguarding title and description by using || ''
      return (complaint.title || '').toLowerCase().includes(search) ||
             (complaint.description || '').toLowerCase().includes(search);
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'priority') {
        return (b.votes || 0) - (a.votes || 0);
      }
      return 0;
    });

  return (
    <main className="dashboard-page-container pages">
      <header className="dashboard-header">
        <div className="header-title-group">
          <h2>Student Dashboard</h2>
          <p className="dashboard-subtitle">{currentUser?.hostelName || 'Hostel Portal'}</p>
        </div>
        <div className="header-right-group">
          <div className="filter-buttons">
            <button onClick={() => setStatusFilter('All')} className={statusFilter === 'All' ? 'active' : ''}>All</button>
            <button onClick={() => setStatusFilter('Submitted')} className={statusFilter === 'Submitted' ? 'active' : ''}>Open</button>
            <button onClick={() => setStatusFilter('In Progress')} className={statusFilter === 'In Progress' ? 'active' : ''}>In Progress</button>
            <button onClick={() => setStatusFilter('Resolved')} className={statusFilter === 'Resolved' ? 'active' : ''}>Resolved</button>
          </div>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      
      <div className="dashboard-controls-row">
        <input
          type="text"
          placeholder="Search complaints..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="select-group">
          <label htmlFor="category-filter">Category</label>
          <select id="category-filter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {filterCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="select-group">
          <label htmlFor="sort-by">Sort by</label>
          <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
        </div>

      </div>

      <ComplaintList 
        complaints={processedComplaints}
        onCardClick={(id) => setSelectedComplaintId(id)}
      />

      <button className="fab" onClick={() => navigate('/new-complaint')} title="Submit New Complaint">+</button>
      
      {selectedComplaintId && (
        <ComplaintDetailPanel
          complaintId={selectedComplaintId}
          onClose={() => setSelectedComplaintId(null)}
        />
      )}
    </main>
  );
}

export default StudentDashboard;