const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true, 
    select: false,
    minlength: [8, "Password must be at least 8 characters"]
  },
  firstName: { type: String, required: true},
  role: {type: String, default: "admin"},
  resetPasswordToken: {type: String },
  resetPasswordExpires: {type: Date}
})

adminSchema.pre("save", async function() {
  try {
    if (!this.isModified("password")) return

    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
  } catch (err) {
    console.error(err)
    throw err
  }
})


const adminModel = mongoose.model("Admin", adminSchema);

module.exports = { adminModel };
