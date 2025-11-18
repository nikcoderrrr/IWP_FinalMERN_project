// frontend/src/services/ComplaintService.js
import AuthService from './AuthService';

// =================================================================
// --- COMPLAINT FUNCTIONS (UNCHANGED) ---
// =================================================================

let mockComplaints = [
  // --- Kalpana Chawla ---
  {
    id: 'c1001',
    title: 'Leaking Faucet in Room 201',
    description: 'The tap in the bathroom won\'t stop dripping.',
    room: 'KC-201',
    category: 'Plumbing',
    status: 'Submitted',
    submittedBy: 's-kc101',
    createdAt: new Date('2025-11-18T09:30:00Z').toISOString(),
    scheduledFor: null,
    votes: 12,
    hostelId: 'kalpana-chawla'
  },
  {
    id: 'c1002',
    title: 'Wi-Fi not working on 3rd floor',
    // ... (all other mock complaint data remains unchanged) ...
    hostelId: 'kalpana-chawla'
  },
  // ... (Anandi, C.V.Raman, J.C.Bose, Homi Baba mocks) ...
  {
    id: 'c1006',
    title: 'AC unit making loud noises',
    // ...
    hostelId: 'homi-baba'
  }
];

class ComplaintService {

  // --- Helper function MOVED INSIDE and made STATIC ---
  static getAuthHeaders() {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // --- Complaint functions are UNCHANGED ---
  static async getAllComplaints(hostelId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!hostelId) {
          return resolve([]);
        }
        const cleanHostelId = hostelId.toLowerCase().trim();
        const complaints = mockComplaints.filter(c => 
          c.hostelId.toLowerCase().trim() === cleanHostelId
        );
        resolve([...complaints]);
      }, 500);
    });
  }

  static async getComplaintById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaint = mockComplaints.find(c => c.id === id);
        if (complaint) {
          resolve(complaint);
        } else {
          reject(new Error('Complaint not found'));
        }
      }, 300);
    });
  }
  
  static async createComplaint(complaintData, hostelId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newComplaint = {
          ...complaintData,
          id: `c${Math.floor(Math.random() * 9000) + 1000}`,
          status: 'Submitted',
          createdAt: new Date().toISOString(),
          votes: 1,
          hostelId: hostelId
        };
        mockComplaints.unshift(newComplaint);
        resolve(newComplaint);
      }, 700);
    });
  }

  static async updateComplaintStatus(id, newStatus) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaintIndex = mockComplaints.findIndex(c => c.id === id);
        if (complaintIndex > -1) {
          mockComplaints[complaintIndex].status = newStatus;
          resolve(mockComplaints[complaintIndex]);
        } else {
          reject(new Error('Complaint not found for update'));
        }
      }, 400);
    });
  }
  
  static async deleteComplaint(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockComplaints = mockComplaints.filter(c => c.id !== id);
        resolve({ success: true });
      }, 500);
    });
  }

  // =================================================================
  // --- MAINTENANCE FUNCTIONS (CHANGED TO LIVE API) ---
  // =================================================================

  /**
   * REPLACED: This now calls your real GET /api/maintenance
   */
  static async getMaintenanceChecks() {
    console.log("Fetching LIVE data for getMaintenanceChecks()");
    const response = await fetch('/api/maintenance', {
      method: 'GET',
      // We now call it as a static method of the class
      headers: ComplaintService.getAuthHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.msg || 'Could not fetch maintenance tasks');
    }
    
    // Map backend data to the format the frontend dashboard expects
    const tasks = await response.json();
    return tasks.map(task => ({
      id: task.taskId, // Frontend expects 'id', backend has 'taskId'
      title: task.definition.title,
      status: task.status,
      scheduledFor: task.scheduledFor,
      hostelId: task.hostel_id,
      category: task.definition.category,
      location: task.definition.default_location,
      type: 'maintenance' // Manually add type for the dashboard filter
    }));
  }

  /**
   * NEW: This calls your real PUT /api/maintenance/:taskId
   */
  static async completeMaintenanceTask(taskId) {
    console.log(`Sending LIVE request to complete task ${taskId}`);
    const response = await fetch(`/api/maintenance/${taskId}`, {
      method: 'PUT',
      // We now call it as a static method of the class
      headers: ComplaintService.getAuthHeaders(),
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.msg || 'Could not complete task');
    }
    return response.json();
  }
}

export default ComplaintService;