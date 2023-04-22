import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
             type: String,
              required: [true, "Email is required"],
              unique: true,
              lowercase: true,
              trim: true,
              validate: {
                validator: (v: string) => {
                    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
                    },
                    message: (props: any) => `${props.value} is not a valid email!`,
               },
            },
        username: { 
            type: String, 
            required: [true, "Username is required"],
            unique: true,
            minlength: [6, "Username must be at least 6 characters long"],
         },
        password: { 
            type: String, 
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
         },
         role: {
            type: String,
            enum: ["client", "admin"],   
            default: "client",
          },
    },
    { timestamps: true }
  );

export default mongoose.model("user", userSchema);