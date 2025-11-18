// hash_temp.js
const bcrypt = require('bcryptjs');

async function hashPass(password) {
  console.log(`Hashing password: ${password}`);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Generated Hash:', hash);
}

hashPass('password123');

//Hashing password: password123
//Generated Hash: $2b$10$iUWT8.j.uVw4wxex1AAy8uVa5gvs0NJO5SWvi1Kl2H.94HPIWADaK