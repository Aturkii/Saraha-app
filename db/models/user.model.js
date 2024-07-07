import { model, Schema } from "mongoose";

const schema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  OTP: {
    type: Number,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  receivedMessages: [{
    type: Schema.Types.ObjectId,
    ref: 'Msg', 
  }],
}, {
  timestamps: { createdAt: true },
  versionKey: false
})

export const userModel = model("User", schema)
