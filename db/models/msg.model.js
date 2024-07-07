import mongoose, { model, Schema } from "mongoose";

const schema = new Schema({
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: { createdAt: true },
  versionKey: false
})

export const msgModel = model("Msg", schema)