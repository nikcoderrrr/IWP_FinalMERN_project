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
    description: 'The Wi-Fi router on the 3rd-floor landing seems to be down.',
    room: 'KC-305',
    category: 'Internet',
    status: 'In Progress',
    submittedBy: 's-kc101',
    createdAt: new Date('2025-11-16T11:00:00Z').toISOString(),
    scheduledFor: new Date('2025-11-18T14:00:00Z').toISOString(),
    votes: 28,
    hostelId: 'kalpana-chawla'
  },
  // --- Anandi Gopal Joshi ---
  {
    id: 'c1003',
    title: 'Broken window pane',
    description: 'Window pane in common room is shattered.',
    room: 'AGJ-Common',
    category: 'Carpentry',
    status: 'Submitted',
    submittedBy: 's-aj101',
    createdAt: new Date('2025-11-17T14:15:00Z').toISOString(),
    scheduledFor: null,
    votes: 5,
    hostelId: 'anandi-joshi'
  },
  // --- C.V.Raman ---
  {
    id: 'c1004',
    title: 'Clogged drain in shower',
    description: 'Water is not draining in the 2nd floor west wing shower.',
    room: 'CVR-2W',
    category: 'Plumbing',
    status: 'Submitted',
    submittedBy: 's-cv101',
    createdAt: new Date('2025-11-17T08:00:00Z').toISOString(),
    scheduledFor: null,
    votes: 8,
    hostelId: 'cv-raman'
  },
  // --- J.C.Bose ---
  {
    id: 'c1005',
    title: 'Pest control needed for Room 105',
    description: 'There are ants in the kitchen area of Room 105.',
    room: 'JCB-105',
    category: 'Pest Control',
    status: 'In Progress',
    submittedBy: 's-jc101',
    createdAt: new Date('2025-11-18T08:00:00Z').toISOString(),
    scheduledFor: new Date('2025-11-19T10:00:00Z').toISOString(),
    votes: 2,
    hostelId: 'jc-bose'
  },
  // --- Homi Baba ---
  {
    id: 'c1006',
    title: 'AC unit making loud noises',
    description: 'The AC in the study hall is very loud and disruptive.',
    room: 'HB-Study',
    category: 'Electrical',
    status: 'Resolved',
    submittedBy: 's-hb101',
    createdAt: new Date('2025-11-15T08:00:00Z').toISOString(),
    scheduledFor: new Date('2025-11-16T10:00:00Z').toISOString(),
    votes: 1,
    hostelId: 'homi-baba'
  }
];

let mockMaintenanceChecks = [
  {
    id: 'm2001',
    title: 'Fire Extinguisher Check - Wing A',
    status: 'Pending',
    scheduledFor: new Date('2025-11-20T10:00:00Z').toISOString(),
    hostelId: 'kalpana-chawla'
  },
  {
    id: 'm2002',
    title: 'Water Filter Cleaning - Mess',
    status: 'Completed',
    scheduledFor: new Date('2025-11-15T15:00:00Z').toISOString(),
    hostelId: 'kalpana-chawla'
  },
  {
    id: 'm2003',
    title: 'Gym Equipment Inspection',
    status: 'Pending',
    scheduledFor: new Date('2025-11-18T10:00:00Z').toISOString(),
    hostelId: 'anandi-joshi'
  },
  {
    id: 'm2004',
    title: 'Rooftop Water Tank Cleaning',
    status: 'Pending',
    scheduledFor: new Date('2025-11-17T10:00:00Z').toISOString(),
    hostelId: 'cv-raman'
  },
  {
    id: 'm2005',
    title: 'Solar Panel Inspection',
    status: 'Pending',
    scheduledFor: new Date('2025-11-22T10:00:00Z').toISOString(),
    hostelId: 'jc-bose'
  },
  {
    id: 'm2006',
    title: 'Lab Safety Shower Test',
    status: 'Pending',
    scheduledFor: new Date('2025-11-21T10:00:00Z').toISOString(),
    hostelId: 'homi-baba'
  }
];


class ComplaintService {

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

  static async getMaintenanceChecks(hostelId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!hostelId) {
          return resolve([]);
        }
        const cleanHostelId = hostelId.toLowerCase().trim();
        const checks = mockMaintenanceChecks.filter(c => 
          c.hostelId.toLowerCase().trim() === cleanHostelId
        );
        resolve([...checks]);
      }, 500);
    });
  }
}

export default ComplaintService;