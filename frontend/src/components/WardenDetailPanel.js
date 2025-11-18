import React, { useState, useEffect } from 'react';
import ComplaintService from '../services/ComplaintService';
import './WardenDetailPanel.css';

const getISODate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

function WardenDetailPanel({ complaintId, onClose , onUpdate}) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // New saving state
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  const [currentStatus, setCurrentStatus] = useState('');
  const [scheduledDate, setScheduledDate] = useState(''); // Track date state
  
  const today = getISODate(new Date());

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!complaintId) return;
      try {
        setLoading(true);
        const data = await ComplaintService.getComplaintById(complaintId);
        setComplaint(data);
        setCurrentStatus(data.status);
        // Initialize date state
        setScheduledDate(data.scheduledFor ? getISODate(data.scheduledFor) : '');
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch complaint:", error);
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [complaintId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      // Call service with both status and date
      await ComplaintService.updateComplaint(complaintId, {
        status: currentStatus,
        scheduledFor: scheduledDate || null 
      });
      setSaving(false);
      if (onUpdate) onUpdate();
      onClose(); // Close panel to refresh dashboard
    } catch (error) {
      console.error("Failed to save:", error);
      setSaving(false);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    console.log("Submitting internal note:", newComment);
    setNewComment('');
  };
  
  const handleStatusChange = (e) => {
    setCurrentStatus(e.target.value);
  };

  const timelineEvents = [
    { type: 'comment', author: 'Warden (You)', date: '2 days ago', body: 'Plumber assigned.' },
    { type: 'submitted', author: 'Student', date: '3 days ago', body: complaint?.description },
  ];

  if (loading || !complaint) {
    return (
      <>
        <div className="panel-backdrop" onClick={onClose}></div>
        <aside className="warden-detail-panel">
          <p className="panel-loading">Loading...</p>
        </aside>
      </>
    );
  }

  return (
    <>
      <div className="panel-backdrop" onClick={onClose}></div>
      <aside className="warden-detail-panel">
        <button onClick={onClose} className="panel-close-btn">&times;</button>
        <header className="panel-header">
          <h2 className="panel-title">
            {complaint.title}
            <span>ID: #{complaintId}</span>
          </h2>
        </header>
        
        <div className="panel-tabs">
          <button 
            className={`panel-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Manage
          </button>
          {/* <button 
            className={`panel-tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </button> */}
        </div>

        <div className="panel-content">
          {activeTab === 'details' && (
            <>
              <section className="panel-section">
                <h4>Change Status</h4>
                <div className="select-group">
                  <select value={currentStatus} onChange={handleStatusChange}>
                    <option value="Submitted">Submitted (New)</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </section>

              <section className="panel-section">
                <h4>Schedule Task</h4>
                <div className="select-group">
                  <input
                    type="date"
                    className="warden-date-input"
                    min={today}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
              </section>
              
              <section className="panel-section">
                <h4>Details</h4>
                <div className="details-grid">
                  <span>Room</span>
                  <strong>{complaint.room}</strong>
                  <span>Category</span>
                  <strong>{complaint.category}</strong>
                  <span>Votes</span>
                  <strong>{complaint.votes || 0}</strong>
                  <span>Submitted</span>
                  <strong>{new Date(complaint.createdAt).toLocaleString()}</strong>
                </div>
              </section>

              <div className="panel-actions">
                <button 
                  className="save-button" 
                  onClick={handleSave} 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}

          {activeTab === 'timeline' && (
            <>
              <section className="panel-section">
                <h4>Activity Timeline</h4>
                <div className="timeline">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <strong>{event.author}</strong>
                          <span>{event.date}</span>
                        </div>
                        <div className="timeline-body">
                          <p>{event.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel-section">
                <h4>Add Internal Note / Comment</h4>
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <textarea
                    placeholder="e.g., Assigned to plumber. ETA 2 hours..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit">Add Note</button>
                </form>
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default WardenDetailPanel;