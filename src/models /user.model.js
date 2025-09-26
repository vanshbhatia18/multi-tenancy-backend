import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
     username: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
    
    
    password: {
      type: String,
      required: [true, "Password is required"],
    },
   
    role:{
      type:String,
      enum:["ADMIN",'USER'],
      default :'USER'
    },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};



 userSchema.methods.generateToken = (user) => {
  return jwt.sign({
    id: user._id,
    role: user.role,
    tenantId: user.tenantId
  }, process.env.JWT_SECRET, { expiresIn: "1d" });
};


export const User = mongoose.model("User", userSchema);