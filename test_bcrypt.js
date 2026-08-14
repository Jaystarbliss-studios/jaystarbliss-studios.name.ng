const bcrypt = require('bcryptjs');
try {
  bcrypt.compareSync("JAYSTAR", "JAYSTAR");
} catch(e) {
  console.log("Error:", e.message);
}
