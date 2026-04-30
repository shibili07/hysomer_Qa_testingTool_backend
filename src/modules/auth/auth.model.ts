import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Added unique constraint
      lowercase: true, // Ensure email is always lowercase
    },
    name: {
      type: String,
      trim: true,
      default: "Admin",
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error;
  }
});


export type User = mongoose.InferSchemaType<typeof UserSchema>;

export const UserModel = mongoose.model<User>("User", UserSchema);