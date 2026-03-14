const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true},
  role: {type: String, default: "admin"},
  resetPasswordToken: {type: String },
  resetPasswordExpires: {type: Date}
})

adminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) 
    return;
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next()
  } catch (err) {
    console.error(err)
    throw err 
  }
})





const adminModel = mongoose.model("Admin", adminSchema);

module.exports = { adminModel };
