const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true},
  resetPasswordToken: {type: String },
  resetPasswordExpires: {type: Date}
})

userSchema.pre("save", async function() {
  if (!this.isModified("password")) 
    return;
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword;

  } catch (err) {
    console.error(err)
  }
})

const userAddressSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  fullName: {type: String, required:true},
  mailingAddress: {type: String, required: true},
  phoneNumber: {type: String, required: true},
  receipt: {type: String, required: true}
}, {timestamps: true});

const userModel = mongoose.model("User", userSchema);
const userAddressModel = mongoose.model("UserAddress", userAddressSchema)

module.exports = { userModel, userAddressModel };
