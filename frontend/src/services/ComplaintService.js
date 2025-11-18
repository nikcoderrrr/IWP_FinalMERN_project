// import axios from 'axios';

// // This is the URL of your backend server
// const API_URL = 'http://localhost:5000/api'; 

// // --- Helper function to get the token ---
// // It assumes you save your user's info in localStorage after login
// const getToken = () => {
//   // Check if 'userInfo' exists in localStorage
//   const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
//   // Return the token, or null if it's not there
//   return userInfo ? userInfo.token : null; 
// };

// /**
//  * Gets all complaints for the logged-in user.
//  * This is a REAL API call.
//  */
// const getAllComplaints = async () => {
//   const token = getToken();

//   // If there's no token, we can't get complaints
//   if (!token) {
//     console.warn('No login token found, returning empty list.');
//     return []; // Return an empty array so the page doesn't crash
//   }

//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`, // <-- Send the token to the backend
//     },
//   };

//   try {
//     // Make the GET request to your backend
//     const { data } = await axios.get(`${API_URL}/complaints`, config);
//     return data;
//   } catch (error) {
//     console.error('Error fetching complaints:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// /**
//  * Creates a new complaint.
//  * This is a REAL API call.
//  */
// const createComplaint = async (complaintData) => {
//   const token = getToken();

//   if (!token) {
//     throw new Error('No login token found. Please log in again.');
//   }

//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`, // <-- Send the token
//     },
//   };

//   try {
//     // Make the POST request to your backend
//     const { data } = await axios.post(
//       `${API_URL}/complaints`, 
//       complaintData, 
//       config
//     );
//     return data;
//   } catch (error) {
//     console.error('Error creating complaint:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// // --- (You can add your other REAL API calls here) ---
// // For example, to get a single complaint:
// const getComplaintById = async (id) => {
//   const token = getToken();
//   const config = { headers: { Authorization: `Bearer ${token}` } };
//   const { data } = await axios.get(`${API_URL}/complaints/${id}`, config);
//   return data;
// };

// // To vote on a complaint:
// const voteOnComplaint = async (id) => {
//   const token = getToken();
//   const config = { headers: { Authorization: `Bearer ${token}` } };
//   const { data } = await axios.post(`${API_URL}/complaints/vote/${id}`, {}, config);
//   return data;
// };

// // --- EXPORT THE REAL SERVICE ---
// const ComplaintService = {
//   getAllComplaints,
//   createComplaint,
//   getComplaintById,
//   voteOnComplaint,
//   // (add getMaintenanceChecks when you build that API)
// };

// export default ComplaintService;

class ComplaintService {

  static getToken() {
    return localStorage.getItem('token');
  }

  static async getAllComplaints(hostelId) {
  try {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = hostelId 
      ? `/api/complaints?hostelId=${hostelId}` 
      : '/api/complaints';

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch complaints');
      return data.map(complaint => ({
        ...complaint,       // Keep all original fields (title, status, etc.)
        id: complaint._id,  // Map _id to id
        type: 'complaint'   // Ensure type is set for filtering
      }));

    } catch (error) {
      console.error('Error fetching complaints:', error);
      return []; // Return empty array on error to prevent crash
    }

    return data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return [];
  }
}

  static async createComplaint(complaintData) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No login token found');

      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(complaintData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create complaint');

      return data;
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  }

  static async getComplaintById(id) {
    try {
      const token = this.getToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/complaints/${id}`, {
        method: 'GET',
        headers: headers,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch complaint');

      return data;
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      throw error;
    }
  }

  static async voteOnComplaint(id) {
    try {
      const token = this.getToken();
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'PATCH', // Or PUT, depending on backend route
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ $inc: { votes: 1 } }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to vote on complaint');

      return data;
    } catch (error) {
      console.error('Error voting on complaint:', error);
      throw error;
    }
  }

  // ==============================================================
  // 2. MAINTENANCE ENDPOINTS (Team B-1 Work - COMPLETED)
  // ==============================================================

  static async getMaintenanceChecks() {
    try {
      const token = this.getToken();
      const response = await fetch('/api/maintenance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store' // Ensure we don't get cached 304 responses
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || 'Failed to fetch maintenance tasks');
      }

      const data = await response.json();

      // --- DATA MAPPING IS CRITICAL HERE ---
      // The backend returns nested objects (task.definition.title).
      // The dashboard expects flat objects (task.title).
      return data.map(task => ({
        id: task.taskId,             // Use sequential ID
        mongoId: task._id,           // Keep reference to Mongo ID
        // Flatten the definition details:
        title: task.definition ? task.definition.title : 'Unknown Task',
        category: task.definition ? task.definition.category : 'Maintenance',
        location: task.definition ? task.definition.default_location : 'General',
        // Pass through task details:
        status: task.status,
        scheduledFor: task.scheduledFor,
        type: 'maintenance'          // Essential for Dashboard filters
      }));

    } catch (error) {
      console.error('Error fetching maintenance checks:', error);
      return []; 
    }
  }

  static async completeMaintenanceTask(taskId) {
    try {
      const token = this.getToken();
      const response = await fetch(`/api/maintenance/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to complete task');
      }

      return data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  static async getMaintenanceChecks(hostelId) {
    try {
      const token = this.getToken();
      const headers = {
        'Content-Type': 'application/json',
      };

      // The backend relies on req.user, so the token is mandatory
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // The controller uses the logged-in user's hostel_id, 
      // so we don't strictly need to pass it in the URL query, 
      // but hitting the endpoint with the token is key.
      const response = await fetch('/api/maintenance', {
        method: 'GET',
        headers: headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch maintenance checks');
      }

      return data;
    } catch (error) {
      console.error('Error fetching maintenance checks:', error);
      return [];
    }
  }

  static async updateComplaint(id, updateData) {
    try {
      const token = this.getToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(updateData), 
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update complaint');
      
      return data;
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
  }
}



export default ComplaintService;