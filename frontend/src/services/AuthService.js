// class AuthService {

//   static async login(email, password) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
        
//         // --- Hostel 1: Kalpana Chawla ---
//         if (email === 'student-kc@hostel.com' && password === 'password123') {
//           resolve({
//             success: true,
//             token: 'fake-student-token-kc',
//             user: { 
//               id: 's-kc101', 
//               name: 'Student (Kalpana Chawla)', 
//               role: 'student',
//               hostelName: 'Kalpana Chawla',
//               hostelId: 'kalpana-chawla'
//             }
//           });
//         } else if (email === 'warden-kc@hostel.com' && password === 'password123') {
//           resolve({
//             success: true,
//             token: 'fake-warden-token-kc',
//             user: { 
//               id: 'w-kc201', 
//               name: 'Warden (Kalpana Chawla)', 
//               role: 'warden',
//               hostelName: 'Kalpana Chawla',
//               hostelId: 'kalpana-chawla'
//             }
//           });
        
//         // --- Hostel 2: Anandi Gopal Joshi ---
//         } else if (email === 'student-aj@hostel.com' && password === 'password123') {
//           resolve({
//             success: true,
//             token: 'fake-student-token-aj',
//             user: { 
//               id: 's-aj101', 
//               name: 'Student (Anandi Joshi)', 
//               role: 'student',
//               hostelName: 'Anandi Gopal Joshi',
//               hostelId: 'anandi-joshi'
//             }
//           });
//         } else if (email === 'warden-aj@hostel.com' && password === 'password123') {
//           resolve({
//             success: true,
//             token: 'fake-warden-token-aj',
//             user: { 
//               id: 'w-aj201', 
//               name: 'Warden (Anandi Joshi)', 
//               role: 'warden',
//               hostelName: 'Anandi Gopal Joshi',
//               hostelId: 'anandi-joshi'
//             }
//           });

//         // --- Hostel 3: C.V.Raman ---
//         } else if (email === 'student-cv@hostel.com' && password === 'password123') {
//           resolve({
//             success: true,
//             token: 'fake-student-token-cv',
//             user: { 
//               id: 's-cv101', 
//               name: 'Student (C.V.Raman)', 
//               role: 'student',
//               hostelName: 'C.V.Raman',
//               hostelId: 'cv-raman'
//             }
//           });
//         } else if (email === 'warden-cv@hostel.com' && password === 'password123') {
//           resolve({
//             success: true,
//             token: 'fake-warden-token-cv',
//             user: { 
//               id: 'w-cv201', 
//               name: 'Warden (C.V.Raman)', 
//               role: 'warden',
//               hostelName: 'C.V.Raman',
//               hostelId: 'cv-raman'
//             }
//           });

//         // --- Hostel 4: J.C.Bose ---
//         } else if (email === 'student-jc@hostel.com' && password === 'password123') {
//           resolve({
//             success: true,
//             token: 'fake-student-token-jc',
//             user: { 
//               id: 's-jc101', 
//               name: 'Student (J.C.Bose)', 
//               role: 'student',
//               hostelName: 'J.C.Bose',
//               hostelId: 'jc-bose'
//             }
//           });
//         } else if (email === 'warden-jc@hostel.com' && password === 'password123') {
//           resolve({
//             success: true,
//             token: 'fake-warden-token-jc',
//             user: { 
//               id: 'w-jc201', 
//               name: 'Warden (J.C.Bose)', 
//               role: 'warden',
//               hostelName: 'J.C.Bose',
//               hostelId: 'jc-bose'
//             }
//           });

//         // --- Hostel 5: Homi Baba ---
//         } else if (email === 'student-hb@hostel.com' && password === 'password123') {
//           resolve({
//             success: true,
//             token: 'fake-student-token-hb',
//             user: { 
//               id: 's-hb101', 
//               name: 'Student (Homi Baba)', 
//               role: 'student',
//               hostelName: 'Homi Baba',
//               hostelId: 'homi-baba'
//             }
//           });
//         } else if (email === 'warden-hb@hostel.com' && password === 'password123') {
//           resolve({
//             success: true,
//             token: 'fake-warden-token-hb',
//             user: { 
//               id: 'w-hb201', 
//               name: 'Warden (Homi Baba)', 
//               role: 'warden',
//               hostelName: 'Homi Baba',
//               hostelId: 'homi-baba'
//             }
//           });

//         // --- Fallback / Error ---
//         } else {
//           reject(new Error('Invalid email or password'));
//         }
//       }, 1000);
//     });
//   }
// }

// export default AuthService;

// frontend/src/services/AuthService.js

class AuthService {

  static async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Invalid email or password');
      }

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static getUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (error) {
      return null;
    }
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

export default AuthService;